/**
 * WCAG 4.1.3 - Status Messages
 * Status messages must be announced to users without requiring focus.
 * Checks for aria-live and aria-atomic attributes on dynamic content.
 */

export interface StatusMessageViolation {
  type: 'missing-aria-live' | 'aria-live-off';
  issue: string;
  line: number;
  content: string;
  severity?: 'error' | 'warning';
}

/**
 * Detect dynamic content that should have aria-live but doesn't
 */
function detectMissingAriaLive(template: string): StatusMessageViolation[] {
  const violations: StatusMessageViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for common status elements without aria-live
    const statusPatterns = [
      /<div[^>]*(?:class|id)\s*=\s*["'].*(?:status|message|alert|notification|toast|banner)[^"']*["'][^>]*>/i,
      /<div[^>]*(?:role\s*=\s*["'](?:status|alert)[^"']*["'])[^>]*>/i,
    ];
    
    const hasStatusIndicator = statusPatterns.some(pattern => pattern.test(line));
    const hasAriaLive = /aria-live\s*=\s*["'](?!off)[^"']+["']/i.test(line);
    
    if (hasStatusIndicator && !hasAriaLive) {
      violations.push({
        type: 'missing-aria-live',
        issue: 'Status message element lacks aria-live attribute. Add aria-live="polite" or aria-live="assertive" for dynamic updates.',
        line: idx + 1,
        content: line.trim(),
        severity: 'error',
      });
    }
  });
  
  return violations;
}

/**
 * Detect aria-live set to "off" on dynamic content (poor practice)
 */
function detectAriaLiveOff(template: string): StatusMessageViolation[] {
  const violations: StatusMessageViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for aria-live="off" on elements that look dynamic
    if (/aria-live\s*=\s*["']off["']/i.test(line)) {
      const hasVueUpdate = /@input|@change|v-model|v-show|v-if/.test(line);
      
      if (hasVueUpdate) {
        violations.push({
          type: 'aria-live-off',
          issue: 'Dynamic element has aria-live="off". Remove this attribute or set it to "polite"/"assertive" if updates should be announced.',
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
 * Main WCAG 4.1.3 validator
 */
export function validate4_1_3(template: string): StatusMessageViolation[] {
  const violations: StatusMessageViolation[] = [];
  
  violations.push(...detectMissingAriaLive(template));
  violations.push(...detectAriaLiveOff(template));
  
  return violations;
}
