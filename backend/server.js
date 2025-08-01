import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from "./routes/ai.route.js"
import userRouter from "./routes/user.route.js"
import connectCloudinary from "./config/cloudinary.js"
dotenv.config()

const app = express()
await connectCloudinary()

app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())
app.use(clerkMiddleware())

// health route 
app.get("/", (req,res)=>{
    res.send("server is live !")
})


app.use(requireAuth())

app.use("/api/ai", aiRouter)
app.use("/api/user", userRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
