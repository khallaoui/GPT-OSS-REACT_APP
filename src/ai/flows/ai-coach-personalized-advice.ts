'use server';
/**
 * @fileOverview AI-powered habit creation flow based on user's explicit instructions.
 */
import { z } from 'zod';
import type { Habit } from '@/lib/types';
import { ai } from '@/ai/genkit';

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

const PersonalizedAdviceOutputSchema = z.object({
  updatedHabits: z.array(HabitSchema)
});


const habitPrompt = ai.definePrompt({
  name: 'habitPrompt',
  inputSchema: PersonalizedAdviceInputSchema,
  outputSchema: AIResponseSchema,
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are my habit assistant.
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
{{{json existingHabits}}}
`,
});


const getPersonalizedAdviceFlow = ai.defineFlow(
  {
    name: 'getPersonalizedAdviceFlow',
    inputSchema: PersonalizedAdviceInputSchema,
    outputSchema: PersonalizedAdviceOutputSchema,
  },
  async (input) => {

    const llmResponse = await habitPrompt(input);
    const output = llmResponse.output;

    if (!output) {
      // On error, return the original list of habits.
      return { updatedHabits: input.existingHabits };
    }
    
    return { updatedHabits: output.habits };
  }
);


export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  const result = await getPersonalizedAdviceFlow(input);
  return result;
}
