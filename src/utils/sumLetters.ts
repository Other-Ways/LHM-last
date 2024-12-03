export interface SumLettersInput {
  positions: [number, number][];
  words: string[];
}

export const prepareSumLettersInput = (criteriaData: Record<string, any>): SumLettersInput => {
  // Extract words from criteria data in order
  const words: string[] = [];
  for (let i = 1; i <= 4; i++) {
    const word = criteriaData[`criteria_${i}`];
    if (word && typeof word === 'string') {
      words.push(word.toLowerCase());
    }
  }

  return {
    positions: [], // This will be managed by the SumLettersConfig component
    words
  };
};

export const formatSumLettersResponse = (sums: number[]): string[] => {
  // Filter out any NaN values and join the numbers
  const validSums = sums.filter(num => !isNaN(num));
  const concatenatedSum = validSums.join('');
  return [concatenatedSum];
};

export const parseSumLettersResponse = (response: string): string => {
  // Clean the response string by removing any non-digit characters
  return response.replace(/\D/g, '');
};