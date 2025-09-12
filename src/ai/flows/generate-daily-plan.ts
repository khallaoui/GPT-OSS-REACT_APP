'use server';
/**
 * @fileOverview This file defines a function for generating a daily plan based on user goals.
 *
 * @function generateDailyPlan - The main function to generate a daily plan.
 * @typedef {GenerateDailyPlanInput} GenerateDailyPlanInput - Input type for the generateDailyPlan function.
 */
import { ai } from '@/ai/genkit';
import { geminiPro } from '@genkit-ai/googleai';
import { z } from 'zod';

const GenerateDailyPlanInputSchema = z.object({
  userGoals: z
    .array(z.string())
    .describe('An array of user goals to base the daily plan on.'),
});

export type GenerateDailyPlanInput = z.infer<typeof GenerateDailyPlanInputSchema>;

const dailyPlanFlow = ai.defineFlow(
  {
    name: 'dailyPlanFlow',
    inputSchema: GenerateDailyPlanInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: geminiPro,
      prompt: `Create a comprehensive daily plan for someone with these goals: ${input.userGoals.join(', ')}.
Include morning routine, work/study blocks, breaks, evening routine, and self-care activities.
Make it realistic and time-specific.`,
      config: {
        maxOutputTokens: 512,
      }
    });

    return llmResponse.text();
  }
);


export async function generateDailyPlan(input: GenerateDailyPlanInput): Promise<string> {
  return await dailyPlanFlow(input);
}
