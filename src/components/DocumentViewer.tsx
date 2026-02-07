// src/components/DocumentViewer.tsx - Legal Document Viewer & Downloader

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Printer,
  Languages,
  CheckSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedDocuments {
  firDraft: {
    english: string;
    hindi: string;
    sections_applied: string[];
    document_type: string;
    generated_date: string;
    instructions: string[];
  };
  writtenComplaint: string;
  evidenceChecklist: {
    critical: Array<{
      item: string;
      examples: string[];
      obtained: boolean;
    }>;
    important: Array<{
      item: string;
      examples: string[];
      obtained: boolean;
    }>;
    helpful: Array<{
      item: string;
      examples: string[];
      obtained: boolean;
    }>;
  };
  instructions: string[];
}

interface DocumentViewerProps {
  documents: GeneratedDocuments;
}

const DocumentViewer = ({ documents }: DocumentViewerProps) => {
  const [expandedDoc, setExpandedDoc] = useState<string>('fir');
  const [copiedDoc, setCopiedDoc] = useState<string>('');
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');

  // ✅ Editable form state for Written Complaint
  const [complaintForm, setComplaintForm] = useState({
    date: new Date().toLocaleDateString(),
    policeStation: '',
    district: '',
    state: '',
    name: '',
    fatherName: '',
    age: '',
    occupation: '',
    address: '',
    mobile: '',
    email: '',
    subject: '',
    incidentDate: '',
    incidentTime: '',
    incidentPlace: '',
    description: '',
    accusedName: '',
    accusedAddress: '',
    witness1: '',
    witness1Contact: '',
    witness2: '',
    witness2Contact: '',
    reliefSought: '',
  });

  // ✅ Safe helpers to handle data inconsistencies
  const safeInstructions = Array.isArray(documents.instructions) ? documents.instructions : [];
  const safeSectionsApplied = (() => {
    const sections = documents.firDraft?.sections_applied;
    if (Array.isArray(sections)) {
      return sections;
    } else if (typeof sections === 'string' && (sections as string).length > 0) {
      return (sections as string).split(',').map((s: string) => s.trim());
    }
    return [];
  })();

  const toggleDoc = (docType: string) => {
    setExpandedDoc(expandedDoc === docType ? '' : docType);
  };

  const copyToClipboard = async (text: string, docName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDoc(docName);
      toast.success(`${docName} copied to clipboard!`);
      setTimeout(() => setCopiedDoc(''), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded!`);
  };

  /**
   * Download FIR as PDF using the new backend-integrated generator
   */
  const downloadFIRPDF = () => {
    try {
      // Import the PDF generator function dynamically
      import('@/lib/firPdfGenerator').then(({ generateFIRPDFFromBackend }) => {
        import('@/lib/logger').then(({ log }) => {
          try {
            // Get user info from auth context if available
            const userInfo = {
              name: '[Your Full Name]',
              email: '[Your Email]',
              phone: '[Your Phone]',
              address: '[Your Address]'
            };

            // Prepare case data
            const caseData = {
              description: documents.firDraft.english || documents.firDraft.hindi || '',
              sections: [], // Will be populated from sections_applied
            };

            // Generate PDF
            generateFIRPDFFromBackend(caseData, documents, userInfo);
            toast.success('FIR PDF generated successfully!');
          } catch (error) {
            log.error('Error generating FIR PDF', error, 'DocumentViewer');
            toast.error('Failed to generate PDF');
          }
        });
      });
    } catch (error) {
      console.error('Failed to load PDF generator module:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const printDocument = (content: string) => {
    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Document</title>');
      printWindow.document.write('<style>body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; } pre { white-space: pre-wrap; }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<pre>${content}</pre>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold mb-2">
          <span className="gradient-text">Legal Documents</span>
        </h2>
        <p className="text-muted-foreground mb-4">
          Download, print, or copy ready-to-file documents
        </p>

        {/* Instructions Alert */}
        {safeInstructions.length > 0 && (
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-blue-400 mb-2">Important Instructions</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {safeInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* FIR Draft */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <button
          onClick={() => toggleDoc('fir')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">FIR Draft</h3>
              <p className="text-sm text-muted-foreground">
                First Information Report - English & Hindi
              </p>
            </div>
          </div>
          {expandedDoc === 'fir' ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        <AnimatePresence>
          {expandedDoc === 'fir' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-6">
                {/* Print Notice */}
                <div className="mb-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-blue-400 mb-1">Fillable FIR Template</p>
                      <p className="text-sm text-muted-foreground">
                        This is a blank template. Print and fill your details at the police station.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Language Toggle */}
                <div className="flex items-center gap-2 mb-4">
                  <Languages className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground mr-2">Template Language:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLanguage('english')}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        language === 'english'
                          ? 'bg-primary text-white'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('hindi')}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        language === 'hindi'
                          ? 'bg-primary text-white'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      हिंदी (Hindi)
                    </button>
                  </div>
                </div>

                {/* Printable FIR Template */}
                <div className="mb-4 p-8 rounded-xl bg-white text-black max-h-[600px] overflow-y-auto print:shadow-none" id="fir-template">
                  {language === 'english' ? (
                    // English Template
                    <div className="space-y-4 text-sm">
                      <div className="text-center border-b-2 border-black pb-3">
                        <h2 className="text-xl font-bold">FIRST INFORMATION REPORT</h2>
                        <p className="text-xs">(Under Section 154 Cr.P.C.)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <p><strong>FIR No:</strong> __________________</p>
                        <p><strong>Date:</strong> __________________</p>
                      </div>

                      <div className="border border-black p-3">
                        <p className="font-bold mb-2">POLICE STATION DETAILS</p>
                        <p><strong>Police Station:</strong> _________________________________</p>
                        <p><strong>District:</strong> ________________________________________</p>
                        <p><strong>State:</strong> __________________________________________</p>
                      </div>

                      <div className="border border-black p-3">
                        <p className="font-bold mb-2">COMPLAINANT INFORMATION</p>
                        <p><strong>Name:</strong> ___________________________________________</p>
                        <p><strong>Father's/Husband's Name:</strong> ________________________</p>
                        <p><strong>Age:</strong> ____________________________________________</p>
                        <p><strong>Address:</strong> _________________________________________</p>
                        <p className="pl-4">_____________________________________________________</p>
                        <p><strong>Mobile:</strong> __________________________________________</p>
                        <p><strong>Email:</strong> ___________________________________________</p>
                      </div>

                      <div className="border border-black p-3">
                        <p className="font-bold mb-2">INCIDENT DETAILS</p>
                        <p><strong>Date of Occurrence:</strong> ______________________________</p>
                        <p><strong>Time:</strong> ____________________________________________</p>
                        <p><strong>Place:</strong> ___________________________________________</p>
                        <p className="pl-4">_____________________________________________________</p>
                      </div>

                      <div className="border border-black p-3">
                        <p className="font-bold mb-2">DESCRIPTION OF INCIDENT</p>
                        <div className="min-h-[150px] border border-gray-400 p-2">
                          {Array(6).fill('_').map((_, i) => (
                            <p key={i}>_________________________________________________________</p>
                          ))}
                        </div>
                      </div>

                      <div className="border border-black p-3">
                        <p className="font-bold mb-2">SECTIONS APPLIED (By Police)</p>
                        <p><strong>IPC Sections:</strong> {safeSectionsApplied.join(', ') || '____________________________'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mt-6">
                        <div>
                          <p className="mb-8">_______________________</p>
                          <p className="font-bold text-xs">Complainant Signature</p>
                        </div>
                        <div>
                          <p className="mb-8">_______________________</p>
                          <p className="font-bold text-xs">Police Officer Signature</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Hindi Template
                    <div className="space-y-4 text-sm">
                      <div className="text-center border-b-2 border-black pb-3">
                        <h2 className="text-xl font-bold">प्रथम सूचना रिपोर्ट</h2>
                        <p className="text-xs">(धारा 154 सी.आर.पी.सी. के अंतर्गत)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <p><strong>एफ.आई.आर. संख्या:</strong> __________________</p>
                        <p><strong>दिनांक:</strong> __________________</p>
                      </div>

                      <div className="border border-black p-3">
                        <p className="font-bold mb-2">पुलिस स्टेशन विवरण</p>
                        <p><strong>थाना:</strong> _________________________________</p>
                        <p><strong>जिला:</strong> ________________________________________</p>
                        <p><strong>राज्य:</strong> __________________________________________</p>
                      </div>

                      <div className="border border-black p-3">
                        <p className="font-bold mb-2">शिकायतकर्ता की जानकारी</p>
                        <p><strong>नाम:</strong> ___________________________________________</p>
                        <p><strong>पिता/पति का नाम:</strong> ________________________</p>
                        <p><strong>आयु:</strong> ____________________________________________</p>
                        <p><strong>पता:</strong> _________________________________________</p>
                        <p className="pl-4">_____________________________________________________</p>
                        <p><strong>मोबाइल:</strong> __________________________________________</p>
                        <p><strong>ईमेल:</strong> ___________________________________________</p>
                      </div>

                      <div className="border border-black p-3">
                        <p className="font-bold mb-2">घटना विवरण</p>
                        <p><strong>घटना की तारीख:</strong> ______________________________</p>
                        <p><strong>समय:</strong> ____________________________________________</p>
                        <p><strong>स्थान:</strong> ___________________________________________</p>
                        <p className="pl-4">_____________________________________________________</p>
                      </div>

                      <div className="border border-black p-3">
                        <p className="font-bold mb-2">घटना का विवरण</p>
                        <div className="min-h-[150px] border border-gray-400 p-2">
                          {Array(6).fill('_').map((_, i) => (
                            <p key={i}>_________________________________________________________</p>
                          ))}
                        </div>
                      </div>

                      <div className="border border-black p-3">
                        <p className="font-bold mb-2">लागू धाराएं (पुलिस द्वारा)</p>
                        <p><strong>आई.पी.सी. धाराएं:</strong> {safeSectionsApplied.join(', ') || '____________________________'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mt-6">
                        <div>
                          <p className="mb-8">_______________________</p>
                          <p className="font-bold text-xs">शिकायतकर्ता के हस्ताक्षर</p>
                        </div>
                        <div>
                          <p className="mb-8">_______________________</p>
                          <p className="font-bold text-xs">पुलिस अधिकारी के हस्ताक्षर</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const template = document.getElementById('fir-template');
                      if (template) {
                        const printWindow = window.open('', '', 'width=800,height=600');
                        if (printWindow) {
                          printWindow.document.write('<html><head><title>FIR Template</title>');
                          printWindow.document.write('<style>body{font-family:serif;padding:20px;}@media print{body{padding:10px;}}</style>');
                          printWindow.document.write('</head><body>');
                          printWindow.document.write(template.innerHTML);
                          printWindow.document.write('</body></html>');
                          printWindow.document.close();
                          printWindow.print();
                        }
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors text-white font-semibold"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="text-sm">Print Template</span>
                  </button>
                </div>

                {/* Metadata */}
                <div className="mt-4 p-4 rounded-xl bg-white/5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sections Applied</p>
                      <p className="font-semibold">{safeSectionsApplied.join(', ') || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Generated On</p>
                      <p className="font-semibold">
                        {documents.firDraft.generated_date 
                          ? new Date(documents.firDraft.generated_date).toLocaleString() 
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Written Complaint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <button
          onClick={() => toggleDoc('complaint')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Written Complaint</h3>
              <p className="text-sm text-muted-foreground">
                Formal complaint to Police Station
              </p>
            </div>
          </div>
          {expandedDoc === 'complaint' ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        <AnimatePresence>
          {expandedDoc === 'complaint' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-6">
                {/* Info Notice */}
                <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-green-400 mb-1">Editable Complaint Form</p>
                      <p className="text-sm text-muted-foreground">
                        Fill in the form below, then print the completed complaint.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Editable Form */}
                <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10 max-h-[400px] overflow-y-auto space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Police Station</label>
                      <input
                        type="text"
                        value={complaintForm.policeStation}
                        onChange={(e) => setComplaintForm({...complaintForm, policeStation: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter police station name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">District</label>
                      <input
                        type="text"
                        value={complaintForm.district}
                        onChange={(e) => setComplaintForm({...complaintForm, district: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="District"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Your Name</label>
                    <input
                      type="text"
                      value={complaintForm.name}
                      onChange={(e) => setComplaintForm({...complaintForm, name: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Father's/Husband's Name</label>
                      <input
                        type="text"
                        value={complaintForm.fatherName}
                        onChange={(e) => setComplaintForm({...complaintForm, fatherName: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Father's/Husband's name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Mobile Number</label>
                      <input
                        type="tel"
                        value={complaintForm.mobile}
                        onChange={(e) => setComplaintForm({...complaintForm, mobile: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Address</label>
                    <textarea
                      value={complaintForm.address}
                      onChange={(e) => setComplaintForm({...complaintForm, address: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={2}
                      placeholder="Your complete address"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Subject</label>
                    <input
                      type="text"
                      value={complaintForm.subject}
                      onChange={(e) => setComplaintForm({...complaintForm, subject: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Subject of complaint"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Incident Date</label>
                      <input
                        type="date"
                        value={complaintForm.incidentDate}
                        onChange={(e) => setComplaintForm({...complaintForm, incidentDate: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Time</label>
                      <input
                        type="time"
                        value={complaintForm.incidentTime}
                        onChange={(e) => setComplaintForm({...complaintForm, incidentTime: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Place</label>
                      <input
                        type="text"
                        value={complaintForm.incidentPlace}
                        onChange={(e) => setComplaintForm({...complaintForm, incidentPlace: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Location"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Description of Incident</label>
                    <textarea
                      value={complaintForm.description}
                      onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                      placeholder="Describe what happened in detail..."
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-4 p-6 rounded-xl bg-white text-black max-h-[400px] overflow-y-auto" id="complaint-preview">
                  <div className="space-y-2 text-sm">
                    <div className="text-right">
                      <p><strong>Date:</strong> {complaintForm.date}</p>
                    </div>

                    <div>
                      <p><strong>To,</strong></p>
                      <p><strong>The Station House Officer</strong></p>
                      <p>{complaintForm.policeStation || '_______________________'}</p>
                      <p>{complaintForm.district || '_______________________'}</p>
                    </div>

                    <div className="mt-3">
                      <p className="font-bold text-center underline">WRITTEN COMPLAINT</p>
                    </div>

                    <div className="border border-black p-2 mt-2">
                      <p className="font-bold text-xs">COMPLAINANT DETAILS</p>
                      <p className="text-xs"><strong>Name:</strong> {complaintForm.name || '__________________'}</p>
                      <p className="text-xs"><strong>Father's/Husband's Name:</strong> {complaintForm.fatherName || '__________________'}</p>
                      <p className="text-xs"><strong>Address:</strong> {complaintForm.address || '__________________'}</p>
                      <p className="text-xs"><strong>Mobile:</strong> {complaintForm.mobile || '__________________'}</p>
                    </div>

                    <div className="mt-2">
                      <p className="text-xs"><strong>SUBJECT:</strong> {complaintForm.subject || '__________________'}</p>
                    </div>

                    <div className="mt-2">
                      <p className="text-xs">Respected Sir/Madam,</p>
                      <p className="text-xs">I would like to bring to your attention the following incident:</p>
                    </div>

                    <div className="border border-black p-2 mt-2">
                      <p className="text-xs"><strong>Date:</strong> {complaintForm.incidentDate || '____'} <strong>Time:</strong> {complaintForm.incidentTime || '____'} <strong>Place:</strong> {complaintForm.incidentPlace || '____'}</p>
                    </div>

                    <div className="mt-2">
                      <p className="font-bold text-xs">DESCRIPTION:</p>
                      <p className="text-xs border border-gray-400 p-2 min-h-[80px] whitespace-pre-wrap">
                        {complaintForm.description || '[Your description will appear here]'}
                      </p>
                    </div>

                    <div className="border border-black p-2 mt-2">
                      <p className="font-bold text-xs">APPLICABLE SECTIONS: {safeSectionsApplied.join(', ')}</p>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs">Yours faithfully,</p>
                      <p className="mt-6 text-xs">_______________________</p>
                      <p className="text-xs font-bold">(Signature)</p>
                      <p className="text-xs">{complaintForm.name || '[Your Name]'}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const preview = document.getElementById('complaint-preview');
                      if (preview) {
                        const printWindow = window.open('', '', 'width=800,height=600');
                        if (printWindow) {
                          printWindow.document.write('<html><head><title>Written Complaint</title>');
                          printWindow.document.write('<style>body{font-family:serif;padding:20px;}</style>');
                          printWindow.document.write('</head><body>');
                          printWindow.document.write(preview.innerHTML);
                          printWindow.document.write('</body></html>');
                          printWindow.document.close();
                          printWindow.print();
                        }
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors text-white font-semibold"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="text-sm">Print Filled Complaint</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Evidence Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <button
          onClick={() => toggleDoc('checklist')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Evidence Checklist</h3>
              <p className="text-sm text-muted-foreground">
                What you need to collect
              </p>
            </div>
          </div>
          {expandedDoc === 'checklist' ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        <AnimatePresence>
          {expandedDoc === 'checklist' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-6 space-y-6">
                {/* Critical Evidence */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <h4 className="font-semibold text-red-400">Critical Evidence (Must Have)</h4>
                  </div>
                  <div className="space-y-3">
                    {documents.evidenceChecklist.critical.map((item, index) => (
                      <div key={index} className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                        <p className="font-semibold mb-2">{item.item}</p>
                        <p className="text-sm text-muted-foreground">
                          Examples: {item.examples.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Evidence */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <h4 className="font-semibold text-yellow-400">Important Evidence (Recommended)</h4>
                  </div>
                  <div className="space-y-3">
                    {documents.evidenceChecklist.important.map((item, index) => (
                      <div key={index} className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                        <p className="font-semibold mb-2">{item.item}</p>
                        <p className="text-sm text-muted-foreground">
                          Examples: {item.examples.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Helpful Evidence */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <h4 className="font-semibold text-blue-400">Helpful Evidence (If Available)</h4>
                  </div>
                  <div className="space-y-3">
                    {documents.evidenceChecklist.helpful.map((item, index) => (
                      <div key={index} className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                        <p className="font-semibold mb-2">{item.item}</p>
                        <p className="text-sm text-muted-foreground">
                          Examples: {item.examples.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DocumentViewer;