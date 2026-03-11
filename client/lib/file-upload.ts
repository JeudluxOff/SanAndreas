/**
 * File upload utility with S3/Cloud Storage support
 */

export interface UploadedFile {
  file_id: string;
  file_url: string;
  presigned_url?: string;
  filename: string;
  size: number;
  type: string;
  uploaded_at: string;
  expires_in?: number;
}

/**
 * Upload a file to cloud storage (S3) or local server
 * @param file - The File object to upload
 * @returns Upload response with file_url and optionally presigned_url
 */
export async function uploadFile(file: File): Promise<UploadedFile> {
  try {
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'File validation failed');
    }

    // Detect upload method based on environment
    const useCloudStorage = isCloudStorageEnabled();

    if (useCloudStorage) {
      return await uploadToCloudStorage(file);
    } else {
      return await uploadToServer(file);
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Get a presigned URL for an already-uploaded file
 * @param fileId - The file ID to get presigned URL for
 * @returns Presigned URL for direct access
 */
export async function getPresignedUrl(fileId: string, expiresIn: number = 3600): Promise<string> {
  try {
    const response = await fetch(`/api/files/${fileId}/presigned?expires=${expiresIn}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to get presigned URL');
    }

    const data = await response.json();
    return data.presigned_url;
  } catch (error) {
    console.error('Presigned URL error:', error);
    throw error;
  }
}

/**
 * Delete an uploaded file
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    const response = await fetch(`/api/files/${fileId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

/**
 * List all uploaded files
 */
export async function listFiles(): Promise<UploadedFile[]> {
  try {
    const response = await fetch('/api/files', {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to list files');
    }

    return await response.json();
  } catch (error) {
    console.error('List files error:', error);
    throw error;
  }
}

// ============ Helper Functions ============

function isCloudStorageEnabled(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  );
}

async function uploadToCloudStorage(file: File): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filename', file.name);
  formData.append('type', file.type);

  const response = await fetch('/api/files/upload-cloud', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Cloud storage upload failed');
  }

  return await response.json();
}

async function uploadToServer(file: File): Promise<UploadedFile> {
  const base64 = await fileToBase64(file);

  const response = await fetch('/api/files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      content: base64,
      type: file.type,
      size: file.size
    })
  });

  if (!response.ok) {
    throw new Error('Server upload failed');
  }

  return await response.json();
}

/**
 * Convert File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 content after the comma
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, maxSizeMB: number = 50): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }

  // Allow common document and image types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed` };
  }

  return { valid: true };
}
