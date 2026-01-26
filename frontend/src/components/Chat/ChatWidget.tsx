
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import MessageBubble from './MessageBubble';
import { Message } from '../../services/api';

interface ChatWidgetProps {
  isFullScreen: boolean;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string, userName?: string) => Promise<void>;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isFullScreen, messages, isLoading, error, sendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "Tell me about your professional background.",
    "What are your core technical skills?",
    "Show me some of your featured projects.",
    "How can I contact Dagmawi?"
  ];

  useEffect(() => {
    // Use a timeout to ensure the scroll happens after the DOM update.
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageToSend = text || inputValue;
    if (!messageToSend.trim()) return;
    await sendMessage(messageToSend);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const TypingIndicator = () => (
    <div className="chat-bubble chat-bubble-bot">
      <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Message List: This will grow and scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Hello! I'm Dagi's AI Assistant
            </h2>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              I'm here to help you explore Dagmawi's portfolio, skills, and experience.
              Feel free to ask me anything or try one of the suggestions below!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="flex items-center p-3 text-sm text-left bg-muted/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 rounded-xl transition-all duration-300 group"
                >
                  <Sparkles className="w-4 h-4 mr-3 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span>{question}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <img src="/assets/profile-photo.png" alt="Bot" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <TypingIndicator />
                </div>
              </div>
            )}
          </>
        )}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {/* This empty div is the target for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area: This will not grow */}
      <div className="flex-shrink-0 border-t border-border p-4">
        <div className="relative flex items-center">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="w-full px-4 pr-16 py-4 rounded-xl text-base bg-primary/5 border-2 border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/30 transition-all duration-300 resize-none shadow-md placeholder:text-muted-foreground/70 font-medium"
            disabled={isLoading}
            rows={1}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            size="sm"
            className="absolute right-2 btn-gradient px-3 h-9 rounded-lg"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {messages.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 justify-center">
            {['Experience', 'Skills', 'Projects', 'Contact'].map((topic) => (
              <button
                key={topic}
                onClick={() => handleSendMessage(`Tell me about your ${topic}.`)}
                className="text-xs px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary border border-border/50 rounded-full transition-all duration-300"
              >
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
