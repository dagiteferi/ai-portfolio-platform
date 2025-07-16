import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { MessageCircle, X, Bot, PanelLeft, Maximize, Minimize } from 'lucide-react';
import ChatWidget from './ChatWidget';
import ChatHistory from './ChatHistory';
import { useChat } from '../../hooks/useChat';

export interface ChatbotHandle {
  openChat: (initialMode: 'small' | 'fullscreen') => void;
}

const Chatbot = forwardRef<ChatbotHandle>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const { messages, isLoading, error, sendMessage } = useChat();

  useImperativeHandle(ref, () => ({
    openChat: (initialMode: 'small' | 'fullscreen') => {
      setIsOpen(true);
      setIsFullScreen(initialMode === 'fullscreen');
    },
  }));
  

  return (
      <>
        {/* Chat Toggle Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsFullScreen(false); // Default to small when toggling with icon
          }}
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${
            isOpen 
              ? 'bg-muted hover:bg-muted/80 border border-border' 
              : 'bg-gradient-to-r from-primary to-accent hover:shadow-glow'
          }`}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          title={isOpen ? 'Close chat' : 'Chat with Dagi'}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <MessageCircle className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div className={`fixed z-50 bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in flex ${isFullScreen ? 'inset-0 w-full h-full rounded-none' : 'bottom-24 right-6 w-[700px] h-[600px] max-w-[calc(100vw-3rem)]'}`}>
            <ChatHistory isHistoryOpen={isHistoryOpen} messages={messages} />
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
                    <p className="text-sm opacity-90">Ask  about me</p>
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
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Widget Content */}
              <div className="flex-grow">
                <ChatWidget isFullScreen={isFullScreen} messages={messages} isLoading={isLoading} error={error} sendMessage={sendMessage} />
              </div>
            </div>
          </div>
        )}
      </>
  );
});

export default Chatbot;