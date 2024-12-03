import React from 'react';
import { Calculator } from 'lucide-react';
import type { TransformDictConfig as Config } from '../../types/transform';

interface TransformDictConfigProps {
  config: Config;
  onChange: (config: Config) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
  criteriaValues?: Record<string, number>;
}

export const TransformDictConfig: React.FC<TransformDictConfigProps> = ({
  onGenerate,
  isLoading,
  disabled,
  criteriaValues = {},
  onChange,
}) => {
  React.useEffect(() => {
    // Skip if no criteria values
    if (!criteriaValues) {
      return;
    }

    // Define the required keys
    const requiredKeys = ['2', '3', '5', '7'];
    const transformedDict: Record<string, number> = {};
    
    // Only include values for the required keys
    requiredKeys.forEach(key => {
      const criteriaKey = `criteria_${key}`;
      if (criteriaValues && criteriaKey in criteriaValues) {
        transformedDict[key] = criteriaValues[criteriaKey];
      }
    });

    onChange({ input_dict: transformedDict });
  }, [criteriaValues, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-gray-500" />
          <h4 className="font-medium">Transform Dictionary</h4>
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
          {isLoading ? 'Transforming...' : 'Transform'}
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
        <p className="text-sm text-gray-600">
          This will transform your criteria values into a new dictionary using only criteria 2, 3, 5, and 7:
        </p>
        <ul className="text-sm text-gray-500 list-disc list-inside mb-4">
          <li>criteria_2 → key "2"</li>
          <li>criteria_3 → key "3"</li>
          <li>criteria_5 → key "5"</li>
          <li>criteria_7 → key "7"</li>
        </ul>
        <p className="text-sm text-gray-600">
          The AI response will be calculated as follows:
        </p>
        <ul className="text-sm text-gray-500 list-disc list-inside">
          <li>First digit: (value(5) + value(7))</li>
          <li>Second digit: (value(5) + value(7) + value(3))</li>
          <li>Third digit: value(7)</li>
          <li>Fourth digit: (value(2) + value(7))</li>
        </ul>
      </div>
    </div>
  );
};