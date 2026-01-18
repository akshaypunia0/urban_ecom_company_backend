import dotenv from 'dotenv'
dotenv.config();
import { prisma } from "../../config/db.js";
import { createRazorpayInstance } from "../../utills/razorpayUtils/razorpayInstance.js";
import crypto from 'crypto'

const razorpay = createRazorpayInstance();


const createOrder = async (req, res) => {

    try {
        if (!req.body || !req.body.serviceId) {
            return res.status(400).json({ message: 'request body is required' })
        }

        const serviceId = req.body.serviceId;

        const service = await prisma.service.findFirst({
            where: {
                id: serviceId,
                vendor: {
                    status: 'APPROVED'
                }
            }
        })

        if (!service || service.active === false) {
            return res.status(400).json({ mesasge: 'Either service not exist or service is inactive' })
        }

        const { price, vendorId, title } = service;

        const createOrderInDb = await prisma.order.create({
            data: {
                userId: req.user.id,
                vendorId,
                serviceId,
                amount: price
            }
        })


        const razorpayOrderPaymentLink = await razorpay.paymentLink.create({
            amount: price * 100,
            currency: 'INR',
            description: title,
            customer: {
                email: req.user.email
            },
            notify: {
                email: true,
                sms: false
            },
            notes: {
                orderId: createOrderInDb.id
            },
            callback_url: "http://localhost:3000/payment-success",
            callback_method: "get"
        });

        if (!razorpayOrderPaymentLink) {
            return res.status(400).json({ message: 'order not created' })
        }



        await prisma.order.update({
            where: { id: createOrderInDb.id },
            data: {
                razorpayOrderId: razorpayOrderPaymentLink.id
            }
        })



        return res.status(201).json({
            message: 'order created successfully',
            order: {
                orderId: createOrderInDb.id,
                razorpayOrderId: razorpayOrderPaymentLink.id,
                amount: razorpayOrderPaymentLink.amount
            }
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'error while creating order' })
    }
}


const confirmPaymentWebhook = async (req, res) => {

    console.log("🔥 Razorpay webhook hit");

    try {

        const secret = process.env.RAZORPAT_WEBHOOK_SECRET;
        const signature = req.headers["x-razorpay-signature"];


        const hmacObject = crypto.createHmac('sha256', secret);
        hmacObject.update(req.body)
        const generatedSignature = hmacObject.digest('hex')


        if (generatedSignature !== signature) {
            return res.status(400).json({ message: 'Invalid payment signature' })
        }

        console.log('After comapring signature');
        
        const bodyString = req.body.toString('utf-8')
        const payload = JSON.parse(bodyString)
        const event = payload.event;

        console.log('payload is: ', payload);
        

        console.log('After event generated', event);

        if (event !== 'payment_link.paid') {
            return res.status(400).json({ message: 'payment unsuccessfull' })
        }

        console.log('After event comparision');

        const payment = payload.payload.payment.entity;
        const orderId = payment.notes.orderId;

        console.log('After payment and orderId creation', payment, orderId);


        await prisma.$transaction(async (tx) => {

            console.log('start creating payment');

            await tx.payment.create({
                data: {
                    orderId: orderId,
                    gatewayOrderId: payment.order_id,
                    paymentStatus: 'SUCCESS',
                    amount: payment.amount
                }
            })

            console.log('Payment created');
            

            await tx.order.update({
                where: { id: orderId },
                data: {
                    ordStatus: 'PAID',
                    razorpayPaymentId: payment.id
                }
            })

            console.log('order updated');
        })

        return res.status(200).json({
            message: 'payment successfull',
            orderId: orderId
        })



    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'error while confirming payment' })
    }
}




export {
    createOrder,
    confirmPaymentWebhook
}