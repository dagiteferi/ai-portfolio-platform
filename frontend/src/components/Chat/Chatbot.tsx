import React, { useState } from 'react';
import { MessageCircle, X, Bot, PanelLeft, Maximize, Minimize } from 'lucide-react';
import ChatWidget from './ChatWidget';
import ChatHistory from './ChatHistory';
import { ChatProvider } from '../../contexts/ChatContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  return (
    <ChatProvider>
      {/* Chat Window */}
        <div className={`fixed z-50 bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in flex ${isFullScreen ? 'inset-0 w-full h-full rounded-none' : 'bottom-24 right-6 w-[700px] h-[600px] max-w-[calc(100vw-3rem)]'}`}>
          <ChatHistory isHistoryOpen={isHistoryOpen} />
          <div className="flex flex-col flex-grow">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-4 text-white flex justify-between items-center w-full rounded-t-xl">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                  aria-label={isHistoryOpen ? 'Close history' : 'Open history'}
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-sm opacity-90">Ask me about Dagmawi</p>
                </div>
              </div>
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                aria-label={isFullScreen ? 'Minimize chat' : 'Maximize chat'}
              >
                {isFullScreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Widget Content */}
            <div className="flex-grow">
              <ChatWidget isFullScreen={isFullScreen} />
            </div>
          </div>
        </div>
    </ChatProvider>
  );
};

export default Chatbot;