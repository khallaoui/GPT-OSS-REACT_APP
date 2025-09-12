'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { PersonalizedAdviceInput, PersonalizedAdviceOutput, Habit } from '@/lib/types';

const MODEL_NAME = 'gemini-1.5-flash-latest';

// Ensure the API key is available
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in the environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig: {
    responseMimeType: 'application/json',
  },
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
  const systemPrompt = `You are an AI life coach. Your role is to provide advice, answer questions, and help users manage their habits. Your response MUST be valid JSON.

The user's current habits are:
\`\`\`json
${JSON.stringify(input.habits, null, 2)}
\`\`\`

The user's request is: "${input.userInput}"

Based on the user's request, you must return a JSON object with two properties:
1. "response": (string) A conversational and encouraging response to the user.
2. "updatedHabits": (array) An array of habit objects. If the user asks to "add", "create", or "set" a new habit, define it here. Otherwise, this should be an empty array.

A habit object must contain:
- "title": (string) The title of the habit.
- "description": (string) A brief description.
- "category": (string) Infer a category from the list: 'health', 'learning', 'productivity', 'morning', 'evening', 'social', 'mindfulness', 'financial'. Default to 'learning'.
- "frequency": (string) 'daily', 'weekly', 'monthly', or 'one-time'. Default to 'daily'.

Example 1: User says "add a habit to drink water".
Your response should be:
{
  "response": "Great idea! I've added 'Drink 8 glasses of water daily' to your health habits.",
  "updatedHabits": [
    {
      "title": "Drink 8 glasses of water daily",
      "description": "Stay hydrated throughout the day.",
      "category": "health",
      "frequency": "daily"
    }
  ]
}

Example 2: User says "how can I be more productive?".
Your response should be:
{
  "response": "To be more productive, try using the Pomodoro Technique. It involves working in focused 25-minute intervals with short breaks in between. Would you like to add this as a habit?",
  "updatedHabits": []
}

Do not add, modify or remove any other fields. The entire output must be a single, valid JSON object.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig,
      safetySettings,
    });
    
    const responseText = result.response.text();
    const parsedResponse = JSON.parse(responseText) as { response: string, updatedHabits?: Omit<Habit, 'id' | 'type' | 'progress' | 'createdAt' | 'completed' | 'streak'>[] };

    const newHabitsWithIds = (parsedResponse.updatedHabits || []).map(habit => ({
      ...habit,
      id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'habit' as const,
      progress: 0,
      createdAt: new Date().toISOString(),
      completed: false,
      streak: 0,
    }));
    
    return {
      response: parsedResponse.response,
      updatedHabits: newHabitsWithIds,
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      response: "Sorry, I had trouble understanding that. Could you try rephrasing?",
      updatedHabits: [],
    };
  }
}
