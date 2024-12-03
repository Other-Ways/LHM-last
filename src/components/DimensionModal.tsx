import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Edit2, Plus, Trash2, FileText, Settings2 } from 'lucide-react';
import { submitJeux } from '../api/jeux';
import { GenerateTextConfig, type GenerateTextConfig as TextConfig } from './ai/GenerateTextConfig';
import { GenerateDescriptionsConfig, type GenerateDescriptionsConfig as DescConfig } from './ai/GenerateDescriptionsConfig';
import { GenerateAxesConfig, type GenerateAxesConfig as AxesConfig } from './ai/GenerateAxesConfig';
import { SumLettersConfig, type SumLettersConfig as SumConfig } from './ai/SumLettersConfig';
import { TransformDictConfig } from './ai/TransformDictConfig';
import { ProcessTextToPdfConfig, type ProcessTextToPdfConfig as PdfConfig } from './ai/ProcessTextToPdfConfig';
import { SumLettersResult } from './ai/SumLettersResult';
import { prepareTransformDictInput, formatTransformDictResponse } from '../utils/transformDict';
import { prepareSumLettersInput } from '../utils/sumLetters';
import type { TeamCriteriaSubmission } from '../types';
import type { TransformDictResponse } from '../types/transform';
import type { Dimension } from '../types/dimension';
import { fetchDimensionById } from '../api/dimensions';

interface DimensionModalProps {
  dimensionId: number;
  dimensionName: string;
  submission: TeamCriteriaSubmission | null;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitted: boolean;
}

type AIFunction = 'generate-text' | 'generate-descriptions' | 'generate-axes' | 'sum-letters' | 'transform-dict' | 'process-text-to-pdf' | 'no-ai';

const AI_FUNCTIONS = [
  { value: 'generate-text', label: 'Generate Text' },
  { value: 'generate-descriptions', label: 'Generate Descriptions' },
  { value: 'generate-axes', label: 'Generate Axes' },
  { value: 'sum-letters', label: 'Sum Letters' },
  { value: 'transform-dict', label: 'Transform Dictionary' },
  { value: 'process-text-to-pdf', label: 'Process Text to PDF' },
  { value: 'no-ai', label: 'No AI' },
];

export const DimensionModal: React.FC<DimensionModalProps> = ({
  dimensionId,
  dimensionName,
  submission,
  onClose,
  onSubmit,
  isSubmitted,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dimension, setDimension] = useState<Dimension | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<AIFunction>('generate-text');
  const [criteriaData, setCriteriaData] = useState(submission?.criteria_data || {});
  const [newCriteriaKey, setNewCriteriaKey] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [rawDescriptionsData, setRawDescriptionsData] = useState<string>('');
  const [rawAxesData, setRawAxesData] = useState<string>('');
  const [sumLettersResult, setSumLettersResult] = useState<string>('');
  const [transformDictResult, setTransformDictResult] = useState<string>('');
  const [pdfLink, setPdfLink] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  // Fetch dimension details when modal opens
  useEffect(() => {
    const fetchDimensionDetails = async () => {
      try {
        const data = await fetchDimensionById(dimensionId);
        setDimension(data);
        setSelectedFunction(data.ai_function as AIFunction);
      } catch (error) {
        console.error('Error fetching dimension:', error);
      }
    };
    fetchDimensionDetails();
  }, [dimensionId]);

  const [textConfig, setTextConfig] = useState<TextConfig>({
    company_context: "LafargeHolcim Maroc, un leader dans le secteur des matériaux de construction au Maroc, est une filiale du groupe international Holcim. L'entreprise se distingue par son engagement envers le développement durable et l'innovation dans ses produits et services.",
    target_words: ["DES", "AU", "C'EST", "CAS"],
    tokens: 100,
    language: "french",
    is_order: true,
  });

  const [descConfig, setDescConfig] = useState<DescConfig>({
    language: "french",
    tokens: 3,
    words: [],
  });

  const [axesConfig, setAxesConfig] = useState<AxesConfig>({
    context: "LafargeHolcim Maroc, un leader dans le secteur des matériaux de construction au Maroc, est une filiale du groupe international Holcim. L'entreprise se distingue par son engagement envers le développement durable et l'innovation dans ses produits et services.",
    count: 4,
    language: "french",
    list_hide: ["SERALN", "ESALNRA", "NRESALN", "ESARNL"],
    text: Object.values(criteriaData)[0] || "",
  });

  const [sumConfig, setSumConfig] = useState<SumConfig>({
    positions: [[1, 3], [3, 4], [1, 2]],
  });

  const [pdfConfig, setPdfConfig] = useState<PdfConfig>({
    text: "",
    words: Object.values(criteriaData),
  });

  const handleFunctionChange = (newFunction: AIFunction) => {
    setSelectedFunction(newFunction);
    setGeneratedContent('');
    if (newFunction === 'generate-descriptions') {
      setDescConfig(prev => ({
        ...prev,
        words: Object.values(criteriaData),
      }));
    } else if (newFunction === 'generate-axes') {
      setAxesConfig(prev => ({
        ...prev,
        text: Object.values(criteriaData)[0] || "",
      }));
    } else if (newFunction === 'process-text-to-pdf') {
      setPdfConfig(prev => ({
        ...prev,
        words: Object.values(criteriaData),
      }));
    }
  };

  const generateContent = async () => {
    setIsLoading(true);
    try {
      const criteriaValues = Object.values(criteriaData);
      let endpoint = '';
      let requestBody = {};

      switch (selectedFunction) {
        case 'generate-text':
          endpoint = '/generate-text';
          requestBody = {
            ...textConfig,
            criteria: criteriaValues,
          };
          break;
        case 'generate-descriptions':
          endpoint = '/generate-descriptions';
          requestBody = {
            ...descConfig,
            words: criteriaValues,
          };
          break;
        case 'generate-axes':
          endpoint = '/generate-axes';
          requestBody = {
            ...axesConfig,
            text: criteriaValues[0] || "",
          };
          break;
        case 'sum-letters':
          endpoint = '/sum-letters';
          const sumLettersData = prepareSumLettersInput(criteriaData);
          requestBody = {
            positions: sumConfig.positions,
            words: sumLettersData.words
          };
          break;
        case 'transform-dict':
          endpoint = '/transform-dict';
          requestBody = {
            input_dict: prepareTransformDictInput(criteriaData)
          };
          break;
        case 'process-text-to-pdf':
          endpoint = '/process-text-to-pdf';
          requestBody = {
            text: pdfConfig.text,
            words: criteriaValues,
          };
          break;
      }

      const response = await fetch(`https://lafarge.thegamechangercompany.io${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (selectedFunction === 'generate-text') {
        setGeneratedContent(data.text || '');
      } else if (selectedFunction === 'generate-descriptions') {
        // Store the raw response data for later use in handleVerify
        setRawDescriptionsData(JSON.stringify(data, null, 2));
        // Format the descriptions for display
        const descriptions = Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n\n');
        setGeneratedContent(descriptions);
      } else if (selectedFunction === 'generate-axes' && data.axes) {
        // Store the raw axes data for later use in handleVerify
        setRawAxesData(JSON.stringify(data, null, 2));
        // Format the axes content for display
        const axesContent = data.axes.map(axis => {
          return `${axis.title}\n${axis.phrases.map((phrase, i) => `${i + 1}. ${phrase}`).join('\n')}`;
        }).join('\n\n');
        setGeneratedContent(axesContent);
      } else if (selectedFunction === 'sum-letters' && data.sums) {
        // Store the sum letters result for later use in handleVerify
        const result = data.sums.filter(num => !isNaN(num)).join('');
        setSumLettersResult(result);
        setGeneratedContent(result);
      } else if (selectedFunction === 'transform-dict') {
        // Store the transform dict result for later use in handleVerify
        const result = formatTransformDictResponse(data as TransformDictResponse);
        setTransformDictResult(result);
        setGeneratedContent(result);
      } else if (selectedFunction === 'process-text-to-pdf') {
        setGeneratedContent(data.message);
        setPdfLink(data.pdf_link ? `https://lafarge.thegamechangercompany.io/${data.pdf_link}` : '');
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (isSubmitted) return;
    
    try {
      const bboxData: Record<string, any> = {};
      const atelierData: Record<string, string> = {};

      if (selectedFunction !== 'no-ai') {
        switch (selectedFunction) {
          case 'process-text-to-pdf':
            bboxData.message = generatedContent;
            break;
          case 'generate-descriptions':
            // Store criteria and descriptions as key-value pairs
            const descriptionsObj: Record<string, string> = JSON.parse(rawDescriptionsData);
            bboxData.descriptions = descriptionsObj;
            break;
          case 'generate-axes':
            // Store axes data in bbox and original text in atelier
            const axesData = JSON.parse(rawAxesData);
            bboxData.axes = axesData.axes;
            // Save the original text from Atelier
            atelierData.text = Object.values(criteriaData)[0] || "";
            break;
          case 'sum-letters':
            // Store sum letters result with "code" as key
            bboxData.code = sumLettersResult;
            break;
          case 'transform-dict':
            // Store transform dict result with "code" as key
            bboxData.code = transformDictResult;
            break;
          default:
            bboxData.text = generatedContent;
        }
      }

      // Add other criteria data if not generate-axes
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

  const handleEdit = (key: string, value: string) => {
    setCriteriaData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddCriteria = () => {
    if (!newCriteriaKey.trim()) return;
    setCriteriaData(prev => ({
      ...prev,
      [newCriteriaKey]: '',
    }));
    setNewCriteriaKey('');
  };

  const handleDeleteCriteria = (keyToDelete: string) => {
    setCriteriaData(prev => {
      const newData = { ...prev };
      delete newData[keyToDelete];
      return newData;
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContent(generatedContent);
  };

  const handleSaveEdit = () => {
    setGeneratedContent(editedContent);
    setIsEditing(false);
    
    // Update the appropriate state based on the selected function
    if (selectedFunction === 'generate-descriptions') {
      setRawDescriptionsData(editedContent);
    } else if (selectedFunction === 'generate-axes') {
      setRawAxesData(editedContent);
    } else if (selectedFunction === 'sum-letters') {
      setSumLettersResult(editedContent);
    } else if (selectedFunction === 'transform-dict') {
      setTransformDictResult(editedContent);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Sticky header */}
        <div className="flex items-center justify-between p-6 border-b bg-white sticky top-0 z-10 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">{dimensionName}</h2>
          </div>
          <div className="flex items-center space-x-4">
            {dimension && (
              <div className="text-sm text-gray-600">
                AI Function: <span className="font-medium">{AI_FUNCTIONS.find(fn => fn.value === dimension.ai_function)?.label || dimension.ai_function}</span>
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

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
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
                    {!isSubmitted && (
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>{isEditing ? 'Done' : 'Edit'}</span>
                      </button>
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
                          onClick={() => handleDeleteCriteria(key)}
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
                        value={value as string}
                        onChange={(e) => handleEdit(key, e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {value as string}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Black Box</h3>
                <div className="space-y-4">
                  <select
                    value={selectedFunction}
                    onChange={(e) => handleFunctionChange(e.target.value as AIFunction)}
                    className="px-4 py-2 border rounded-lg bg-white"
                  >
                    <option value="no-ai">No AI</option>
                    <option value="generate-text">Generate Text</option>
                    <option value="generate-descriptions">Generate Descriptions</option>
                    <option value="generate-axes">Generate Axes</option>
                    <option value="sum-letters">Sum Letters</option>
                    <option value="transform-dict">Transform Dictionary</option>
                    <option value="process-text-to-pdf">Process Text to PDF</option>
                  </select>

                  {selectedFunction === 'generate-text' && (
                    <GenerateTextConfig
                      config={textConfig}
                      onChange={setTextConfig}
                      onGenerate={generateContent}
                      isLoading={isLoading}
                      disabled={Object.values(criteriaData).length === 0}
                    />
                  )}
                  
                  {selectedFunction === 'generate-descriptions' && (
                    <GenerateDescriptionsConfig
                      config={descConfig}
                      onChange={setDescConfig}
                      onGenerate={generateContent}
                      isLoading={isLoading}
                      disabled={Object.values(criteriaData).length === 0}
                    />
                  )}
                  
                  {selectedFunction === 'generate-axes' && (
                    <GenerateAxesConfig
                      config={axesConfig}
                      onChange={setAxesConfig}
                      onGenerate={generateContent}
                      isLoading={isLoading}
                      disabled={Object.values(criteriaData).length === 0}
                    />
                  )}
                  
                  {selectedFunction === 'sum-letters' && (
                    <SumLettersConfig
                      config={sumConfig}
                      onChange={setSumConfig}
                      onGenerate={generateContent}
                      isLoading={isLoading}
                      disabled={Object.values(criteriaData).length === 0}
                    />
                  )}

                  {selectedFunction === 'transform-dict' && (
                    <TransformDictConfig
                      config={{ input_dict: prepareTransformDictInput(criteriaData) }}
                      onChange={() => {}} // No configuration needed
                      onGenerate={generateContent}
                      isLoading={isLoading}
                      disabled={Object.values(criteriaData).length === 0}
                    />
                  )}

                  {selectedFunction === 'process-text-to-pdf' && (
                    <ProcessTextToPdfConfig
                      config={pdfConfig}
                      onChange={setPdfConfig}
                      onGenerate={generateContent}
                      isLoading={isLoading}
                      disabled={Object.values(criteriaData).length === 0}
                    />
                  )}

                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">AI Output</h3>
                      {generatedContent && !isEditing && (
                        <button
                          onClick={handleEditClick}
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
                            onClick={handleCancelEdit}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 border rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
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

                  {selectedFunction === 'process-text-to-pdf' && pdfLink && (
                    <div className="mt-4 flex justify-end">
                      <a
                        href={pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FileText className="w-5 h-5" />
                        <span>Preview PDF</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="p-6 border-t bg-gray-50 sticky bottom-0 rounded-b-lg">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={isSubmitted || (selectedFunction !== 'no-ai' && !generatedContent)}
              className={`
                px-4 py-2 rounded-lg text-white
                ${isSubmitted || (selectedFunction !== 'no-ai' && !generatedContent)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }
              `}
            >
              {isSubmitted ? 'Verified' : 'Verify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};