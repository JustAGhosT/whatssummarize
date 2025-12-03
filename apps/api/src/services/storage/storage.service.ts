/**
 * Storage Service - Multi-Provider File Storage
 *
 * Provides unified file storage interface supporting multiple providers:
 * - Local filesystem storage
 * - AWS S3 storage
 * - Azure Blob Storage
 *
 * Provider Selection Priority:
 * 1. Azure Blob Storage (if AZURE_STORAGE_ACCOUNT_NAME configured)
 * 2. AWS S3 (if AWS_S3_BUCKET configured)
 * 3. Local filesystem (default)
 *
 * Usage:
 * const storage = new StorageService();
 * await storage.uploadFile('exports/chat.json', jsonData);
 * const url = await storage.getFileUrl('exports/chat.json');
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { logger } from '../../utils/logger.js';
import { getStorageProvider, getAzureBlobStorageConfig, type StorageProvider } from '../../config/azure/index.js';

// =============================================================================
// Types
// =============================================================================

export interface StorageFile {
  key: string;
  size: number;
  contentType: string;
  lastModified: Date;
  url?: string;
}

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
}

export interface StorageServiceConfig {
  provider?: StorageProvider;
  localBasePath?: string;
}

// =============================================================================
// Storage Service
// =============================================================================

export class StorageService {
  private provider: StorageProvider;
  private localBasePath: string;

  constructor(config: StorageServiceConfig = {}) {
    this.provider = config.provider || getStorageProvider();
    this.localBasePath = config.localBasePath || process.env.UPLOAD_DIR || './uploads';

    logger.info(`[StorageService] Using provider: ${this.provider}`);
  }

  /**
   * Upload a file to storage
   */
  async uploadFile(
    key: string,
    data: Buffer | string,
    options: UploadOptions = {}
  ): Promise<StorageFile> {
    switch (this.provider) {
      case 'azure-blob':
        return this.uploadToAzure(key, data, options);
      case 'aws-s3':
        return this.uploadToS3(key, data, options);
      default:
        return this.uploadToLocal(key, data, options);
    }
  }

  /**
   * Download a file from storage
   */
  async downloadFile(key: string): Promise<Buffer> {
    switch (this.provider) {
      case 'azure-blob':
        return this.downloadFromAzure(key);
      case 'aws-s3':
        return this.downloadFromS3(key);
      default:
        return this.downloadFromLocal(key);
    }
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(key: string): Promise<void> {
    switch (this.provider) {
      case 'azure-blob':
        return this.deleteFromAzure(key);
      case 'aws-s3':
        return this.deleteFromS3(key);
      default:
        return this.deleteFromLocal(key);
    }
  }

  /**
   * Get a signed URL for file access
   */
  async getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
    switch (this.provider) {
      case 'azure-blob':
        return this.getAzureUrl(key, expiresIn);
      case 'aws-s3':
        return this.getS3Url(key, expiresIn);
      default:
        return this.getLocalUrl(key);
    }
  }

  /**
   * Check if a file exists
   */
  async fileExists(key: string): Promise<boolean> {
    switch (this.provider) {
      case 'azure-blob':
        return this.existsInAzure(key);
      case 'aws-s3':
        return this.existsInS3(key);
      default:
        return this.existsInLocal(key);
    }
  }

  /**
   * List files in a directory/prefix
   */
  async listFiles(prefix: string): Promise<StorageFile[]> {
    switch (this.provider) {
      case 'azure-blob':
        return this.listInAzure(prefix);
      case 'aws-s3':
        return this.listInS3(prefix);
      default:
        return this.listInLocal(prefix);
    }
  }

  // ===========================================================================
  // Local Storage Implementation
  // ===========================================================================

  private async uploadToLocal(key: string, data: Buffer | string, options: UploadOptions): Promise<StorageFile> {
    const filePath = join(this.localBasePath, key);
    const dirPath = dirname(filePath);

    await fs.mkdir(dirPath, { recursive: true });

    const buffer = typeof data === 'string' ? Buffer.from(data) : data;
    await fs.writeFile(filePath, buffer);

    const stats = await fs.stat(filePath);

    return {
      key,
      size: stats.size,
      contentType: options.contentType || 'application/octet-stream',
      lastModified: stats.mtime,
      url: this.getLocalUrl(key),
    };
  }

  private async downloadFromLocal(key: string): Promise<Buffer> {
    const filePath = join(this.localBasePath, key);
    return fs.readFile(filePath);
  }

  private async deleteFromLocal(key: string): Promise<void> {
    const filePath = join(this.localBasePath, key);
    await fs.unlink(filePath);
  }

  private getLocalUrl(key: string): string {
    return `/uploads/${key}`;
  }

  private async existsInLocal(key: string): Promise<boolean> {
    try {
      const filePath = join(this.localBasePath, key);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async listInLocal(prefix: string): Promise<StorageFile[]> {
    const dirPath = join(this.localBasePath, prefix);
    const files: StorageFile[] = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isFile()) {
          const filePath = join(dirPath, entry.name);
          const stats = await fs.stat(filePath);
          files.push({
            key: join(prefix, entry.name),
            size: stats.size,
            contentType: 'application/octet-stream',
            lastModified: stats.mtime,
          });
        }
      }
    } catch {
      // Directory doesn't exist
    }

    return files;
  }

  // ===========================================================================
  // Azure Blob Storage Implementation
  // ===========================================================================

  private async uploadToAzure(key: string, data: Buffer | string, options: UploadOptions): Promise<StorageFile> {
    const config = getAzureBlobStorageConfig();
    if (!config) throw new Error('Azure Blob Storage not configured');

    const buffer = typeof data === 'string' ? Buffer.from(data) : data;

    // Build Azure Blob Storage URL
    const url = this.buildAzureBlobUrl(config.accountName, config.containerName, key);

    const headers: Record<string, string> = {
      'Content-Type': options.contentType || 'application/octet-stream',
      'Content-Length': buffer.length.toString(),
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-version': '2023-11-03',
      'x-ms-date': new Date().toUTCString(),
    };

    // Add SAS token or account key authentication
    let authUrl = url;
    if (config.sasToken) {
      authUrl = `${url}?${config.sasToken}`;
    } else if (config.accountKey) {
      // For production, use Azure SDK or proper HMAC signing
      // This is a simplified version for POC
      headers['Authorization'] = this.createAzureAuthHeader(
        'PUT',
        config.accountName,
        config.containerName,
        key,
        config.accountKey,
        headers
      );
    }

    const response = await fetch(authUrl, {
      method: 'PUT',
      headers,
      body: buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Azure Blob upload failed: ${response.status} - ${errorText}`);
    }

    logger.info(`[StorageService] Uploaded to Azure: ${key}`);

    return {
      key,
      size: buffer.length,
      contentType: options.contentType || 'application/octet-stream',
      lastModified: new Date(),
      url: this.getAzureUrl(key, 3600),
    };
  }

  private async downloadFromAzure(key: string): Promise<Buffer> {
    const config = getAzureBlobStorageConfig();
    if (!config) throw new Error('Azure Blob Storage not configured');

    let url = this.buildAzureBlobUrl(config.accountName, config.containerName, key);

    if (config.sasToken) {
      url = `${url}?${config.sasToken}`;
    }

    const response = await fetch(url, {
      headers: {
        'x-ms-version': '2023-11-03',
      },
    });

    if (!response.ok) {
      throw new Error(`Azure Blob download failed: ${response.status}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  private async deleteFromAzure(key: string): Promise<void> {
    const config = getAzureBlobStorageConfig();
    if (!config) throw new Error('Azure Blob Storage not configured');

    let url = this.buildAzureBlobUrl(config.accountName, config.containerName, key);

    if (config.sasToken) {
      url = `${url}?${config.sasToken}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'x-ms-version': '2023-11-03',
      },
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Azure Blob delete failed: ${response.status}`);
    }
  }

  private getAzureUrl(key: string, expiresIn: number): string {
    const config = getAzureBlobStorageConfig();
    if (!config) return '';

    let url = this.buildAzureBlobUrl(config.accountName, config.containerName, key);

    if (config.sasToken) {
      url = `${url}?${config.sasToken}`;
    }

    return url;
  }

  private async existsInAzure(key: string): Promise<boolean> {
    const config = getAzureBlobStorageConfig();
    if (!config) return false;

    let url = this.buildAzureBlobUrl(config.accountName, config.containerName, key);

    if (config.sasToken) {
      url = `${url}?${config.sasToken}`;
    }

    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'x-ms-version': '2023-11-03',
      },
    });

    return response.ok;
  }

  private async listInAzure(prefix: string): Promise<StorageFile[]> {
    const config = getAzureBlobStorageConfig();
    if (!config) return [];

    const baseUrl = `https://${config.accountName}.blob.core.windows.net/${config.containerName}`;
    let url = `${baseUrl}?restype=container&comp=list&prefix=${encodeURIComponent(prefix)}`;

    if (config.sasToken) {
      url = `${url}&${config.sasToken}`;
    }

    const response = await fetch(url, {
      headers: {
        'x-ms-version': '2023-11-03',
      },
    });

    if (!response.ok) {
      throw new Error(`Azure Blob list failed: ${response.status}`);
    }

    // Parse XML response (simplified - use proper XML parser in production)
    const text = await response.text();
    const files: StorageFile[] = [];

    // Basic regex parsing for POC - use xml2js or similar in production
    const blobMatches = text.matchAll(/<Blob>[\s\S]*?<Name>(.*?)<\/Name>[\s\S]*?<Content-Length>(\d+)<\/Content-Length>[\s\S]*?<Last-Modified>(.*?)<\/Last-Modified>[\s\S]*?<\/Blob>/g);

    for (const match of blobMatches) {
      files.push({
        key: match[1],
        size: parseInt(match[2], 10),
        contentType: 'application/octet-stream',
        lastModified: new Date(match[3]),
      });
    }

    return files;
  }

  private buildAzureBlobUrl(accountName: string, containerName: string, blobName: string): string {
    return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
  }

  private createAzureAuthHeader(
    method: string,
    accountName: string,
    containerName: string,
    blobName: string,
    accountKey: string,
    headers: Record<string, string>
  ): string {
    // Note: This is a placeholder. Production code should use Azure SDK
    // or implement proper SharedKey authentication
    logger.warn('[StorageService] Using simplified Azure auth - use Azure SDK in production');
    return `SharedKey ${accountName}:placeholder`;
  }

  // ===========================================================================
  // AWS S3 Implementation (Placeholder)
  // ===========================================================================

  private async uploadToS3(key: string, data: Buffer | string, options: UploadOptions): Promise<StorageFile> {
    // TODO: Implement AWS S3 upload using AWS SDK
    logger.warn('[StorageService] AWS S3 not fully implemented, falling back to local');
    return this.uploadToLocal(key, data, options);
  }

  private async downloadFromS3(key: string): Promise<Buffer> {
    logger.warn('[StorageService] AWS S3 not fully implemented, falling back to local');
    return this.downloadFromLocal(key);
  }

  private async deleteFromS3(key: string): Promise<void> {
    logger.warn('[StorageService] AWS S3 not fully implemented, falling back to local');
    return this.deleteFromLocal(key);
  }

  private getS3Url(key: string, expiresIn: number): string {
    logger.warn('[StorageService] AWS S3 not fully implemented');
    return this.getLocalUrl(key);
  }

  private async existsInS3(key: string): Promise<boolean> {
    logger.warn('[StorageService] AWS S3 not fully implemented');
    return this.existsInLocal(key);
  }

  private async listInS3(prefix: string): Promise<StorageFile[]> {
    logger.warn('[StorageService] AWS S3 not fully implemented');
    return this.listInLocal(prefix);
  }
}

// Export singleton instance
export const storageService = new StorageService();
