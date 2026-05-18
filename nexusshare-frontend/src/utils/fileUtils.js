/**
 * Get visual configuration for a file based on its type
 * @param {string} type - The file type (e.g., 'image', 'pdf', 'video', etc.)
 * @returns {object} - Configuration object with icon, color, and bg classes
 */
export const getFileConfig = (type) => {
  const configs = {
    image: { icon: 'fa-file-image', color: 'text-blue-500', bg: 'bg-blue-50' },
    pdf: { icon: 'fa-file-pdf', color: 'text-red-500', bg: 'bg-red-50' },
    video: { icon: 'fa-file-video', color: 'text-purple-500', bg: 'bg-purple-50' },
    audio: { icon: 'fa-file-audio', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    excel: { icon: 'fa-file-excel', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    word: { icon: 'fa-file-word', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    zip: { icon: 'fa-file-archive', color: 'text-amber-500', bg: 'bg-amber-50' },
    pptx: { icon: 'fa-file-powerpoint', color: 'text-orange-500', bg: 'bg-orange-50' },
    default: { icon: 'fa-file', color: 'text-gray-400', bg: 'bg-gray-50' }
  };
  return configs[type] || configs.default;
};
