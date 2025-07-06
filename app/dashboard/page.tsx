"use client";

import React, { useEffect, useState } from "react";
import Collections from "@/components/Collections";
import { Collection } from "@/models/model";
import { FaBars, FaHistory, FaTimes } from "react-icons/fa";

function ChatArea() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-w-0">
      <div className="w-full max-w-4xl rounded-lg p-4 md:p-6 flex flex-col h-[70vh] md:h-[75vh]">
        <div className="flex-1 overflow-y-auto">
          {/* Chat messages placeholder */}
          <div className="text-gray-400 text-center mt-20">Chat interface placeholder</div>
        </div>
        <form className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring text-sm md:text-base"
            placeholder="Type your message..."
            disabled
          />
          <button
            type="submit"
            className="bg-gray-300 text-gray-600 px-3 md:px-4 py-2 rounded cursor-not-allowed text-sm md:text-base"
            disabled
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}

function ChatHistory({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Chat History Sidebar */}
      <aside className={`
        fixed lg:relative top-0 right-0 h-full lg:h-auto
        w-72 bg-white border-l border-gray-200 p-6 flex flex-col
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        ${isOpen ? 'flex' : 'hidden lg:flex'}
      `}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto text-gray-400 text-center mt-20">
          Chat history placeholder
        </div>
      </aside>
    </>
  );
}

function CollectionsSidebar({ collections, isOpen, onClose }: { 
  collections: Collection[], 
  isOpen: boolean, 
  onClose: () => void 
}) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Collections Sidebar */}
      <aside className={`
        fixed md:relative top-0 left-0 h-full md:h-auto
        w-64 bg-white border-r border-gray-200 p-4 md:p-6 flex flex-col
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isOpen ? 'flex' : 'hidden md:flex'}
      `}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-semibold">Collections</h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-gray-100 rounded"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 space-y-4 md:space-y-6 overflow-y-auto">
          <Collections collections={collections} />
        </div>
      </aside>
    </>
  );
}

export default function Dashboard() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCollections, setShowCollections] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetch('/api/collections', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.collections) {
          setCollections(data.collections);
          setError(null);
        } else if (data.error) {
          setError(data.error);
          setCollections([]);
        }
      })
      .catch(err => {
        setError('Network error: ' + err.message);
        setCollections([]);
      });
  }, []);

  // Close sidebars when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setShowCollections(false);
      }
      if (window.innerWidth >= 1024) { // lg breakpoint
        setShowHistory(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      <div className="flex flex-col flex-1">
        {error && (
          <div className="bg-red-100 text-red-700 p-2 text-center text-sm">{error}</div>
        )}
        
        {/* Header with toggle buttons */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between md:justify-end">
          <button
            onClick={() => setShowCollections(true)}
            className="md:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
          >
            <FaBars className="w-4 h-4" />
            Collections
          </button>
          
          <button
            onClick={() => setShowHistory(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
          >
            <FaHistory className="w-4 h-4" />
            History
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Collections sidebar */}
          <CollectionsSidebar 
            collections={collections}
            isOpen={showCollections}
            onClose={() => setShowCollections(false)}
          />
          
          {/* Chat area - takes up all remaining space */}
          <ChatArea />
          
          {/* Chat history sidebar */}
          <ChatHistory 
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
          />
        </div>
      </div>
    </div>
  );
}

