import React from 'react';
import { FileText } from 'lucide-react';

export interface ProcessTextToPdfConfig {
  text: string;
  words: string[];
}

interface ProcessTextToPdfConfigProps {
  config: ProcessTextToPdfConfig;
  onChange: (config: ProcessTextToPdfConfig) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ProcessTextToPdfConfig: React.FC<ProcessTextToPdfConfigProps> = ({
  config,
  onChange,
  onGenerate,
  isLoading,
  disabled,
}) => {
  const handleConfigChange = (key: keyof ProcessTextToPdfConfig, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <h4 className="font-medium">Process Text to PDF Configuration</h4>
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading || disabled}
          className={`
            px-4 py-2 rounded-lg text-white transition-colors
            ${isLoading || disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
        >
          {isLoading ? 'Processing...' : 'Generate PDF'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea
            value={config.text}
            onChange={(e) => handleConfigChange('text', e.target.value)}
            className="w-full p-3 border rounded-lg min-h-[150px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the text to be processed..."
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            The words from your Atelier will be used as criteria for PDF generation.
          </p>
          <div className="flex flex-wrap gap-2">
            {config.words.map((word, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};