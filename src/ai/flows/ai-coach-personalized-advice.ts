'use server';
/**
 * @fileOverview AI-powered habit creation flow based on user's explicit instructions.
 */
import { z } from 'zod';
import type { Habit } from '@/lib/types';

// The user-specified habit object format.
const HabitSchema = z.object({
  id: z.string().describe("a unique id"),
  title: z.string().describe("short descriptive title"),
  description: z.string().describe("optional longer description").optional(),
  type: z.literal("habit"),
  frequency: z.enum(["daily", "weekly", "monthly", "one-time"]).describe("infer from text or default to 'daily'"),
  progress: z.literal(0),
  createdAt: z.string().describe("ISO timestamp"),
});

// A schema for the expected AI response.
const AIResponseSchema = z.object({
  habits: z.array(HabitSchema)
});

// The input for the flow.
const PersonalizedAdviceInputSchema = z.object({
  userInput: z.string(),
  existingHabits: z.array(HabitSchema),
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;


// The final output returned to the client.
export type PersonalizedAdviceOutput = {
  updatedHabits: Habit[];
};


export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  // Construct the prompt following the user's rules.
  const systemPrompt = `You are my habit assistant.
When I describe a new habit or goal in plain text, create a new habit object for it and add it to my list.

The object must include:
- id (unique id)
- title (short descriptive name)
- description (optional longer description)
- type (always "habit")
- frequency (daily | weekly | monthly | one-time, infer from my text or default to daily)
- progress (always start at 0)
- createdAt (current timestamp in ISO format)

Rules:
1. Always return a JSON object with a single key "habits" which is an array of all habits including the new one.
2. Do not explain, just return the JSON object.
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
      console.error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      // On error, return the original list of habits.
      return { updatedHabits: input.existingHabits };
    }

    const data = await response.json();
    const responseContent = JSON.parse(data.choices[0].message.content);

    // Validate the response against the Zod schema.
    const parsed = AIResponseSchema.safeParse(responseContent);

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
