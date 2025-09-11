'use server';
/**
 * @fileOverview This file defines a function for generating a daily plan based on user goals.
 *
 * @function generateDailyPlan - The main function to generate a daily plan.
 * @typedef {GenerateDailyPlanInput} GenerateDailyPlanInput - Input type for the generateDailyPlan function.
 */

import { z } from 'zod';

const GenerateDailyPlanInputSchema = z.object({
  userGoals: z
    .array(z.string())
    .describe('An array of user goals to base the daily plan on.'),
});

export type GenerateDailyPlanInput = z.infer<typeof GenerateDailyPlanInputSchema>;

export async function generateDailyPlan(input: GenerateDailyPlanInput): Promise<string> {
  const prompt = `Create a comprehensive daily plan for someone with these goals: ${input.userGoals.join(', ')}.
Include morning routine, work/study blocks, breaks, evening routine, and self-care activities.
Make it realistic and time-specific.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: 'system', content: 'You are a productivity expert who creates daily plans.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      return "Sorry, I couldn't generate a plan at this time.";
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Sorry, I received an empty response.";
  } catch (error) {
    console.error("Error fetching from OpenRouter:", error);
    return "Oops! Something went wrong. Please check your API key and try again later.";
  }
}
