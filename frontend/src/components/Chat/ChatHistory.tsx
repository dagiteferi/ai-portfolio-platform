
import React from 'react';
import { History, MessageSquare, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Message } from '../../services/api';

interface ChatHistoryProps {
  isHistoryOpen: boolean;
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ isHistoryOpen, messages }) => {

  return (
    <div
      className={`bg-card shadow-lg transition-all duration-300 ease-in-out ${
        isHistoryOpen ? 'w-64 p-4' : 'w-0 p-0'
      } overflow-hidden`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground">History</h2>
        <Button variant="ghost" size="icon">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <div className="space-y-2">
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
