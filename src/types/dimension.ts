export type AIFunction = 'no-ai' | 'generate-text' | 'generate-descriptions' | 'transform-dict' | 'sum-letters' | 'process-text-to-pdf';

export interface DimensionConfig {
  dimension_name: string;
  ai_function: AIFunction;
  processing_mode: 'Manual' | 'Auto';
}

export interface Dimension extends DimensionConfig {
  dimension_id: number;
}

export interface DimensionResponse extends DimensionConfig {
  dimension_id: number;
}
