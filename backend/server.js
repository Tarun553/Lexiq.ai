import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from "./routes/ai.route.js"
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

// health route 
app.get("/", (req,res)=>{
    res.send("server is live !")
})


app.use(requireAuth())

app.use("/api/ai", aiRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
