"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Habit, Goal } from '@/lib/types';

interface AppContextType {
  habits: Habit[];
  goals: Goal[];
  addHabit: (habit: Omit<Habit, 'id' | 'created_date' | 'completed' | 'streak'>) => void;
  toggleHabit: (habitId: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;
  getHabitsByCategory: (category: string) => Habit[];
  getCompletionRate: () => number;
  getLongestStreak: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial dummy data
const initialHabits: Habit[] = [
  { id: '1', name: '15 minutes of meditation', category: 'morning', description: 'Using a guided meditation app.', created_date: new Date().toISOString(), completed: true, streak: 5 },
  { id: '2', name: '30 minutes of daily exercise', category: 'health', description: 'A mix of cardio and strength training.', created_date: new Date().toISOString(), completed: false, streak: 2 },
  { id: '3', name: 'Read 20 pages daily', category: 'learning', description: 'Reading a non-fiction book.', created_date: new Date().toISOString(), completed: true, streak: 12 },
  { id: '4', name: 'Digital detox 1 hour before bed', category: 'evening', description: 'No screens before sleeping.', created_date: new Date().toISOString(), completed: false, streak: 0 },
];

const initialGoals: Goal[] = [
    { id: 'g1', title: 'Run a 5k marathon', timeline: '3 months', progress: 40 },
    { id: 'g2', title: 'Finish online course on React', timeline: '1 month', progress: 75 },
    { id: 'g3', title: 'Save $1000 for vacation', timeline: '6 months', progress: 20 },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const addHabit = (habitData: Omit<Habit, 'id' | 'created_date' | 'completed' | 'streak'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      created_date: new Date().toISOString(),
      completed: false,
      streak: 0,
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const wasCompleted = h.completed;
        const newCompleted = !wasCompleted;
        let newStreak = h.streak;
        
        if (newCompleted) {
          newStreak += 1;
        } else if (newStreak > 0) {
          newStreak -=1;
        }

        return { ...h, completed: newCompleted, streak: newStreak };
      }
      return h;
    }));
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'progress'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: crypto.randomUUID(),
      progress: 0,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(prev => prev.map(g =>
      g.id === goalId ? { ...g, progress: Math.max(0, Math.min(100, progress)) } : g
    ));
  };

  const getHabitsByCategory = (category: string) => {
    return habits.filter(h => h.category === category);
  };
  
  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    const completedCount = habits.filter(h => h.completed).length;
    return Math.round((completedCount / habits.length) * 100);
  };

  const getLongestStreak = () => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map(h => h.streak), 0);
  };


  const value = {
    habits,
    goals,
    addHabit,
    toggleHabit,
    addGoal,
    updateGoalProgress,
    getHabitsByCategory,
    getCompletionRate,
    getLongestStreak,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
