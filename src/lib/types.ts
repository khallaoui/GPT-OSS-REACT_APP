import type { LucideIcon } from 'lucide-react';

export interface Habit {
  id: string;
  name: string;
  category: string;
  description: string;
  created_date: string;
  completed: boolean;
  streak: number;
}

export interface Goal {
  id: string;
  title: string;
  timeline: string;
  progress: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Category {
  key: string;
  label: string;
  icon: LucideIcon;
}
