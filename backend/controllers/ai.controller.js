import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdf from "pdf-parse/lib/pdf-parse.js";

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const userId = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const freeUsage = req.free_usage;

    if (plan !== "premium" && freeUsage >= 10) {
      return res.status(403).json({ message: "Free usage limit reached" });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    // Insert the new creation into the database with the correct schema
    await sql`
            INSERT INTO creation (user_id, prompt, content, type, publish)
            VALUES (${userId}, ${prompt}, ${content}, 'article', FALSE)
            RETURNING id, created_at, updated_at
        `;

    // Update user's free usage if not on premium plan
    if (plan !== "premium") {
      try {
        await clerkClient.users.updateUser(userId, {
          privateMetadata: {
            free_usage: (parseInt(freeUsage) || 0) + 1,
          },
        });
      } catch (updateError) {
        console.error("Error updating user metadata:", updateError);
        // Continue even if metadata update fails
      }
    }

    return res.status(200).json({
      message: "Article generated successfully",
      content,
    });
  } catch (error) {
    console.error("Error in generateArticle:", error);
    return res.status(500).json({
      message: "Error generating article",
      error: error.message,
    });
  }
};

export const generateImage = async (req, res) => {
  try {
    const userId = req.auth();
    const { prompt } = req.body;

    const formData = new FormData();
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer", // Move responseType here as an axios config option
      }
    );

    // Upload directly from buffer instead of base64
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Write the buffer to the upload stream
      uploadStream.end(Buffer.from(response.data, "binary"));
    });

    // Insert the new creation into the database
    await sql`
      INSERT INTO creation (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${uploadResult.secure_url}, 'image', FALSE)
      RETURNING id, created_at, updated_at
    `;

    return res.status(200).json({
      success: true,
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Error in generateImage:", error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || "Error generating image",
      details: error.message,
    });
  }
};

export const RomoveBackground = async (req, res) => {
  try {
    const userId = req.auth();
    const { image } = req.file;

    // Upload directly from buffer instead of base64
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Write the buffer to the upload stream
      uploadStream.end(Buffer.from(image.path, "binary"), {
        transformation: [
          {
            effect: "background_removal",
            background_removal: "remove_the_background",
          },
        ],
      });
    });

    // Insert the new creation into the database
    await sql`
      INSERT INTO creation (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${"Remove Background"}, ${
      uploadResult.secure_url
    }, 'image', FALSE)
      RETURNING id, created_at, updated_at
    `;

    return res.status(200).json({
      success: true,
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Error in generateImage:", error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || "Error generating image",
      details: error.message,
    });
  }
};

export const RemoveObject = async (req, res) => {
  try {
    const userId = req.auth();
    const { object } = req.body;
    const { image } = req.file;

    // Upload directly from buffer instead of base64
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Write the buffer to the upload stream
      uploadStream.end(Buffer.from(image.path, "binary"), {
        transformation: [
          {
            effect: `gen_remove:${object}`,
            resource_type: "image",
          },
        ],
      });
    });

    // Insert the new creation into the database
    await sql`
      INSERT INTO creation (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${`removed ${object} from image`}, ${
      uploadResult.secure_url
    }, 'image', FALSE)
      RETURNING id, created_at, updated_at
    `;

    return res.status(200).json({
      success: true,
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Error in generateImage:", error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || "Error generating image",
      details: error.message,
    });
  }
};

export const ResumeReview = async (req, res) => {

  function extractJSON(content) {
    try {
      const match = content.match(/\{[\s\S]*?\}/);
      return match ? JSON.parse(match[0]) : null;
    } catch (e) {
      return null;
    }
  }
  try {
    const userId = req.auth();

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.file;

    // Verify file exists
    if (!fs.existsSync(file.path)) {
      return res.status(400).json({
        success: false,
        message: "File upload failed",
      });
    }

    try {
      // Read and parse the PDF
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdf(dataBuffer);

      const prompt = `
      You are a resume reviewer. Analyze the resume text provided and return a structured JSON with:
      {
        "score": number from 0 to 100,
        "strengths": [list of strengths],
        "weaknesses": [list of weaknesses],
        "suggestions": [list of improvement suggestions]
      }
      
      Resume text:
      """${pdfData.text}"""
      Only respond with raw JSON, no extra text.
      `;

      const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content;
      let review;

      try {
        // Try to parse the JSON response
        review = extractJSON(content);
      } catch (e) {
        // If parsing fails, return the raw content
        review = {
          score: 0,
          strengths: [],
          weaknesses: [],
          suggestions: [content],
        };
      }

      // Save to database
      await sql`
        INSERT INTO creation (user_id, prompt, content, type, publish)
        VALUES (${userId}, ${prompt}, ${JSON.stringify(
        review
      )}, 'resume', FALSE)
        RETURNING id, created_at, updated_at
      `;

      // Clean up the uploaded file
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });

      return res.status(200).json({
        success: true,
        data: review,
      });
    } catch (error) {
      // Clean up the uploaded file in case of error
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in ResumeReview:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing your resume",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
