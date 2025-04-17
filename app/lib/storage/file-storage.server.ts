import fs from 'fs/promises';
import path from 'path';
import type { Paste, PasteMetadata, StorageProvider } from './types';

const STORAGE_DIR =
  process.env.STORAGE_DIR || path.join(process.cwd(), 'files');

export const createFileStorage = async (): Promise<StorageProvider> => {
  // Ensure storage directory exists
  await fs.mkdir(STORAGE_DIR, { recursive: true });

  const getPastePath = (id: string) => path.join(STORAGE_DIR, `${id}`);
  const getMetadataPath = (id: string) =>
    path.join(getPastePath(id), 'metadata.json');
  const getContentPath = (id: string) =>
    path.join(getPastePath(id), 'content.txt');

  return {
    async save(paste: Paste) {
      const pastePath = getPastePath(paste.id);
      await fs.mkdir(pastePath, { recursive: true });

      // Save metadata
      const metadata: PasteMetadata = {
        id: paste.id,
        languageId: paste.languageId,
        createdAt: paste.createdAt,
        updatedAt: paste.updatedAt,
        expiresAt: paste.expiresAt,
      };
      await fs.writeFile(
        getMetadataPath(paste.id),
        JSON.stringify(metadata, null, 2)
      );

      // Save content
      await fs.writeFile(getContentPath(paste.id), paste.data);
    },

    async get(id: string) {
      try {
        // Get metadata
        const metadataRaw = await fs.readFile(getMetadataPath(id), 'utf-8');
        const metadata = JSON.parse(metadataRaw) as PasteMetadata;

        // Get content
        const data = await fs.readFile(getContentPath(id), 'utf-8');

        return {
          ...metadata,
          data,
        };
      } catch {
        return null;
      }
    },

    async delete(id: string) {
      try {
        await fs.rm(getPastePath(id), { recursive: true, force: true });
      } catch {
        // Ignore if directory doesn't exist
      }
    },

    async list() {
      const metadataItems: PasteMetadata[] = [];

      try {
        const entries = await fs.readdir(STORAGE_DIR, { withFileTypes: true });

        for (const entry of entries) {
          if (entry.isDirectory()) {
            try {
              const metadataPath = getMetadataPath(entry.name);
              const metadataRaw = await fs.readFile(metadataPath, 'utf-8');
              const metadata = JSON.parse(metadataRaw) as PasteMetadata;
              metadataItems.push(metadata);
            } catch {
              // Skip invalid entries
              continue;
            }
          }
        }
      } catch {
        // Return empty array if storage directory doesn't exist
      }

      return metadataItems;
    },
  };
};
