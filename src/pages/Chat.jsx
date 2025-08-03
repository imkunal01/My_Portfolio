import React from 'react';
import Chat from '../components/Chat';

const ChatPage = () => {
  return (
    <div className="chat-page">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Chat with AI</h1>
        <Chat />
      </div>
    </div>
  );
};

export default ChatPage;