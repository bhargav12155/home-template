/**
 * Unique ID Generator for User URLs
 * 
 * Generates unique 8-character IDs in format: ABC123XY
 * - First 3 characters: Letters (A-Z)
 * - Next 3 characters: Numbers (0-9)  
 * - Last 2 characters: Letters (A-Z)
 */

/**
 * Generate a unique 8-character ID for users
 * Format: ABC123XY (3 letters + 3 numbers + 2 letters)
 */
export function generateUniqueId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let uniqueId = '';
  
  // First 3 characters: Letters
  for (let i = 0; i < 3; i++) {
    uniqueId += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Next 3 characters: Numbers
  for (let i = 0; i < 3; i++) {
    uniqueId += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  // Last 2 characters: Letters
  for (let i = 0; i < 2; i++) {
    uniqueId += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  return uniqueId;
}

/**
 * Validate unique ID format
 */
export function isValidUniqueId(id: string): boolean {
  // Must be exactly 8 characters
  if (id.length !== 8) return false;
  
  // First 3 must be letters
  if (!/^[A-Z]{3}/.test(id.substring(0, 3))) return false;
  
  // Next 3 must be numbers
  if (!/^[0-9]{3}/.test(id.substring(3, 6))) return false;
  
  // Last 2 must be letters
  if (!/^[A-Z]{2}/.test(id.substring(6, 8))) return false;
  
  return true;
}

/**
 * Generate multiple unique IDs and ensure they're unique
 */
export async function generateUniqueUserIds(count: number = 1, existingIds: string[] = []): Promise<string[]> {
  const ids: string[] = [];
  const existingSet = new Set(existingIds);
  
  while (ids.length < count) {
    const newId = generateUniqueId();
    
    // Make sure it's not already in use
    if (!existingSet.has(newId) && !ids.includes(newId)) {
      ids.push(newId);
      existingSet.add(newId);
    }
  }
  
  return ids;
}

/**
 * Format unique ID for display (adds spacing for readability)
 */
export function formatUniqueId(id: string): string {
  if (!isValidUniqueId(id)) return id;
  
  // Format as: ABC 123 XY
  return `${id.substring(0, 3)} ${id.substring(3, 6)} ${id.substring(6, 8)}`;
}

// Example usage:
// const id = generateUniqueId(); // "ABC123XY"
// const formatted = formatUniqueId(id); // "ABC 123 XY"
// const isValid = isValidUniqueId("ABC123XY"); // true
