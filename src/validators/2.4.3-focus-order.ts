/**
 * WCAG 2.4.3 - Focus Order
 * Ensures the focus order is meaningful and logical.
 * Validates that components with tabindex are ordered correctly.
 */

export interface FocusOrderViolation {
  type: 'negative-tabindex' | 'invalid-tabindex' | 'poor-tabindex-strategy';
  issue: string;
  line: number;
  content: string;
  severity?: 'error' | 'warning';
}

/**
 * Check for negative tabindex values (removes from tab order)
 */
function detectNegativeTabindex(template: string): FocusOrderViolation[] {
  const violations: FocusOrderViolation[] = [];
  
  // Match negative tabindex (tabindex="-1" is valid but should be used sparingly)
  const negativeTabindexRegex = /\btabindex\s*=\s*["']?-\d+["']?/gi;
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    if (negativeTabindexRegex.test(line)) {
      violations.push({
        type: 'negative-tabindex',
        issue: 'Element uses negative tabindex. While valid, negative tabindex hides elements from logical tab order.',
        line: idx + 1,
        content: line.trim(),
        severity: 'warning',
      });
    }
  });
  
  return violations;
}

/**
 * Check for improper tabindex values (> 0)
 */
function detectImproperTabindex(template: string): FocusOrderViolation[] {
  const violations: FocusOrderViolation[] = [];
  
  // Match tabindex with positive values > 0 (poor practice)
  const positiveTabindexRegex = /\btabindex\s*=\s*["']?([1-9]\d*)["']?/gi;
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    const matches = [...line.matchAll(positiveTabindexRegex)];
    if (matches.length > 0) {
      violations.push({
        type: 'invalid-tabindex',
        issue: 'Element uses explicit positive tabindex (> 0). This creates unpredictable focus order. Use tabindex="0" or remove it.',
        line: idx + 1,
        content: line.trim(),
        severity: 'error',
      });
    }
  });
  
  return violations;
}

/**
 * Check for inconsistent tabindex strategy in interactive elements
 */
function detectPoorTabindexStrategy(template: string): FocusOrderViolation[] {
  const violations: FocusOrderViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for interactive divs without tabindex
    if (/@click/.test(line) && !/(tabindex|role\s*=)/.test(line)) {
      const divMatch = /<div[^>]*@click/.test(line) || /<span[^>]*@click/.test(line);
      if (divMatch) {
        violations.push({
          type: 'poor-tabindex-strategy',
          issue: 'Custom interactive element (@click) lacks tabindex and role attributes. Add tabindex="0" and appropriate role.',
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
 * Main WCAG 2.4.3 validator
 */
export function validate2_4_3(template: string): FocusOrderViolation[] {
  const violations: FocusOrderViolation[] = [];
  
  violations.push(...detectNegativeTabindex(template));
  violations.push(...detectImproperTabindex(template));
  violations.push(...detectPoorTabindexStrategy(template));
  
  return violations;
}
