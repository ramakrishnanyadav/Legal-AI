// src/components/EvidenceUploader.tsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Image, Video, File, Loader2, Check, AlertCircle } from 'lucide-react';
import { processEvidenceFile } from '@/lib/cloudinary';
import { UploadedEvidence } from '@/lib/storage';
import { toast } from 'sonner';

interface EvidenceUploaderProps {
  onUploadComplete: (files: UploadedEvidence[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

interface UploadingFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  result?: UploadedEvidence;
}

const EvidenceUploader = ({ 
  onUploadComplete, 
  maxFiles = 5,
  acceptedTypes = ['image/*', 'video/*', 'application/pdf', '.doc', '.docx']
}: EvidenceUploaderProps) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    if (fileType === 'application/pdf') return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Max 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'File must be less than 10MB' };
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/quicktime',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not supported' };
    }

    return { valid: true };
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Check max files
    if (uploadingFiles.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate and prepare files
    const validFiles: UploadingFile[] = [];
    
    for (const file of fileArray) {
      const validation = validateFile(file);
      
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
        continue;
      }

      validFiles.push({
        file,
        id: `${Date.now()}-${Math.random()}`,
        progress: 0,
        status: 'uploading',
      });
    }

    if (validFiles.length === 0) return;

    setUploadingFiles(prev => [...prev, ...validFiles]);

    // Upload files
    const uploadPromises = validFiles.map(async (uploadingFile) => {
      try {
        const result = await processEvidenceFile(uploadingFile.file);
        
        if (!result) {
          throw new Error('Upload failed');
        }

        // Update status
        setUploadingFiles(prev =>
          prev.map(f =>
            f.id === uploadingFile.id
              ? { ...f, status: 'success', progress: 100, result }
              : f
          )
        );

        return result;
      } catch (error) {
        // Update status to error
        setUploadingFiles(prev =>
          prev.map(f =>
            f.id === uploadingFile.id
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f
          )
        );
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((r): r is UploadedEvidence => r !== null);

    if (successfulUploads.length > 0) {
      onUploadComplete(successfulUploads);
      toast.success(`${successfulUploads.length} file(s) uploaded successfully`);
      
      // Clear after 2 seconds
      setTimeout(() => {
        setUploadingFiles([]);
      }, 2000);
    }
  };

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
          dragActive
            ? 'border-primary bg-primary/10'
            : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              Images, videos, PDFs (max 10MB each)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Up to {maxFiles} files
            </p>
          </div>
        </div>
      </div>

      {/* Uploading Files List */}
      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {uploadingFiles.map((uploadingFile) => {
              const Icon = getFileIcon(uploadingFile.file.type);
              
              return (
                <motion.div
                  key={uploadingFile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      uploadingFile.status === 'success' 
                        ? 'bg-green-500/20' 
                        : uploadingFile.status === 'error'
                        ? 'bg-red-500/20'
                        : 'bg-primary/20'
                    }`}>
                      {uploadingFile.status === 'uploading' && (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      )}
                      {uploadingFile.status === 'success' && (
                        <Check className="w-5 h-5 text-green-400" />
                      )}
                      {uploadingFile.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {uploadingFile.file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(uploadingFile.file.size)}</span>
                        {uploadingFile.status === 'uploading' && (
                          <span>• Uploading...</span>
                        )}
                        {uploadingFile.status === 'success' && (
                          <span className="text-green-400">• Uploaded</span>
                        )}
                        {uploadingFile.status === 'error' && (
                          <span className="text-red-400">• {uploadingFile.error}</span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {uploadingFile.status === 'uploading' && (
                        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2, ease: 'easeInOut' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    {uploadingFile.status !== 'uploading' && (
                      <button
                        onClick={() => removeFile(uploadingFile.id)}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EvidenceUploader;