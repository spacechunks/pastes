import type { Paste, PasteMetadata } from './storage/types';
import { createFileStorage } from './storage/file-storage.server';
import { createS3Storage } from './storage/s3-storage.server';
import { z } from 'zod';
import { redirect } from 'react-router';
import { generateReadableId } from './readable-id';

const savePasteInputSchema = z.object({
  data: z.string(),
  languageId: z.string(),
});

type SavePasteInput = z.infer<typeof savePasteInputSchema>;

const initializeStorage = async () => {
  if (process.env.STORAGE_TYPE === 's3') {
    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
      throw new Error('Missing required S3 configuration');
    }

    return createS3Storage({
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
    });
  }

  return createFileStorage();
};

let storagePromise: Promise<
  Awaited<ReturnType<typeof initializeStorage>>
> | null = null;

const getStorage = () => {
  if (!storagePromise) {
    storagePromise = initializeStorage();
  }
  return storagePromise;
};

export async function savePaste(input: SavePasteInput): Promise<string> {
  savePasteInputSchema.parse(input);

  const storage = await getStorage();

  const paste: Paste = {
    id: generateReadableId(),
    data: input.data,
    languageId: input.languageId,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: undefined,
  };

  await storage.save(paste);
  return paste.id;
}

export async function getPaste(id: string): Promise<Paste> {
  if (typeof id !== 'string') {
    throw new Error('ID must be a string');
  }

  const storage = await getStorage();
  const paste = await storage.get(id);

  if (!paste) {
    throw redirect('/');
  }

  if (paste.expiresAt && paste.expiresAt < new Date()) {
    await storage.delete(id);
    throw redirect('/');
  }

  return paste;
}

export async function listPastes(): Promise<PasteMetadata[]> {
  const storage = await getStorage();
  const pastes = await storage.list();

  return pastes.filter(
    (paste) => !paste.expiresAt || paste.expiresAt > new Date()
  );
}
