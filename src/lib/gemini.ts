'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { PersonalizedAdviceInput, PersonalizedAdviceOutput, Habit } from '@/lib/types';

const MODEL_NAME = 'gemini-1.5-flash-latest';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
});

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 8192,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export async function getAIResponse(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  const systemPrompt = `You are an AI Coach. Your role is to provide encouraging advice and help users improve their habits.

You must follow these rules strictly:
1.  **Always speak in plain, friendly text only.**
2.  **Do not include JSON, brackets, or any technical formatting like "response" or "updatedHabits".**
3.  Reply with a natural sentence that can be displayed directly in a chat, as if you were having a real conversation.

Here is the user's current context:
- Their habits are: ${JSON.stringify(input.habits.map(h => h.title))}
- Their request is: "${input.userInput}"

Now, provide a helpful and conversational response.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig,
      safetySettings,
    });
    
    const responseText = result.response.text();
    
    // Since we now expect plain text, we return it directly.
    // The "updatedHabits" feature is disabled by this change, but it ensures the chat is clean.
    return {
      response: responseText,
      updatedHabits: [],
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      response: "Sorry, I had trouble connecting to the AI service. Please check your API key and try again.",
      updatedHabits: [],
    };
  }
}
