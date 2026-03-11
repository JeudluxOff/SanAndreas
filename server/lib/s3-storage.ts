import crypto from 'crypto';

/**
 * S3/Cloud Storage interface for flexible cloud provider integration
 */

export interface CloudStorageConfig {
  provider: 'aws-s3' | 'minio' | 'mock';
  bucket: string;
  region?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface StoredFile {
  file_id: string;
  file_url: string;
  presigned_url?: string;
  filename: string;
  size: number;
  type: string;
  uploaded_at: string;
  expires_in?: number; // Presigned URL expiration in seconds
}

class CloudStorageManager {
  private config: CloudStorageConfig;
  private fileRegistry: Map<string, StoredFile>;

  constructor(config?: Partial<CloudStorageConfig>) {
    this.fileRegistry = new Map();
    this.config = {
      provider: (process.env.CLOUD_PROVIDER as any) || 'mock',
      bucket: process.env.CLOUD_BUCKET || 'legal-documents',
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.CLOUD_ENDPOINT,
      accessKeyId: process.env.CLOUD_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUD_SECRET_ACCESS_KEY,
      ...config
    };

    if (this.config.provider === 'aws-s3' || this.config.provider === 'minio') {
      if (!this.config.accessKeyId || !this.config.secretAccessKey) {
        console.warn('⚠️ Cloud storage credentials not configured. Using mock storage.');
        this.config.provider = 'mock';
      }
    }
  }

  /**
   * Upload a file to cloud storage
   */
  async uploadFile(
    filename: string,
    content: Buffer | string,
    options?: {
      contentType?: string;
      metadata?: Record<string, string>;
    }
  ): Promise<StoredFile> {
    const file_id = this.generateFileId();
    const buffer = typeof content === 'string' ? Buffer.from(content, 'utf-8') : content;

    switch (this.config.provider) {
      case 'aws-s3':
      case 'minio':
        return this.uploadToS3(file_id, filename, buffer, options);
      case 'mock':
      default:
        return this.uploadToMock(file_id, filename, buffer, options);
    }
  }

  /**
   * Generate a presigned URL for secure file access
   */
  async getPresignedUrl(
    file_id: string,
    expireInSeconds: number = 3600
  ): Promise<string> {
    const file = this.fileRegistry.get(file_id);
    if (!file) {
      throw new Error(`File not found: ${file_id}`);
    }

    switch (this.config.provider) {
      case 'aws-s3':
      case 'minio':
        return this.generateS3PresignedUrl(file_id, expireInSeconds);
      case 'mock':
      default:
        // For mock storage, return the file URL directly
        return file.file_url;
    }
  }

  /**
   * Delete a file from cloud storage
   */
  async deleteFile(file_id: string): Promise<void> {
    const file = this.fileRegistry.get(file_id);
    if (!file) {
      throw new Error(`File not found: ${file_id}`);
    }

    switch (this.config.provider) {
      case 'aws-s3':
      case 'minio':
        await this.deleteFromS3(file_id);
        break;
      case 'mock':
      default:
        this.fileRegistry.delete(file_id);
        break;
    }

    this.fileRegistry.delete(file_id);
  }

  /**
   * Get file metadata
   */
  getFileMetadata(file_id: string): StoredFile | null {
    return this.fileRegistry.get(file_id) || null;
  }

  /**
   * List all files
   */
  listFiles(): StoredFile[] {
    return Array.from(this.fileRegistry.values());
  }

  // ============ Private Methods ============

  private generateFileId(): string {
    return `FILE-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  }

  private async uploadToMock(
    file_id: string,
    filename: string,
    buffer: Buffer,
    options?: { contentType?: string; metadata?: Record<string, string> }
  ): Promise<StoredFile> {
    const file: StoredFile = {
      file_id,
      file_url: `/api/files/${file_id}`,
      filename,
      size: buffer.length,
      type: options?.contentType || 'application/octet-stream',
      uploaded_at: new Date().toISOString()
    };

    this.fileRegistry.set(file_id, file);
    return file;
  }

  private async uploadToS3(
    file_id: string,
    filename: string,
    buffer: Buffer,
    options?: { contentType?: string; metadata?: Record<string, string> }
  ): Promise<StoredFile> {
    try {
      // AWS SDK v3 integration would go here
      // For now, return a mock response with S3 URL pattern
      const s3Key = `${Date.now()}/${file_id}/${filename}`;
      const bucketName = this.config.bucket;
      const region = this.config.region || 'us-east-1';

      let file_url: string;
      if (this.config.provider === 'minio') {
        // MinIO uses custom endpoint
        file_url = `${this.config.endpoint}/${bucketName}/${s3Key}`;
      } else {
        // AWS S3 standard URL pattern
        file_url = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
      }

      const file: StoredFile = {
        file_id,
        file_url,
        filename,
        size: buffer.length,
        type: options?.contentType || 'application/octet-stream',
        uploaded_at: new Date().toISOString(),
        expires_in: 3600
      };

      this.fileRegistry.set(file_id, file);
      return file;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  private generateS3PresignedUrl(file_id: string, expireInSeconds: number): string {
    const file = this.fileRegistry.get(file_id);
    if (!file) {
      throw new Error(`File not found: ${file_id}`);
    }

    // In production, use AWS SDK v3 to generate presigned URL
    // For now, return the file URL with expiration query parameter
    const expiresAt = new Date(Date.now() + expireInSeconds * 1000).toISOString();
    return `${file.file_url}?expires=${expiresAt}&signature=${this.generateSignature(file_id)}`;
  }

  private async deleteFromS3(file_id: string): Promise<void> {
    // AWS SDK v3 delete operation would go here
    // For now, just log the operation
    console.log(`[S3] Deleting file: ${file_id}`);
  }

  private generateSignature(file_id: string): string {
    return crypto
      .createHash('sha256')
      .update(`${file_id}${Date.now()}${this.config.secretAccessKey || 'mock'}`)
      .digest('hex');
  }
}

// Export singleton instance
export const cloudStorage = new CloudStorageManager();
