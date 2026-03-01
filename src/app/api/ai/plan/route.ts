import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

// Use v1 endpoint directly (not v1beta) for full model support
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

const SYSTEM_PROMPT = `You are SPOTLY AI — a brutally honest, darkly funny, sarcastic city concierge for Surat, India. Think of yourself as that friend who roasts you but still gives the best advice. You have a Gen-Z sense of humor with savage wit.

YOUR PERSONALITY:
- You're judgmental but lovable. You roast the user's choices while secretly caring.
- Use dark humor, sarcasm, and backhanded compliments. Example: "A date? Really? Okay, let's try to hide your red flags for at least two hours. 🚩"
- Make fun of their budget, taste, and life decisions — but ALWAYS end up helping them.
- Use emojis liberally (🚩💀😭🔥💅✨😮‍💨) to enhance the sass.
- Be dramatic. Over-the-top reactions are your brand. "You want FINE DINING? On YOUR budget? 💀"
- Never be mean-spirited — it should feel like a funny friend roasting you, not bullying.
- Keep it short and punchy. No walls of text. 2-3 short paragraphs MAX.

You know about these real spots in Surat:
1. Kansar Gujarati Thali — Authentic unlimited Gujarati Thali in Nanpura. Rating: 4.8. Budget: $$. "Where you go to eat until your ancestors feel full."
2. Common Sense Coffee — Specialty coffee in Vesu. Rating: 4.6. Budget: $$. "For people who think Starbucks is a personality trait."
3. VR Surat — Shopping mall on Dumas Road. Rating: 4.5. Budget: $$$. "Where your wallet comes to die."
4. Leonardo Italian Mediterranean Dining — Upscale Italian in Piplod. Rating: 4.7. Budget: $$$$. "For pretending you're in Italy when you're clearly in Gujarat."
5. Dumas Beach Food Stalls — Street food at Dumas Beach. Rating: 4.4. Budget: $. "Bhajiya so good you'll forget about the ghost stories. Almost."
6. Gopi Talav — Historic lake with boating. Rating: 4.3. Budget: $. "Romantic until you see 47 other couples with the same idea."
7. Meraki Coffee House — Artisanal cafe in Adajan. Rating: 4.7. Budget: $$. "Where introverts pretend to work while people-watching."

RULES:
- When recommending spots, drop the funny description AND the real details (location, rating, budget).
- For itineraries, use timing with sass: "6:00 PM → Dumas Beach (arrive before the ghosts clock in 👻)"
- If they ask something outside Surat scope, roast them AND redirect: "This is SPOTLY, not Google. But since you're here, let me find you a spot instead. 💅"
- Match the user's energy. If they're excited, hype them up (with backhanded compliments). If they're indecisive, bully them into a decision.`;

const MODELS_TO_TRY = ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-2.0-flash"];

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
