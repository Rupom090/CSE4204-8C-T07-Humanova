import React, { useState } from 'react';
import { Bot, User } from 'lucide-react';
import { PromptInput } from '@/components/ai/PromptInput';
import { apiService } from '@/services/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your AI assistant. How can I help you today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (prompt: string) => {
    // Add user message
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setIsLoading(true);

    // Backend API call for the AI response
    try {
      const responseText = await apiService.chat(newMessages);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: responseText }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: "Sorry, I encountered an error communicating with the server." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-bg-secondary p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary flex items-center gap-2">
          <Bot className="w-8 h-8 text-accent-primary" />
          AI Chat Assistant
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Have a conversation with Humanova AI.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-bg-primary border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-surface border border-border-subtle' : 'bg-accent-primary text-bg-primary'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-text-secondary" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-surface border border-border-subtle text-text-primary rounded-tr-sm' 
                  : 'bg-accent-glow/5 border border-accent-primary/20 text-text-primary rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-primary text-bg-primary flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 bg-accent-glow/5 border border-accent-primary/20 text-text-primary flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border-subtle bg-bg-primary/50">
          <PromptInput onSubmit={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
