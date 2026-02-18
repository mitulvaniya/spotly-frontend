import { model } from "@/lib/ai-config";
import { SPOTS } from "@/lib/data";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!model) {
      return NextResponse.json(
        { error: "Gemini API Key not configured" },
        { status: 500 }
      );
    }

    const { budget, vibe, companion, answers, mode } = await req.json();

    // 1. Prepare Content for AI
    // We send a simplified version of spots to save tokens
    const spotContext = SPOTS.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      price: "$$$",
      tags: s.tags,
      location: s.location,
    }));

    let prompt = "";

    if (mode === "chat") {
      prompt = `
          You are SPOTLY, a cynical, dark-humored AI host in Surat.
          USER SAYS: "${answers[0]}"
          
          Respond with a single, short, witty, roast-style message (max 2 sentences).
          Do not offer to help. Just be sassy.
        `;
    } else {
      prompt = `
          You are SPOTLY, a cynical, dark-humored, high-end concierge for Surat City.
          
          USER PROFILE:
          - Budget: ${budget}
          - Vibe: ${vibe}
          - Companion: ${companion}
          - Answers: ${answers.join(", ")}

          TASK:
          1. Select exactly 3 distinct spots from the AVAILABLE SPOTS list below that best fit this disaster of a plan.
          2. Write a short, roasting narrative (2-3 sentences) explaining why you picked these. Bejudgmental but helpful.
          3. Return ONLY valid JSON in this format:
          {
            "narrative": "string",
            "spots": [id1, id2, id3]
          }

          AVAILABLE SPOTS:
          ${JSON.stringify(spotContext)}
        `;
    }

    // 2. Generate with Fallback
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // 3. Clean and Parse (Robust cleaning)
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

      let data;
      if (mode === "chat") {
        data = { narrative: cleanedText, spots: [] };
      } else {
        try {
          data = JSON.parse(cleanedText);
        } catch (parseError) {
          console.error("Parse Error:", cleanedText);
          throw new Error("Failed to parse AI response");
        }
      }

      return NextResponse.json(data);

    } catch (apiError) {
      console.error("Gemini API Failed (Using Smart Fallback):", apiError);

      // --- SMART LOCAL AI (Context-Aware Responses) ---
      const userInput = (answers[0] || "").toLowerCase();

      let narrative = "";

      if (mode === "chat") {
        // Analyze user input for keywords
        if (userInput.includes("hi") || userInput.includes("hello") || userInput.includes("hey")) {
          const greetings = [
            "Oh, you're being polite? How refreshing. What do you want?",
            "Hello to you too. Ready to make questionable life choices?",
            "Hi. I'm judging you already. What's the plan?",
            "Hey there, social butterfly. Let's see what disaster you're planning."
          ];
          narrative = greetings[Math.floor(Math.random() * greetings.length)];
        } else if (userInput.includes("help") || userInput.includes("suggest")) {
          narrative = "Help? That's what I'm here for. Click those buttons above and let me roast your choices properly.";
        } else if (userInput.includes("food") || userInput.includes("eat") || userInput.includes("hungry")) {
          narrative = "Hungry? Shocking. Try the 'Date Night' or 'Solo' options above. I'll find you something that won't poison you.";
        } else if (userInput.includes("party") || userInput.includes("drink") || userInput.includes("club")) {
          narrative = "Party mode activated. Click 'Party (Regrettable)' above and let's see how bad this gets.";
        } else if (userInput.includes("coffee") || userInput.includes("cafe")) {
          narrative = "Coffee? The universal excuse for pretending to be productive. I respect it. Use the buttons above.";
        } else {
          const sassyResponses = [
            "That's... interesting. Use the buttons above for actual recommendations.",
            "I'm not sure what you want me to do with that information.",
            "Okay. Anyway, click a button above and let's get you sorted.",
            "Cool story. Now pick an option from the buttons.",
            "Noted. Moving on—use those shiny buttons above."
          ];
          narrative = sassyResponses[Math.floor(Math.random() * sassyResponses.length)];
        }

        return NextResponse.json({ narrative, spots: [] });
      } else {
        // Plan mode: Generate contextual itinerary
        const vibeKeywords = vibe.toLowerCase();
        let selectedSpots = [];

        // Smart spot selection based on vibe
        if (vibeKeywords.includes("date") || vibeKeywords.includes("romantic")) {
          selectedSpots = spotContext.filter(s =>
            s.tags.some(t => t.toLowerCase().includes("romantic") || t.toLowerCase().includes("fine"))
          ).slice(0, 3);
          narrative = "A date? Brave. Here's where you can pretend to be interesting for a few hours.";
        } else if (vibeKeywords.includes("party") || vibeKeywords.includes("wild")) {
          selectedSpots = spotContext.filter(s =>
            s.tags.some(t => t.toLowerCase().includes("nightlife") || t.toLowerCase().includes("bar"))
          ).slice(0, 3);
          narrative = "Party time. Here's your recipe for regret. You're welcome.";
        } else if (vibeKeywords.includes("solo") || vibeKeywords.includes("alone")) {
          selectedSpots = spotContext.filter(s =>
            s.tags.some(t => t.toLowerCase().includes("cafe") || t.toLowerCase().includes("quiet"))
          ).slice(0, 3);
          narrative = "Solo adventure? Finally, someone with standards. Here's where you can avoid people.";
        } else {
          selectedSpots = spotContext.slice(0, 3);
          narrative = "I'm not sure what you're going for, but here are some safe bets.";
        }

        // Fallback if filtering didn't work
        if (selectedSpots.length < 3) {
          selectedSpots = spotContext.slice(0, 3);
        }

        return NextResponse.json({
          narrative,
          spots: selectedSpots.map(s => s.id)
        });
      }
    }
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Undefined AI Error" },
      { status: 500 }
    );
  }
}
