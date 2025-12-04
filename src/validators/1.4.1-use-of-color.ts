/**
 * WCAG 1.4.1 - Use of Color
 * Color alone must not be used as the only means of conveying information.
 * Checks for over-reliance on color without text labels or icons.
 */

export interface UseOfColorViolation {
  type: 'color-only-status' | 'color-only-link';
  issue: string;
  line: number;
  content: string;
  severity?: 'error' | 'warning';
}

/**
 * Detect status indicators that rely only on color
 */
function detectColorOnlyStatus(template: string): UseOfColorViolation[] {
  const violations: UseOfColorViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for elements with color classes but no text content or aria-label
    // Pattern: div/span with only color class (success, error, warning, danger, etc.)
    const colorClassPattern = /class\s*=\s*["'].*(?:success|error|warning|danger|pending|active|inactive|disabled|enabled)[^"']*["']/i;
    const hasColorClass = colorClassPattern.test(line);
    
    if (hasColorClass) {
      // Check if element has no text or icon indicators
      const hasTextOrIcon = /(?:>.*[A-Za-z0-9].*<|svg|icon|i\s+class|aria-label)/i.test(line);
      const hasAriaLabel = /aria-label|title\s*=/.test(line);
      
      if (!hasTextOrIcon && !hasAriaLabel && !line.includes('</')) {
        violations.push({
          type: 'color-only-status',
          issue: 'Element uses color class (success/error/warning) without text, icon, or aria-label. Add descriptive text or aria-label.',
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
 * Detect links distinguished only by color (no underline or text difference)
 */
function detectColorOnlyLink(template: string): UseOfColorViolation[] {
  const violations: UseOfColorViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for <a> tags with color-only styling (no text-decoration, no icon, no color-change on hover)
    if (/<a[^>]*href/.test(line)) {
      // Look for style that removes underline without other distinction
      const hasNoDecoration = /text-decoration\s*:\s*none|no-underline/.test(line);
      const hasColorClass = /class\s*=\s*["'][^"']*(?:primary|secondary|accent|link|blue|red)[^"']*["']/.test(line);
      
      if (hasNoDecoration && hasColorClass) {
        violations.push({
          type: 'color-only-link',
          issue: 'Link is styled with color only (no underline or text distinction). Ensure links are underlined or have other visual indicator beyond color.',
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
 * Main WCAG 1.4.1 validator
 */
export function validate1_4_1(template: string): UseOfColorViolation[] {
  const violations: UseOfColorViolation[] = [];
  
  violations.push(...detectColorOnlyStatus(template));
  violations.push(...detectColorOnlyLink(template));
  
  return violations;
}
