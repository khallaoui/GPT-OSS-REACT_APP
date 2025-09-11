'use server';
/**
 * @fileOverview AI-powered personalized advice flow for morning and evening routines.
 *
 * - getPersonalizedAdvice - A function that generates personalized routine suggestions.
 * - PersonalizedAdviceInput - The input type for the getPersonalizedAdvice function.
 * - PersonalizedAdviceOutput - The return type for the getPersonalizedAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedAdviceInputSchema = z.object({
  userInput: z.string().describe('The user input describing their needs and goals for morning/evening routines.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']).describe('The role of the message sender'),
    content: z.string().describe('The content of the message'),
  })).optional().describe('The chat history of the conversation.'),
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;

const PersonalizedAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized advice for improving morning and evening routines.'),
});
export type PersonalizedAdviceOutput = z.infer<typeof PersonalizedAdviceOutputSchema>;

export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  return personalizedAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedAdvicePrompt',
  input: {schema: PersonalizedAdviceInputSchema},
  output: {schema: PersonalizedAdviceOutputSchema},
  prompt: `You are an AI life coach specializing in providing personalized advice for morning and evening routines. Based on the user's input, provide specific, actionable suggestions for building better habits and improving their daily life.

User Input: {{{userInput}}}

{% if chatHistory %}
Chat History:
{% each chatHistory %}
{{this.role}}: {{this.content}}
{% endeach %}
{% endif %}

Provide tailored advice:
`,
});

const personalizedAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedAdviceFlow',
    inputSchema: PersonalizedAdviceInputSchema,
    outputSchema: PersonalizedAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
