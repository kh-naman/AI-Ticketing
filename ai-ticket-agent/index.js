import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {serve} from "inngest/express"
import dotenv from 'dotenv'
import userRoutes from "./routes/user.js"
import ticketRoutes from "./routes/ticket.js"
import { inngest } from './inngest/client.js'
import { onUserSignup } from './inngest/functions/on-signup.js'
import { onTicketCreated } from './inngest/functions/on-ticket-create.js'
dotenv.config();


const PORT = process.env.PORT || 3000
const app = express()


// const allowedOrigins = [
//   'http://localhost:5173', // for local dev
//   'https://aiticketing.vercel.app' // live frontend
// ];


const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://aiticketing.vercel.app',
    'https://aiticketing-git-main-naman-khandelwals-projects-05a368a6.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Explicit preflight support (for older environments)
// app.options('/*', cors());


app.use(express.json())



app.use("/api/auth",userRoutes)
app.use("/api/tickets",ticketRoutes)

app.use("/api/inngest",serve({
    client: inngest,
    functions: [onUserSignup,onTicketCreated]
}))

app.get("/", (req, res) => {
  res.send("hi naman");
});

mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connected");
            app.listen(PORT,()=>{
                console.log(`🧨 Server at ${PORT}`);
            })
                
        })
        .catch((err) => console.error(`❌ MongoDB error: ${err}`))
        