import { prisma } from "../../config/db.js";

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany();

        return res.status(200).json({
            message: allUsers.length > 0 ? "user fetched successfully" : "No user exist",
            data: allUsers
        })


    } catch (error) {
        return res.status(500).json({
            message: 'error getting all users'
        })
    }
}


const getAllVendors = async (req, res) => {
    try {
        const vendors = await prisma.vendor.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: vendors.length > 0 ? "success" : "no vendor exist",
            vendors
        })
    } catch (error) {
        return res.status(500).json({message: 'Error getting all vendors'})
    }
}




export {
    getAllUsers,
    getAllVendors
}