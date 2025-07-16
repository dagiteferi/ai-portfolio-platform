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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    console.log('handleSendMessage triggered');
    console.log('Input value:', inputValue);
    if (!inputValue.trim()) {
      console.log('Input value is empty, not sending message.');
      return;
    }
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
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto bg-muted/20 py-10">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={`bg-background shadow-lg ${isFullScreen ? 'absolute bottom-40 left-0 right-0 border-t-0' : 'border-t border-border'}`}>
        <div className={`mx-auto px-4 ${isFullScreen ? 'max-w-5xl' : 'max-w-3xl'}`}>
          <div className="relative flex items-center">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Chat with me .."
              className={`w-full px-4 pr-16 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none overflow-hidden ${isFullScreen ? 'py-6 text-lg bg-muted/20 border-2 border-border/20 shadow-sm' : 'py-3 bg-muted/10 border border-border/30'}`}
              disabled={isLoading}
              rows={1}
            ></textarea>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
              className="absolute right-2 btn-gradient px-3 h-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className={`mx-auto flex flex-wrap gap-1 pt-2 justify-center px-4 pb-2 ${isFullScreen ? 'max-w-5xl' : 'max-w-3xl'}`}>
          {['Experience', 'Skills', 'Projects', 'Contact'].map((topic) => (
            <button
              key={topic}
              onClick={() => setInputValue(topic.toLowerCase())}
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