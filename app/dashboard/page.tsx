import React from "react";
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

const collectionsData: Collection[] = [
  {
    name: "Collection 1",
    documents: [
      { name: "Document 1", url: "/dashboard/collection1/doc1", metadata: { author: "Alice", tags: ["tag1", "tag2"] } },
      { name: "Document 2", url: "/dashboard/collection1/doc2", metadata: { author: "Bob", tags: ["tag3"] } },
    ],
  },
  {
    name: "Collection 2",
    documents: [
      { name: "Document A", url: "/dashboard/collection2/docA", metadata: { author: "Carol", tags: ["tagA"] } },
      { name: "Document B", url: "/dashboard/collection2/docB", metadata: { author: "Dave", tags: ["tagB", "tagC"] } },
    ],
  },
  {
    name: "Empty Collection",
    documents: [],
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      <Collections collections={collectionsData} />
      <ChatArea />
      <ChatHistory />
    </div>
  );
}

