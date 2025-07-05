import React, { useState } from "react";
import { FaFolder, FaFileAlt } from "react-icons/fa";
import { Collection, Document } from "@/models/model";


function CollectionItem({ collection }: { collection: Collection }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection_name: collection.name }),
      });
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents as Document[]);
      } else if (data.error) {
        setError(data.error);
        setDocuments([]);
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
      <div className="flex items-center gap-2 font-medium justify-between">
        <span className="flex items-center gap-2">
          <FaFolder className="text-gray-500" /> {collection.name}
        </span>
        <button
          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          onClick={fetchDocuments}
          type="button"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'View Documents'}
        </button>
      </div>
      {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
      {loading ? (
        <div className="mt-2 ml-2 text-xs text-gray-400 italic">Loading...</div>
      ) : documents.length > 0 ? (
        <div>
          {documents.map((doc, docIdx) => (
            <DocumentItem key={doc.id || docIdx} document={doc} />
          ))}
        </div>
      ) : (
        <div className="mt-2 ml-2 text-xs text-gray-400 italic flex items-center gap-2">
          <FaFileAlt className="text-gray-200" /> Empty collection
        </div>
      )}
    </div>
  );
}

function DocumentItem({ document }: { document: Document }) {
  return (
    <div 
      className="mt-2 ml-2 text-xs font-mono bg-gray-100 p-2 rounded hover:bg-gray-200 cursor-pointer"
      onClick={() => window.open(document.file_url, '_blank')}
    >
      <div className="flex items-center gap-2">
        <FaFileAlt className="text-gray-400" /> {document.path}
      </div>
      <div className="text-xs text-gray-500 mt-1">Status: {document.index_status}</div>
    </div>
  );
}

export default function Collections({ collections }: { collections: Collection[] }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Collections</h2>
      <div className="flex-1 space-y-6 overflow-y-auto">
        {collections.map((collection, idx) => (
          <CollectionItem
            key={collection.name}
            collection={collection}
          />
        ))}
      </div>
    </aside>
  );
}
