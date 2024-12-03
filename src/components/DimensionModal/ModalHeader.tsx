import React from 'react';
import { Settings2, X } from 'lucide-react';
import type { Dimension } from '../../types/dimension';

interface ModalHeaderProps {
  dimensionName: string;
  dimension: Dimension | null;
  onClose: () => void;
}

const AI_FUNCTIONS = [
  { value: 'no-ai', label: 'No AI' },
  { value: 'generate-text', label: 'Generate Text' },
  { value: 'generate-descriptions', label: 'Generate Descriptions' },
  { value: 'generate-axes', label: 'Generate Axes' },
  { value: 'sum-letters', label: 'Sum Letters' },
  { value: 'transform-dict', label: 'Transform Dictionary' },
  { value: 'process-text-to-pdf', label: 'Process Text to PDF' },
];

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  dimensionName,
  dimension,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b bg-white sticky top-0 z-10 rounded-t-lg">
      <div className="flex items-center space-x-2">
        <Settings2 className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">{dimensionName}</h2>
      </div>
      <div className="flex items-center space-x-4">
        {dimension && (
          <div className="text-sm text-gray-600">
            AI Function: <span className="font-medium">
              {AI_FUNCTIONS.find(fn => fn.value === dimension.ai_function)?.label || dimension.ai_function}
            </span>
          </div>
        )}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};