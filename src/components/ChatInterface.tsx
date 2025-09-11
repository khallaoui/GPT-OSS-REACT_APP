"use client";

import React, { useState, useRef, useEffect } from 'react';
import { getPersonalizedAdvice } from '@/app/actions';
import type { ChatMessage, Habit } from '@/lib/types';
import { chatExamples } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AppLogo } from '@/components/icons';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { habits: existingHabits, addHabit, addGoal } = useAppContext();
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = async (prompt?: string) => {
    const userMessageContent = prompt || input;
    if (!userMessageContent.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', content: userMessageContent };
    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      // The AI will now directly return the updated list of habits.
      const result = await getPersonalizedAdvice({
        userInput: userMessageContent,
        existingHabits: (existingHabits as any),
      });

      const { updatedHabits } = result;
      
      const newHabit = updatedHabits.find(h => !existingHabits.some(eh => eh.id === h.id));

      if (newHabit) {
        // Here we can call our context's addHabit, but since the AI is the source of truth,
        // it might be better to have a `setHabits` in the context. For now, we add the single new habit.
        addHabit(newHabit as any);
        toast({ title: "Habit Added!", description: `"${newHabit.title}" is now on your list.` });
         setMessages(prev => [...prev, {role: 'assistant', content: `I've added the new habit "${newHabit.title}" for you.`}]);
      } else {
        // If no new habit was detected, maybe the AI responded with text (though it shouldn't based on new rules)
        setMessages(prev => [...prev, {role: 'assistant', content: "I wasn't able to add a new habit from that. Please try rephrasing."}]);
      }


    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      const errorResponse: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto h-[70vh] flex flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center p-8 rounded-lg">
                <Sparkles className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-4 text-2xl font-bold font-headline">Your AI Personality Coach</h2>
                <p className="mt-2 text-muted-foreground">What would you like to work on today?</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                    <AvatarFallback><AppLogo className="w-5 h-5"/></AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-3 max-w-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                 <ReactMarkdown className="markdown-content" components={{ p: ({node, ...props}) => <p className="mb-0" {...props} /> }}>
                    {msg.content}
                 </ReactMarkdown>
              </div>
               {msg.role === 'user' && (
                <Avatar className="w-8 h-8">
                    <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                <AvatarFallback><AppLogo className="w-5 h-5"/></AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-card">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe a habit you want to start..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={() => handleSend()} disabled={isLoading} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {chatExamples.slice(0, 3).map((example, index) => (
            <Button
              key={index}
              onClick={() => handleSend(example)}
              variant="outline"
              size="sm"
              className="text-xs"
              disabled={isLoading}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
