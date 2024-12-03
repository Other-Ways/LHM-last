import React from 'react';
import { FileText } from 'lucide-react';

interface PDFPreviewProps {
  pdfLink: string;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ pdfLink }) => {
  if (!pdfLink) return null;

  return (
    <div className="mt-4 flex justify-end">
      <a
        href={pdfLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <FileText className="w-5 h-5" />
        <span>Preview PDF</span>
      </a>
    </div>
  );
};