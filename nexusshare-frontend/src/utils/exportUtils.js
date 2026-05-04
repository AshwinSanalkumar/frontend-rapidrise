import jsPDF from 'jspdf';

/**
 * Generates a PDF on the client side from workstation data.
 */
export const generateWorkstationPDF = (station, content) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text(station.title, 20, 30);
  
  // Meta info
  doc.setFontSize(10);
  doc.setTextColor(156, 163, 175); // gray-400
  const dateStr = new Date(station.createdAt).toLocaleDateString();
  doc.text(`Created: ${dateStr} | Owner: ${station.ownerName}`, 20, 40);
  
  // Divider
  doc.setDrawColor(229, 231, 235); // gray-200
  doc.line(20, 45, 190, 45);
  
  // Content
  doc.setFontSize(12);
  doc.setTextColor(31, 41, 55); // gray-800
  
  // Split text to fit page width
  const splitContent = doc.splitTextToSize(content, 170);
  doc.text(splitContent, 20, 60);
  
  // Save
  doc.save(`${station.title.replace(/\s+/g, '_')}.pdf`);
};
