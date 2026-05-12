import html2pdf from 'html2pdf.js';

export const generateWorkstationPDF = async (station, element) => {
  if (!element) return;

  const editorContent = element.querySelector('.workstation-editor');

  if (!editorContent) {
    console.error('Editor content not found');
    return;
  }

  try {
    // Clone editor
    const clonedEditor = editorContent.cloneNode(true);

    // Remove collaborative cursors
    clonedEditor.querySelectorAll('.collaboration-cursor').forEach(el => el.remove());

    // Create export container
    const exportContainer = document.createElement('div');

    exportContainer.style.background = '#ffffff';
    exportContainer.style.padding = '50px 60px 35px 35px';
    exportContainer.style.width = '800px';
    exportContainer.style.color = '#111827';
    exportContainer.style.fontFamily = 'Arial, sans-serif';

    // Header
    const header = document.createElement('div');

    header.style.marginBottom = '30px';
    header.style.borderBottom = '1px solid #e5e7eb';
    header.style.paddingBottom = '15px';

    header.innerHTML = `
      <h1 style="font-size:24px;font-weight:bold;margin:0;">
        ${station.title}
      </h1>

      <p style="font-size:12px;color:#6b7280;margin-top:8px;">
        NexusShare Workstation • ${new Date().toLocaleString()}
      </p>
    `;

    exportContainer.appendChild(header);
    exportContainer.appendChild(clonedEditor);

    // Important styles for export
    clonedEditor.style.height = 'auto';
    clonedEditor.style.maxHeight = 'none';
    clonedEditor.style.overflow = 'visible';

    // Add temporarily to DOM
    document.body.appendChild(exportContainer);

    // PDF options
    const options = {
      margin: [-10, -2, 5, 5],
      filename: `${station.title.replace(/\s+/g, '_')}.pdf`,

      image: {
        type: 'jpeg',
        quality: 0.98,
      },

      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      },

      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },

      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
      },
    };

    // Generate PDF
    await html2pdf()
      .set(options)
      .from(exportContainer)
      .save();

    // Cleanup
    document.body.removeChild(exportContainer);

  } catch (error) {
    console.error('PDF Export failed:', error);
  }
};