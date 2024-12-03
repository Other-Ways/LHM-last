import React from 'react';
import type { TransformDictResponse } from '../../types/transform';

interface TransformDictResultProps {
  result: TransformDictResponse | null;
}

export const TransformDictResult: React.FC<TransformDictResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Result:</h4>
      <div className="bg-gray-50 p-4 rounded-md font-mono">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600">Key {key}:</span>
              <span className="text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};