import React from 'react';
import type { AIFunction } from '../../types/dimension';

interface AIFunctionSelectorProps {
  selectedFunction: AIFunction;
  onChange: (newFunction: AIFunction) => void;
  disabled?: boolean;
}

const AI_FUNCTIONS = [
  { value: 'generate-text', label: 'Generate Text' },
  { value: 'generate-descriptions', label: 'Generate Descriptions' },
  { value: 'generate-axes', label: 'Generate Axes' },
  { value: 'sum-letters', label: 'Sum Letters' },
  { value: 'transform-dict', label: 'Transform Dictionary' },
  { value: 'process-text-to-pdf', label: 'Process Text to PDF' },
  { value: 'no-ai', label: 'No AI' },
];

export const AIFunctionSelector: React.FC<AIFunctionSelectorProps> = ({
  selectedFunction,
  onChange,
  disabled = true, // Set default to true to always disable the selector
}) => {
  return (
    <select
      value={selectedFunction}
      onChange={(e) => onChange(e.target.value as AIFunction)}
      className={`
        px-4 py-2 border rounded-lg
        ${disabled 
          ? 'bg-gray-100 cursor-not-allowed opacity-75' 
          : 'bg-white'
        }
      `}
      disabled={disabled}
    >
      {AI_FUNCTIONS.map((fn) => (
        <option key={fn.value} value={fn.value}>
          {fn.label}
        </option>
      ))}
    </select>
  );
};