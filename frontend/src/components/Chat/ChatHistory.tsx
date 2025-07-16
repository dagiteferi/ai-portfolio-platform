import React from 'react';
import { History, MessageSquare, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Conversation } from '../../hooks/useChat'; // Import the Conversation type

interface ChatHistoryProps {
  isHistoryOpen: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  startNewConversation: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  isHistoryOpen, 
  conversations, 
  activeConversationId,
  setActiveConversation,
  startNewConversation 
}) => {

  return (
    <div
      className={`bg-card shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
        isHistoryOpen ? 'w-64 p-4' : 'w-0 p-0'
      } overflow-hidden`}
    >
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-foreground">History</h2>
        <Button variant="ghost" size="icon" onClick={startNewConversation} title="Start new chat">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <div className="space-y-2 overflow-y-auto flex-grow">
        {conversations.map((convo) => (
          <div
            key={convo.id}
            onClick={() => setActiveConversation(convo.id)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
              activeConversationId === convo.id ? 'bg-primary/20' : 'hover:bg-primary/10'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground truncate">{convo.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;