import React, { useState, useRef, useEffect } from "react";
import { Collection } from "@/models/model";
import { FaPlus, FaCheck } from "react-icons/fa";

const PRIMARY_COLOR = '#4693FF';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbox({ collections }: { collections: Collection[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user'
    };

    // Create bot response with selected collections info
    let botResponseText = 'Hi';
    
    if (selectedCollections.length > 0) {
      botResponseText += `\n\nSelected collections: ${selectedCollections.join(', ')}`;
    } else {
      botResponseText += '\n\nNo collections selected.';
    }

    // Add bot response
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: 'bot'
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputValue('');
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

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-white">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Start a conversation...
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[70%]">
                    <div className={`p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'text-white ml-auto'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    style={message.sender === 'user' ? { backgroundColor: PRIMARY_COLOR } : {}}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <div className="relative flex items-center" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowCollections(!showCollections)}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <FaPlus className="w-4 h-4 text-gray-500" />
              </button>
              
              {showCollections && (
                <div className="absolute bottom-12 left-0 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
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
                                  ? 'border-blue-500'
                                  : 'border-gray-300'
                              }`}
                              style={selectedCollections.includes(collection.name) ? { backgroundColor: PRIMARY_COLOR } : {}}
                              >
                                {selectedCollections.includes(collection.name) && (
                                  <FaCheck className="w-2 h-2 text-white" />
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
            
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ask anything"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                inputValue.trim()
                  ? 'text-white hover:opacity-90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={inputValue.trim() ? { backgroundColor: PRIMARY_COLOR } : {}}
            >
              Send
            </button>
          </form>

          {/* Selected collections display - moved below the form */}
          {selectedCollections.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCollections.map((collectionName) => (
                <span
                  key={collectionName}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {collectionName}
                  <button
                    onClick={() => toggleCollection(collectionName)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
