import React, { useEffect, useRef } from "react";
import MessageContent from "./MessageContent";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  results?: any[];
}

interface ChatWindowProps {
  title: string;
  messages: Message[];
  isLoading: boolean;
  onDocumentClick: (fileUrl: string) => void;
}

const PRIMARY_COLOR = '#EFF6FF';

export default function ChatWindow({ title, messages, isLoading, onDocumentClick }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added, but only if user is near the bottom
  useEffect(() => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
      
      // For new conversations or when user is at bottom, auto-scroll
      if (messages.length <= 2 || isNearBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Window Title */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      </div>
      
      {/* Messages container with explicit height calculation */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ 
          minHeight: 0, // This is crucial for flex items with overflow
          height: 'calc(100% - 73px)' // Subtract header height (padding + text + border)
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-xl font-medium mb-2">Welcome to Document Search</div>
              <div className="text-base">Start a conversation by typing your question below</div>
            </div>
          </div>
        ) : (
          <div className="max-w-full mx-auto px-4 py-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="group">
                  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${message.sender === 'user' ? 'max-w-[70%]' : 'max-w-[85%]'}`}>
                      <div 
                        className={`p-4 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-gray-100 text-black ml-auto'
                            : 'bg-gray-100 text-black'
                        }`}
                        style={message.sender === 'user' ? { backgroundColor: PRIMARY_COLOR } : {}}
                      >
                        {message.sender === 'user' ? (
                          <p className="text-base text-[#3C74ED] leading-relaxed whitespace-pre-line">
                            {message.text}
                          </p>
                        ) : (
                          <MessageContent message={message} onDocumentClick={onDocumentClick} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%]">
                    <div className="p-4 rounded-lg bg-gray-100 text-gray-800">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <p className="text-base">Searching documents...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
