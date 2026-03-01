
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const SYSTEM_PROMPT = `You are SPOTLY AI — a smart, friendly city concierge for Surat, India. You help people discover the best places, plan outings, and get local recommendations.

You know about these real spots in Surat:
1. Kansar Gujarati Thali — Authentic unlimited Gujarati Thali in Nanpura. Rating: 4.8. Budget: $$
2. Common Sense Coffee — Specialty coffee cafe in Vesu. Rating: 4.6. Budget: $$
3. VR Surat — Major shopping mall on Dumas Road with INOX, food court, and brands. Rating: 4.5. Budget: $$$
4. Leonardo Italian Mediterranean Dining — Upscale Italian/Mediterranean in Piplod. Rating: 4.7. Budget: $$$$
5. Dumas Beach Food Stalls — Street food along Dumas Beach. Famous for tomato bhajiya. Rating: 4.4. Budget: $
6. Gopi Talav — Historic lake with boating, food zones, laser shows. Rating: 4.3. Budget: $
7. Meraki Coffee House — Artisanal cafe in Adajan. Rating: 4.7. Budget: $$

Guidelines:
- Be warm, helpful, and conversational. Use emojis naturally.
- When recommending spots, mention specific details like location, rating, budget.
- If someone asks for a plan/itinerary, structure it with timing (e.g. "6:00 PM → Dumas Beach...").
- If questions are outside Surat/city discovery scope, gently redirect to helping them find great spots.
- Keep responses concise but informative (2-4 paragraphs max).
- You can also answer general questions about Surat (weather, culture, transport).`;

// Try multiple models in order of preference
const MODELS_TO_TRY = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];

async function tryGenerate(prompt: string, history: any[] = []) {
    if (!genAI) throw new Error("API key not configured");

    const contextPrompt = `${SYSTEM_PROMPT}

Conversation history:
${(history || []).map((m: any) => `${m.role === "user" ? "User" : "AI"}: ${m.text}`).join("\n")}

User's latest message: "${prompt}"

Respond naturally:`;

    for (const modelName of MODELS_TO_TRY) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(contextPrompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error(`Model ${modelName} failed:`, error.message);
            // If it's a quota error, try the next model
            if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
                continue;
            }
            // For non-quota errors, throw immediately
            throw error;
        }
    }

    // All models exhausted
    throw new Error("QUOTA_EXHAUSTED");
}

export async function POST(req: Request) {
    if (!genAI) {
        return NextResponse.json(
            { success: false, message: "Gemini API key not configured. Please set GEMINI_API_KEY in Vercel." },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { prompt, history } = body;

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { success: false, message: "Prompt is required" },
                { status: 400 }
            );
        }

        const text = await tryGenerate(prompt, history);
        return NextResponse.json({ success: true, data: { response: text } });

    } catch (error: any) {
        console.error("AI Generation Error:", error);

        if (error.message === "QUOTA_EXHAUSTED" || error.message?.includes("429") || error.message?.includes("quota")) {
            return NextResponse.json({
                success: false,
                message: "I'm getting too many requests right now! 🔥 The AI service is temporarily rate-limited. Please wait a minute and try again."
            }, { status: 429 });
        }

        return NextResponse.json(
            { success: false, message: error.message || "AI generation failed. Please try again." },
            { status: 500 }
        );
    }
}
