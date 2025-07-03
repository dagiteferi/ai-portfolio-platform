import React from 'react';

interface MessageBubbleProps {
  message: string;
  sender: 'user' | 'bot';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sender }) => {
  return (
    <div className={`message-bubble ${sender === 'user' ? 'user' : 'bot'}`}>
      {message}
    </div>
  );
};

export default MessageBubble;
export {};