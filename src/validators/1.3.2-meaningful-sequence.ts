/**
 * WCAG 1.3.2 - Meaningful Sequence
 * The reading order of content must be the same as the visual order.
 * Checks for CSS that changes visual order (flexbox order, grid placement) without reflecting in HTML.
 */

export interface MeaningfulSequenceViolation {
  type: 'css-order-mismatch' | 'visual-reorder-warning';
  issue: string;
  line: number;
  content: string;
  severity?: 'error' | 'warning';
}

/**
 * Detect CSS order property that might reorder elements
 */
function detectCSSOrderMismatch(template: string): MeaningfulSequenceViolation[] {
  const violations: MeaningfulSequenceViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Detect style attributes with order property
    if (/order\s*:\s*(?!0|initial|inherit)[^;]*/i.test(line)) {
      violations.push({
        type: 'css-order-mismatch',
        issue: 'CSS order property detected. Ensure the visual order matches the HTML source order for keyboard navigation and screen readers.',
        line: idx + 1,
        content: line.trim(),
        severity: 'warning',
      });
    }
    
    // Detect CSS grid with explicit placement that might reorder
    if (/grid-column|grid-row|column:\s*[0-9]|row:\s*[0-9]/.test(line)) {
      violations.push({
        type: 'visual-reorder-warning',
        issue: 'CSS Grid placement detected. Verify that visual order matches source order or update source order to match visual layout.',
        line: idx + 1,
        content: line.trim(),
        severity: 'warning',
      });
    }
  });
  
  return violations;
}

/**
 * Detect flexbox reverse that changes visual order
 */
function detectFlexboxReverse(template: string): MeaningfulSequenceViolation[] {
  const violations: MeaningfulSequenceViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Detect flex-direction: row-reverse or column-reverse
    if (/flex-direction\s*:\s*(?:row|column)-reverse/i.test(line)) {
      violations.push({
        type: 'visual-reorder-warning',
        issue: 'CSS flexbox reverse detected. Ensure reading order matches visual order by restructuring HTML if needed.',
        line: idx + 1,
        content: line.trim(),
        severity: 'warning',
      });
    }
  });
  
  return violations;
}

/**
 * Main WCAG 1.3.2 validator
 */
export function validate1_3_2(template: string): MeaningfulSequenceViolation[] {
  const violations: MeaningfulSequenceViolation[] = [];
  
  violations.push(...detectCSSOrderMismatch(template));
  violations.push(...detectFlexboxReverse(template));
  
  return violations;
}
