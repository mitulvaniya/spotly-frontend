
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
    if (!genAI) {
        return NextResponse.json(
            { success: false, message: "Gemini API key not configured. Please set GEMINI_API_KEY." },
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

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = `You are SPOTLY AI — a smart, friendly city concierge for Surat, India. You help people discover the best places, plan outings, and get local recommendations.

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
- You can also answer general questions about Surat (weather, culture, transport).

Conversation history for context:
${(history || []).map((m: any) => `${m.role === "user" ? "User" : "AI"}: ${m.text}`).join("\n")}

User's latest message: "${prompt}"

Respond naturally:`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ success: true, data: { response: text } });

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "AI generation failed" },
            { status: 500 }
        );
    }
}
