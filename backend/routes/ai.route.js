import express from "express";
import { auth } from "../middlewares/auth.js";
import {generateArticle, generateImage, ResumeReview, RomoveBackground, RemoveObject} from "../controllers/ai.controller.js";
import { upload } from "../config/multer.js";

const aiRouter = express.Router();

aiRouter.post("/generate-article", auth, generateArticle);
aiRouter.post("/generate-image",auth, generateImage);
aiRouter.post("/resume-review", upload.single("resume") ,auth, ResumeReview);
aiRouter.post("/remove-background", upload.single("image") ,auth, RomoveBackground);
aiRouter.post("/remove-object", upload.single("image") ,auth, RemoveObject);

export default aiRouter
