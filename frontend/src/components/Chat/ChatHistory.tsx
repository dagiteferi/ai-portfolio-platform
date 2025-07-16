
import React, { useEffect, useRef } from 'react';
import { History, MessageSquare, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Message } from '../../services/api';

interface ChatHistoryProps {
  isHistoryOpen: boolean;
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ isHistoryOpen, messages }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={`bg-card shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
        isHistoryOpen ? 'w-64 p-4' : 'w-0 p-0'
      } overflow-hidden`}
    >
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-foreground">History</h2>
        <Button variant="ghost" size="icon">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <div ref={scrollContainerRef} className="space-y-2 overflow-y-auto flex-grow">
        {messages.map((message, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors duration-200"
          >
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground truncate">{message.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
