"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Target, Trophy, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAICoachResponse } from '@/app/actions';

export function GoalManager() {
  const { goals, addGoal, updateGoalProgress, habits } = useAppContext();
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    if (goals.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Goals Found',
        description: 'Add some goals before generating a plan.',
      });
      return;
    }
    toast({ title: '🤖 AI is crafting your plan...', description: 'This might take a moment.' });
    
    const goalTitles = goals.map(g => g.title).join(', ');
    const prompt = `Based on my goals (${goalTitles}), generate a simple daily action plan for me.`;

    const result = await getAICoachResponse({ userInput: prompt, habits: habits });
    
    toast({
      title: '📅 Your AI-Generated Daily Plan',
      description: <pre className="mt-2 w-full rounded-md bg-slate-950 p-4"><code className="text-white whitespace-pre-wrap">{result.response}</code></pre>,
      duration: 20000,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold font-headline">Your Goals</h2>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleGeneratePlan}>
            <Bot className="mr-2 h-4 w-4" /> Generate Daily Plan
          </Button>
          <AddGoalDialog addGoal={addGoal} />
        </div>
      </div>

      {goals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map(goal => (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="flex items-start gap-3">
                  <Trophy className="w-6 h-6 text-primary mt-1" />
                  <span className="flex-1">{goal.title}</span>
                </CardTitle>
                <CardDescription>Timeline: {goal.timeline}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-2">{goal.progress}% complete</div>
                <Progress value={goal.progress} aria-label={`${goal.title} progress`} />
              </CardContent>
              <CardFooter className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => updateGoalProgress(goal.id, goal.progress + 10)}>+10%</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
            <CardContent>
                <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold font-headline">No goals defined</h3>
                <p className="mt-2 text-muted-foreground">Set a new goal to start tracking your achievements.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

function AddGoalDialog({ addGoal }: { addGoal: (goal: any) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [timeline, setTimeline] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !timeline) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please provide a title and timeline." });
      return;
    }
    addGoal({ title, timeline });
    toast({ title: "Goal Set!", description: `You're on your way to achieving "${title}".` });
    setTitle('');
    setTimeline('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Set a New Goal</DialogTitle>
          <DialogDescription>Define your next big achievement. Make it specific and measurable.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Run a 5k marathon" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Input id="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g., 3 months" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Set Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
