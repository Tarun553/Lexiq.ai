import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";
import {v2 as cloudinary} from "cloudinary";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


export const generateArticle = async (req,res)=>{
  try {
    const userId = req.auth();
    const{prompt , length} = req.body;
    const plan = req.plan;
    const freeUsage = req.free_usage;

    if(plan !== 'premium' && freeUsage >= 10){
        return res.status(403).json({message:"Free usage limit reached"})
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
    formData.append('prompt', prompt);

    const response = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      formData,
      {
        headers: {
          'x-api-key': process.env.CLIPDROP_API_KEY,
          ...formData.getHeaders()
        },
        responseType: 'arraybuffer'  // Move responseType here as an axios config option
      }
    );

    // Upload directly from buffer instead of base64
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      
      // Write the buffer to the upload stream
      uploadStream.end(Buffer.from(response.data, 'binary'));
    });

    // Insert the new creation into the database
    await sql`
      INSERT INTO creation (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${uploadResult.secure_url}, 'image', FALSE)
      RETURNING id, created_at, updated_at
    `;

    return res.status(200).json({
      success: true,
      imageUrl: uploadResult.secure_url
    });

  } catch (error) {
    console.error('Error in generateImage:', error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || 'Error generating image',
      details: error.message
    });
  }
};


export const RomoveBackground = async (req, res) => {
  try {
    const userId = req.auth();
    const {image} = req.file;

 
   

    // Upload directly from buffer instead of base64
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      
      // Write the buffer to the upload stream
      uploadStream.end(Buffer.from(image.path, 'binary'),{transformation: [{
        effect: 'background_removal',
        background_removal: 'remove_the_background'
      }]})
    });

    // Insert the new creation into the database
    await sql`
      INSERT INTO creation (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${"Remove Background"}, ${uploadResult.secure_url}, 'image', FALSE)
      RETURNING id, created_at, updated_at
    `;

    return res.status(200).json({
      success: true,
      imageUrl: uploadResult.secure_url
    });

  } catch (error) {
    console.error('Error in generateImage:', error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || 'Error generating image',
      details: error.message
    });
  }
};


export const RemoveObject = async (req, res) => {
  try {
    const userId = req.auth();
    const {object} = req.body;
    const {image} = req.file;

 
   

    // Upload directly from buffer instead of base64
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      
      // Write the buffer to the upload stream
      uploadStream.end(Buffer.from(image.path, 'binary'),{transformation: [{
        effect: `gen_remove:${object}`,
        resource_type: 'image'
      }]})
    });

    // Insert the new creation into the database
    await sql`
      INSERT INTO creation (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${`removed ${object} from image`}, ${uploadResult.secure_url}, 'image', FALSE)
      RETURNING id, created_at, updated_at
    `;

    return res.status(200).json({
      success: true,
      imageUrl: uploadResult.secure_url
    });

  } catch (error) {
    console.error('Error in generateImage:', error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || 'Error generating image',
      details: error.message
    });
  }
};



export const ResumeReview = async (req, res) => {
  try {
    const userId = req.auth();
   
    const {resume} = req.file;


    if(resume.size > 1024 * 1024 * 5){
      return res.status(400).json({message:"File size should be less than 5MB"})
    }

    const dataBuffer = fs.readFileSync(resume.path);

    const pdfData = await pdf(dataBuffer);

    console.log(pdfData);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weakness and areas of improvement. Resume: ${pdfData.text}`
 
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

    // // Upload directly from buffer instead of base64
    // const uploadResult = await new Promise((resolve, reject) => {
    //   const uploadStream = cloudinary.uploader.upload_stream(
    //     { resource_type: 'auto' },
    //     (error, result) => {
    //       if (error) return reject(error);
    //       resolve(result);
    //     }
    //   );
      
    //   // Write the buffer to the upload stream
    //   uploadStream.end(Buffer.from(resume.path, 'binary'))
    // });

    // Insert the new creation into the database
    await sql`
      INSERT INTO creation (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${content}, 'resume', FALSE)
      RETURNING id, created_at, updated_at
    `;

    return res.status(200).json({
      success: true,
      content
    });

  } catch (error) {
    console.error('Error in ResumeReview:', error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || 'Error Reviewing Resume',
      details: error.message
    });
  }
};
