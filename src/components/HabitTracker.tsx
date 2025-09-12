"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { habitCategories, habitSuggestions } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Flame, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAICoachResponse } from '@/app/actions';
import type { Habit } from '@/lib/types';


export function HabitTracker() {
  const { habits, toggleHabit, addHabit } = useAppContext();
  const { toast } = useToast();

  const handleToggle = (id: string) => {
    toggleHabit(id);
    toast({
      title: "Habit updated!",
      description: "Keep up the great work on your habits.",
    });
  };

  const handleGetAISuggestions = async (habitName: string, currentMethod: string) => {
    toast({ title: '🤖 AI Thinking...', description: 'Generating suggestions to improve your habit.' });
    const prompt = `I have a habit "${habitName}" which I'm trying to follow by "${currentMethod}". Can you give me some actionable suggestions to improve my consistency?`;
    const result = await getAICoachResponse({ userInput: prompt, habits });
    toast({
      title: `✨ Suggestions for "${habitName}"`,
      description: <pre className="whitespace-pre-wrap font-sans">{result.response}</pre>,
      duration: 15000,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold font-headline">Your Habits</h2>
        <AddHabitDialog addHabit={addHabit} />
      </div>

      <Accordion type="multiple" defaultValue={habitCategories.map(c => c.key)} className="w-full">
        {habitCategories.map(category => {
          const categoryHabits = habits.filter(h => h.category === category.key);
          if (categoryHabits.length === 0) return null;
          
          return (
            <AccordionItem value={category.key} key={category.key}>
              <AccordionTrigger className="text-xl font-headline">
                <div className="flex items-center gap-3">
                  <category.icon className="w-6 h-6 text-primary" />
                  {category.label}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {categoryHabits.map(habit => (
                    <Card key={habit.id} className="flex flex-col">
                      <CardContent className="p-4 flex-1 flex flex-col justify-between">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            id={`habit-${habit.id}`}
                            checked={habit.completed}
                            onCheckedChange={() => handleToggle(habit.id)}
                            className="w-6 h-6 mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor={`habit-${habit.id}`} className="text-lg font-semibold leading-tight">{habit.title}</Label>
                            <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Flame className={`w-4 h-4 ${habit.streak > 0 ? 'text-amber-500' : ''}`} />
                                <span>{habit.streak} day streak</span>
                            </div>
                           <Button variant="ghost" size="sm" onClick={() => handleGetAISuggestions(habit.title, habit.description || '')}>
                                Improve with AI
                            </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      {habits.length === 0 && (
         <Card className="text-center py-12">
            <CardContent>
                <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold font-headline">No habits yet</h3>
                <p className="mt-2 text-muted-foreground">Click "Add New Habit" to start your journey.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

function AddHabitDialog({ addHabit }: { addHabit: (habit: any) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<Habit['frequency']>('daily');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please provide a title and category." });
      return;
    }
    addHabit({ title, category, description, frequency });
    toast({ title: "Habit Added!", description: `"${title}" is now on your list.` });
    setTitle('');
    setCategory('');
    setDescription('');
    setFrequency('daily');
    setOpen(false);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setTitle(suggestion);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Add a New Habit</DialogTitle>
          <DialogDescription>What new positive routine do you want to build?</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {habitCategories.map(cat => (
                    <SelectItem key={cat.key} value={cat.key}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             {category && (
              <div className="space-y-2">
                <Label>Suggestions</Label>
                 <div className="flex flex-wrap gap-2">
                    {(habitSuggestions[category] || []).slice(0, 4).map(suggestion => (
                      <Button key={suggestion} type="button" variant="outline" size="sm" onClick={() => handleSuggestionClick(suggestion)}>
                        {suggestion}
                      </Button>
                    ))}
                 </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Habit Title</Label>
              <Input id="name" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Meditate for 10 minutes" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Using the Calm app right after waking up." />
            </div>
             <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select onValueChange={(value) => setFrequency(value as Habit['frequency'])} value={frequency}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                   <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Habit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
