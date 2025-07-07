
import { Message } from '../contexts/ChatContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const sendMessageToBackend = async (message: string, userName: string, history: ChatMessage[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        user_name: userName,
        history: history.map(msg => ({ user: msg.sender === 'user' ? msg.text : '', assistant: msg.sender === 'bot' ? msg.text : '' })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get response from backend');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending message to backend:', error);
    throw error;
  }
};
