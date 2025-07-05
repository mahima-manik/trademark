export type Document = {
  id: string;
  collection_name: string;
  path: string;
  metadata: Record<string, string | string[]>;
  index_status: IndexStatus;
  created_at: string;
  size: number;
  num_pages: number;
  file_url: string;
};

export type IndexStatus = "not_parsed" | "parsing" | "not_indexed" | "indexing" | "indexed" | "parsing_failed" | "indexing_failed";

export type Collection = {
  name: string;
  documents: Document[];
};
