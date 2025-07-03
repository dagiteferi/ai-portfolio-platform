import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (message: string) => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Dagmawi's AI assistant. I can help answer questions about his experience, skills, and projects. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedResponses: { [key: string]: string } = {
    'experience': "Dagmawi has over 5 years of experience in AI/ML engineering, including roles at TechCorp AI, DataFlow Solutions, and internships at Stanford AI Lab and Google. He specializes in deep learning, NLP, and computer vision.",
    'skills': "His core skills include Python, TensorFlow, PyTorch, React, Machine Learning, Deep Learning, Data Science, and Cloud Computing. He's also experienced with MLOps and deploying AI models to production.",
    'education': "Dagmawi holds a Master's in Computer Science from Stanford University (2020-2022) with a focus on AI/ML, and a Bachelor's in Computer Engineering from UC Berkeley (2016-2020).",
    'projects': "Some notable projects include a Prompt Engineering Optimization framework, Neural Style Transfer app, Predictive Analytics Dashboard, and various web and mobile applications. Check out the Projects section for more details!",
    'contact': "You can reach Dagmawi at contact@dagmawiteferi.com or +1 (555) 123-4567. He's based in San Francisco, CA and available for consulting, development projects, and collaborations.",
    'services': "Dagmawi offers Machine Learning Consulting, Web Development, Data Analysis, AI Model Deployment, Business Intelligence, and AI Automation services.",
    'certifications': "He holds certifications from Google (Professional ML Engineer), AWS (ML Specialty), TensorFlow Developer Certificate, and Deep Learning Specialization from Coursera."
  };

  const getRandomDelay = () => Math.random() * 1000 + 500;

  const generateResponse = useCallback((userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help you learn more about Dagmawi Teferi. You can ask me about his experience, skills, education, projects, or how to contact him.";
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! Is there anything else you'd like to know about Dagmawi?";
    }

    return "I'd be happy to help! You can ask me about Dagmawi's experience, skills, education, projects, services, or contact information. What specific area interests you?";
  }, [predefinedResponses]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: generateResponse(text),
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  }, [generateResponse]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ChatContext.Provider value={{ messages, isTyping, sendMessage, messagesEndRef }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};