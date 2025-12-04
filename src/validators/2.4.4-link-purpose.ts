/**
 * WCAG 2.4.4 - Link Purpose
 * The purpose of each link must be determinable from link text or context.
 * Detects generic link text and links without clear purpose.
 */

export interface LinkPurposeViolation {
  type: 'generic-link-text' | 'empty-link' | 'image-link-no-alt';
  issue: string;
  line: number;
  content: string;
  severity?: 'error' | 'warning';
}

/**
 * Detect links with generic text
 */
function detectGenericLinkText(template: string): LinkPurposeViolation[] {
  const violations: LinkPurposeViolation[] = [];
  
  const lines = template.split('\n');
  const genericTexts = ['click here', 'read more', 'more', 'link', 'go', 'here', 'next', 'previous', '>>>', '<<<'];
  
  lines.forEach((line, idx) => {
    if (/<a[^>]*href/.test(line)) {
      const linkText = line.match(/>([^<]*)</)?.[1]?.toLowerCase().trim();
      
      if (linkText && genericTexts.some(text => linkText === text || linkText.includes(text))) {
        violations.push({
          type: 'generic-link-text',
          issue: `Generic link text detected: "${linkText}". Use descriptive text that explains the link destination.`,
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
 * Detect empty or missing link text
 */
function detectEmptyLink(template: string): LinkPurposeViolation[] {
  const violations: LinkPurposeViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for <a> tags with no text and no aria-label
    const emptyLinkRegex = /<a[^>]*href[^>]*>[\s]*<\/a>/i;
    const missingAriaLabel = !/(aria-label|title|aria-labelledby)/i.test(line);
    
    if (emptyLinkRegex.test(line) && missingAriaLabel) {
      violations.push({
        type: 'empty-link',
        issue: 'Empty link with no text or aria-label. Add descriptive link text or aria-label attribute.',
        line: idx + 1,
        content: line.trim(),
        severity: 'error',
      });
    }
  });
  
  return violations;
}

/**
 * Detect image-only links without alt text
 */
function detectImageLinkNoAlt(template: string): LinkPurposeViolation[] {
  const violations: LinkPurposeViolation[] = [];
  
  const lines = template.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for <a> containing only <img> without alt
    if (/<a[^>]*>[\s]*<img[^>]*>[\s]*<\/a>/.test(line)) {
      const hasAlt = /alt\s*=\s*["'][^"']+["']/.test(line);
      const hasAriaLabel = /aria-label\s*=\s*["'][^"']+["']/.test(line);
      
      if (!hasAlt && !hasAriaLabel) {
        violations.push({
          type: 'image-link-no-alt',
          issue: 'Link contains only an image without alt text or aria-label. Add descriptive alt text to the image.',
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
 * Main WCAG 2.4.4 validator
 */
export function validate2_4_4(template: string): LinkPurposeViolation[] {
  const violations: LinkPurposeViolation[] = [];
  
  violations.push(...detectGenericLinkText(template));
  violations.push(...detectEmptyLink(template));
  violations.push(...detectImageLinkNoAlt(template));
  
  return violations;
}
