/**
 * Parses error responses from the backend into a clean, user-friendly string.
 * Handles strings, arrays, DRF-style error objects, and ErrorDetail technical strings.
 */
export const parseError = (error) => {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') {
    // Check if it's the raw ErrorDetail string representation (protection for any missed cleanup)
    if (error.includes("ErrorDetail(string=")) {
      const match = error.match(/string='(.*?)'/);
      if (match && match[1]) return match[1];
    }
    return error;
  }

  // Handle Arrays (take the first error)
  if (Array.isArray(error)) {
    if (error.length === 0) return 'An unknown error occurred';
    return parseError(error[0]);
  }

  // Handle Objects (DRF style or custom)
  if (typeof error === 'object') {
    // Common keys used by our API
    const message = error.error || error.detail || error.message;
    if (message) return parseError(message);

    // If it's a validation error object like { "filename": ["..."] }
    const firstKey = Object.keys(error)[0];
    if (firstKey) {
      const fieldError = error[firstKey];
      const prefix = firstKey !== 'non_field_errors' ? `${firstKey}: ` : '';
      return prefix + parseError(fieldError);
    }
  }

  return 'An unknown error occurred';
};
