'use server';

import {
  getPersonalizedAdvice,
  generateDailyPlan,
  improveHabitMethods,
} from '@/lib/gemini';

import type {
  PersonalizedAdviceInput,
  PersonalizedAdviceOutput,
} from '@/lib/gemini';
import type { GenerateDailyPlanInput } from '@/lib/gemini';
import type { ImproveHabitMethodsInput } from '@/lib/gemini';

// This is a simple wrapper for the AI call to be used in client components.
export async function getAICoachResponse(
  input: PersonalizedAdviceInput
): Promise<PersonalizedAdviceOutput> {
  try {
    const result = await getPersonalizedAdvice(input);
    return result;
  } catch (error) {
    console.error('Error in getPersonalizedAdvice:', error);
    return {
      response: "I'm sorry, but I couldn't get a response. Please try again.",
    };
  }
}

export async function getDailyPlan(
  input: GenerateDailyPlanInput
): Promise<string> {
  try {
    const result = await generateDailyPlan(input);
    return result;
  } catch (error) {
    console.error('Error in generateDailyPlan:', error);
    return "I'm sorry, but I couldn't generate a daily plan at this moment. Please check your goals and try again.";
  }
}

export async function getHabitSuggestions(
  input: ImproveHabitMethodsInput
): Promise<string> {
  try {
    const result = await improveHabitMethods(input);
    return result;
  } catch (error) {
    console.error('Error in improveHabitMethods:', error);
    return "I'm having trouble coming up with suggestions right now. Please tell me more about your habit and I'll try again.";
  }
}
