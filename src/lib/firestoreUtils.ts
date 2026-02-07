// src/lib/firestoreUtils.ts - Add this new file

/**
 * Recursively removes undefined values from an object
 * Firestore doesn't accept undefined - it needs null or the field omitted
 */
export const removeUndefined = <T>(obj: T): T => {
  if (obj === null || obj === undefined) {
    return null as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefined) as any;
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Skip undefined values entirely
      if (value === undefined) {
        continue;
      }
      
      // Recursively clean nested objects
      if (value !== null && typeof value === 'object') {
        cleaned[key] = removeUndefined(value);
      } else {
        cleaned[key] = value;
      }
    }
    
    return cleaned;
  }

  return obj;
};

/**
 * Ensures all required fields exist with default values
 */
export const ensureDefaults = (obj: any, defaults: any): any => {
  const result = { ...obj };
  
  for (const [key, defaultValue] of Object.entries(defaults)) {
    if (result[key] === undefined || result[key] === null) {
      result[key] = defaultValue;
    }
  }
  
  return result;
};