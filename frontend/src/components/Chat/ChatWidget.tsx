import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import MessageBubble from './MessageBubble';
import { useChat } from '../../contexts/ChatContext';

const ChatWidget: React.FC = () => {
  const { messages, sendMessage, isTyping, messagesEndRef } = useChat();
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
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
    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/20">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isTyping && (
        <div className="flex justify-start">
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <img src="/profile-photo.jpg" alt="Bot" className="w-4 h-4 rounded-full" />
            </div>
            <TypingIndicator />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />

      <div className="p-4 border-t border-border bg-background">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Dagmawi..."
            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isTyping || !inputValue.trim()}
            size="sm"
            className="btn-gradient px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
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