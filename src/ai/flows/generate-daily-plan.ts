'use server';

/**
 * @fileOverview Generates a daily action plan based on a user's long-term goals.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateDailyPlanInputSchema = z.object({
  userGoals: z.array(z.string()).describe("A list of the user's long-term goals."),
});
export type GenerateDailyPlanInput = z.infer<typeof GenerateDailyPlanInputSchema>;

const GenerateDailyPlanOutputSchema = z.object({
  plan: z.string().describe('A comprehensive, time-specific daily plan in markdown format.'),
});
export type GenerateDailyPlanOutput = z.infer<typeof GenerateDailyPlanOutputSchema>;

export async function generateDailyPlan(input: GenerateDailyPlanInput): Promise<GenerateDailyPlanOutput> {
  return generateDailyPlanFlow(input);
}

const dailyPlanPrompt = ai.definePrompt({
  name: 'generateDailyPlanPrompt',
  input: { schema: GenerateDailyPlanInputSchema },
  output: { schema: GenerateDailyPlanOutputSchema },
  prompt: `You are an AI assistant that creates a comprehensive daily plan for someone with these goals: {{#each userGoals}}- {{this}} {{/each}}.
Include a morning routine, work/study blocks, breaks, an evening routine, and self-care activities.
Make it realistic and time-specific. The output should be a single block of plain text.`,
});

const generateDailyPlanFlow = ai.defineFlow(
  {
    name: 'generateDailyPlanFlow',
    inputSchema: GenerateDailyPlanInputSchema,
    outputSchema: GenerateDailyPlanOutputSchema,
  },
  async (input) => {
    const { output } = await dailyPlanPrompt(input);
    return output!;
  }
);
