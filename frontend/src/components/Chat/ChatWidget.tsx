import React from 'react';
import { useChat } from '../../contexts/ChatContext';

const ChatWidget: React.FC = () => {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = React.useState('');

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
      <h3>Chat Widget</h3>
      <div style={{ height: '100px', overflowY: 'scroll', border: '1px solid gray', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatWidget;
