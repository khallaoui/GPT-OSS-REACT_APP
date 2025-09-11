'use server';
/**
 * @fileOverview AI-powered personalized advice flow for morning and evening routines.
 *
 * - getPersonalizedAdvice - A function that generates personalized routine suggestions.
 * - PersonalizedAdviceInput - The input type for the getPersonalizedAdvice function.
 * - PersonalizedAdviceOutput - The return type for the getPersonalizedAdvice function.
 */
import { z } from 'zod';
import { habitCategories } from '@/lib/data';

const habitCategoryKeys = habitCategories.map(c => c.key) as [string, ...string[]];

// Define Zod schemas for the tools. This helps with type safety.
const addHabitSchema = z.object({
  name: z.string().describe('The name or title of the habit.'),
  description: z.string().describe('A brief description of how the user plans to perform the habit.').optional(),
  category: z.enum(habitCategoryKeys).describe('The category for the habit.'),
});

const addGoalSchema = z.object({
  title: z.string().describe('The title of the goal.'),
  timeline: z.string().describe("The user's desired timeline for achieving the goal (e.g., '3 months', '1 year')."),
});

// Tool definitions for the AI model
const tools = [
  {
    type: 'function',
    function: {
      name: 'addHabit',
      description: 'Creates a new habit for the user.',
      parameters: {
        type: 'object',
        properties: addHabitSchema.shape,
        required: ['name', 'category'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'addGoal',
      description: 'Creates a new goal for the user.',
      parameters: {
        type: 'object',
        properties: addGoalSchema.shape,
        required: ['title', 'timeline'],
      },
    },
  },
];


const PersonalizedAdviceInputSchema = z.object({
  userInput: z.string().describe('The user input describing their needs and goals for morning/evening routines.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'tool']).describe('The role of the message sender'),
    content: z.string().describe('The content of the message'),
    tool_calls: z.any().optional(),
    tool_call_id: z.string().optional(),
  })).optional().describe('The chat history of the conversation.'),
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;


// The 'any' type is used here to accommodate the varied structure of tool calls and text responses from the API.
export type PersonalizedAdviceOutput = {
  response: any;
};

export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  const messages = [
    {
      role: 'system',
      content: `You are GPT-Life, an AI personality coach helping users build better habits and develop their personality.
Give practical, actionable advice in a motivational tone.
If the user asks to create a habit or set a goal, use the provided tools to do so.
Infer the category for habits based on the user's request.
Acknowledge that the habit or goal has been created after using a tool.`
    },
    ...(input.chatHistory || []).map(m => ({ role: m.role, content: m.content, tool_calls: m.tool_calls, tool_call_id: m.tool_call_id })),
    { role: 'user', content: input.userInput }
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages,
        tools: tools,
        tool_choice: 'auto',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return { response: data.choices[0] };
  } catch (error) {
    console.error("Error fetching from OpenRouter:", error);
    return { response: { message: { content: "Oops! Something went wrong. Please check your API key and try again later." }}};
  }
}
