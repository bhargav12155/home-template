import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/auth';

interface ImageUploadProps {
  folder?: 'templates' | 'properties' | 'agents' | 'logos' | 'heroes';
  onUploadSuccess?: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  children?: React.ReactNode;
}

interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  folder: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export default function ImageUpload({
  folder = 'templates',
  onUploadSuccess,
  onUploadError,
  accept = 'image/*',
  maxSize = 50, // 50MB default
  className,
  children,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFile = async (file: File) => {
    if (!user) {
      onUploadError?.('Please log in to upload files');
      return;
    }

    // Validate file type based on accept prop
    const isImage = accept.includes('image');
    const isVideo = accept.includes('video');
    const isValidType = (isImage && file.type.startsWith('image/')) || 
                       (isVideo && file.type.startsWith('video/')) ||
                       accept === '*/*';
    
    if (!isValidType) {
      const expectedType = isVideo ? 'video' : 'image';
      onUploadError?.(`Please select ${isVideo && isImage ? 'an image or video' : `a ${expectedType}`} file`);
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onUploadError?.(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      // Always use 'image' field name since server expects this regardless of file type
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const result = await response.json();
      setUploadProgress(100);
      
      onUploadSuccess?.(result.file);
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (children) {
    return (
      <div className={className} onClick={handleClick}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        {children}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <div className="text-sm text-gray-600">
                Uploading... {uploadProgress}%
              </div>
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-gray-100 rounded-full">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Upload {accept.includes('video') ? (accept.includes('image') ? 'a file' : 'a video') : 'an image'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop your {accept.includes('video') ? (accept.includes('image') ? 'file' : 'video') : 'image'} here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports: {accept.includes('video') && accept.includes('image') 
                    ? 'Images (JPG, PNG, WebP, GIF) and Videos (MP4, WebM, MOV)' 
                    : accept.includes('video') 
                      ? 'Videos (MP4, WebM, MOV, AVI)' 
                      : 'Images (JPG, PNG, WebP, GIF)'} (max {maxSize}MB)
                </p>
              </div>
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Reusable hook for image upload functionality
export function useImageUpload(folder: 'templates' | 'properties' | 'agents' | 'logos' | 'heroes' = 'templates') {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const uploadImage = async (file: File): Promise<UploadResult | null> => {
    if (!user) {
      setError('Please log in to upload images');
      return null;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      return result.file;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error,
    clearError: () => setError(null),
  };
}
