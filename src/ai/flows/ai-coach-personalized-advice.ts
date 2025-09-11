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
import { habitCategories } from '@/lib/data';

const habitCategoryKeys = habitCategories.map(c => c.key) as [string, ...string[]];

export const addHabitTool = ai.defineTool(
  {
    name: 'addHabit',
    description: 'Creates a new habit for the user.',
    inputSchema: z.object({
      name: z.string().describe('The name or title of the habit.'),
      description: z.string().describe('A brief description of how the user plans to perform the habit.').optional(),
      category: z.enum(habitCategoryKeys).describe('The category for the habit.'),
    }),
    outputSchema: z.string(),
  },
  async (habit) => {
    // In a real app, this would add the habit to a database.
    // For now, we'll just confirm it was "added".
    return `Habit "${habit.name}" has been added under the ${habit.category} category.`;
  }
);

export const addGoalTool = ai.defineTool(
  {
    name: 'addGoal',
    description: 'Creates a new goal for the user.',
    inputSchema: z.object({
      title: z.string().describe('The title of the goal.'),
      timeline: z.string().describe("The user's desired timeline for achieving the goal (e.g., '3 months', '1 year')."),
    }),
    outputSchema: z.string(),
  },
  async (goal) => {
    return `Goal "${goal.title}" with a timeline of ${goal.timeline} has been set.`;
  }
);


const PersonalizedAdviceInputSchema = z.object({
  userInput: z.string().describe('The user input describing their needs and goals for morning/evening routines.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model', 'system', 'tool']).describe('The role of the message sender'),
    content: z.string().describe('The content of the message'),
  })).optional().describe('The chat history of the conversation.'),
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;

const PersonalizedAdviceOutputSchema = z.object({
   response: z.any().describe('Personalized advice or tool call result.'),
});
export type PersonalizedAdviceOutput = z.infer<typeof PersonalizedAdviceOutputSchema>;

export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  const history = (input.chatHistory || []).map((msg: any) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

  const { response } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    tools: [addHabitTool, addGoalTool],
    prompt: input.userInput,
    history,
    config: {
      toolChoice: 'auto'
    },
    system: `You are GPT-Life, an AI personality coach helping users build better habits and develop their personality.
Give practical, actionable advice in a motivational tone.
If the user asks to create a habit or set a goal, use the provided tools to do so.
Infer the category for habits based on the user's request.
Acknowledge that the habit or goal has been created after using a tool.`
  });
  
  return { response: response };
}