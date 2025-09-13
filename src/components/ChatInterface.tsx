"use client";

import React, { useState, useRef, useEffect } from 'react';
import { getAICoachResponse } from '@/app/actions';
import { useAppContext } from '@/context/AppContext';
import type { ChatMessage, Habit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AppLogo } from '@/components/icons';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';

export function ChatInterface() {
  const { habits, setHabits, addHabit } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Automatically display a welcome message with an example.
    if (messages.length === 0 && !isLoading) {
      setMessages([
        { role: 'assistant', content: "Welcome to your AI Coach! Ask me for advice, or tell me to 'add a habit to meditate daily'." }
      ]);
    }
  }, []); // Runs only once on component mount

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
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await getAICoachResponse({
        userInput: userMessageContent,
        habits: habits,
      });

      const assistantMessage: ChatMessage = {role: 'assistant', content: result.response};
      setMessages(prev => [...prev, assistantMessage]);

      if (result.updatedHabits && result.updatedHabits.length > 0) {
        // Use the existing context function to add habits
        result.updatedHabits.forEach(newHabit => {
            addHabit(newHabit);
            toast({
              title: "Habit Added!",
              description: `The AI has added "${newHabit.title}" to your list.`,
            });
        });
      }

    } catch (error) {
      console.error('Error getting response:', error);
      const errorResponse: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, but I couldn't get a response. Please try again."
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
          {messages.length === 0 && !isLoading && (
            <div className="text-center p-8 rounded-lg">
                <Sparkles className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-4 text-2xl font-bold font-headline">Your AI Assistant</h2>
                <p className="mt-2 text-muted-foreground">Ask me anything, including to add new habits!</p>
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
            placeholder="Ask anything, or 'add a habit to meditate daily'"
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={() => handleSend()} disabled={isLoading} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
