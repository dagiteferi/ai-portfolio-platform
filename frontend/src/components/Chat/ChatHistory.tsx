
import React from 'react';
import { History, MessageSquare, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface ChatHistoryProps {
  isHistoryOpen: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ isHistoryOpen }) => {
  const chatSessions = [
    { id: 1, title: 'AI/ML Consulting Opportunities' },
    { id: 2, title: 'Full-stack Development Projects' },
    { id: 3, title: 'Technical Mentoring Discussion' },
    { id: 4, title: 'Collaboration on Research' },
  ];

  return (
    <div
      className={`bg-muted/50 border-r border-border/20 transition-all duration-300 ease-in-out ${
        isHistoryOpen ? 'w-64 p-4' : 'w-0 p-0'
      } overflow-hidden`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">History</h2>
        <Button variant="ghost" size="icon">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <div className="space-y-2">
        {chatSessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors duration-200"
          >
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground truncate">{session.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
