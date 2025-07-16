import { useState, useCallback } from 'react';
import { sendMessageToBackend, ChatRequestPayload, Message } from '../services/api';



// Define the return type of the hook for clear component contracts.
export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string, userName?: string) => Promise<void>;
}

/**
 * A custom hook to manage the state and logic of a chat session.
 * It handles message history, loading states, errors, and communication with the backend API.
 * @returns An object containing the chat state and a function to send messages.
 */
export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string, userName: string = 'User') => {
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
    setMessages((prevMessages: Message[]) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Prepare the history in the format the backend expects.
      const history = messages.map((msg: Message) => ({
        user: msg.sender === 'user' ? msg.text : '',
        assistant: msg.sender === 'bot' ? msg.text : '',
      }));

      const payload: ChatRequestPayload = {
        message: text,
        history,
        user_name: userName,
      };

      // Call the type-safe API service.
      const response = await sendMessageToBackend(payload);

      const botMessage: Message = { id: Date.now().toString() + '-bot', text: response.response, sender: 'bot', timestamp: new Date() };
      setMessages((prevMessages: Message[]) => [...prevMessages, botMessage]);

    } catch (err: any) {
      // The API service interceptor has already logged the detailed error.
      // We just need to set a user-friendly error message for the UI.
      setError(err.message || 'Sorry, an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [messages]); // Dependency on `messages` ensures history is always current.

  return { messages, isLoading, error, sendMessage };
};

