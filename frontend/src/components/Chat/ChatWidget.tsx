
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
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

  useEffect(() => {
    // Use a timeout to ensure the scroll happens after the DOM update.
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    await sendMessage(inputValue);
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
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <img src="/assets/profile-photo.jpg" alt="Bot" className="w-4 h-4 rounded-full" />
              </div>
              <TypingIndicator />
            </div>
          </div>
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
            placeholder="Chat with me..."
            className="w-full px-4 pr-16 py-2 rounded-lg text-sm bg-muted/50 border border-border/30 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
            disabled={isLoading}
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="sm"
            className="absolute right-2 btn-gradient px-3 h-8"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1 pt-2 justify-center">
          {['Experience', 'Skills', 'Projects', 'Contact'].map((topic) => (
            <button
              key={topic}
              onClick={() => setInputValue(`Tell me about your ${topic}.`)}
              className="text-xs px-2 py-1 bg-muted hover:bg-primary hover:text-primary-foreground rounded transition-colors duration-300"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
