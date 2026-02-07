// src/components/FIRTemplatePreview.tsx - UPDATED VERSION
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Edit3, 
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Clock,
  Scale,
  FileDown
} from 'lucide-react';
import GlassCard from './GlassCard';
import { FIRData } from '../lib/storage';
import { generateFIRPDF } from '../lib/firPdfGenerator'; // 🆕 Import PDF generator
import { toast } from 'sonner'; // 🆕 Import toast

interface FIRTemplateProps {
  userDescription: string;
  primarySection: {
    code: string;
    name: string;
  };
  relatedSections?: { code: string; name: string }[];
  caseType?: string;
  onUpdate?: (firData: FIRData) => void;
}

const easeOut = [0.25, 0.46, 0.45, 0.94];

declare global {
  interface Window {
    firSaveTimeout?: number;
  }
}

// EditableField component (unchanged)
const EditableField = ({ 
  label, 
  value, 
  field, 
  icon: Icon,
  multiline = false,
  editMode,
  onInputChange
}: { 
  label: string; 
  value: string; 
  field: string; 
  icon: React.ElementType;
  multiline?: boolean;
  editMode: boolean;
  onInputChange: (field: string, value: string) => void;
}) => (
  <div className="space-y-1">
    <label className="text-xs text-muted-foreground flex items-center gap-1">
      <Icon className="w-3 h-3" />
      {label}
    </label>
    {editMode ? (
      multiline ? (
        <textarea
          value={value}
          onChange={(e) => onInputChange(field, e.target.value)}
          className="w-full p-2 rounded-lg bg-white/5 border border-primary/30 text-foreground text-sm focus:outline-none focus:border-primary resize-none"
          rows={3}
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onInputChange(field, e.target.value)}
          className="w-full p-2 rounded-lg bg-white/5 border border-primary/30 text-foreground text-sm focus:outline-none focus:border-primary"
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      )
    ) : (
      <p className={`text-sm ${value ? 'text-foreground' : 'text-muted-foreground italic'}`}>
        {value || `[${label} - click Edit to fill]`}
      </p>
    )}
  </div>
);

const FIRTemplatePreview = ({ 
  userDescription, 
  primarySection,
  relatedSections = [],
  caseType = 'Criminal',
  onUpdate
}: FIRTemplateProps) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    complainantName: '',
    complainantAddress: '',
    complainantPhone: '',
    complainantEmail: '',
    incidentDate: '',
    incidentTime: '',
    incidentPlace: '',
    description: userDescription,
    accusedDetails: '',
    witnessDetails: '',
  });

  const currentDate = new Date().toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  const handleInputChange = (field: string, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    
    if (onUpdate) {
      if (window.firSaveTimeout) {
        clearTimeout(window.firSaveTimeout);
      }
      
      window.firSaveTimeout = window.setTimeout(() => {
        const firData: FIRData = {
          complainantName: updatedFormData.complainantName,
          complainantAddress: updatedFormData.complainantAddress,
          complainantPhone: updatedFormData.complainantPhone,
          complainantEmail: updatedFormData.complainantEmail,
          incidentDate: updatedFormData.incidentDate,
          incidentTime: updatedFormData.incidentTime,
          incidentPlace: updatedFormData.incidentPlace,
          accusedDetails: updatedFormData.accusedDetails,
          witnessDetails: updatedFormData.witnessDetails,
          description: updatedFormData.description,
          primarySection: {
            code: primarySection.code,
            name: primarySection.name,
          },
          relatedSections: relatedSections,
          generatedDate: currentDate,
        };
        onUpdate(firData);
        console.log('✅ FIR auto-saved');
      }, 1000);
    }
  };

  const handleEditModeSave = () => {
    if (editMode && onUpdate) {
      const firData: FIRData = {
        complainantName: formData.complainantName,
        complainantAddress: formData.complainantAddress,
        complainantPhone: formData.complainantPhone,
        complainantEmail: formData.complainantEmail,
        incidentDate: formData.incidentDate,
        incidentTime: formData.incidentTime,
        incidentPlace: formData.incidentPlace,
        accusedDetails: formData.accusedDetails,
        witnessDetails: formData.witnessDetails,
        description: formData.description,
        primarySection: {
          code: primarySection.code,
          name: primarySection.name,
        },
        relatedSections: relatedSections,
        generatedDate: currentDate,
      };
      onUpdate(firData);
      console.log('✅ FIR saved on close');
    }
    setEditMode(!editMode);
  };

  const allSections = [primarySection, ...relatedSections];
  const sectionsText = allSections.map(s => `${s.code} (${s.name})`).join(', ');

  // 🆕 NEW: Generate FIR data object for PDF
  const getFIRData = (): FIRData => {
    return {
      complainantName: formData.complainantName,
      complainantAddress: formData.complainantAddress,
      complainantPhone: formData.complainantPhone,
      complainantEmail: formData.complainantEmail,
      incidentDate: formData.incidentDate,
      incidentTime: formData.incidentTime,
      incidentPlace: formData.incidentPlace,
      accusedDetails: formData.accusedDetails,
      witnessDetails: formData.witnessDetails,
      description: formData.description,
      primarySection: {
        code: primarySection.code,
        name: primarySection.name,
      },
      relatedSections: relatedSections,
      generatedDate: currentDate,
    };
  };

  // 🆕 NEW: Handle PDF Download
  const handleDownloadPDF = () => {
    try {
      const firData = getFIRData();
      generateFIRPDF(firData);
      toast.success('FIR PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  // Existing TXT download function (keep as is)
  const generateDownloadContent = () => {
    return `
================================================================================
                    FIRST INFORMATION REPORT (F.I.R.)
                         (Under Section 154 Cr.P.C.)
================================================================================

DRAFT TEMPLATE - FOR REFERENCE ONLY
Date Generated: ${currentDate}

--------------------------------------------------------------------------------
SECTION I: COMPLAINANT DETAILS
--------------------------------------------------------------------------------

Name:           ${formData.complainantName || '[To be filled]'}
Address:        ${formData.complainantAddress || '[To be filled]'}
Contact:        ${formData.complainantPhone || '[To be filled]'}
Email:          ${formData.complainantEmail || '[To be filled]'}

--------------------------------------------------------------------------------
SECTION II: INCIDENT DETAILS
--------------------------------------------------------------------------------

Date of Incident:    ${formData.incidentDate || '[To be filled]'}
Time of Incident:    ${formData.incidentTime || '[To be filled]'}
Place of Incident:   ${formData.incidentPlace || '[To be filled]'}

--------------------------------------------------------------------------------
SECTION III: APPLICABLE LEGAL SECTIONS
--------------------------------------------------------------------------------

${sectionsText}

--------------------------------------------------------------------------------
SECTION IV: DESCRIPTION OF INCIDENT
--------------------------------------------------------------------------------

${formData.description || userDescription}

--------------------------------------------------------------------------------
SECTION V: ACCUSED DETAILS (If Known)
--------------------------------------------------------------------------------

${formData.accusedDetails || '[To be filled if known]'}

--------------------------------------------------------------------------------
SECTION VI: WITNESS DETAILS (If Any)
--------------------------------------------------------------------------------

${formData.witnessDetails || '[To be filled if applicable]'}

--------------------------------------------------------------------------------

                         SIGNATURE OF COMPLAINANT


                    _______________________________


================================================================================
DISCLAIMER: This is a sample template generated for informational purposes only.
The actual FIR format may vary by state and police station. Please verify all
details with the concerned police station before submission.

Generated by LegalAI - Not an official document
================================================================================
`;
  };

  const handleDownloadTXT = () => {
    const content = generateDownloadContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fir-draft-template-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('FIR text file downloaded!');
  };

  return (
    <GlassCard className="mt-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Draft FIR Template
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pre-filled based on your situation assessment
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleEditModeSave}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                editMode 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white/5 text-foreground hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit3 className="w-4 h-4" />
              {editMode ? 'Save & Close' : 'Edit Fields'}
            </motion.button>

            {/* 🆕 NEW: PDF Download Button */}
            <motion.button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileDown className="w-4 h-4" />
              PDF
            </motion.button>

            {/* Existing TXT Download */}
            <motion.button
              onClick={handleDownloadTXT}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              TXT
            </motion.button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-400">
            <strong>Sample Only:</strong> This is a reference template. The actual FIR format varies by police station. 
            Verify all details with the concerned authority before submission.
          </p>
        </div>

        {/* Template Preview - REST OF THE CODE REMAINS SAME */}
        <div 
          className="p-4 rounded-lg border border-border"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)',
            fontFamily: 'serif'
          }}
        >
          {/* Title */}
          <div className="text-center border-b border-border pb-4 mb-4">
            <h4 className="text-lg font-bold tracking-wide">FIRST INFORMATION REPORT</h4>
            <p className="text-xs text-muted-foreground mt-1">(Under Section 154 Cr.P.C.)</p>
            <p className="text-xs text-muted-foreground">Draft Date: {currentDate}</p>
          </div>

          {/* Complainant Section */}
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              COMPLAINANT DETAILS
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
              <EditableField 
                label="Full Name" 
                value={formData.complainantName} 
                field="complainantName"
                icon={User}
                editMode={editMode}
                onInputChange={handleInputChange}
              />
              <EditableField 
                label="Contact Number" 
                value={formData.complainantPhone} 
                field="complainantPhone"
                icon={User}
                editMode={editMode}
                onInputChange={handleInputChange}
              />
              <EditableField 
                label="Email Address" 
                value={formData.complainantEmail} 
                field="complainantEmail"
                icon={User}
                editMode={editMode}
                onInputChange={handleInputChange}
              />
              <div className="md:col-span-2">
                <EditableField 
                  label="Address" 
                  value={formData.complainantAddress} 
                  field="complainantAddress"
                  icon={MapPin}
                  editMode={editMode}
                  onInputChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Incident Section */}
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              INCIDENT DETAILS
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-4">
              <EditableField 
                label="Date of Incident" 
                value={formData.incidentDate} 
                field="incidentDate"
                icon={Calendar}
                editMode={editMode}
                onInputChange={handleInputChange}
              />
              <EditableField 
                label="Time (Approx.)" 
                value={formData.incidentTime} 
                field="incidentTime"
                icon={Clock}
                editMode={editMode}
                onInputChange={handleInputChange}
              />
              <EditableField 
                label="Place of Incident" 
                value={formData.incidentPlace} 
                field="incidentPlace"
                icon={MapPin}
                editMode={editMode}
                onInputChange={handleInputChange}
              />
            </div>
          </div>

          {/* Legal Sections */}
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              APPLICABLE LEGAL SECTIONS
            </h5>
            <div className="pl-4">
              <div className="flex flex-wrap gap-2">
                {allSections.map((section) => (
                  <span 
                    key={section.code}
                    className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-mono"
                  >
                    {section.code} - {section.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              DESCRIPTION OF INCIDENT
            </h5>
            <div className="pl-4">
              <EditableField 
                label="Detailed Description" 
                value={formData.description} 
                field="description"
                icon={FileText}
                multiline
                editMode={editMode}
                onInputChange={handleInputChange}
              />
            </div>
          </div>

          {/* Accused & Witness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-semibold text-primary mb-3">ACCUSED DETAILS</h5>
              <div className="pl-4">
                <EditableField 
                  label="Accused Information (if known)" 
                  value={formData.accusedDetails} 
                  field="accusedDetails"
                  icon={User}
                  multiline
                  editMode={editMode}
                  onInputChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-primary mb-3">WITNESS DETAILS</h5>
              <div className="pl-4">
                <EditableField 
                  label="Witness Information (if any)" 
                  value={formData.witnessDetails} 
                  field="witnessDetails"
                  icon={User}
                  multiline
                  editMode={editMode}
                  onInputChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Signature Area */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground mb-4">SIGNATURE OF COMPLAINANT</p>
            <div className="w-48 mx-auto border-b border-muted-foreground/30 pb-1">
              <p className="text-xs text-muted-foreground italic">[To be signed at police station]</p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center">
          This template is generated for informational purposes. 
          The actual FIR will be drafted by the police based on your verbal/written complaint.
        </p>
      </div>
    </GlassCard>
  );
};

export default FIRTemplatePreview;