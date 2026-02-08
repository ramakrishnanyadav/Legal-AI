import { motion } from 'framer-motion';
import { Download, Printer, FileText, Globe } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';

interface FIRDocumentProps {
  documents: {
    english: string;
    hindi: string;
    marathi: string;
    sections_applied: string[];
    document_type: string;
    generated_date: string;
    instructions: string[];
  };
  caseDescription: string;
}

const FIRDocument = ({ documents, caseDescription }: FIRDocumentProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hindi' | 'marathi'>('english');

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = documents[selectedLanguage];
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>FIR Draft - ${selectedLanguage.toUpperCase()}</title>
          <style>
            @page {
              size: A4;
              margin: 1.5cm;
            }
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #000;
              background: white;
              margin: 0;
              padding: 20px;
            }
            .header {
              text-align: center;
              font-weight: bold;
              font-size: 16pt;
              margin-bottom: 20px;
              text-decoration: underline;
            }
            .section-title {
              font-weight: bold;
              margin-top: 15px;
              margin-bottom: 5px;
            }
            .signature-line {
              margin-top: 40px;
              border-top: 1px solid #000;
              width: 200px;
              padding-top: 5px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
            }
            @media print {
              body {
                margin: 0;
                padding: 15px;
              }
            }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDownload = () => {
    const content = documents[selectedLanguage];
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FIR_Draft_${selectedLanguage}_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">FIR Draft Documents</h3>
                <p className="text-sm text-gray-600">Ready to print and submit</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">3 Languages</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {documents.sections_applied.map((section, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-300"
              >
                {section}
              </span>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="p-6 border-yellow-200 bg-yellow-50/50">
          <h4 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
            ⚠️ Important Instructions
          </h4>
          <ul className="space-y-2">
            {documents.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-yellow-900">
                <span className="font-bold">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* Multi-language FIR Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="p-6">
          <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as any)}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="english" className="font-semibold">
                  🇬🇧 English
                </TabsTrigger>
                <TabsTrigger value="hindi" className="font-semibold">
                  🇮🇳 हिंदी
                </TabsTrigger>
                <TabsTrigger value="marathi" className="font-semibold">
                  🇮🇳 मराठी
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              </div>
            </div>

            <TabsContent value="english">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-inner" style={{ 
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)',
                minHeight: '800px'
              }}>
                <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-900">
                  {documents.english}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="hindi">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-inner" style={{ 
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)',
                minHeight: '800px'
              }}>
                <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-900">
                  {documents.hindi}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="marathi">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-inner" style={{ 
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)',
                minHeight: '800px'
              }}>
                <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-900">
                  {documents.marathi}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      {/* Tips for Submission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="p-6 border-green-200 bg-green-50/50">
          <h4 className="text-lg font-bold text-green-900 mb-3">✅ Submission Checklist</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="font-semibold text-gray-900 mb-1">Before Printing:</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Review all details carefully</li>
                <li>• Fill in [bracketed] information</li>
                <li>• Check dates and times</li>
                <li>• Verify police station address</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="font-semibold text-gray-900 mb-1">While Submitting:</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Take 2 printed copies</li>
                <li>• Sign both copies</li>
                <li>• Attach identity proof</li>
                <li>• Get acknowledgment receipt</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default FIRDocument;
