import React, { useState } from 'react';
import { MessageCircle, X, Bot } from 'lucide-react';
import ChatWidget from './ChatWidget';
import { ChatProvider } from '../../contexts/ChatContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ChatProvider>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${
          isOpen 
            ? 'bg-muted hover:bg-muted/80 border border-border' 
            : 'bg-gradient-to-r from-primary to-accent hover:shadow-glow'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-foreground" />
        ) : (
          <MessageCircle className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50 bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm opacity-90">Ask me about Dagmawi</p>
              </div>
            </div>
          </div>

          {/* Chat Widget Content */}
          <ChatWidget />
        </div>
      )}
    </ChatProvider>
  );
};

export default Chatbot;
