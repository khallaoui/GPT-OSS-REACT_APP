'use server';
/**
 * @fileOverview AI-powered personalized advice flow.
 * This file implements the "habit assistant" persona as requested by the user.
 */
import { z } from 'zod';
import type { Habit } from '@/lib/types';

// The new, user-specified habit object format.
const HabitSchema = z.object({
  id: z.string().describe("a unique id"),
  title: z.string().describe("short descriptive title"),
  description: z.string().describe("optional longer description").optional(),
  type: z.literal("habit"),
  frequency: z.enum(["daily", "weekly", "monthly", "one-time"]).describe("infer from text or default to 'daily'"),
  progress: z.literal(0),
  createdAt: z.string().describe("ISO timestamp"),
});

// A schema for the tool that the AI will use.
const createHabitToolSchema = z.object({
  habits: z.array(HabitSchema)
});

// The input for the main flow, which is just the user's text.
const PersonalizedAdviceInputSchema = z.object({
  userInput: z.string(),
  existingHabits: z.array(HabitSchema), // Pass existing habits for context.
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;


// The final output returned to the client.
export type PersonalizedAdviceOutput = {
  updatedHabits: Habit[];
};


export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  // Construct the prompt following the user's rules.
  const systemPrompt = `You are my habit assistant.
Whenever I give you a text describing a habit, create a new JavaScript object for that habit and add it to my list of habits.

The object format must be:
{
  id: "unique_id",          // generate a unique id
  title: "short title",     // short descriptive title
  description: "optional longer description",
  type: "habit",
  frequency: "daily | weekly | monthly | one-time", // infer from text or default to "daily"
  progress: 0,
  createdAt: "ISO timestamp"
}

Rules:
1. Only return the updated array of habits (with the new habit included).
2. Do not explain or add extra text.
3. Always append the new habit to the existing list.

This is the existing list of habits:
${JSON.stringify(input.existingHabits, null, 2)}
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://gpt-life.app",
        "X-Title": "GPT-Life AI Coach",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input.userInput }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const responseContent = JSON.parse(data.choices[0].message.content);

    // Validate the response against the Zod schema.
    const parsed = createHabitToolSchema.safeParse(responseContent);

    if (!parsed.success) {
      console.error("Invalid format from AI:", parsed.error);
      // Return existing habits if AI response is invalid
      return { updatedHabits: input.existingHabits };
    }

    return { updatedHabits: parsed.data.habits };

  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    // On error, return the original list of habits without changes.
    return { updatedHabits: input.existingHabits };
  }
}
