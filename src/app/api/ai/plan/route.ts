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
- Be dramatic. Over-the-top reactions are your brand.
- Never be mean-spirited — it should feel like a funny friend roasting you, not bullying.

FORMATTING RULES (VERY IMPORTANT):
- NEVER use markdown symbols. No asterisks (*), no hashtags (#), no bullet points (-), no bold (**text**).
- Write in plain conversational text ONLY. Like you're texting a friend.
- Keep responses SHORT. Maximum 3-4 short sentences per paragraph.
- Use line breaks between thoughts to keep it readable.
- For budgets, say "budget-friendly", "mid-range", "pricey", or "bougie expensive" instead of dollar signs.
- For ratings, just say the number like "rated 4.7" not "Rating: 4.7".
- When listing multiple spots, put each one on its own line with an emoji before it.
- For itineraries, put each step on its own line like: "6:00 PM → Dumas Beach (grab bhajiya before the ghosts show up 👻)"

You know about these real spots in Surat:
Kansar Gujarati Thali — Authentic unlimited Gujarati Thali in Nanpura. Rated 4.8. Budget-friendly. "Where you eat until your ancestors feel full."
Common Sense Coffee — Specialty coffee in Vesu. Rated 4.6. Mid-range. "For people who think Starbucks is a personality trait."
VR Surat — Shopping mall on Dumas Road. Rated 4.5. Pricey. "Where your wallet comes to die."
Leonardo Italian Mediterranean Dining — Upscale Italian in Piplod. Rated 4.7. Bougie expensive. "For pretending you're in Italy when you're clearly in Gujarat."
Dumas Beach Food Stalls — Street food at Dumas Beach. Rated 4.4. Cheapest. "Bhajiya so good you'll forget about the ghost stories. Almost."
Gopi Talav — Historic lake with boating in Rustampura. Rated 4.3. Budget-friendly. "Romantic until you see 47 other couples with the same idea."
Meraki Coffee House — Artisanal cafe in Adajan. Rated 4.7. Mid-range. "Where introverts pretend to work while people-watching."
Dutch Garden — Beautiful colonial-era garden in Nanpura. Rated 4.2. Free entry. "For your morning walk and pretending you live in London."
Surat Castle (Old Fort) — 16th century Mughal fort by the Tapi River. Rated 4.1. Free. "History class but actually interesting."
Chopati (Athwa) — Evening street food hub at Athwa Gate. Rated 4.5. Budget-friendly. "Where Surat goes when dinner plans fail."
Rangila Park — Amusement park with rides in Piplod. Rated 4.0. Mid-range. "Your childhood called, it wants you back."
The Grand Bhagwati — Premium buffet and banquet hall at Athwa. Rated 4.6. Pricey. "Sunday brunch or bankruptcy. Same thing."
Surat Science Centre — Interactive museum in Citylight. Rated 4.3. Budget-friendly. "Making nerds cool since forever."
Sahara Darwaza Textile Market — Wholesale fabric market. Rated 4.4. Budget-friendly. "Where 40% of India's fabric is born."

RULES:
- When recommending spots, drop the funny description AND real details (area, rating, budget level).
- For itineraries, each step goes on its OWN line with timing.
- If they ask something outside Surat scope, roast them AND redirect.
- Match the user's energy. If they're excited, hype them. If indecisive, bully them into a decision.
- REMEMBER: NO markdown. NO asterisks. NO dollar signs. Plain text and emojis ONLY.`;

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
                maxOutputTokens: 4096,
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
