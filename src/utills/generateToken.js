import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

const generateToken = (user, res) => {

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    }

    const token = jwt.sign(
        payload,
        process.env.JWT_SECTET,
        {
            expiresIn: '7d'
        }
    )

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: (1000 * 60 * 60 * 7)
    })

    return token;

}

export default generateToken