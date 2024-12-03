import React, { useState, useEffect } from 'react';
import { fetchDimensionById, submitJeux } from '../../api';
import { ModalHeader } from './ModalHeader';
import { AtelierSection } from './AtelierSection';
import { AIFunctionSelector } from './AIFunctionSelector';
import { OutputSection } from './OutputSection';
import { PDFPreview } from './PDFPreview';
import { ModalFooter } from './ModalFooter';
import { useAIFunctions } from '../../hooks/useAIFunctions';
import type { AIFunction, Dimension } from '../../types/dimension';
import type { TeamCriteriaSubmission } from '../../types';
import type { Jeu } from '../../api/jeux';

interface DimensionModalProps {
  dimensionId: number;
  dimensionName: string;
  submission: TeamCriteriaSubmission | null;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitted: boolean;
  currentJeu?: Jeu;
}

export const DimensionModal: React.FC<DimensionModalProps> = ({
  dimensionId,
  dimensionName,
  submission,
  onClose,
  onSubmit,
  isSubmitted,
  currentJeu,
}) => {
  const [dimension, setDimension] = useState<Dimension | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<AIFunction>('no-ai');
  const [criteriaData, setCriteriaData] = useState(submission?.criteria_data || {});
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [pdfLink, setPdfLink] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const {
    isLoading,
    generateContent,
    rawDescriptionsData,
    rawAxesData,
    sumLettersResult,
    transformDictResult,
  } = useAIFunctions();

  useEffect(() => {
    const fetchDimension = async () => {
      try {
        const data = await fetchDimensionById(dimensionId);
        setDimension(data);
        setSelectedFunction(data.ai_function);
      } catch (error) {
        console.error('Error fetching dimension:', error);
      }
    };
    fetchDimension();
  }, [dimensionId]);

  useEffect(() => {
    if (currentJeu) {
      setCriteriaData(currentJeu.atelier || {});
      
      if (currentJeu.bbox) {
        if (currentJeu.bbox.text) {
          setGeneratedContent(currentJeu.bbox.text);
        } else if (currentJeu.bbox.descriptions) {
          const descriptions = Object.entries(currentJeu.bbox.descriptions)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n\n');
          setGeneratedContent(descriptions);
        } else if (currentJeu.bbox.axes) {
          const axesContent = currentJeu.bbox.axes.map((axis: any) => {
            return `${axis.title}\n${axis.phrases.map((phrase: string, i: number) => `${i + 1}. ${phrase}`).join('\n')}`;
          }).join('\n\n');
          setGeneratedContent(axesContent);
        } else if (currentJeu.bbox.code) {
          setGeneratedContent(currentJeu.bbox.code);
        }
      }
    }
  }, [currentJeu]);

  const handleEdit = (key: string, value: string) => {
    setCriteriaData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddCriteria = (key: string) => {
    setCriteriaData(prev => ({
      ...prev,
      [key]: '',
    }));
  };

  const handleDeleteCriteria = (keyToDelete: string) => {
    setCriteriaData(prev => {
      const newData = { ...prev };
      delete newData[keyToDelete];
      return newData;
    });
  };

  const handleVerify = async () => {
    try {
      const bboxData: Record<string, any> = {};
      const atelierData: Record<string, string> = {};

      if (selectedFunction !== 'no-ai') {
        switch (selectedFunction) {
          case 'process-text-to-pdf':
            bboxData.message = generatedContent;
            break;
          case 'generate-descriptions':
            bboxData.descriptions = JSON.parse(rawDescriptionsData);
            break;
          case 'generate-axes':
            const axesData = JSON.parse(rawAxesData);
            bboxData.axes = axesData.axes;
            atelierData.text = Object.values(criteriaData)[0] || "";
            break;
          case 'sum-letters':
            bboxData.code = sumLettersResult;
            break;
          case 'transform-dict':
            bboxData.code = transformDictResult;
            break;
          default:
            bboxData.text = generatedContent;
        }
      }

      if (selectedFunction !== 'generate-axes') {
        Object.entries(criteriaData).forEach(([key, value], index) => {
          atelierData[`criteria_${index + 1}`] = value as string;
        });
      }

      await submitJeux({
        dimension_id: dimensionId,
        atelier: atelierData,
        bbox: selectedFunction === 'no-ai' ? {} : bboxData,
      });
      onSubmit();
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert('Failed to verify submission. Please try again.');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <ModalHeader
          dimensionName={dimensionName}
          dimension={dimension}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
              <AtelierSection
                criteriaData={criteriaData}
                isEditing={isEditing}
                isSubmitted={isSubmitted && !isEditing}
                onEdit={handleEdit}
                onDelete={handleDeleteCriteria}
                onAdd={handleAddCriteria}
              />

              <div>
                <h3 className="text-lg font-medium mb-4">Black Box</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">AI Function:</span>
                    <span className="font-medium">
                      {dimension?.ai_function === 'no-ai' ? 'No AI' :
                       dimension?.ai_function === 'generate-text' ? 'Generate Text' :
                       dimension?.ai_function === 'generate-descriptions' ? 'Generate Descriptions' :
                       dimension?.ai_function === 'generate-axes' ? 'Generate Axes' :
                       dimension?.ai_function === 'sum-letters' ? 'Sum Letters' :
                       dimension?.ai_function === 'transform-dict' ? 'Transform Dictionary' :
                       dimension?.ai_function === 'process-text-to-pdf' ? 'Process Text to PDF' :
                       dimension?.ai_function}
                    </span>
                  </div>

                  <OutputSection
                    generatedContent={generatedContent}
                    isEditing={isEditing}
                    onEditClick={() => setIsEditing(true)}
                    onSaveEdit={(content) => {
                      setGeneratedContent(content);
                      setIsEditing(false);
                    }}
                    onCancelEdit={() => setIsEditing(false)}
                  />

                  <PDFPreview pdfLink={pdfLink} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalFooter
          onClose={onClose}
          onVerify={handleVerify}
          isSubmitted={isSubmitted && !isEditing}
          hasGeneratedContent={!!generatedContent}
          selectedFunction={selectedFunction}
          onEditClick={handleEditClick}
        />
      </div>
    </div>
  );
};