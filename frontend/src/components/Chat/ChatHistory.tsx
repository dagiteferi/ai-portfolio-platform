import React from 'react';
import { History, MessageSquare, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Conversation } from '../../hooks/useChat'; // Import the Conversation type

interface ChatHistoryProps {
  isHistoryOpen: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  startNewConversation: () => void;
  onClose: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  isHistoryOpen,
  conversations,
  activeConversationId,
  setActiveConversation,
  startNewConversation,
  onClose
}) => {

  const handleConversationClick = (id: string) => {
    setActiveConversation(id);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div
      className={`bg-card shadow-lg transition-all duration-300 ease-in-out flex flex-col ${isHistoryOpen ? 'w-64 p-4' : 'w-0 p-0'
        } overflow-hidden absolute md:static z-20 h-full left-0 top-0`}
    >
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          History
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={startNewConversation} title="Start new chat">
            <Plus className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden" title="Close history">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="space-y-2 overflow-y-auto flex-grow">
        {conversations.map((convo) => (
          <div
            key={convo.id}
            onClick={() => handleConversationClick(convo.id)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${activeConversationId === convo.id ? 'bg-primary/20' : 'hover:bg-primary/10'
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