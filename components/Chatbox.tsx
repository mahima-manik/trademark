import React, { useState, useRef, useEffect } from "react";
import { Collection } from "@/models/model";
import { FaPlus, FaCheck, FaExternalLinkAlt, FaArrowUp } from "react-icons/fa";

const PRIMARY_COLOR = '#EFF6FF';
const PRIMARY_COLOR_LIGHT = '#3C74ED';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  results?: any[];
}

export default function Chatbox({ collections }: { collections: Collection[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the API
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
        // Add bot response
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          results: data.results
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        // Handle error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Error: ${data.error || 'Something went wrong'}`,
          sender: 'bot'
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      // Handle network error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Error: Failed to connect to the server',
        sender: 'bot'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCollection = (collectionName: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionName)
        ? prev.filter(name => name !== collectionName)
        : [...prev, collectionName]
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCollections(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDocumentClick = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const renderMessageContent = (message: Message) => {
    // Show results in a structured format instead of the formatted text
    if (message.results && message.results.length > 0) {
      return (
        <div>
          <div className="text-base leading-relaxed mb-3">
            Found results for your query: "{message.text.match(/Found results for your query: "(.*?)"/)?.[1] || 'your search'}"
          </div>
          <div className="space-y-3">
            {message.results.map((collectionResult: any, idx: number) => (
              <div key={idx} className="border-l-2 border-gray-300 pl-3">
                <h4 className="font-medium text-gray-900 mb-2">{collectionResult.collection}:</h4>
                <div className="space-y-2">
                  {collectionResult.results.map((result: any, resultIdx: number) => (
                    <div key={resultIdx} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => handleDocumentClick(result.file_url)}
                          className="text-left w-full group"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-blue-600 hover:text-blue-800 group-hover:underline truncate">
                              {result.path}
                            </span>
                            <FaExternalLinkAlt className="w-3 h-3 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Score: {result.score.toFixed(2)}
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // For messages without results, show formatted text
    const formattedText = message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return (
      <div 
        className="text-base leading-relaxed whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-xl font-medium mb-2">Welcome to Document Search</div>
              <div className="text-base">Start a conversation by typing your question below</div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="group">
                  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${message.sender === 'user' ? 'max-w-[70%]' : 'max-w-[85%]'}`}>
                      <div className={`p-4 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-gray-100 text-black ml-auto'
                          : 'bg-gray-100 text-black'
                      }`}
                      style={message.sender === 'user' ? { backgroundColor: PRIMARY_COLOR } : {}}
                      >
                        {message.sender === 'user' ? (
                          <p className="text-base text-[#3C74ED] leading-relaxed whitespace-pre-line">{message.text}</p>
                        ) : (
                          renderMessageContent(message)
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
      
      {/* Input area - fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto p-4">
          <form className="flex gap-3" onSubmit={handleSubmit}>
            <div className="flex-1 relative">
              <div className="relative flex items-center bg-white border border-gray-300 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                {/* Plus icon inside input box */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCollections(!showCollections)}
                    className="flex items-center justify-center w-10 h-10 ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                    disabled={isLoading}
                    title="Select collections"
                  >
                    <FaPlus className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {showCollections && (
                    <div className="absolute bottom-16 left-0 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Select Collections</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {collections.length === 0 ? (
                            <p className="text-sm text-gray-500">No collections available</p>
                          ) : (
                            collections.map((collection) => (
                              <label
                                key={collection.name}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                              >
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={selectedCollections.includes(collection.name)}
                                    onChange={() => toggleCollection(collection.name)}
                                  />
                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    selectedCollections.includes(collection.name)
                                      ? 'border-[#3C74ED] bg-[#3C74ED]'
                                      : 'border-gray-300'
                                  }`}
                                  style={selectedCollections.includes(collection.name) ? { backgroundColor: PRIMARY_COLOR } : {}}
                                  >
                                    {selectedCollections.includes(collection.name) && (
                                      <FaCheck className="w-2 h-2 text-[#3C74ED]" />
                                    )}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-700">{collection.name}</span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input field */}
                <input
                  type="text"
                  className="flex-1 px-4 py-4 pr-16 focus:outline-none bg-transparent text-gray-900 placeholder-gray-500 text-base"
                  placeholder="Ask anything about your documents..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                />

                {/* Send button with up arrow icon */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                    inputValue.trim() && !isLoading
                      ? 'text-white hover:opacity-90'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  style={inputValue.trim() && !isLoading ? { backgroundColor: PRIMARY_COLOR_LIGHT } : {}}
                >
                  <FaArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Selected collections display */}
          {selectedCollections.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCollections.map((collectionName) => (
                <span
                  key={collectionName}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {collectionName}
                  <button
                    onClick={() => toggleCollection(collectionName)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
