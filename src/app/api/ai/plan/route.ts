import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

// Use v1 endpoint directly (not v1beta) for full model support
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

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

const MODELS_TO_TRY = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];

async function callGeminiREST(model: string, prompt: string): Promise<string> {
    const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 1024,
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message || `${response.status} ${response.statusText}`;
        throw new Error(`${response.status}:${errorMsg}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("No text in response");
    }

    return text;
}

async function tryGenerate(prompt: string, history: any[] = []) {
    const contextPrompt = `${SYSTEM_PROMPT}

Conversation history:
${(history || []).map((m: any) => `${m.role === "user" ? "User" : "AI"}: ${m.text}`).join("\n")}

User's latest message: "${prompt}"

Respond naturally:`;

    let lastError: Error | null = null;

    for (const model of MODELS_TO_TRY) {
        try {
            return await callGeminiREST(model, contextPrompt);
        } catch (error: any) {
            console.error(`Model ${model} failed:`, error.message);
            lastError = error;
            // If it's a 429 or quota error, try next model
            if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
                continue;
            }
            // If it's a 404 (model not found), try next model
            if (error.message?.includes("404") || error.message?.includes("not found")) {
                continue;
            }
            // For other errors, still try next model
            continue;
        }
    }

    throw lastError || new Error("All models failed");
}

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { success: false, message: "Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables." },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { prompt, history } = body;

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { success: false, message: "Please type a message first!" },
                { status: 400 }
            );
        }

        const text = await tryGenerate(prompt, history);
        return NextResponse.json({ success: true, data: { response: text } });

    } catch (error: any) {
        console.error("AI Generation Error:", error.message);

        if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
            return NextResponse.json({
                success: false,
                message: "I'm getting too many requests right now! 🔥 Please wait a minute and try again."
            }, { status: 429 });
        }

        return NextResponse.json(
            { success: false, message: "Something went wrong with the AI. Please try again in a moment! 😔" },
            { status: 500 }
        );
    }
}
