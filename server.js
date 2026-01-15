import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { connectDB } from './src/config/db.js'
import authRoutes from './src/routes/authRoutes/authRoutes.js'
import adminRoutes from './src/routes/adminRoutes/adminRoutes.js'
import userRoutes from './src/routes/userRoutes/userRoutes.js'
import vendorRoutes from './src/routes/vendorRoutes/vendorRoutes.js'

const app = express()

const port = process.env.PORT || 4002;

connectDB();

app.use(express.json())



//routes starts from here

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/vendor', vendorRoutes);

//routes starts from here

app.get('/', (req, res) => {
    res.send('Hello, server working')
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    
})