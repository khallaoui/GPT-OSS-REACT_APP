"use client";

import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { Flame, Trophy } from "lucide-react";

const chartConfig: ChartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--muted))",
  },
};

export function Dashboard() {
  const { goals, getCompletionRate, getLongestStreak, habits } = useAppContext();
  const completionRate = getCompletionRate();
  const longestStreak = getLongestStreak();

  const chartData = [
    { name: 'Completed', value: completionRate, fill: 'hsl(var(--chart-1))' },
    { name: 'Pending', value: 100 - completionRate, fill: 'hsl(var(--muted))' },
  ];

  const habitProgressData = habits.map(habit => ({
    name: habit.name.substring(0, 3) + '..',
    streak: habit.streak,
  }));


  return (
    <div className="flex flex-col h-full p-4 space-y-6 bg-card/50">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="User Avatar" data-ai-hint="avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-bold font-headline">Welcome Back!</h2>
          <p className="text-sm text-muted-foreground">Let's make today count.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
            <CardHeader className="p-4">
                <CardTitle className="text-3xl font-bold">{completionRate}%</CardTitle>
                <CardDescription>Habits Done</CardDescription>
            </CardHeader>
        </Card>
        <Card className="text-center">
            <CardHeader className="p-4">
                <CardTitle className="flex items-center justify-center text-3xl font-bold">
                    {longestStreak} <Flame className="w-6 h-6 ml-1 text-amber-500"/>
                </CardTitle>
                <CardDescription>Top Streak</CardDescription>
            </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Daily Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full h-24">
            <PieChart accessibilityLayer>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={25} outerRadius={35} cornerRadius={5}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Trophy className="w-5 h-5"/> Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.length > 0 ? goals.map((goal) => (
            <div key={goal.id}>
              <div className="flex justify-between mb-1">
                <p className="text-sm font-medium truncate">{goal.title}</p>
                <p className="text-sm text-muted-foreground">{goal.progress}%</p>
              </div>
              <Progress value={goal.progress} aria-label={`${goal.title} progress`} />
            </div>
          )) : (
            <p className="text-sm text-muted-foreground text-center py-4">No goals set yet. Go to the 'Goal Manager' tab to add one!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
