"use client";

import { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import { AppLogo } from '@/components/icons';

import { Dashboard } from '@/components/Dashboard';
import { ChatInterface } from '@/components/ChatInterface';
import { HabitTracker } from '@/components/HabitTracker';
import { GoalManager } from '@/components/GoalManager';

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <AppProvider>
      <SidebarProvider>
        <Sidebar>
          <Dashboard />
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col h-screen">
            <header className="flex items-center justify-between p-4 border-b bg-card/80 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <AppLogo className="h-8 w-8 text-primary" />
                  <h1 className="text-xl font-bold font-headline">GPT-Life AI Coach</h1>
                </div>
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <PanelLeft />
                  </Button>
                </SidebarTrigger>
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                  <TabsTrigger value="chat">💬 AI Coach</TabsTrigger>
                  <TabsTrigger value="habits">📅 Habit Tracker</TabsTrigger>
                  <TabsTrigger value="goals">🎯 Goal Manager</TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="mt-6">
                  <ChatInterface />
                </TabsContent>
                <TabsContent value="habits" className="mt-6">
                  <HabitTracker />
                </TabsContent>
                <TabsContent value="goals" className="mt-6">
                  <GoalManager />
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  );
}
