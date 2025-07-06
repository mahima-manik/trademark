"use client";

import React, { useEffect, useState } from "react";
import Collections from "@/components/Collections";
import Chatbox from "@/components/Chatbox";
import { Collection } from "@/models/model";
import { FaBars, FaTimes } from "react-icons/fa";

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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Collections Sidebar */}
      <aside className={`
        fixed lg:relative top-0 left-0 h-full
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isOpen ? 'flex' : 'hidden lg:flex'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Collections</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
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

  useEffect(() => {
    fetch('/api/collections', { method: 'GET' })
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
      if (window.innerWidth >= 1024) { // lg breakpoint
        setShowCollections(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex font-sans bg-gray-50 overflow-hidden">
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-700 p-2 text-center text-sm z-30">
          {error}
        </div>
      )}
      
      <div className="flex flex-1 h-full">
        {/* Collections sidebar */}
        <CollectionsSidebar 
          collections={collections}
          isOpen={showCollections}
          onClose={() => setShowCollections(false)}
        />
        
        {/* Chat area - takes up all remaining space */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Header with toggle button */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between lg:justify-end flex-shrink-0">
            <button
              onClick={() => setShowCollections(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
            >
              <FaBars className="w-4 h-4" />
              <span className="text-sm text-gray-700">Collections</span>
            </button>
          </div>

          {/* Chat container */}
          <div className="flex-1 min-h-0">
            <Chatbox collections={collections} />
          </div>
        </div>
      </div>
    </div>
  );
}

