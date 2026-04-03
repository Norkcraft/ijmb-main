/**
 * Generates a formatted application ID string based on a numeric sequence.
 * Format: IJMB-YYYY-000000 (e.g. IJMB-2026-000145)
 * 
 * @param sequenceNumber The unique numeric sequence from the database
 * @returns The formatted application ID string
 */
export const generateApplicationId = (sequenceNumber: number): string => {
  const year = new Date().getFullYear();
  const paddedNumber = String(sequenceNumber).padStart(6, '0');
  return `IJMB-${year}-${paddedNumber}`;
};
