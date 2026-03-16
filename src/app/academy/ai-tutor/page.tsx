'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, AlertTriangle, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AiTutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.content,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Er is een fout opgetreden. Probeer het opnieuw.',
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Kan geen verbinding maken met de AI Tutor service.',
          timestamp: new Date(),
        },
      ]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-accent-purple" />
            AI Tutor
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Stel vragen over het curriculum — Prompt, Context, Intent & Specification Engineering
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
          >
            <Trash2 className="w-4 h-4" />
            Nieuw gesprek
          </Button>
        )}
      </div>

      {/* AI Disclosure */}
      <Card className="mb-4 border-accent-purple/20 bg-accent-purple/5">
        <CardContent className="py-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-accent-purple mt-0.5 shrink-0" />
          <p className="text-xs text-gray-400">
            <strong className="text-gray-300">EU AI Act Disclosure:</strong> Dit is een AI-assistent
            aangedreven door Claude (Anthropic). De tutor is beperkt tot curriculum-onderwerpen en
            kan fouten maken. Gebruik je eigen oordeel en verifieer belangrijke informatie.{' '}
            <span className="text-gray-500">Je kunt de AI Tutor uitzetten in je instellingen.</span>
          </p>
        </CardContent>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-accent-purple/10 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-accent-purple" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Hoe kan ik je helpen?
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              Ik kan je helpen met vragen over prompt engineering, context engineering,
              intent engineering, specification engineering, en het RALF framework.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
              {[
                'Leg het Pentagon Model uit',
                'Hoe schrijf ik een L4 prompt?',
                'Wat is het verschil tussen context en intent?',
                'Help me met GIVEN/WHEN/THEN',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1.5 rounded-lg bg-navy-700 border border-white/5 text-sm text-gray-300 hover:text-white hover:border-accent-purple/30 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-accent-purple" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-accent-blue/20 text-white'
                  : 'bg-navy-800 border border-white/5'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-300 prose-code:text-accent-cyan prose-pre:bg-navy-900">
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    remarkPlugins={[remarkGfm]}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-white whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-accent-blue" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-accent-purple" />
            </div>
            <div className="bg-navy-800 border border-white/5 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Stel een vraag over het curriculum..."
          rows={1}
          className="flex-1 rounded-xl bg-navy-800 border border-white/10 px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent resize-none"
        />
        <Button type="submit" disabled={!input.trim() || loading} loading={loading}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
