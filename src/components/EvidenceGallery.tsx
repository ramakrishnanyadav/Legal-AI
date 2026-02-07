// src/components/EvidenceGallery.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, Trash2, FileText, Image as ImageIcon, Video, File, AlertCircle } from 'lucide-react';
import { UploadedEvidence } from '@/lib/storage';
import { getThumbnailUrl } from '@/lib/cloudinary';
import EvidencePreviewModal from './EvidencePreviewModal';
import { toast } from 'sonner';

interface EvidenceGalleryProps {
  evidence: UploadedEvidence[];
  onDelete?: (evidenceId: string) => void;
  readOnly?: boolean;
}

const EvidenceGallery = ({ evidence, onDelete, readOnly = false }: EvidenceGalleryProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return ImageIcon;
    if (fileType.startsWith('video/')) return Video;
    if (fileType === 'application/pdf') return FileText;
    return File;
  };

  const getFileType = (fileType: string): 'image' | 'video' | 'pdf' | 'other' => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType === 'application/pdf') return 'pdf';
    return 'other';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handlePreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const handleDownload = (item: UploadedEvidence) => {
    const link = document.createElement('a');
    link.href = item.cloudinaryUrl;
    link.download = item.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  };

  const handleDelete = (evidenceId: string) => {
    if (deleteConfirm === evidenceId) {
      // Confirm delete
      onDelete?.(evidenceId);
      setDeleteConfirm(null);
      toast.success('Evidence deleted');
    } else {
      // First click - show confirmation
      setDeleteConfirm(evidenceId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  if (evidence.length === 0) {
    return (
      <div className="text-center py-12 glass rounded-xl">
        <File className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">No evidence files uploaded yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {evidence.map((item, index) => {
          const Icon = getFileIcon(item.fileType);
          const fileType = getFileType(item.fileType);
          const isDeleting = deleteConfirm === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl overflow-hidden group hover:border-primary/50 transition-all"
            >
              {/* Thumbnail/Preview */}
              <div 
                className="relative aspect-square bg-white/5 cursor-pointer overflow-hidden"
                onClick={() => handlePreview(index)}
              >
                {fileType === 'image' ? (
                  <img
                    src={getThumbnailUrl(item.publicId)}
                    alt={item.fileName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : fileType === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Video className="w-12 h-12 text-purple-300" />
                  </div>
                ) : fileType === 'pdf' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500/20 to-orange-500/20">
                    <FileText className="w-12 h-12 text-red-300" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <File className="w-12 h-12 text-blue-300" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* File Info */}
              <div className="p-3">
                <div className="flex items-start gap-2 mb-2">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={item.fileName}>
                      {item.fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(item.size)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {/* Preview */}
                  <button
                    onClick={() => handlePreview(index)}
                    className="flex-1 p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-1"
                    title="Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-xs">View</span>
                  </button>

                  {/* Download */}
                  <button
                    onClick={() => handleDownload(item)}
                    className="flex-1 p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-1"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-xs">Save</span>
                  </button>

                  {/* Delete */}
                  {!readOnly && onDelete && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`flex-1 p-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                        isDeleting
                          ? 'bg-red-500/20 text-red-400'
                          : 'hover:bg-red-500/10 text-red-400'
                      }`}
                      title={isDeleting ? 'Click again to confirm' : 'Delete'}
                    >
                      {isDeleting ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span className="text-xs">
                        {isDeleting ? 'Sure?' : 'Del'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Preview Modal */}
      <EvidencePreviewModal
        evidence={evidence}
        initialIndex={previewIndex}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default EvidenceGallery;