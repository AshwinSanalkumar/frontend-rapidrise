import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Captures a pixel-perfect snapshot of the editor to ensure styling and layout parity.
 */
export const generateWorkstationPDF = async (station, element) => {
  if (!element) return;

  // We target the actual editor content area
  const editorContent = element.querySelector('.workstation-editor');
  if (!editorContent) return;

  try {
    // 1. Capture the editor as a high-quality canvas
    const canvas = await html2canvas(editorContent, {
      scale: 3, // High DPI for crisp text
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure the cloned editor is expanded to full height for capture
        const clonedEditor = clonedDoc.querySelector('.workstation-editor');
        if (clonedEditor) {
          clonedEditor.style.height = 'auto';
          clonedEditor.style.maxHeight = 'none';
          clonedEditor.style.overflow = 'visible';
        }
      }
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // 2. Setup PDF (A4 size)
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pdfWidth - (margin * 2);
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = contentWidth / imgWidth;
    const finalImgHeight = imgHeight * ratio;

    // 3. Add Header (matching the app style)
    doc.setFillColor(249, 250, 251); // gray-50
    doc.rect(0, 0, pdfWidth, 25, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39); // gray-900
    doc.text(station.title, margin, 15);
    
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128); // gray-500
    doc.text(`NexusShare Workstation Export | ${new Date().toLocaleString()}`, margin, 20);

    // 4. Add the Image
    // If the image is longer than one page, jsPDF addImage will scale it.
    // For absolute pixel-perfect parity of a single document, we place it below the header.
    doc.addImage(imgData, 'PNG', margin, 35, contentWidth, finalImgHeight, undefined, 'FAST');

    // 5. Save
    doc.save(`${station.title.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('High-Fidelity PDF Export failed:', error);
    throw error;
  }
};

