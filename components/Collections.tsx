import React, { useState, useRef } from "react";
import { FaFolder, FaFileAlt, FaSync, FaPlus } from "react-icons/fa";
import { Collection, Document } from "@/models/model";


function CollectionItem({ collection }: { collection: Collection }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [documentPath, setDocumentPath] = useState('');

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        collection_name: collection.name,
        limit: '1024'
      });
      
      const res = await fetch(`/api/documents?${params}`, {
        method: 'GET',
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

  const handleAddDocument = async () => {
    if (!documentText.trim() || !documentPath.trim()) {
      setUploadError('Both text and path are required');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection_name: collection.name,
          path: documentPath,
          content: {
            type: 'text',
            text: documentText
          },
          metadata: {},
          overwrite: false
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        // Success - refresh the documents list
        await fetchDocuments();
        // Clear the form
        setDocumentText('');
        setDocumentPath('');
        setShowAddForm(false);
      } else {
        setUploadError(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setUploadError('Network error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-lg p-3 hover:bg-gray-100">
      <div className="flex items-center gap-2 font-medium justify-between">
        <span className="flex items-center gap-2 text-gray-900">
          <FaFolder className="text-gray-700" /> {collection.name}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="p-1 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-200"
            onClick={() => setShowAddForm(!showAddForm)}
            type="button"
            disabled={uploading}
            title="Add document"
          >
            <FaPlus className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-200"
            onClick={fetchDocuments}
            type="button"
            disabled={loading}
            title="Refresh documents"
          >
            <FaSync className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Add document form */}
      {showAddForm && (
        <div className="mt-3 p-3 bg-gray-50 rounded border">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Path
              </label>
              <input
                type="text"
                placeholder="e.g., test.txt"
                value={documentPath}
                onChange={(e) => setDocumentPath(e.target.value)}
                className="w-full p-2 text-sm border rounded bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Content
              </label>
              <textarea
                placeholder="Enter your document content here..."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                className="w-full p-2 text-sm border rounded bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAddDocument}
                disabled={uploading}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Adding...' : 'Add Document'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setDocumentText('');
                  setDocumentPath('');
                  setUploadError(null);
                }}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="text-xs text-red-600 mt-2 font-medium">
          {uploadError}
        </div>
      )}
      
      {error && <div className="text-xs text-red-600 mt-2 font-medium">{error}</div>}
      
      {loading ? (
        <div className="mt-2 ml-2 text-xs text-gray-600 italic">Loading...</div>
      ) : documents.length > 0 ? (
        <div>
          {documents.map((doc, docIdx) => (
            <DocumentItem key={doc.id || docIdx} document={doc} />
          ))}
        </div>
      ) : (
        <div className="mt-2 ml-2 text-xs text-gray-600 italic flex items-center gap-2">
          <FaFileAlt className="text-gray-600" /> Empty collection
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
      <div className="flex items-center gap-2 text-gray-900">
        <FaFileAlt className="text-gray-700" /> {document.path}
      </div>
      <div className="text-xs text-gray-700 mt-1">Status: {document.index_status}</div>
    </div>
  );
}

export default function Collections({ collections }: { collections: Collection[] }) {
  return (
    <div className="space-y-4 md:space-y-6">
      {collections.map((collection, idx) => (
        <CollectionItem
          key={collection.name}
          collection={collection}
        />
      ))}
    </div>
  );
}
