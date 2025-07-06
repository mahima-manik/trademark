import React, { useState } from "react";
import { Collection } from "@/models/model";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  results?: any[];
}

export default function Chatbox({ collections }: { collections: Collection[] }) {
  const [leftMessages, setLeftMessages] = useState<Message[]>([]);
  const [rightMessages, setRightMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    // Add user message to both windows
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user'
    };

    setLeftMessages(prev => [...prev, userMessage]);
    setRightMessages(prev => [...prev, userMessage]);
    
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the API for left window
      const response = await fetch('/api/rank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          selectedCollections: selectedCollections,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const leftBotMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          results: data.results
        };
        setLeftMessages(prev => [...prev, leftBotMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Error: ${data.error || 'Something went wrong'}`,
          sender: 'bot'
        };
        setLeftMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Error: Failed to connect to the server',
        sender: 'bot'
      };
      setLeftMessages(prev => [...prev, errorMessage]);
    }

    // Always add the same response to right window
    const rightBotMessage: Message = {
      id: (Date.now() + 2).toString(),
      text: 'Hey, we are implementing the functionality',
      sender: 'bot'
    };
    setRightMessages(prev => [...prev, rightBotMessage]);
    
    setIsLoading(false);
  };

  const toggleCollection = (collectionName: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionName)
        ? prev.filter(name => name !== collectionName)
        : [...prev, collectionName]
    );
  };

  const handleDocumentClick = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Dual chat windows */}
      <div className="flex-1 flex min-h-0">
        <div className="w-1/2 border-r border-gray-200 h-full">
          <ChatWindow
            title="Document Search"
            messages={leftMessages}
            isLoading={isLoading}
            onDocumentClick={handleDocumentClick}
          />
        </div>
        
        <div className="w-1/2 h-full">
          <ChatWindow
            title="Feature Preview"
            messages={rightMessages}
            isLoading={isLoading}
            onDocumentClick={handleDocumentClick}
          />
        </div>
      </div>
      
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        collections={collections}
        selectedCollections={selectedCollections}
        onToggleCollection={toggleCollection}
        showCollections={showCollections}
        setShowCollections={setShowCollections}
      />
    </div>
  );
}
