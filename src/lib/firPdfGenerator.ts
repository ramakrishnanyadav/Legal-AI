// src/lib/firPdfGenerator.ts
import jsPDF from 'jspdf';
import { FIRData } from './storage';

export const generateFIRPDF = (firData: FIRData) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 20;

  // Helper: Add text with auto-pagination
  const addText = (
    text: string, 
    size: number = 10, 
    style: 'normal' | 'bold' = 'normal',
    align: 'left' | 'center' = 'left'
  ) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    
    if (align === 'center') {
      doc.text(text, pageWidth / 2, y, { align: 'center' });
    } else {
      doc.text(text, margin, y);
    }
    y += size / 2 + 3;
    checkPageBreak();
  };

  // Helper: Add wrapped text
  const addWrappedText = (text: string, maxWidth: number = pageWidth - 2 * margin) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 5;
      checkPageBreak();
    });
  };

  // Helper: Check if new page needed
  const checkPageBreak = () => {
    if (y > pageHeight - 30) {
      doc.addPage();
      y = 20;
    }
  };

  // Helper: Add section divider
  const addDivider = () => {
    y += 3;
    doc.setDrawColor(100, 100, 100);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  // Helper: Add field
  const addField = (label: string, value: string, icon: string = '•') => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text(`${icon} ${label}:`, margin, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const labelWidth = doc.getTextWidth(`${icon} ${label}: `);
    
    const valueText = value || '[Not provided]';
    const lines = doc.splitTextToSize(valueText, pageWidth - margin * 2 - labelWidth);
    
    lines.forEach((line: string, index: number) => {
      if (index === 0) {
        doc.text(line, margin + labelWidth, y);
      } else {
        y += 5;
        checkPageBreak();
        doc.text(line, margin + labelWidth, y);
      }
    });
    
    y += 7;
    checkPageBreak();
  };

  // ==========================================
  // START BUILDING PDF
  // ==========================================

  // Header
  doc.setFillColor(10, 14, 39);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FIRST INFORMATION REPORT', pageWidth / 2, 15, { align: 'center' });
  
  y = 35;
  
  // Subtitle
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  addText('(Under Section 154 Cr.P.C.)', 10, 'normal', 'center');
  addText(`Draft Date: ${firData.generatedDate}`, 9, 'normal', 'center');
  
  y += 5;
  addDivider();

  // Warning box
  doc.setFillColor(255, 248, 220);
  doc.setDrawColor(255, 193, 7);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 15, 2, 2, 'FD');
  
  doc.setFontSize(8);
  doc.setTextColor(139, 69, 19);
  y += 6;
  doc.text('⚠ SAMPLE ONLY: This is a reference template. Actual FIR format varies by police station.', margin + 5, y);
  y += 5;
  doc.text('Verify all details with the concerned authority before submission.', margin + 5, y);
  
  y += 12;
  doc.setTextColor(0, 0, 0);

  // ====================
  // COMPLAINANT DETAILS
  // ====================
  addText('📋 COMPLAINANT DETAILS', 12, 'bold');
  y += 2;
  
  addField('Full Name', firData.complainantName, '👤');
  addField('Contact Number', firData.complainantPhone, '📞');
  addField('Email Address', firData.complainantEmail, '📧');
  addField('Address', firData.complainantAddress, '📍');
  
  addDivider();

  // ====================
  // INCIDENT DETAILS
  // ====================
  addText('📅 INCIDENT DETAILS', 12, 'bold');
  y += 2;
  
  addField('Date of Incident', firData.incidentDate, '📆');
  addField('Time (Approx.)', firData.incidentTime, '⏰');
  addField('Place of Incident', firData.incidentPlace, '📍');
  
  addDivider();

  // ====================
  // DESCRIPTION
  // ====================
  addText('📝 DESCRIPTION OF INCIDENT', 12, 'bold');
  y += 2;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('• Detailed Description:', margin, y);
  y += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  addWrappedText(firData.description || '[No description provided]');
  
  addDivider();

  // ====================
  // APPLICABLE SECTIONS
  // ====================
  addText('⚖️ APPLICABLE LEGAL SECTIONS', 12, 'bold');
  y += 2;
  
  // Primary Section
  doc.setFillColor(0, 119, 255, 0.1);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 18, 2, 2, 'F');
  
  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 119, 255);
  doc.text(`${firData.primarySection.code}`, margin + 5, y);
  
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text(firData.primarySection.name, margin + 5, y);
  
  y += 5;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Indian Penal Code', margin + 5, y);
  
  y += 10;

  // Related Sections
  if (firData.relatedSections && firData.relatedSections.length > 0) {
    y += 3;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Related Sections:', margin, y);
    y += 7;
    
    firData.relatedSections.forEach((section) => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${section.code}`, margin + 5, y);
      
      doc.setFont('helvetica', 'normal');
      const nameWidth = doc.getTextWidth(`• ${section.code} `);
      doc.text(`- ${section.name}`, margin + 5 + nameWidth, y);
      y += 6;
      checkPageBreak();
    });
  }
  
  addDivider();

  // ====================
  // ACCUSED DETAILS
  // ====================
  addText('🎭 ACCUSED DETAILS', 12, 'bold');
  y += 2;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  addWrappedText(
    firData.accusedDetails || '[Accused information to be provided if known]'
  );
  
  addDivider();

  // ====================
  // WITNESS DETAILS
  // ====================
  addText('👥 WITNESS DETAILS', 12, 'bold');
  y += 2;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  addWrappedText(
    firData.witnessDetails || '[Witness information to be provided if any]'
  );
  
  addDivider();

  // ====================
  // SIGNATURE SECTION
  // ====================
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SIGNATURE OF COMPLAINANT', pageWidth / 2, y, { align: 'center' });
  
  y += 15;
  doc.setDrawColor(0, 0, 0);
  doc.line(pageWidth / 2 - 40, y, pageWidth / 2 + 40, y);
  
  y += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('[To be signed at police station]', pageWidth / 2, y, { align: 'center' });

  // ====================
  // FOOTER
  // ====================
  const footerY = pageHeight - 20;
  doc.setFillColor(240, 240, 240);
  doc.rect(0, footerY, pageWidth, 20, 'F');
  
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'This template is generated for informational purposes. The actual FIR will be drafted by the police',
    pageWidth / 2,
    footerY + 6,
    { align: 'center' }
  );
  doc.text(
    'based on your verbal/written complaint at the police station.',
    pageWidth / 2,
    footerY + 11,
    { align: 'center' }
  );
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 119, 255);
  doc.text('Generated by LegalAI', pageWidth / 2, footerY + 16, { align: 'center' });

  // Save the PDF
  const fileName = `FIR_Draft_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Install: npm install jspdf
// Usage: generateFIRPDF(firData);