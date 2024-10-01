'use client'

import React, { useState, KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, isUser: true }]);
      setInputValue("");
      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:4000/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputValue }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMessages(prev => [...prev, { text: data.response, isUser: false }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { text: "Sorry, there was an error processing your request.", isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="p-4 bg-gray-900">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">AI Chat</h1>
          <Button variant="ghost" size="sm" onClick={clearMessages}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            Clear Chat
          </Button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        <div className="max-w-md mx-auto">
          {messages.map((message, index) => (
            <div key={index} className={`rounded-lg p-4 mb-4 ${message.isUser ? 'bg-blue-600 ml-auto' : 'bg-gray-800'}`}>
              <p className="text-white">{message.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-black p-4">
        <div className="max-w-md mx-auto flex">
          <Input 
            className="flex-grow mr-2 bg-gray-800 text-white"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button variant="default" size="default" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}
