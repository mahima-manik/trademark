export type Document = {
  name: string;
  url: string;
};

export type Collection = {
  name: string;
  metadata?: string;
  documents: Document[];
};
