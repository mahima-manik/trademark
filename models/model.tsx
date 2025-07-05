export type Document = {
  name: string;
  url: string;
  metadata?: Record<string, string | string[]>;
};

export type Collection = {
  name: string;
  documents: Document[];
};
