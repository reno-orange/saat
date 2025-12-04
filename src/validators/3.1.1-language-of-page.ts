/**
 * WCAG 3.1.1 - Language of Page
 * The default human language of each page must be programmatically determinable.
 * Checks for lang attribute on HTML element.
 */

export interface LanguageViolation {
  type: 'missing-lang' | 'invalid-lang';
  issue: string;
  line?: number;
  content?: string;
  severity?: 'error' | 'warning';
}

/**
 * Check for missing lang attribute on html element
 */
function detectMissingLangAttribute(template: string): LanguageViolation[] {
  const violations: LanguageViolation[] = [];
  
  // Check if <html lang="..."> is present
  if (!/<html[^>]+lang\s*=\s*["'][a-z]{2}([-_][a-z]{2})?["']/i.test(template)) {
    violations.push({
      type: 'missing-lang',
      issue: 'HTML element lacks lang attribute. Add lang="fr" or appropriate language code to the <html> element.',
      severity: 'error',
    });
  }
  
  return violations;
}

/**
 * Check for invalid lang attribute values
 */
function detectInvalidLangAttribute(template: string): LanguageViolation[] {
  const violations: LanguageViolation[] = [];
  
  // Match lang attributes with invalid values
  const langRegex = /<html[^>]*lang\s*=\s*["']([^"']+)["']/i;
  const match = template.match(langRegex);
  
  if (match) {
    const langValue = match[1];
    // Valid format: 2-letter code optionally followed by 2-letter region (en, en-US, fr-CA, etc.)
    if (!/^[a-z]{2}(-[a-z]{2})?$/i.test(langValue)) {
      violations.push({
        type: 'invalid-lang',
        issue: `Invalid lang value: "${langValue}". Use format like "fr", "en-US", "de-CH".`,
        content: match[0],
        severity: 'error',
      });
    }
  }
  
  return violations;
}

/**
 * Main WCAG 3.1.1 validator
 */
export function validate3_1_1(template: string): LanguageViolation[] {
  const violations: LanguageViolation[] = [];
  
  violations.push(...detectMissingLangAttribute(template));
  violations.push(...detectInvalidLangAttribute(template));
  
  return violations;
}
