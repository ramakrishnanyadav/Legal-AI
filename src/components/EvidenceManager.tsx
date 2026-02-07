// src/components/EvidenceManager.tsx - Complete Evidence Management
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Grid3x3, List, Folder, Filter } from 'lucide-react';
import { UploadedEvidence } from '@/lib/storage';
import EvidenceUploader from './EvidenceUploader';
import EvidenceGallery from './EvidenceGallery';
import { toast } from 'sonner';

interface EvidenceManagerProps {
  caseId: string;
  existingEvidence?: UploadedEvidence[];
  onUpdate?: (evidence: UploadedEvidence[]) => void;
  readOnly?: boolean;
}

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'images' | 'videos' | 'documents';

const EvidenceManager = ({ 
  caseId, 
  existingEvidence = [], 
  onUpdate,
  readOnly = false 
}: EvidenceManagerProps) => {
  const [evidence, setEvidence] = useState<UploadedEvidence[]>(existingEvidence);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    setEvidence(existingEvidence);
  }, [existingEvidence]);

  const handleUploadComplete = async (newFiles: UploadedEvidence[]) => {
    const updatedEvidence = [...evidence, ...newFiles];
    setEvidence(updatedEvidence);
    setShowUploader(false);
    
    // Call parent update
    if (onUpdate) {
      onUpdate(updatedEvidence);
    }

    // Save to Firestore
    try {
      const { addEvidenceToCase } = await import('@/lib/storage');
      await addEvidenceToCase(caseId, newFiles);
      toast.success('Evidence saved successfully');
    } catch (error) {
      console.error('Error saving evidence:', error);
      toast.error('Failed to save evidence');
    }
  };

  const handleDelete = async (evidenceId: string) => {
    const updatedEvidence = evidence.filter(e => e.id !== evidenceId);
    setEvidence(updatedEvidence);
    
    if (onUpdate) {
      onUpdate(updatedEvidence);
    }

    // Update Firestore
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      await updateDoc(doc(db, 'cases', caseId), {
        evidenceFiles: updatedEvidence,
      });
    } catch (error) {
      console.error('Error deleting evidence:', error);
      toast.error('Failed to delete evidence');
    }
  };

  const getFilteredEvidence = () => {
    switch (filter) {
      case 'images':
        return evidence.filter(e => e.fileType.startsWith('image/'));
      case 'videos':
        return evidence.filter(e => e.fileType.startsWith('video/'));
      case 'documents':
        return evidence.filter(e => e.fileType === 'application/pdf' || e.fileType.includes('document'));
      default:
        return evidence;
    }
  };

  const filteredEvidence = getFilteredEvidence();

  const stats = {
    total: evidence.length,
    images: evidence.filter(e => e.fileType.startsWith('image/')).length,
    videos: evidence.filter(e => e.fileType.startsWith('video/')).length,
    documents: evidence.filter(e => e.fileType === 'application/pdf' || e.fileType.includes('document')).length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Folder className="w-5 h-5 text-primary" />
            Evidence Files
          </h3>
          <p className="text-sm text-muted-foreground">
            {stats.total} file{stats.total !== 1 ? 's' : ''} uploaded
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg glass">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-white/10'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-white/10'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Button */}
          {!readOnly && (
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Upload</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'All', value: stats.total, filter: 'all' as FilterType },
          { label: 'Images', value: stats.images, filter: 'images' as FilterType },
          { label: 'Videos', value: stats.videos, filter: 'videos' as FilterType },
          { label: 'Docs', value: stats.documents, filter: 'documents' as FilterType },
        ].map((stat) => (
          <button
            key={stat.filter}
            onClick={() => setFilter(stat.filter)}
            className={`p-3 rounded-xl transition-all ${
              filter === stat.filter
                ? 'glass border border-primary bg-primary/10'
                : 'glass hover:bg-white/5'
            }`}
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Uploader */}
      <AnimatePresence>
        {showUploader && !readOnly && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <EvidenceUploader onUploadComplete={handleUploadComplete} maxFiles={5} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery */}
      <EvidenceGallery
        evidence={filteredEvidence}
        onDelete={!readOnly ? handleDelete : undefined}
        readOnly={readOnly}
      />
    </div>
  );
};

export default EvidenceManager;