import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/ai.route.js";
import userRouter from "./routes/user.route.js";
import connectCloudinary from "./config/cloudinary.js";
dotenv.config();

const app = express();
await connectCloudinary();

// CORS configuration
const allowedOrigins = [
  "https://lexiq-ai-1.onrender.com/", // Development
  process.env.FRONTEND_URL, // Production
].filter(Boolean); // Remove any undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware());

// health route
app.get("/", (req, res) => {
  res.send("server is live!");
});

app.use(requireAuth());

app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
