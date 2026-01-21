import React, { useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import { useSimulatedStream } from '../../hooks/useSimulatedStream';
import ReactMarkdown from 'react-markdown';
import { Message } from '../../services/api';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { displayedText, start } = useSimulatedStream(message.text, 50);

  useEffect(() => {
    if (message.sender === 'bot') {
      start();
    }
  }, [message.text, message.sender, start]);

  const textToShow = message.sender === 'user' ? message.text : displayedText;

  return (
    <div
      key={message.id}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'}`}>
          {message.sender === 'user' ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className={`chat-bubble ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
          <ReactMarkdown className="text-sm">{textToShow}</ReactMarkdown>
          {message.file_url && message.sender === 'bot' && (
            <div className="mt-2">
              <iframe
                src={message.file_url}
                title="CV"
                className="w-full h-64 rounded-lg border"
              ></iframe>
              <a href={message.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                Open CV in new tab
              </a>
            </div>
          )}
          <span className="text-xs opacity-70 mt-1 block">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;