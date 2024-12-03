import { TransformDictResponse } from '../types/transform';

export const formatTransformDictResponse = (response: TransformDictResponse): string => {
  const order = ["57", "573", "7", "27"];
  return order.map(key => response[key]?.toString() || "").join("");
};

export const prepareTransformDictInput = (criteriaData: Record<string, any>): Record<string, number> => {
  const requiredKeys = ['2', '3', '5', '7'];
  const inputDict: Record<string, number> = {};
  
  requiredKeys.forEach(key => {
    const criteriaKey = `criteria_${key}`;
    const value = criteriaData[criteriaKey];
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    
    if (value !== undefined && !isNaN(numValue)) {
      inputDict[key] = numValue;
    }
  });
  
  return inputDict;
};