'use server';

/**
 * @fileOverview A conversational AI flow that provides personalized advice and
 * can add or update habits based on the user's request.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Habit } from '@/lib/types';

const HabitSchema = z.object({
  id: z.string().optional(),
  title: z.string().describe('The title of the habit.'),
  description: z.string().describe('A brief description of the habit.'),
  category: z.string().describe("The category of the habit (e.g., 'health', 'learning')."),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'one-time']).describe('How often the habit should be performed.'),
});

const PersonalizedAdviceInputSchema = z.object({
  userInput: z.string().describe("The user's question or request."),
  habits: z.array(HabitSchema as z.ZodType<Habit>).describe("The user's current list of habits."),
});

export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;

const PersonalizedAdviceOutputSchema = z.object({
  response: z.string().describe("The AI's conversational response to the user."),
  updatedHabits: z.array(HabitSchema as z.ZodType<Habit>).optional().describe('A list of new or updated habits if the user requested changes.'),
});

export type PersonalizedAdviceOutput = z.infer<typeof PersonalizedAdviceOutputSchema>;

export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  return personalizedAdviceFlow(input);
}

const habitPrompt = ai.definePrompt({
  name: 'personalizedAdvicePrompt',
  input: { schema: PersonalizedAdviceInputSchema },
  output: { schema: PersonalizedAdviceOutputSchema },
  prompt: `You are an AI life coach. Your role is to provide advice, answer questions, and help users manage their habits.

The user's current habits are:
\`\`\`json
{{#if habits}}
{{{JSONstringify habits}}}
{{else}}
[]
{{/if}}
\`\`\`

User's request: "{{userInput}}"

Based on the user's request:
1.  Provide a conversational and encouraging response in the 'response' field.
2.  If the user asks to "add", "create", or "set" a new habit, define it as a valid JSON object in the 'updatedHabits' array.
3.  Infer the category and frequency if not specified. Default frequency to 'daily' and category to 'learning'.
4.  Do not modify existing habits unless explicitly asked.
5.  If you are just providing advice or answering a question, the 'updatedHabits' array should be empty or omitted.
`,
});

const personalizedAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedAdviceFlow',
    inputSchema: PersonalizedAdviceInputSchema,
    outputSchema: PersonalizedAdviceOutputSchema,
  },
  async (input) => {
    // Generate a unique ID for any new habits
    const processedInput = {
      ...input,
      userInput: input.userInput
    };

    const { output } = await habitPrompt(processedInput);
    
    if (output && output.updatedHabits) {
      output.updatedHabits = output.updatedHabits.map(habit => ({
        ...habit,
        id: habit.id || `habit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      }));
    }

    return output!;
  }
);
