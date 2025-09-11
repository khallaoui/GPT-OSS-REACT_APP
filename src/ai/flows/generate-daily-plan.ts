// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a daily plan based on user goals.
 *
 * The flow takes user goals as input and returns a comprehensive daily plan including morning routine,
 * work/study blocks, breaks, evening routine, and self-care activities.
 *
 * @function generateDailyPlan - The main function to generate a daily plan.
 * @typedef {GenerateDailyPlanInput} GenerateDailyPlanInput - Input type for the generateDailyPlan function.
 * @typedef {GenerateDailyPlanOutput} GenerateDailyPlanOutput - Return type for the generateDailyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyPlanInputSchema = z.object({
  userGoals: z
    .array(z.string())
    .describe('An array of user goals to base the daily plan on.'),
});

export type GenerateDailyPlanInput = z.infer<typeof GenerateDailyPlanInputSchema>;

const GenerateDailyPlanOutputSchema = z.object({
  dailyPlan: z.string().describe('A comprehensive daily plan based on the user goals.'),
});

export type GenerateDailyPlanOutput = z.infer<typeof GenerateDailyPlanOutputSchema>;

export async function generateDailyPlan(input: GenerateDailyPlanInput): Promise<GenerateDailyPlanOutput> {
  return generateDailyPlanFlow(input);
}

const generateDailyPlanPrompt = ai.definePrompt({
  name: 'generateDailyPlanPrompt',
  input: {schema: GenerateDailyPlanInputSchema},
  output: {schema: GenerateDailyPlanOutputSchema},
  prompt: `Create a comprehensive daily plan for someone with these goals: {{{userGoals}}}.
Include morning routine, work/study blocks, breaks, evening routine, and self-care activities.
Make it realistic and time-specific.`,
});

const generateDailyPlanFlow = ai.defineFlow(
  {
    name: 'generateDailyPlanFlow',
    inputSchema: GenerateDailyPlanInputSchema,
    outputSchema: GenerateDailyPlanOutputSchema,
  },
  async input => {
    const {output} = await generateDailyPlanPrompt(input);
    return {dailyPlan: output!.dailyPlan!};
  }
);
