import type { Category } from '@/lib/types';
import { Sunrise, Sunset, Zap, HeartPulse, Users, BookOpen, Brain, DollarSign } from 'lucide-react';

export const habitCategories: Category[] = [
  { key: "morning", label: "Morning Routine", icon: Sunrise },
  { key: "evening", label: "Evening Routine", icon: Sunset },
  { key: "productivity", label: "Productivity", icon: Zap },
  { key: "health", label: "Health & Wellness", icon: HeartPulse },
  { key: "social", label: "Social Skills", icon: Users },
  { key: "learning", label: "Learning & Development", icon: BookOpen },
  { key: "mindfulness", label: "Mindfulness", icon: Brain },
  { key: "financial", label: "Financial Health", icon: DollarSign }
];

export const habitSuggestions: Record<string, string[]> = {
  "morning": [
    "Wake up at 6 AM consistently",
    "Drink a glass of water immediately after waking up",
    "15 minutes of meditation or mindfulness",
    "Morning exercise (yoga, jogging, stretching)",
    "Plan your day and set 3 main goals",
    "Read 10 pages of a book",
    "Healthy breakfast with protein"
  ],
  "evening": [
    "Digital detox 1 hour before bed",
    "Gratitude journaling",
    "Prepare for next day (clothes, meals)",
    "Review daily accomplishments",
    "Reading before bed (no screens)",
    "Evening reflection and planning",
    "Relaxation techniques (deep breathing)"
  ],
  "productivity": [
    "Pomodoro technique (25min work, 5min break)",
    "Time blocking for important tasks",
    "Weekly review and planning session",
    "Single-tasking instead of multitasking",
    "Declutter workspace daily",
    "Set clear daily priorities",
    "Use a task management system"
  ],
  "health": [
    "30 minutes of daily exercise",
    "Drink 8 glasses of water",
    "Healthy meal preparation",
    "Regular sleep schedule",
    "Daily stretching routine"
  ],
  "learning": [
    "Read 20 pages daily",
    "Learn a new skill for 30 minutes",
    "Practice a language daily",
    "Watch educational content",
    "Take online courses regularly"
  ],
  "social": [
    "Practice active listening in conversations",
    "Start one small conversation with a stranger",
    "Give a genuine compliment to someone",
    "Join a new social group or club",
    "Call a friend or family member"
  ],
  "mindfulness": [
    "Practice 10 minutes of focused breathing",
    "Mindful eating for one meal",
    "Go for a walk without any devices",
    "Write down three things you're grateful for",
    "Do a 5-minute body scan meditation"
  ],
  "financial": [
    "Track your daily expenses",
    "Read one article about personal finance",
    "Set aside a small amount for savings",
    "Review your monthly budget",
    "Plan meals to reduce food spending"
  ]
};

export const chatExamples: string[] = [
  "Add a new habit to read 10 pages a day",
  "Set a goal to learn Next.js in 1 month",
  "Help me build better social skills",
  "I need help with time management",
  "How to develop a consistent exercise habit?",
  "Suggest ways to improve my current sleep routine"
];
