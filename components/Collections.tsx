import React, { useState, useRef, useEffect } from "react";
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
  const [uploadMode, setUploadMode] = useState<'text' | 'file'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAddDocument = async () => {
    if (uploadMode === 'text') {
      if (!documentText.trim() || !documentPath.trim()) {
        setUploadError('Both text and path are required');
        return;
      }
    } else {
      if (!selectedFile || !documentPath.trim()) {
        setUploadError('Both file and path are required');
        return;
      }
    }

    setUploading(true);
    setUploadError(null);

    try {
      let content;
      
      if (uploadMode === 'text') {
        content = {
          type: 'text',
          text: documentText
        };
      } else {
        // Convert file to base64
        const base64Data = await fileToBase64(selectedFile!);
        content = {
          type: 'auto',
          base64_data: base64Data
        };
      }

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection_name: collection.name,
          path: documentPath,
          content: content,
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
        setSelectedFile(null);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill path with filename if empty
      if (!documentPath) {
        setDocumentPath(file.name);
      }
    }
  };

  // Auto-fetch documents when component mounts
  useEffect(() => {
    fetchDocuments();
  }, [collection.name]); // Re-fetch if collection name changes

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
            {/* Mode selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="text"
                    checked={uploadMode === 'text'}
                    onChange={(e) => setUploadMode(e.target.value as 'text' | 'file')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Text Content</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="file"
                    checked={uploadMode === 'file'}
                    onChange={(e) => setUploadMode(e.target.value as 'text' | 'file')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">File Upload</span>
                </label>
              </div>
            </div>

            {/* Document path */}
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

            {/* Content input based on mode */}
            {uploadMode === 'text' ? (
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
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="w-full p-2 text-sm border rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {selectedFile && (
                  <div className="mt-1 text-xs text-gray-600">
                    Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </div>
                )}
              </div>
            )}

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
                  setSelectedFile(null);
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
