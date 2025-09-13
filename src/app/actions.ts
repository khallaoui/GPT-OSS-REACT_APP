'use server';

import { getAIResponse } from '@/lib/gemini';
import type { PersonalizedAdviceInput, PersonalizedAdviceOutput } from '@/lib/types';

// This is a simple wrapper for the AI call to be used in client components.
export async function getAICoachResponse(
  input: PersonalizedAdviceInput
): Promise<PersonalizedAdviceOutput> {
  // The try-catch is now handled inside getAIResponse, making this action a clean pass-through.
  return getAIResponse(input);
}
