'use server';
/**
 * @fileOverview A simplified AI-powered advice flow.
 */
import { z } from 'zod';
import { ai } from '@/ai/genkit';
import type { Habit } from '@/lib/types';

const PersonalizedAdviceInputSchema = z.object({
  userInput: z.string(),
  habits: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      category: z.string().optional(),
      completed: z.boolean().optional(),
      streak: z.number().optional(),
      frequency: z.enum(['daily', 'weekly', 'monthly', 'one-time']),
    })
  ),
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;

// Define the schema for a single habit, which can be created or updated.
const HabitSchema = z.object({
  id: z.string().optional().describe("An optional existing ID to update a habit. If not provided, a new habit is created."),
  title: z.string().describe("The name of the habit."),
  description: z.string().optional().describe("A brief description of how the habit is performed."),
  category: z.string().optional().describe("The category the habit belongs to."),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'one-time']).default('daily'),
});

// Define the full response schema from the AI.
const AIResponseSchema = z.object({
  response: z.string().describe("The AI's conversational response to the user."),
  updatedHabits: z.array(HabitSchema).optional().describe("A list of new or updated habits based on the user's request. Only include habits that were explicitly mentioned for creation or update."),
});

// The final output returned to the client.
export type PersonalizedAdviceOutput = {
  response: string;
  updatedHabits?: Habit[];
};

const habitPrompt = ai.definePrompt({
  name: 'habitCoachPrompt',
  input: { schema: PersonalizedAdviceInputSchema },
  output: { schema: AIResponseSchema },
  prompt: `You are an AI life coach. Your role is to provide advice, answer questions, and help users manage their habits.

The user's current habits are:
{{#if habits}}
  {{#each habits}}
  - {{this.title}} ({{this.description}})
  {{/each}}
{{else}}
  No habits defined yet.
{{/if}}

User's request: "{{userInput}}"

Based on the user's request:
1.  Provide a conversational and encouraging response.
2.  If the user asks to add, create, or set a new habit, define it in the 'updatedHabits' array.
3.  If the user asks a general question or for advice, provide a helpful response and leave 'updatedHabits' empty.
4.  Do not modify existing habits unless explicitly asked.
5.  Infer the category and frequency if not specified, but default to 'daily' for frequency.`,
});

const getPersonalizedAdviceFlow = ai.defineFlow(
  {
    name: 'getPersonalizedAdviceFlow',
    inputSchema: PersonalizedAdviceInputSchema,
    outputSchema: AIResponseSchema,
  },
  async (input) => {
    const llmResponse = await habitPrompt(input);
    return llmResponse.output!;
  }
);


export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  const result = await getPersonalizedAdviceFlow(input);
  return {
    response: result.response,
    updatedHabits: result.updatedHabits?.map(h => ({ ...h, id: h.id || crypto.randomUUID(), type: 'habit', progress: 0, createdAt: new Date().toISOString() }))
  };
}
