'use server';
/**
 * @fileOverview A simplified AI-powered advice flow.
 */
import { z } from 'zod';
import { ai } from '@/ai/genkit';
import type { Habit } from '@/lib/types';

// The input for the flow.
const PersonalizedAdviceInputSchema = z.object({
  userInput: z.string(),
  existingHabits: z.array(z.any()), // Kept for potential context, but not used in prompt
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;


// The final output returned to the client.
export type PersonalizedAdviceOutput = {
  response: string;
};

const PersonalizedAdviceOutputSchema = z.object({
  response: z.string()
});


const getPersonalizedAdviceFlow = ai.defineFlow(
  {
    name: 'getPersonalizedAdviceFlow',
    inputSchema: PersonalizedAdviceInputSchema,
    outputSchema: PersonalizedAdviceOutputSchema,
  },
  async (input) => {
    
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: `You are a helpful AI life coach. The user asked: "${input.userInput}". Provide a concise and helpful response.`,
    });
    
    const response = llmResponse.text;
    
    return { response };
  }
);


export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  const result = await getPersonalizedAdviceFlow(input);
  return result;
}
