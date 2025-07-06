import React, { useRef, useEffect } from "react";
import { FaPlus, FaCheck, FaArrowUp } from "react-icons/fa";
import { Collection } from "@/models/model";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  collections: Collection[];
  selectedCollections: string[];
  onToggleCollection: (collectionName: string) => void;
  showCollections: boolean;
  setShowCollections: (show: boolean) => void;
}

const PRIMARY_COLOR = '#EFF6FF';
const PRIMARY_COLOR_LIGHT = '#3C74ED';

export default function ChatInput({
  inputValue,
  setInputValue,
  onSubmit,
  isLoading,
  collections,
  selectedCollections,
  onToggleCollection,
  showCollections,
  setShowCollections
}: ChatInputProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCollections(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowCollections]);

  return (
    <div className="flex-shrink-0 border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto p-4">
        <form className="flex gap-3" onSubmit={onSubmit}>
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
                                  onChange={() => onToggleCollection(collection.name)}
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
                  onClick={() => onToggleCollection(collectionName)}
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
  );
}
