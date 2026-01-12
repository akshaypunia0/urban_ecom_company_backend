import { prisma } from "../../config/db.js";

const applyVendor = async (req, res) => {

    try {

        if (!req.body) {
            return res.status(400).json({ message: 'Request body missing: please provide company name' });
        }

        const userId = req.user.id;
        const { company } = req.body;


        if (!company) {
            return res.status(400).json({ message: 'please provide your company name' })
        }

        const existingVendor = await prisma.vendor.findUnique({
            where: { userId }
        });

        if (existingVendor) {
            return res.status(400).json({ message: 'already applied' })
        };

        const vendor = await prisma.vendor.create({
            data: {
                userId,
                company
            }
        })

        return res.status(201).json({
            status: 'success',
            message: 'Vendor application submitted',
            vendor
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'something went wrong while applying for verdor' })
    }
}


export {
    applyVendor,
}