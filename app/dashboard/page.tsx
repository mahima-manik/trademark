import React from "react";
import { FaFolder, FaFileAlt } from "react-icons/fa";
import Link from "next/link";

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Collections</h2>
      <div className="flex-1 space-y-6 overflow-y-auto">
        {/* Collection Placeholder */}
        <div className="border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
          <div className="flex items-center gap-2 font-medium">
            <FaFolder className="text-gray-500" /> Collection 1
          </div>
          <div className="text-xs text-gray-500 mt-1">Metadata: Placeholder</div>
          <ul className="mt-2 ml-2 list-disc text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <FaFileAlt className="text-gray-400" />
              <Link href="/dashboard/collection1/doc1" className="hover:underline">Document 1</Link>
            </li>
            <li className="flex items-center gap-2">
              <FaFileAlt className="text-gray-400" />
              <Link href="/dashboard/collection1/doc2" className="hover:underline">Document 2</Link>
            </li>
          </ul>
        </div>
        <div className="border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
          <div className="flex items-center gap-2 font-medium">
            <FaFolder className="text-gray-500" /> Collection 2
          </div>
          <div className="text-xs text-gray-500 mt-1">Metadata: Placeholder</div>
          <ul className="mt-2 ml-2 list-disc text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <FaFileAlt className="text-gray-400" />
              <Link href="/dashboard/collection2/docA" className="hover:underline">Document A</Link>
            </li>
            <li className="flex items-center gap-2">
              <FaFileAlt className="text-gray-400" />
              <Link href="/dashboard/collection2/docB" className="hover:underline">Document B</Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

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
  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      <Sidebar />
      <ChatArea />
      <ChatHistory />
    </div>
  );
}

