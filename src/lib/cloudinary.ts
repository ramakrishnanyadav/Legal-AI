// src/lib/cloudinary.ts - Cloudinary Upload System

import { UploadedEvidence } from './storage';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

/**
 * Upload image to Cloudinary (unsigned upload - perfect for hackathons!)
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'legal-ai-evidence'
): Promise<CloudinaryUploadResult | null> => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary credentials missing. Check your .env file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);
    formData.append('tags', 'legal-ai,evidence');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      url: data.url,
      publicId: data.public_id,
      secureUrl: data.secure_url,
      format: data.format,
      width: data.width,
      height: data.height,
      bytes: data.bytes,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    return null;
  }
};

/**
 * Upload multiple files
 */
export const uploadMultipleToCloudinary = async (
  files: File[],
  folder: string = 'legal-ai-evidence'
): Promise<CloudinaryUploadResult[]> => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file, folder));
  const results = await Promise.all(uploadPromises);
  return results.filter((result): result is CloudinaryUploadResult => result !== null);
};

/**
 * Process file and create UploadedEvidence object
 */
export const processEvidenceFile = async (
  file: File
): Promise<UploadedEvidence | null> => {
  const uploadResult = await uploadToCloudinary(file);
  
  if (!uploadResult) return null;

  return {
    id: uploadResult.publicId,
    fileName: file.name,
    fileType: file.type,
    cloudinaryUrl: uploadResult.secureUrl,
    publicId: uploadResult.publicId,
    uploadedAt: new Date().toISOString(),
    size: uploadResult.bytes,
  };
};

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
    quality?: 'auto' | number;
  } = {}
): string => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
  } = options;

  let transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);

  const transformString = transformations.join(',');
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
};

/**
 * Get thumbnail URL (200x200)
 */
export const getThumbnailUrl = (publicId: string): string => {
  return getOptimizedImageUrl(publicId, {
    width: 200,
    height: 200,
    crop: 'fill',
  });
};