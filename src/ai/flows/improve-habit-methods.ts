'use server';

/**
 * @fileOverview An AI agent for improving habit methods.
 *
 * - improveHabitMethods - A function that suggests improved methods for a given habit.
 * - ImproveHabitMethodsInput - The input type for the improveHabitMethods function.
 */
import { ai } from '@/ai/genkit';
import { geminiPro } from '@genkit-ai/googleai';
import { z } from 'zod';

const ImproveHabitMethodsInputSchema = z.object({
  habitName: z.string().describe('The name of the habit to improve.'),
  currentMethod: z.string().describe('The current method used for the habit.'),
});
export type ImproveHabitMethodsInput = z.infer<typeof ImproveHabitMethodsInputSchema>;

const improveHabitMethodsFlow = ai.defineFlow(
  {
    name: 'improveHabitMethodsFlow',
    inputSchema: ImproveHabitMethodsInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: geminiPro,
      prompt: `You are an AI habit coach. A user has the habit '${input.habitName}' and currently does it like this: ${input.currentMethod}.\n\
Please suggest 3 improved methods or techniques to make this habit more effective, sustainable, and rewarding.\nProvide specific, actionable suggestions.\n`,
    });
    return llmResponse.text();
  }
);


export async function improveHabitMethods(input: ImproveHabitMethodsInput): Promise<string> {
  return await improveHabitMethodsFlow(input);
}
