'use server';

/**
 * @fileOverview An AI agent for improving habit methods.
 *
 * - improveHabitMethods - A function that suggests improved methods for a given habit.
 * - ImproveHabitMethodsInput - The input type for the improveHabitMethods function.
 */

import { z } from 'zod';

const ImproveHabitMethodsInputSchema = z.object({
  habitName: z.string().describe('The name of the habit to improve.'),
  currentMethod: z.string().describe('The current method used for the habit.'),
});
export type ImproveHabitMethodsInput = z.infer<typeof ImproveHabitMethodsInputSchema>;


export async function improveHabitMethods(input: ImproveHabitMethodsInput): Promise<string> {
    const prompt = `You are an AI habit coach. A user has the habit '${input.habitName}' and currently does it like this: ${input.currentMethod}.\n\
Please suggest 3 improved methods or techniques to make this habit more effective, sustainable, and rewarding.\nProvide specific, actionable suggestions.\n`;

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
              { role: 'user', content: prompt }
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
          return "Sorry, I couldn't generate suggestions at this time.";
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "Sorry, I received an empty response.";
    } catch (error) {
        console.error("Error fetching from OpenRouter:", error);
        return "Oops! Something went wrong. Please check your API key and try again later.";
    }
}
