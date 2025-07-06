import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  results?: any[];
}

interface MessageContentProps {
  message: Message;
  onDocumentClick: (fileUrl: string) => void;
}

export default function MessageContent({ message, onDocumentClick }: MessageContentProps) {
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
                        onClick={() => onDocumentClick(result.file_url)}
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
}
