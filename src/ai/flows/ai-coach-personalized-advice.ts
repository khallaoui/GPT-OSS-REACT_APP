'use server';
/**
 * @fileOverview A simplified AI-powered advice flow.
 */
import { z } from 'zod';
import { ai } from '@/ai/genkit';

const PersonalizedAdviceInputSchema = z.object({
  userInput: z.string(),
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;


// The final output returned to the client.
export type PersonalizedAdviceOutput = {
  response: string;
};

const getPersonalizedAdviceFlow = ai.defineFlow(
  {
    name: 'getPersonalizedAdviceFlow',
    inputSchema: PersonalizedAdviceInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: input.userInput,
    });
    
    return llmResponse.text;
  }
);


export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  const result = await getPersonalizedAdviceFlow(input);
  return { response: result };
}
