import { prisma } from "../config/db.js";
import bcrypt from 'bcryptjs';
import generateToken from "../utills/generateToken.js";


const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "all fields are required" })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        })

        if (existingUser) {
            return res.status(400).json({ error: 'user already exist' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER'
            }
        })


        const token = generateToken(user, res)

        res.status(201).json({
            status: 'success',
            message: 'User regstered successfully',
            data: {
                id: user.id,
                name,
                email,
                role: user.role
            },
            token
        });


    } catch (error) {
        return res.status(500).json({ error: 'User register fail' })
    }

}


const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        })
        

        if(!existingUser) {
            return res.status(400).json({message: 'Email or password is incorrect'})
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);

        if(!isValidPassword) {
            return res.status(400).json({message: 'Email or password is incorrect'});
        }

        const token = generateToken(existingUser, res)

        return res.status(200).json({
            status: 'success',
            message: 'Login successfull',
            data: {
                user: {
                    id: existingUser.id,
                    name: existingUser.name,
                    email,
                    role: existingUser.role
                },
                token
            }
        })


    } catch (error) {
        console.log("Error while login: ", error.message);
        
        return res.status(500).json({error: 'Login error'});
    }
}

const logout = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    return res.status(200).json({message: 'Logout successfull'})

}


export {
    registerUser,
    login,
    logout,
}