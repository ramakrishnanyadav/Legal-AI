// src/components/EvidencePreviewModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { UploadedEvidence } from '@/lib/storage';

interface EvidencePreviewModalProps {
  evidence: UploadedEvidence[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const EvidencePreviewModal = ({ evidence, initialIndex, isOpen, onClose }: EvidencePreviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  const currentEvidence = evidence[currentIndex];

  const getFileType = (fileType: string) => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType === 'application/pdf') return 'pdf';
    return 'other';
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setZoom(1);
    }
  };

  const handleNext = () => {
    if (currentIndex < evidence.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setZoom(1);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentEvidence.cloudinaryUrl;
    link.download = currentEvidence.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  if (!isOpen || !currentEvidence) return null;

  const fileType = getFileType(currentEvidence.fileType);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={onClose}
        >
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 glass rounded-t-2xl">
              <div className="flex-1">
                <h3 className="font-semibold truncate">{currentEvidence.fileName}</h3>
                <p className="text-xs text-muted-foreground">
                  {currentIndex + 1} of {evidence.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls (for images) */}
                {fileType === 'image' && (
                  <>
                    <button
                      onClick={handleZoomOut}
                      disabled={zoom <= 0.5}
                      className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoom >= 3}
                      className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-2" />
                  </>
                )}

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 glass rounded-b-2xl overflow-hidden flex items-center justify-center relative">
              {/* Navigation Arrows */}
              {evidence.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="absolute left-4 z-10 p-3 rounded-full glass hover:bg-white/10 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === evidence.length - 1}
                    className="absolute right-4 z-10 p-3 rounded-full glass hover:bg-white/10 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* File Preview */}
              <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                {fileType === 'image' && (
                  <motion.img
                    key={currentEvidence.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: zoom }}
                    src={currentEvidence.cloudinaryUrl}
                    alt={currentEvidence.fileName}
                    className="max-w-full max-h-full object-contain transition-transform"
                    style={{ transformOrigin: 'center' }}
                  />
                )}

                {fileType === 'video' && (
                  <motion.video
                    key={currentEvidence.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={currentEvidence.cloudinaryUrl}
                    controls
                    className="max-w-full max-h-full rounded-lg"
                  />
                )}

                {fileType === 'pdf' && (
                  <iframe
                    src={`${currentEvidence.cloudinaryUrl}#toolbar=1`}
                    className="w-full h-full rounded-lg"
                    title={currentEvidence.fileName}
                  />
                )}

                {fileType === 'other' && (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Preview not available for this file type
                    </p>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Download File
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {evidence.length > 1 && (
              <div className="mt-2 p-2 glass rounded-xl">
                <div className="flex gap-2 overflow-x-auto">
                  {evidence.map((item, index) => {
                    const itemType = getFileType(item.fileType);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentIndex(index);
                          setZoom(1);
                        }}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentIndex
                            ? 'border-primary scale-110'
                            : 'border-transparent hover:border-white/30'
                        }`}
                      >
                        {itemType === 'image' ? (
                          <img
                            src={item.cloudinaryUrl}
                            alt={item.fileName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/10 flex items-center justify-center text-xs">
                            {itemType.toUpperCase()}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EvidencePreviewModal;