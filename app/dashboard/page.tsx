"use client";

import React, { useEffect, useState } from "react";
import Collections from "@/components/Collections";
import { Collection } from "@/models/model";

function ChatArea() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6 flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto mb-4">
          {/* Chat messages placeholder */}
          <div className="text-gray-400 text-center mt-20">Chat interface placeholder</div>
        </div>
        <form className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
            placeholder="Type your message..."
            disabled
          />
          <button
            type="submit"
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
            disabled
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}

function ChatHistory() {
  return (
    <aside className="w-72 bg-white border-l border-gray-200 p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Chat History</h2>
      <div className="flex-1 overflow-y-auto text-gray-400 text-center mt-20">
        Chat history placeholder
      </div>
    </aside>
  );
}

export default function Dashboard() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      <div className="flex flex-col flex-1">
        {error && (
          <div className="bg-red-100 text-red-700 p-2 text-center text-sm">{error}</div>
        )}
        <div className="flex flex-1">
          <Collections collections={collections} />
          <ChatArea />
          <ChatHistory />
        </div>
      </div>
    </div>
  );
}

