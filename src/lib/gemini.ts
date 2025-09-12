'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { Habit } from "@/lib/types";

const MODEL_NAME = "gemini-1.5-flash-latest";
const API_KEY = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

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

export type PersonalizedAdviceInput = {
  userInput: string;
  habits: Habit[];
};

export type PersonalizedAdviceOutput = {
  response: string;
  updatedHabits?: Habit[];
};

export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  const parts = [
    {
      text: `You are an AI life coach. Your role is to provide advice, answer questions, and help users manage their habits.
The user's current habits are:
${input.habits.length > 0 ? input.habits.map(h => `- ${h.title} (${h.description})`).join('\n') : 'No habits defined yet.'}

User's request: "${input.userInput}"

Based on the user's request:
1.  Provide a conversational and encouraging response in the 'response' field.
2.  If the user asks to add, create, or set a new habit, define it in the 'updatedHabits' array. The output must be a valid JSON object.
3.  Infer the category and frequency if not specified, but default to 'daily' for frequency.
4.  Do not modify existing habits unless explicitly asked.
5.  If you are just providing advice or answering a question, the 'updatedHabits' array should be empty.

Your entire output must be a single JSON object with two keys: "response" (string) and "updatedHabits" (an array of habits). A habit object should have: 'title', 'description', 'category', 'frequency' ('daily', 'weekly', 'monthly', or 'one-time').
Example habit object: { "title": "Run three times a week", "description": "Morning runs on M, W, F", "category": "health", "frequency": "weekly" }
`,
    },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const jsonResponse = result.response.text();
    const parsedResult = JSON.parse(jsonResponse);

    const output: PersonalizedAdviceOutput = {
      response: parsedResult.response || "I'm not sure how to respond to that.",
    };

    if (parsedResult.updatedHabits && Array.isArray(parsedResult.updatedHabits)) {
      output.updatedHabits = parsedResult.updatedHabits.map((h: any) => ({
        id: crypto.randomUUID(),
        title: h.title,
        description: h.description,
        category: h.category,
        frequency: h.frequency,
        type: 'habit',
        progress: 0,
        createdAt: new Date().toISOString(),
        completed: false,
        streak: 0,
      }));
    }

    return output;
  } catch (error) {
    console.error("Error getting personalized advice:", error);
    return { response: "Sorry, I had trouble processing that request. The AI may have returned an invalid format." };
  }
}

export type GenerateDailyPlanInput = {
  userGoals: string[];
};

export async function generateDailyPlan(input: GenerateDailyPlanInput): Promise<string> {
  const prompt = `Create a comprehensive daily plan for someone with these goals: ${input.userGoals.join(', ')}.
Include morning routine, work/study blocks, breaks, evening routine, and self-care activities.
Make it realistic and time-specific. The output should be plain text.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating daily plan:", error);
    return "I'm sorry, but I couldn't generate a daily plan at this moment.";
  }
}

export type ImproveHabitMethodsInput = {
  habitName: string;
  currentMethod: string;
};

export async function improveHabitMethods(input: ImproveHabitMethodsInput): Promise<string> {
  const prompt = `You are an AI habit coach. A user has the habit '${input.habitName}' and currently does it like this: ${input.currentMethod}.\n\
Please suggest 3 improved methods or techniques to make this habit more effective, sustainable, and rewarding.\nProvide specific, actionable suggestions as plain text.`;
  
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error improving habit methods:", error);
    return "I'm having trouble coming up with suggestions right now.";
  }
}
