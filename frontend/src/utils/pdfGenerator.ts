// frontend/src/utils/pdfGenerator.ts
// Enhanced PDF Generation using jsPDF with proper formatting

export const generatePDF = async (content: string, filename: string): Promise<void> => {
    try {
      // Dynamic import of jsPDF to avoid SSR issues and ensure it's loaded
      const { jsPDF } = await import('jspdf');
      
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
  
      // Document settings
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = 6;
      const maxWidth = pageWidth - (margin * 2);
      
      // Initialize position
      let yPosition = margin;
  
      // Set default font
      doc.setFont('times', 'normal');
      doc.setFontSize(12);
  
      // Function to add a new page if needed
      const checkPageBreak = (requiredHeight: number = lineHeight) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };
  
      // Function to add text with word wrapping
      const addTextWithWrapping = (text: string, fontSize: number = 12, fontStyle: string = 'normal', indent: number = 0) => {
        doc.setFontSize(fontSize);
        doc.setFont('times', fontStyle);
        
        if (!text.trim()) {
          yPosition += lineHeight * 0.5;
          return;
        }
        
        const lines = doc.splitTextToSize(text, maxWidth - indent);
        
        lines.forEach((line: string) => {
          checkPageBreak();
          doc.text(line, margin + indent, yPosition);
          yPosition += lineHeight;
        });
      };
  
      // Function to determine text formatting based on content
      const processLine = (line: string) => {
        const trimmedLine = line.trim();
        
        if (!trimmedLine) {
          // Empty line - add small spacing
          yPosition += lineHeight * 0.3;
          return;
        }
  
        // Document title (all caps, centered)
        if (trimmedLine.match(/^[A-Z\s&(),-]+$/) && trimmedLine.length < 80 && !trimmedLine.match(/^\d+\./)) {
          checkPageBreak(lineHeight * 2);
          doc.setFontSize(16);
          doc.setFont('times', 'bold');
          const textWidth = doc.getTextWidth(trimmedLine);
          const centerX = (pageWidth - textWidth) / 2;
          doc.text(trimmedLine, centerX, yPosition);
          yPosition += lineHeight * 1.5;
          doc.setFont('times', 'normal');
          doc.setFontSize(12);
          return;
        }
  
        // Section headers (numbered sections like "1. SERVICES")
        if (trimmedLine.match(/^\d+\.\s+[A-Z][A-Z\s]+$/)) {
          yPosition += lineHeight * 0.5; // Space before section
          checkPageBreak(lineHeight * 2);
          addTextWithWrapping(trimmedLine, 12, 'bold');
          yPosition += lineHeight * 0.3; // Space after section
          return;
        }
  
        // Subsection headers (like "a) Payment Terms:")
        if (trimmedLine.match(/^[a-z]\)\s+/)) {
          checkPageBreak();
          addTextWithWrapping(trimmedLine, 12, 'normal', 5);
          return;
        }
  
        // Signature blocks and special formatting
        if (trimmedLine.includes('_____') || trimmedLine.match(/^[A-Z\s]+:\s*$/)) {
          yPosition += lineHeight * 0.5;
          checkPageBreak();
          addTextWithWrapping(trimmedLine, 12, 'normal');
          if (trimmedLine.includes('_____')) {
            yPosition += lineHeight * 0.5;
          }
          return;
        }
  
        // Party identification (like "SERVICE PROVIDER:" or "CLIENT:")
        if (trimmedLine.match(/^[A-Z\s]+:\s+\S/)) {
          yPosition += lineHeight * 0.3;
          checkPageBreak();
          addTextWithWrapping(trimmedLine, 12, 'bold');
          return;
        }
  
        // WHEREAS clauses
        if (trimmedLine.startsWith('WHEREAS')) {
          checkPageBreak();
          addTextWithWrapping(trimmedLine, 12, 'normal', 5);
          return;
        }
  
        // NOW THEREFORE clause
        if (trimmedLine.startsWith('NOW, THEREFORE')) {
          yPosition += lineHeight * 0.5;
          checkPageBreak();
          addTextWithWrapping(trimmedLine, 12, 'normal');
          yPosition += lineHeight * 0.5;
          return;
        }
  
        // IN WITNESS WHEREOF
        if (trimmedLine.startsWith('IN WITNESS WHEREOF')) {
          yPosition += lineHeight;
          checkPageBreak();
          addTextWithWrapping(trimmedLine, 12, 'normal');
          yPosition += lineHeight * 0.5;
          return;
        }
  
        // Indented paragraphs (start with spaces or contain specific keywords)
        if (trimmedLine.match(/^   /) || line.startsWith('   ')) {
          checkPageBreak();
          addTextWithWrapping(trimmedLine, 12, 'normal', 10);
          return;
        }
  
        // Disclaimer or important notes
        if (trimmedLine.includes('IMPORTANT') || trimmedLine.includes('DISCLAIMER')) {
          yPosition += lineHeight * 0.5;
          checkPageBreak();
          addTextWithWrapping(trimmedLine, 11, 'bold');
          yPosition += lineHeight * 0.3;
          return;
        }
  
        // Regular paragraph text
        checkPageBreak();
        addTextWithWrapping(trimmedLine, 12, 'normal');
      };
  
      // Process the document content line by line
      const lines = content.split('\n');
      
      // Add document header with date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      });
      
      doc.setFontSize(8);
      doc.setFont('times', 'normal');
      doc.text(`Generated on: ${currentDate}`, pageWidth - margin - 40, 15);
      doc.setFontSize(12);
  
      // Process each line
      lines.forEach(line => {
        processLine(line);
      });
  
      // Add footer with page numbers if multiple pages
      const totalPages = doc.getNumberOfPages();
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
        }
      }
  
      // Save the PDF
      doc.save(`${filename}.pdf`);
      console.log('✅ PDF generated successfully');
      
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      
      // Fallback: download as text file
      console.log('📄 Falling back to text download');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      throw new Error('PDF generation failed, downloaded as text file instead');
    }
  };