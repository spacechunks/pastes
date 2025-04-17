export type PasteMetadata = {
  id: string;
  languageId: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
};

export type PasteContent = {
  data: string;
};

export type Paste = PasteMetadata & PasteContent;

export type StorageProvider = {
  save: (paste: Paste) => Promise<void>;
  get: (id: string) => Promise<Paste | null>;
  delete: (id: string) => Promise<void>;
  list: () => Promise<PasteMetadata[]>;
};
