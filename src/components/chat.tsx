'use client'

import React from 'react';
interface ChatProps {
  // Define your component props here
}

const messages = [
  {
    id: 1,
    content: 'Hello',
    role: 'user',
  },
  {
    id: 2,
    content: 'Hi',
    role: 'assistant',
  },
  {
    id: 3,
    content: 'How are you',
    role: 'user',
  },
]
const Chat: React.FC<ChatProps> = () => {
  return (
    <div className="bg-black p-4">
      {/* messages */}
      <div className="mb-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <p className={`text-${message.role === 'user' ? 'blue' : 'green'}-500`}>
              {message.role}: {message.content}
            </p>
          </div>
        ))}
      </div>
      {/* input */}
      <div className="flex">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-grow border border-gray-300 rounded-l p-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r">Send</button>
      </div>
    </div>
  );
};

export default Chat;
