'use server';
/**
 * @fileOverview AI-powered personalized advice flow for morning and evening routines.
 *
 * - getPersonalizedAdvice - A function that generates personalized routine suggestions.
 * - PersonalizedAdviceInput - The input type for the getPersonalizedAdvice function.
 * - PersonalizedAdviceOutput - The return type for the getPersonalizedAdvice function.
 */

import {z} from 'zod';

const PersonalizedAdviceInputSchema = z.object({
  userInput: z.string().describe('The user input describing their needs and goals for morning/evening routines.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']).describe('The role of the message sender'),
    content: z.string().describe('The content of the message'),
  })).optional().describe('The chat history of the conversation.'),
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;

const PersonalizedAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized advice for improving morning and evening routines.'),
});
export type PersonalizedAdviceOutput = z.infer<typeof PersonalizedAdviceOutputSchema>;

export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  const messages = [
    {
      role: 'system' as const,
      content: 'You are GPT-Life, an AI personality coach helping users build better habits and develop their personality. Give practical, actionable advice in a motivational tone.'
    },
    ...(input.chatHistory || []).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: input.userInput }
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "openrouter/cinematika-7b:free", // "openai/gpt-oss-20b:free" seems to be unavailable, using a free alternative
        messages: messages,
        max_tokens: 300,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const advice = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response. Try again.";
    return { advice };
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return { advice: "Oops! Something went wrong. Please check your API key and try again later." };
  }
}
