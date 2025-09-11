'use server';

/**
 * @fileOverview An AI agent for improving habit methods.
 *
 * - improveHabitMethods - A function that suggests improved methods for a given habit.
 * - ImproveHabitMethodsInput - The input type for the improveHabitMethods function.
 * - ImproveHabitMethodsOutput - The return type for the improveHabitMethods function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveHabitMethodsInputSchema = z.object({
  habitName: z.string().describe('The name of the habit to improve.'),
  currentMethod: z.string().describe('The current method used for the habit.'),
});
export type ImproveHabitMethodsInput = z.infer<typeof ImproveHabitMethodsInputSchema>;

const ImproveHabitMethodsOutputSchema = z.object({
  suggestions: z.string().describe('A list of improved methods or techniques to make the habit more effective.'),
});
export type ImproveHabitMethodsOutput = z.infer<typeof ImproveHabitMethodsOutputSchema>;

export async function improveHabitMethods(input: ImproveHabitMethodsInput): Promise<ImproveHabitMethodsOutput> {
  return improveHabitMethodsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveHabitMethodsPrompt',
  input: {schema: ImproveHabitMethodsInputSchema},
  output: {schema: ImproveHabitMethodsOutputSchema},
  prompt: `You are an AI habit coach. A user has the habit '{{habitName}}' and currently does it like this: {{currentMethod}}.\n\
Please suggest 3 improved methods or techniques to make this habit more effective, sustainable, and rewarding.\nProvide specific, actionable suggestions.\n`,
});

const improveHabitMethodsFlow = ai.defineFlow(
  {
    name: 'improveHabitMethodsFlow',
    inputSchema: ImproveHabitMethodsInputSchema,
    outputSchema: ImproveHabitMethodsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
