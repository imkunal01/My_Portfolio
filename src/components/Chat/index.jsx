import React from 'react';
import AiInput from '@/components/ui/ai-input';

const Chat = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Chat with AI</h2>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            {/* Chat messages would go here */}
            <div className="flex flex-col space-y-2">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg self-start max-w-[80%]">
                <p className="text-gray-800 dark:text-gray-200">Hello! How can I help you today?</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Input Component */}
        <AiInput />
      </div>
    </div>
  );
};

export default Chat;