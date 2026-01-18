import { prisma } from "../../config/db.js";


const markOrders = async (req, res) => {
    try {
        
        const { orderId } = req.body;

        const markOrder = await prisma.order.update({
            where: { id: orderId },
            data: { ordStatus: 'CANCELLED' }
        })

        return res.status(200).json({
            message: 'order updated',
            order: markOrder
        })


    } catch (error) {
        return res.status(500).json({message: 'error while performing markOrders controller'})
    }
}

export {
    markOrders,
}