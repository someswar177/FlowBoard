// utils/geminiClient.js
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Universal text generation function
export async function generateText(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // or gemini-2.5-pro
      contents: prompt,
    });

    return response.text; // <-- note: it's response.text now
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gemini AI generation failed");
  }
}

// import fetch from "node-fetch";

// export async function callGemini(prompt, options = {}) {
//   const apiKey = process.env.GEMINI_API_KEY;
//   const apiUrl = process.env.GEMINI_API_URL || "https://api.example-gemini.com/v1/generate";

//   if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

//   const body = {
//     prompt,
//     max_tokens: options.maxTokens || 512,
//     temperature: options.temperature ?? 0.2,
//     model: options.model || "gemini-pro",
//   };

//   const res = await fetch(apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${apiKey}`,
//     },
//     body: JSON.stringify(body),
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Gemini error: ${res.status} ${text}`);
//   }

//   const data = await res.json();
//   return data;
// }
