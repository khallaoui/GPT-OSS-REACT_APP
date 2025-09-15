// src/lib/gptoss.ts
import type { PersonalizedAdviceInput, PersonalizedAdviceOutput, Habit } from "@/lib/types";

export async function getAIResponse(
  input: PersonalizedAdviceInput
): Promise<PersonalizedAdviceOutput> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content: "You are GPT-Life, an AI Coach helping users improve their habits. Reply in plain, friendly text. Suggest new habits only if needed, and list them in JSON under 'updatedHabits'."
          },
          {
            role: "user",
            content: `User habits: ${input.habits.map(h => h.title).join(", ")}
User input: "${input.userInput}"`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiMessage = data?.choices?.[0]?.message?.content || "No response received.";

    // Parse JSON for updated habits
    let updatedHabits: Habit[] = [];
    try {
      const jsonMatch = aiMessage.match(/\{.*"updatedHabits".*\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        updatedHabits = (parsed.updatedHabits || []).map((h: { title: string }) => ({
          id: crypto.randomUUID(),
          title: h.title,
          type: "general",        // default type
          frequency: 1,           // default frequency
          progress: 0,            // default progress
          createdAt: new Date().toISOString()
        }));
      }
    } catch {
      updatedHabits = [];
    }

    return {
      response: aiMessage.replace(/\{.*"updatedHabits".*\}/s, "").trim(),
      updatedHabits
    };
  } catch (error) {
    console.error("Error calling GPT-OSS-120B:", error);
    return {
      response: "Sorry, I had trouble connecting to the AI service. Please check your API key and try again.",
      updatedHabits: []
    };
  }
}
