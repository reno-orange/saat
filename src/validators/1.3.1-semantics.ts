/**
 * WCAG 2.1 Rule 1.3.1: Info and Relationships (Level A)
 *
 * Checks that information and relationships conveyed through presentation are
 * also available programmatically or in text.
 *
 * Common patterns checked:
 * - Form inputs have associated labels
 * - Lists use semantic elements (ul, ol, li)
 * - Headings have proper hierarchy
 */

import type { VueComponent, Violation } from '../core/types';

/**
 * Check if input has associated label
 */
function checkInputLabel(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  // Find inputs without labels
  const inputRegex = /<input[^>]*(?!type=["']hidden["'])[^>]*id=["']([^"']+)["'][^>]*>/g;
  let match;

  while ((match = inputRegex.exec(component.template)) !== null) {
    const inputId = match[1];
    // Check if there's a label with matching 'for' attribute
    const labelRegex = new RegExp(`<label[^>]*for=["']${inputId}["'][^>]*>`, 'g');

    if (!labelRegex.test(component.template)) {
      const lineNum = component.template.substring(0, match.index).split('\n').length;
      violations.push({
        ruleId: '1.3.1',
        ruleName: 'Info and Relationships',
        severity: 'error',
        line: lineNum,
        content: match[0],
        issue: `Input with id="${inputId}" has no associated label`,
        recommendation: `Add <label for="${inputId}">Label text</label>`,
      });
    }
  }

  return violations;
}

/**
 * Check for semantic list usage
 */
function checkListSemantics(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  // Check for v-for on non-semantic elements that should be lists
  const vForDivRegex = /<div[^>]*v-for[^>]*>[^<]*<\/div>/g;
  const matches = component.template.match(vForDivRegex) || [];

  // This is a heuristic - flag div with v-for that might be a list
  matches.forEach((match: string) => {
    const line = component.template.substring(0, component.template.indexOf(match)).split('\n').length;
    violations.push({
      ruleId: '1.3.1',
      ruleName: 'Info and Relationships',
      severity: 'warning',
      line,
      content: match.substring(0, 50) + '...',
      issue: 'Potential list using div instead of ul/ol/li',
      recommendation: 'Consider using <ul><li v-for="..."> or <ol><li v-for="..."> for list structures',
    });
  });

  return violations;
}

/**
 * Check heading hierarchy (h1 -> h2 -> h3, no jumps)
 */
function checkHeadingHierarchy(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  const headingRegex = /<h([1-6])[^>]*>/g;
  const headings: Array<{ level: number; line: number }> = [];
  let match;

  while ((match = headingRegex.exec(component.template)) !== null) {
    const level = parseInt(match[1]);
    const line = component.template.substring(0, match.index).split('\n').length;
    headings.push({ level, line });
  }

  // Check for hierarchy jumps (e.g., h1 -> h3)
  for (let i = 1; i < headings.length; i++) {
    const prevLevel = headings[i - 1].level;
    const currentLevel = headings[i].level;

    if (currentLevel > prevLevel + 1) {
      violations.push({
        ruleId: '1.3.1',
        ruleName: 'Info and Relationships',
        severity: 'warning',
        line: headings[i].line,
        content: `<h${currentLevel}>`,
        issue: `Heading hierarchy jump from h${prevLevel} to h${currentLevel}`,
        recommendation: `Use h${prevLevel + 1} instead of h${currentLevel} to maintain proper hierarchy`,
      });
    }
  }

  return violations;
}

/**
 * Main validator for 1.3.1
 */
export function validate1_3_1(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  violations.push(...checkInputLabel(component));
  violations.push(...checkListSemantics(component));
  violations.push(...checkHeadingHierarchy(component));

  return violations;
}

