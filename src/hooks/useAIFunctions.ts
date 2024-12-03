import { useState } from 'react';
import { API_CONFIG } from '../api/config';
import { prepareSumLettersInput } from '../utils/sumLetters';
import { prepareTransformDictInput, formatTransformDictResponse } from '../utils/transformDict';
import type { TransformDictResponse } from '../types/transform';

export const useAIFunctions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rawDescriptionsData, setRawDescriptionsData] = useState<string>('');
  const [rawAxesData, setRawAxesData] = useState<string>('');
  const [sumLettersResult, setSumLettersResult] = useState<string>('');
  const [transformDictResult, setTransformDictResult] = useState<string>('');

  const generateContent = async (
    selectedFunction: string,
    config: any,
    criteriaData: Record<string, any>
  ) => {
    setIsLoading(true);
    try {
      const criteriaValues = Object.values(criteriaData);
      let endpoint = '';
      let requestBody = {};

      switch (selectedFunction) {
        case 'generate-text':
          endpoint = '/generate-text';
          requestBody = {
            ...config,
            criteria: criteriaValues,
          };
          break;
        case 'generate-descriptions':
          endpoint = '/generate-descriptions';
          requestBody = {
            ...config,
            words: criteriaValues,
          };
          break;
        case 'generate-axes':
          endpoint = '/generate-axes';
          requestBody = {
            ...config,
            text: criteriaValues[0] || "",
          };
          break;
        case 'sum-letters':
          endpoint = '/sum-letters';
          const sumLettersData = prepareSumLettersInput(criteriaData);
          requestBody = {
            positions: config.positions,
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
            text: config.text,
            words: criteriaValues,
          };
          break;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
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
      
      switch (selectedFunction) {
        case 'generate-descriptions':
          setRawDescriptionsData(JSON.stringify(data, null, 2));
          return Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n\n');
        case 'generate-axes':
          setRawAxesData(JSON.stringify(data, null, 2));
          return data.axes.map((axis: any) => {
            return `${axis.title}\n${axis.phrases.map((phrase: string, i: number) => `${i + 1}. ${phrase}`).join('\n')}`;
          }).join('\n\n');
        case 'sum-letters':
          const result = data.sums.filter((num: number) => !isNaN(num)).join('');
          setSumLettersResult(result);
          return result;
        case 'transform-dict':
          const transformResult = formatTransformDictResponse(data as TransformDictResponse);
          setTransformDictResult(transformResult);
          return transformResult;
        default:
          return data.text || '';
      }
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateContent,
    rawDescriptionsData,
    rawAxesData,
    sumLettersResult,
    transformDictResult,
  };
};