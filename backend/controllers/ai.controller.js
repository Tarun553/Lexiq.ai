import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";

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
