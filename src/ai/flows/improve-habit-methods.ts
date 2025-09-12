'use server';

/**
 * @fileOverview Generates suggestions for improving a user's existing habit.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ImproveHabitMethodsInputSchema = z.object({
  habitName: z.string().describe("The name of the habit the user wants to improve."),
  currentMethod: z.string().describe("The user's current method for performing the habit."),
});
export type ImproveHabitMethodsInput = z.infer<typeof ImproveHabitMethodsInputSchema>;

const ImproveHabitMethodsOutputSchema = z.object({
  suggestions: z.string().describe('Actionable suggestions for improving the habit, formatted as plain text.'),
});
export type ImproveHabitMethodsOutput = z.infer<typeof ImproveHabitMethodsOutputSchema>;

export async function improveHabitMethods(input: ImproveHabitMethodsInput): Promise<ImproveHabitMethodsOutput> {
  return improveHabitMethodsFlow(input);
}

const improveHabitPrompt = ai.definePrompt({
  name: 'improveHabitMethodsPrompt',
  input: { schema: ImproveHabitMethodsInputSchema },
  output: { schema: ImproveHabitMethodsOutputSchema },
  prompt: `You are an AI habit coach. A user has the habit '{{habitName}}' and currently does it like this: {{currentMethod}}.
Please suggest 3 improved methods or techniques to make this habit more effective, sustainable, and rewarding.
Provide specific, actionable suggestions.`,
});

const improveHabitMethodsFlow = ai.defineFlow(
  {
    name: 'improveHabitMethodsFlow',
    inputSchema: ImproveHabitMethodsInputSchema,
    outputSchema: ImproveHabitMethodsOutputSchema,
  },
  async (input) => {
    const { output } = await improveHabitPrompt(input);
    return output!;
  }
);
