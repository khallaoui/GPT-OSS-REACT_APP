'use server';

import { getPersonalizedAdvice as getPersonalizedAdviceFlow } from '@/ai/flows/ai-coach-personalized-advice';
import { generateDailyPlan as generateDailyPlanFlow } from '@/ai/flows/generate-daily-plan';
import { improveHabitMethods as improveHabitMethodsFlow } from '@/ai/flows/improve-habit-methods';

// This is a simple wrapper for the AI call to be used in client components.
export async function getPersonalizedAdvice(input: { userInput: string }): Promise<{ response: string; }> {
  try {
    const result = await getPersonalizedAdviceFlow(input);
    return { response: result.response };
  } catch (error) {
    console.error("Error in getPersonalizedAdvice:", error);
    return { response: "I'm sorry, but I couldn't get a response. Please try again." };
  }
}

export async function generateDailyPlan(input: { userGoals: string[] }): Promise<string> {
  try {
    const result = await generateDailyPlanFlow(input);
    return result;
  } catch (error) {
    console.error("Error in generateDailyPlan:", error);
    return "I'm sorry, but I couldn't generate a daily plan at this moment. Please check your goals and try again.";
  }
}

export async function improveHabitMethods(input: { habitName: string, currentMethod: string }): Promise<string> {
  try {
    const result = await improveHabitMethodsFlow(input);
    return result;
  } catch (error) {
    console.error("Error in improveHabitMethods:", error);
    return "I'm having trouble coming up with suggestions right now. Please tell me more about your habit and I'll try again.";
  }
}
