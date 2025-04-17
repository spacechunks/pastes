import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import type { Paste, PasteMetadata, StorageProvider } from './types';

type S3StorageConfig = {
  bucket: string;
  region: string;
  endpoint?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  forcePathStyle?: boolean;
};

export const createS3Storage = async (
  config: S3StorageConfig
): Promise<StorageProvider> => {
  const s3 = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: config.credentials,
    forcePathStyle: config.forcePathStyle ?? false,
  });

  const getKey = (id: string) => `pastes/${id}`;

  return {
    async save(paste: Paste) {
      const metadata: PasteMetadata = {
        id: paste.id,
        languageId: paste.languageId,
        createdAt: paste.createdAt,
        updatedAt: paste.updatedAt,
        expiresAt: paste.expiresAt,
      };

      await s3.send(
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: getKey(paste.id),
          Body: paste.data,
          ContentType: 'text/plain',
          Metadata: {
            languageId: metadata.languageId,
            createdAt: metadata.createdAt.toISOString(),
            updatedAt: metadata.updatedAt.toISOString(),
            expiresAt: metadata.expiresAt?.toISOString() || '',
          },
        })
      );
    },

    async get(id: string) {
      try {
        const response = await s3.send(
          new GetObjectCommand({
            Bucket: config.bucket,
            Key: getKey(id),
          })
        );

        const data = await response.Body!.transformToString();
        const metadata = response.Metadata!;

        return {
          id,
          data,
          languageId: metadata.languageid,
          createdAt: new Date(metadata.createdat),
          updatedAt: new Date(metadata.updatedat),
          expiresAt: metadata.expiresat
            ? new Date(metadata.expiresat)
            : undefined,
        };
      } catch {
        return null;
      }
    },

    async delete(id: string) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: config.bucket,
            Key: getKey(id),
          })
        );
      } catch {
        // Ignore if object doesn't exist
      }
    },

    async list() {
      const list = await s3.send(
        new ListObjectsV2Command({
          Bucket: config.bucket,
          Prefix: 'pastes/',
        })
      );

      const items: PasteMetadata[] = [];

      if (list.Contents) {
        for (const item of list.Contents) {
          try {
            const response = await s3.send(
              new GetObjectCommand({
                Bucket: config.bucket,
                Key: item.Key,
              })
            );

            const metadata = response.Metadata!;
            const id = item.Key!.replace('pastes/', '');

            items.push({
              id,
              languageId: metadata.languageid,
              createdAt: new Date(metadata.createdat),
              updatedAt: new Date(metadata.updatedat),
              expiresAt: metadata.expiresat
                ? new Date(metadata.expiresat)
                : undefined,
            });
          } catch {
            // Skip invalid items
            continue;
          }
        }
      }

      return items;
    },
  };
};
