import { useState, useCallback, useMemo } from 'react';
import { sendMessageToBackend, ChatRequestPayload, Message } from '../services/api';

// Define the structure for a conversation
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

// Define the return type of the hook for clear component contracts.
export interface UseChatReturn {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[]; // Messages of the active conversation
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string, userName?: string) => Promise<void>;
  startNewConversation: () => void;
  setActiveConversation: (conversationId: string) => void;
}

/**
 * A custom hook to manage the state and logic of a chat session.
 * It handles multiple conversations, loading states, errors, and communication with the backend API.
 * @returns An object containing the chat state and functions to manage conversations.
 */
export const useChat = (): UseChatReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string, userName: string = 'User') => {
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
    setIsLoading(true);
    setError(null);

    let currentConversationId = activeConversationId;
    let conversationHistory: Message[] = [];

    // If there is no active conversation, create a new one.
    if (!currentConversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: text, // The first message becomes the title
        messages: [userMessage],
      };
      setConversations(prev => [...prev, newConversation]);
      setActiveConversationId(newConversation.id);
      currentConversationId = newConversation.id;
      conversationHistory = []; // No history for the first message of a new convo
    } else {
      // Add the message to the currently active conversation.
      const activeConvo = conversations.find(c => c.id === currentConversationId);
      conversationHistory = activeConvo?.messages || [];
      
      setConversations(prev =>
        prev.map(convo =>
          convo.id === currentConversationId
            ? { ...convo, messages: [...convo.messages, userMessage] }
            : convo
        )
      );
    }

    try {
      const history = conversationHistory.map((msg: Message) => ({
        user: msg.sender === 'user' ? msg.text : '',
        assistant: msg.sender === 'bot' ? msg.text : '',
      }));

      const payload: ChatRequestPayload = {
        message: text,
        history,
        user_name: userName,
      };

      const response = await sendMessageToBackend(payload);
      const botMessage: Message = { id: Date.now().toString() + '-bot', text: response.response, sender: 'bot', timestamp: new Date() };

      // Add the bot's response to the active conversation.
      setConversations(prev =>
        prev.map(convo =>
          convo.id === currentConversationId
            ? { ...convo, messages: [...convo.messages, botMessage] }
            : convo
        )
      );

    } catch (err: any) {
      setError(err.message || 'Sorry, an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, conversations]);

  const startNewConversation = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  const setActiveConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
  }, []);

  // Memoize the active conversation and its messages to prevent unnecessary re-renders.
  const activeConversation = useMemo(() => 
    conversations.find(c => c.id === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  const messages = useMemo(() => 
    activeConversation ? activeConversation.messages : [],
    [activeConversation]
  );

  return {
    conversations,
    activeConversation,
    messages,
    isLoading,
    error,
    sendMessage,
    startNewConversation,
    setActiveConversation,
  };
};