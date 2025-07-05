import React from "react";
import { FaFolder, FaFileAlt } from "react-icons/fa";
import Link from "next/link";
import { Collection } from "@/models/model";


export default function Collections({ collections }: { collections: Collection[] }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Collections</h2>
      <div className="flex-1 space-y-6 overflow-y-auto">
        {collections.map((collection, idx) => (
          <div key={idx} className="border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-2 font-medium">
              <FaFolder className="text-gray-500" /> {collection.name}
            </div>
            {collection.documents.length > 0 ? (
              <ul className="mt-2 ml-2 list-disc text-sm text-gray-700">
                {collection.documents.map((doc, docIdx) => (
                  <li key={docIdx} className="flex flex-col gap-1 mb-2">
                    <div className="flex items-center gap-2">
                      <FaFileAlt className="text-gray-400" />
                      <Link href={doc.url} className="hover:underline">{doc.name}</Link>
                    </div>
                    {doc.metadata && (
                      <div className="ml-6 text-xs text-gray-500">
                        {Object.entries(doc.metadata).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-semibold">{key}:</span> {Array.isArray(value) ? value.join(", ") : value}
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-2 ml-2 text-xs text-gray-400 italic flex items-center gap-2">
                <FaFileAlt className="text-gray-200" /> Empty collection
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
