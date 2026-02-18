
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
// Note: In a real app, ensure process.env.GEMINI_API_KEY is set
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
    if (!genAI) {
        return NextResponse.json(
            { success: false, message: "Gemini API key not configured" },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { prompt } = body;

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { success: false, message: "Prompt is required" },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Structured prompt to ensure JSON response
        const systemPrompt = `
You are a local city expert and concierge.
Suggest a 3-stop itinerary based on the user's request: "${prompt}".
STRICTLY return a JSON array of objects. Do not include markdown formatting (like \`\`\`json).
Each object must have:
- "time": string (e.g. "7:00 PM")
- "title": string (Name of the place/activity)
- "location": string (Brief location or neighborhood)
- "description": string (Why it's a good choice, max 1 sentence)

Example output:
[
  { "time": "10:00 AM", "title": "Coffee at The Grind", "location": "Downtown", "description": "Best espresso in the city." },
  ...
]
`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if Gemini adds it despite instructions
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let itinerary;
        try {
            itinerary = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse AI response:", text);
            return NextResponse.json(
                { success: false, message: "Failed to parse AI response" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: itinerary });

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
