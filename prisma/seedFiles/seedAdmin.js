import { prisma } from "../../src/config/db.js";
import bcrypt from "bcryptjs";

const adminEmail = 'admin@example.com';

const createAdmin = async () => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin@00', salt)

    await prisma.user.create({
        data: {
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN'
        }
    })

    console.log("Admin created");

}

createAdmin();