import type { LucideIcon } from 'lucide-react';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  type: 'habit';
  frequency: 'daily' | 'weekly' | 'monthly' | 'one-time';
  progress: number;
  createdAt: string;
  // Kept for compatibility with existing components but can be phased out.
  category?: string;
  completed?: boolean;
  streak?: number;
}

export interface Goal {
  id: string;
  title: string;
  timeline: string;
  progress: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls?: any;
  tool_call_id?: string;
}

export interface Category {
  key: string;
  label: string;
  icon: LucideIcon;
}
