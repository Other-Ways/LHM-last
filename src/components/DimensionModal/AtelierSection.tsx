import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface AtelierSectionProps {
  criteriaData: Record<string, string>;
  isEditing: boolean;
  isSubmitted: boolean;
  onEdit: (key: string, value: string) => void;
  onDelete: (key: string) => void;
  onAdd: (key: string) => void;
}

export const AtelierSection: React.FC<AtelierSectionProps> = ({
  criteriaData,
  isEditing,
  isSubmitted,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [newCriteriaKey, setNewCriteriaKey] = React.useState('');

  const handleAddCriteria = () => {
    if (!newCriteriaKey.trim()) return;
    onAdd(newCriteriaKey);
    setNewCriteriaKey('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Atelier</h3>
        <div className="flex items-center space-x-2">
          {!isSubmitted && isEditing && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newCriteriaKey}
                onChange={(e) => setNewCriteriaKey(e.target.value)}
                placeholder="New criteria name"
                className="px-3 py-1 border rounded-md text-sm"
              />
              <button
                onClick={handleAddCriteria}
                className="text-green-600 hover:text-green-700 p-1 rounded-md hover:bg-green-50"
                title="Add new criteria"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {Object.entries(criteriaData).map(([key, value], index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              {key}
            </label>
            {isEditing && !isSubmitted && (
              <button
                onClick={() => onDelete(key)}
                className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50"
                title="Delete criteria"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          {isEditing && !isSubmitted ? (
            <input
              type="text"
              value={value}
              onChange={(e) => onEdit(key, e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              {value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};