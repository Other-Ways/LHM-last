import React from 'react';
import { Edit2 } from 'lucide-react';

interface ModalFooterProps {
  onClose: () => void;
  onVerify: () => void;
  isSubmitted: boolean;
  hasGeneratedContent: boolean;
  selectedFunction: string;
  onEditClick: () => void;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  onClose,
  onVerify,
  isSubmitted,
  hasGeneratedContent,
  selectedFunction,
  onEditClick,
}) => {
  const isVerifyDisabled = (selectedFunction !== 'no-ai' && !hasGeneratedContent);

  return (
    <div className="p-6 border-t bg-gray-50 sticky bottom-0 rounded-b-lg">
      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        {isSubmitted ? (
          <button
            onClick={onEditClick}
            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <button
            onClick={onVerify}
            disabled={isVerifyDisabled}
            className={`
              px-4 py-2 rounded-lg text-white
              ${isVerifyDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isSubmitted ? 'Update' : 'Verify'}
          </button>
        )}
      </div>
    </div>
  );
};