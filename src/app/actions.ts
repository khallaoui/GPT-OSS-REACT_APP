'use server';

import { getPersonalizedAdvice } from '@/ai/flows/ai-coach-personalized-advice';
import type { PersonalizedAdviceInput, PersonalizedAdviceOutput } from '@/ai/flows/ai-coach-personalized-advice';

// This is a simple wrapper for the AI call to be used in client components.
export async function getAICoachResponse(
  input: PersonalizedAdviceInput
): Promise<PersonalizedAdviceOutput> {
  try {
    const result = await getPersonalizedAdvice(input);
    return result;
  } catch (error) {
    console.error('Error in getPersonalizedAdvice:', error);
    // Return a structured error response
    return {
      response: "I'm sorry, but I couldn't get a response. Please try again.",
      updatedHabits: [] 
    };
  }
}
