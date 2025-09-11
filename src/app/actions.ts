'use server';

import { 
  getPersonalizedAdvice as getPersonalizedAdviceFlow,
  type PersonalizedAdviceInput,
  type PersonalizedAdviceOutput
} from '@/ai/flows/ai-coach-personalized-advice';
import { 
  generateDailyPlan as generateDailyPlanFlow,
  type GenerateDailyPlanInput
} from '@/ai/flows/generate-daily-plan';
import { 
  improveHabitMethods as improveHabitMethodsFlow,
  type ImproveHabitMethodsInput
} from '@/ai/flows/improve-habit-methods';

export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  try {
    const result = await getPersonalizedAdviceFlow(input);
    return result;
  } catch (error) {
    console.error("Error in getPersonalizedAdvice:", error);
    return { response: { message: { content: "I'm sorry, but I encountered an error while generating advice. Please try again later." } } };
  }
}

export async function generateDailyPlan(input: GenerateDailyPlanInput): Promise<string> {
    try {
        const result = await generateDailyPlanFlow(input);
        return result;
    } catch (error) {
        console.error("Error in generateDailyPlan:", error);
        return "I'm sorry, but I couldn't generate a daily plan at this moment. Please check your goals and try again.";
    }
}

export async function improveHabitMethods(input: ImproveHabitMethodsInput): Promise<string> {
    try {
        const result = await improveHabitMethodsFlow(input);
        return result;
    } catch (error) {
        console.error("Error in improveHabitMethods:", error);
        return "I'm having trouble coming up with suggestions right now. Please tell me more about your habit and I'll try again.";
    }
}
