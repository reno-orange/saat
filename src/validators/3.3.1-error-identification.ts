/**
 * WCAG 3.3.1 - Error Identification
 * Errors must be identified and described in text to the user.
 * Checks for error messages without proper accessibility and messaging.
 */

export interface ErrorIdentificationViolation {
  type: 'missing-error-message' | 'missing-aria-invalid' | 'missing-error-connection';
  issue: string;
  line: number;
  content: string;
  severity?: 'error' | 'warning';
}

/**
 * Detect form fields marked as invalid without error message
 */
function detectMissingErrorMessage(template: string): ErrorIdentificationViolation[] {
  const violations: ErrorIdentificationViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for aria-invalid="true" without following error message
    if (/aria-invalid\s*=\s*["']true["']/.test(line)) {
      // Look for error text indicator in same or next few lines
      const contextLines = lines.slice(idx, Math.min(idx + 3)).join(' ');
      const hasErrorText = /error|invalid|required|incorrect/.test(contextLines);
      
      if (!hasErrorText) {
        violations.push({
          type: 'missing-error-message',
          issue: 'Field marked as invalid (aria-invalid="true") but no error message found. Add descriptive error text.',
          line: idx + 1,
          content: line.trim(),
          severity: 'error',
        });
      }
    }
  });
  
  return violations;
}

/**
 * Detect form fields with error styling but no aria-invalid
 */
function detectMissingAriaInvalid(template: string): ErrorIdentificationViolation[] {
  const violations: ErrorIdentificationViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for input/select/textarea with error class but no aria-invalid
    const errorClassRegex = /(?:input|select|textarea)[^>]*class\s*=\s*["'].*(?:error|invalid|has-error)[^"']*["']/i;
    const hasErrorClass = errorClassRegex.test(line);
    const hasAriaInvalid = /aria-invalid/.test(line);
    
    if (hasErrorClass && !hasAriaInvalid) {
      violations.push({
        type: 'missing-aria-invalid',
        issue: 'Form field has error styling but lacks aria-invalid="true". Add aria-invalid for screen reader users.',
        line: idx + 1,
        content: line.trim(),
        severity: 'warning',
      });
    }
  });
  
  return violations;
}

/**
 * Detect error messages not connected to fields via aria-describedby
 */
function detectMissingErrorConnection(template: string): ErrorIdentificationViolation[] {
  const violations: ErrorIdentificationViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for input with aria-invalid but no aria-describedby linking to error
    if (/<input[^>]*aria-invalid\s*=\s*["']true["']/.test(line)) {
      const hasAriaDescribedby = /aria-describedby\s*=/.test(line);
      
      if (!hasAriaDescribedby) {
        violations.push({
          type: 'missing-error-connection',
          issue: 'Input field marked invalid but lacks aria-describedby linking to error message. Add aria-describedby="error-id".',
          line: idx + 1,
          content: line.trim(),
          severity: 'warning',
        });
      }
    }
  });
  
  return violations;
}

/**
 * Main WCAG 3.3.1 validator
 */
export function validate3_3_1(template: string): ErrorIdentificationViolation[] {
  const violations: ErrorIdentificationViolation[] = [];
  
  violations.push(...detectMissingErrorMessage(template));
  violations.push(...detectMissingAriaInvalid(template));
  violations.push(...detectMissingErrorConnection(template));
  
  return violations;
}
