import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Square, 
  Download, 
  Share2, 
  Camera, 
  FileText, 
  Users, 
  Receipt, 
  Video,
  Mail,
  MessageCircle,
  Smartphone,
  HardDrive,
  MapPin,
  Clock
} from 'lucide-react';
import GlassCard from './GlassCard';
import { EvidenceChecklistData } from '../lib/storage'; // 🆕 Import type
import { removeUndefined } from '../lib/firestoreUtils';

interface EvidenceItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: 'document' | 'digital' | 'physical' | 'witness';
  description: string;
}

interface EvidenceChecklistProps {
  crimeType: string;
  onClose?: () => void;
  onUpdate?: (checklistData: EvidenceChecklistData) => void; // 🆕 Add onUpdate prop
}

const easeOut = [0.25, 0.46, 0.45, 0.94];

// Evidence items based on crime type
const getEvidenceItems = (crimeType: string): EvidenceItem[] => {
  const baseItems: EvidenceItem[] = [
    { id: 'timeline', label: 'Incident Timeline', icon: <Clock className="w-4 h-4" />, category: 'document', description: 'Detailed timeline of events with dates and times' },
    { id: 'location', label: 'Location Details', icon: <MapPin className="w-4 h-4" />, category: 'physical', description: 'Address, landmarks, and location photos' },
  ];

  const crimeSpecificItems: Record<string, EvidenceItem[]> = {
    theft: [
      { id: 'cctv', label: 'CCTV Footage', icon: <Video className="w-4 h-4" />, category: 'digital', description: 'Security camera recordings from the incident location' },
      { id: 'receipts', label: 'Purchase Receipts', icon: <Receipt className="w-4 h-4" />, category: 'document', description: 'Original purchase bills proving ownership' },
      { id: 'witnesses', label: 'Witness Information', icon: <Users className="w-4 h-4" />, category: 'witness', description: 'Names and contact details of witnesses' },
      { id: 'photos', label: 'Photos of Items', icon: <Camera className="w-4 h-4" />, category: 'physical', description: 'Images of stolen items for identification' },
      { id: 'serial', label: 'Serial Numbers', icon: <FileText className="w-4 h-4" />, category: 'document', description: 'Device serial numbers, IMEI for phones' },
    ],
    fraud: [
      { id: 'bank', label: 'Bank Statements', icon: <FileText className="w-4 h-4" />, category: 'document', description: 'Transaction records showing fraudulent transfers' },
      { id: 'contracts', label: 'Contracts/Agreements', icon: <FileText className="w-4 h-4" />, category: 'document', description: 'Signed documents related to the fraud' },
      { id: 'messages', label: 'Communication Records', icon: <MessageCircle className="w-4 h-4" />, category: 'digital', description: 'WhatsApp, SMS, email communications' },
      { id: 'id_proof', label: 'Identity Documents', icon: <FileText className="w-4 h-4" />, category: 'document', description: 'Copies of IDs shared during transaction' },
      { id: 'screenshots', label: 'Transaction Screenshots', icon: <Smartphone className="w-4 h-4" />, category: 'digital', description: 'Screenshots of payment confirmations, UPI' },
    ],
    cyber: [
      { id: 'screenshots', label: 'Screenshots', icon: <Smartphone className="w-4 h-4" />, category: 'digital', description: 'Screenshots of fraudulent messages, websites' },
      { id: 'emails', label: 'Suspicious Emails', icon: <Mail className="w-4 h-4" />, category: 'digital', description: 'Original emails with headers preserved' },
      { id: 'urls', label: 'URLs/Website Links', icon: <FileText className="w-4 h-4" />, category: 'digital', description: 'Links to fraudulent websites or profiles' },
      { id: 'device', label: 'Device Information', icon: <HardDrive className="w-4 h-4" />, category: 'digital', description: 'Device used, IP addresses if available' },
      { id: 'transactions', label: 'Payment Records', icon: <Receipt className="w-4 h-4" />, category: 'document', description: 'UPI, bank transfer confirmations' },
    ],
    assault: [
      { id: 'medical', label: 'Medical Reports', icon: <FileText className="w-4 h-4" />, category: 'document', description: 'Injury certificates, hospital records' },
      { id: 'photos_injury', label: 'Injury Photographs', icon: <Camera className="w-4 h-4" />, category: 'physical', description: 'Date-stamped photos of injuries' },
      { id: 'witnesses', label: 'Eyewitness Details', icon: <Users className="w-4 h-4" />, category: 'witness', description: 'Names and statements of witnesses' },
      { id: 'cctv', label: 'CCTV/Video Evidence', icon: <Video className="w-4 h-4" />, category: 'digital', description: 'Any recorded footage of incident' },
      { id: 'weapon', label: 'Weapon Details', icon: <FileText className="w-4 h-4" />, category: 'physical', description: 'Description or photos of weapon used' },
    ],
    default: [
      { id: 'documents', label: 'Relevant Documents', icon: <FileText className="w-4 h-4" />, category: 'document', description: 'Any documents related to the incident' },
      { id: 'photos', label: 'Photographs', icon: <Camera className="w-4 h-4" />, category: 'physical', description: 'Photos of the incident scene or evidence' },
      { id: 'witnesses', label: 'Witness Information', icon: <Users className="w-4 h-4" />, category: 'witness', description: 'Contact details of any witnesses' },
      { id: 'communications', label: 'Communications', icon: <MessageCircle className="w-4 h-4" />, category: 'digital', description: 'Messages, emails, call records' },
    ],
  };

  const typeKey = crimeType.toLowerCase().includes('theft') ? 'theft' 
    : crimeType.toLowerCase().includes('fraud') || crimeType.toLowerCase().includes('cheat') ? 'fraud'
    : crimeType.toLowerCase().includes('cyber') ? 'cyber'
    : crimeType.toLowerCase().includes('assault') || crimeType.toLowerCase().includes('hurt') ? 'assault'
    : 'default';

  return [...baseItems, ...(crimeSpecificItems[typeKey] || crimeSpecificItems.default)];
};

const categoryColors = {
  document: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  digital: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  physical: 'bg-green-500/20 text-green-400 border-green-500/30',
  witness: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const categoryLabels = {
  document: 'Documents',
  digital: 'Digital Evidence',
  physical: 'Physical Evidence',
  witness: 'Witness Information',
};

const EvidenceChecklist = ({ 
  crimeType,
  onUpdate // 🆕 Receive onUpdate prop
}: EvidenceChecklistProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showShareMenu, setShowShareMenu] = useState(false);
  const evidenceItems = getEvidenceItems(crimeType);

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('evidenceChecklist');
    if (saved) {
      try {
        setCheckedItems(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to load checklist:', e);
      }
    }
  }, []);

  // 🆕 MODIFIED: Save to both localStorage AND Firestore
  useEffect(() => {
    // Save to localStorage (existing)
    localStorage.setItem('evidenceChecklist', JSON.stringify([...checkedItems]));
    
    // Also save to Firestore (NEW)
    if (onUpdate) {
      const progress = (checkedItems.size / evidenceItems.length) * 100;
      
      const checklistData: EvidenceChecklistData = {
        items: evidenceItems.map(item => ({
          id: item.id,
          label: item.label,
          category: item.category,
          description: item.description,
          isChecked: checkedItems.has(item.id),
        })),
        checkedItemIds: Array.from(checkedItems),
        completionPercentage: Math.round(progress),
        lastUpdated: new Date().toISOString(),
      };
      
      onUpdate(checklistData);
    }
  }, [checkedItems, evidenceItems, onUpdate]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const progress = (checkedItems.size / evidenceItems.length) * 100;

  const generatePDFContent = () => {
    const content = `
EVIDENCE PRESERVATION CHECKLIST
================================
Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
Case Type: ${crimeType}

CHECKLIST ITEMS:
${evidenceItems.map(item => 
  `${checkedItems.has(item.id) ? '☑' : '☐'} ${item.label}
   ${item.description}
`).join('\n')}

COMPLETION: ${checkedItems.size} of ${evidenceItems.length} items (${Math.round(progress)}%)

---
IMPORTANT: This is a general guideline. Consult a legal professional for case-specific advice.
Generated by LegalRights.ai - For informational purposes only.
    `;
    return content;
  };

  const handleDownload = () => {
    const content = generatePDFContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidence-checklist-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = (method: 'whatsapp' | 'email') => {
    const content = generatePDFContent();
    const encodedContent = encodeURIComponent(content);
    
    if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodedContent}`, '_blank');
    } else {
      window.open(`mailto:?subject=Evidence Checklist&body=${encodedContent}`, '_blank');
    }
    setShowShareMenu(false);
  };

  // Group by category
  const groupedItems = evidenceItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, EvidenceItem[]>);

  return (
    <GlassCard className="mt-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Evidence You Should Preserve
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Gather these items before filing your complaint
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>

            <div className="relative">
              <motion.button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-foreground text-sm hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>

              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-10"
                  >
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 w-full text-left text-sm"
                    >
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 w-full text-left text-sm"
                    >
                      <Mail className="w-4 h-4 text-blue-500" />
                      Email
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{checkedItems.size} of {evidenceItems.length} items collected</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: easeOut }}
            />
          </div>
        </div>

        {/* Grouped checklist */}
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs border ${categoryColors[category as keyof typeof categoryColors]}`}>
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </span>
              </div>
              
              <div className="space-y-2">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      checkedItems.has(item.id) 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-white/5 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {checkedItems.has(item.id) ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-primary"
                        >
                          <CheckSquare className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{item.icon}</span>
                        <span className={`font-medium ${checkedItems.has(item.id) ? 'text-primary' : 'text-foreground'}`}>
                          {item.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-yellow-400">
            <strong>Tip:</strong> Preserve original documents. Make copies for submission and keep originals safely.
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

export default EvidenceChecklist;