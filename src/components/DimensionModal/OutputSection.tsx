import React from 'react';
import { Edit2 } from 'lucide-react';

interface OutputSectionProps {
  generatedContent: string;
  isEditing: boolean;
  onEditClick: () => void;
  onSaveEdit: (content: string) => void;
  onCancelEdit: () => void;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  generatedContent,
  isEditing,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
}) => {
  const [editedContent, setEditedContent] = React.useState(generatedContent);

  React.useEffect(() => {
    setEditedContent(generatedContent);
  }, [generatedContent]);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">AI Output</h3>
        {generatedContent && !isEditing && (
          <button
            onClick={onEditClick}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-64 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={onCancelEdit}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 border rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => onSaveEdit(editedContent)}
              className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-md">
          <pre className="whitespace-pre-wrap">{generatedContent || 'No content generated yet'}</pre>
        </div>
      )}
    </div>
  );
};