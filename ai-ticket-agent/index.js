import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from "./routes/user.js"



const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

dotenv.config();

app.use("/api/auth",userRoutes)

mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connected");
            app.listen(PORT,()=>{
                console.log(`🧨 Server at http://localhost:${PORT}`);
            })
                
        })
        .catch((err) => console.error(`❌ MongoDB error: ${err}`))
        