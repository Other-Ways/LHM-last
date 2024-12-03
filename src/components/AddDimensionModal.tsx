import React, { useState } from 'react';
import { X, Plus, Settings2 } from 'lucide-react';
import { createDimension } from '../api/dimensions';
import type { AIFunction, DimensionConfig } from '../types/dimension';

interface AddDimensionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AI_FUNCTIONS: { value: AIFunction; label: string }[] = [
  { value: 'no-ai', label: 'No AI' },
  { value: 'generate-text', label: 'Generate Text' },
  { value: 'generate-descriptions', label: 'Generate Descriptions' },
  { value: 'transform-dict', label: 'Transform Dictionary' },
  { value: 'sum-letters', label: 'Sum Letters' },
  { value: 'process-text-to-pdf', label: 'Process Text to PDF' },
];

export const AddDimensionModal: React.FC<AddDimensionModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<DimensionConfig>({
    dimension_name: '',
    ai_function: 'no-ai',
    processing_mode: 'Manual',
  });

  const handleAIFunctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFunction = e.target.value as AIFunction;
    setConfig({
      ...config,
      ai_function: newFunction,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createDimension(config);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dimension');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Add New Dimension</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dimension Name
            </label>
            <input
              type="text"
              value={config.dimension_name}
              onChange={(e) =>
                setConfig({ ...config, dimension_name: e.target.value })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter dimension name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AI Function
            </label>
            <select
              value={config.ai_function}
              onChange={handleAIFunctionChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {AI_FUNCTIONS.map((fn) => (
                <option key={fn.value} value={fn.value}>
                  {fn.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Processing Mode
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Auto"
                  checked={config.processing_mode === 'Auto'}
                  onChange={(e) => setConfig({ ...config, processing_mode: 'Auto' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Auto</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Manual"
                  checked={config.processing_mode === 'Manual'}
                  onChange={(e) => setConfig({ ...config, processing_mode: 'Manual' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Manual</span>
              </label>
            </div>
            {config.ai_function === 'no-ai' && config.processing_mode === 'Auto' && (
              <p className="mt-2 text-sm text-gray-500 italic">
                Auto mode will automatically save the data without AI processing
              </p>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`
                px-4 py-2 rounded-lg text-white flex items-center space-x-2
                ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                }
              `}
            >
              <Plus className="w-4 h-4" />
              <span>{isLoading ? 'Creating...' : 'Create Dimension'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
