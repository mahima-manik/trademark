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
          <h2 className="text-base md:text-lg font-semibold text-gray-900">Collections</h2>
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
      if (window.innerWidth >= 768) { // md breakpoint
        setShowCollections(false);
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
            <span className="text-sm text-gray-700">Collections</span>
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
          <Chatbox collections={collections} />

        </div>
      </div>
    </div>
  );
}

