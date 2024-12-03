import { fetchWithErrorHandling } from './utils';
import type { Dimension, DimensionConfig, DimensionResponse } from '../types/dimension';

export const fetchDimensions = async (skip = 0, limit = 10): Promise<Dimension[]> => {
  return fetchWithErrorHandling(`/dimensions/?skip=${skip}&limit=${limit}`);
};

export const fetchDimensionById = async (dimensionId: number): Promise<Dimension> => {
  return fetchWithErrorHandling(`/dimensions/${dimensionId}`);
};

export const createDimension = async (config: DimensionConfig): Promise<DimensionResponse> => {
  // Validate processing_mode
  if (!config.processing_mode || !['Manual', 'Auto'].includes(config.processing_mode)) {
    throw new Error('processing_mode must be either "Manual" or "Auto"');
  }

  const response = await fetch('https://lafarge.thegamechangercompany.io/dimensions/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dimension_name: config.dimension_name,
      ai_function: config.ai_function,
      processing_mode: config.processing_mode.toLowerCase(), // Convert to lowercase for API
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create dimension: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Ensure processing_mode is set in response with correct capitalization
  if (!data.processing_mode) {
    data.processing_mode = config.processing_mode;
  } else {
    // Convert response to match UI capitalization
    data.processing_mode = data.processing_mode === 'auto' ? 'Auto' : 'Manual';
  }

  return data;
};