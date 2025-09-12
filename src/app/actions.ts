'use server';

import { getGeminiResponse } from '@/lib/gemini';

// This is a simple wrapper for the AI call to be used in client components.
export async function getPersonalizedAdvice(input: { userInput: string }): Promise<{ response: string; }> {
  try {
    const result = await getGeminiResponse(input.userInput);
    return { response: result };
  } catch (error) {
    console.error("Error in getPersonalizedAdvice:", error);
    return { response: "I'm sorry, but I couldn't get a response. Please try again." };
  }
}

export async function generateDailyPlan(input: { userGoals: string[] }): Promise<string> {
  try {
    const prompt = `Create a comprehensive daily plan for someone with these goals: ${input.userGoals.join(', ')}.
Include morning routine, work/study blocks, breaks, evening routine, and self-care activities.
Make it realistic and time-specific.`;
    const result = await getGeminiResponse(prompt);
    return result;
  } catch (error) {
    console.error("Error in generateDailyPlan:", error);
    return "I'm sorry, but I couldn't generate a daily plan at this moment. Please check your goals and try again.";
  }
}

export async function improveHabitMethods(input: { habitName: string, currentMethod: string }): Promise<string> {
  try {
    const prompt = `You are an AI habit coach. A user has the habit '${input.habitName}' and currently does it like this: ${input.currentMethod}.\n\
Please suggest 3 improved methods or techniques to make this habit more effective, sustainable, and rewarding.\nProvide specific, actionable suggestions.\n`;
    const result = await getGeminiResponse(prompt);
    return result;
  } catch (error) {
    console.error("Error in improveHabitMethods:", error);
    return "I'm having trouble coming up with suggestions right now. Please tell me more about your habit and I'll try again.";
  }
}
