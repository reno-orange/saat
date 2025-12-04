/**
 * WCAG 2.1 Rule 4.1.2: Name, Role, Value (Level A)
 *
 * For all user interface components, the name and role can be determined
 * programmatically; states, properties, and values that can be set by the user
 * can be programmatically set; and notification of changes to these items is
 * available to user agents.
 *
 * Common patterns checked:
 * - Buttons have accessible names
 * - Form controls have names/labels
 * - Interactive elements have proper roles
 */

import type { VueComponent, Violation } from '../core/types';

/**
 * Check if buttons have accessible names
 */
function checkButtonNames(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  // Find all button elements
  const buttonRegex = /<button[^>]*>(.*?)<\/button>/gs;
  let match;

  while ((match = buttonRegex.exec(component.template)) !== null) {
    const buttonTag = match[0];
    const buttonContent = match[1];
    const hasAriaLabel = /aria-label=/.test(buttonTag);
    const hasAriaLabelledby = /aria-labelledby=/.test(buttonTag);
    const hasTextContent = buttonContent && buttonContent.trim().length > 0;

    if (!hasAriaLabel && !hasAriaLabelledby && !hasTextContent) {
      const lineNum = component.template.substring(0, match.index).split('\n').length;
      violations.push({
        ruleId: '4.1.2',
        ruleName: 'Name, Role, Value',
        severity: 'error',
        line: lineNum,
        content: buttonTag.substring(0, 50),
        issue: 'Button has no accessible name',
        recommendation: 'Add visible text content, aria-label, or aria-labelledby to the button',
      });
    }
  }

  return violations;
}

/**
 * Check if form controls have associated names
 */
function checkFormControlNames(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  // Find select elements
  const selectRegex = /<select[^>]*>/g;
  let match;

  while ((match = selectRegex.exec(component.template)) !== null) {
    const selectTag = match[0];
    const hasName = /name=|aria-label=/.test(selectTag);
    const hasAssociatedLabel = /id=["']([^"']+)["']/.test(selectTag) && 
      new RegExp(`<label[^>]*for=["']${RegExp.$1}["']`).test(component.template);

    if (!hasName && !hasAssociatedLabel) {
      const lineNum = component.template.substring(0, match.index).split('\n').length;
      violations.push({
        ruleId: '4.1.2',
        ruleName: 'Name, Role, Value',
        severity: 'error',
        line: lineNum,
        content: selectTag,
        issue: 'Select element has no accessible name',
        recommendation: 'Add a name attribute or associate a label using for/id',
      });
    }
  }

  return violations;
}

/**
 * Check if custom interactive elements have proper roles
 */
function checkCustomElementRoles(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  // Find divs with click handlers that should have role
  const clickableDivRegex = /<div[^>]*@click[^>]*>/g;
  let match;

  while ((match = clickableDivRegex.exec(component.template)) !== null) {
    const divTag = match[0];
    const hasRole = /role=/.test(divTag);
    const hasKeyboardHandler = /@keydown|@keyup|@keypress/.test(divTag);

    if (!hasRole) {
      const lineNum = component.template.substring(0, match.index).split('\n').length;
      violations.push({
        ruleId: '4.1.2',
        ruleName: 'Name, Role, Value',
        severity: 'error',
        line: lineNum,
        content: divTag.substring(0, 50),
        issue: 'Custom interactive element missing role attribute',
        recommendation: 'Add role="button" or appropriate role to the div element',
      });
    }

    if (!hasKeyboardHandler) {
      const lineNum = component.template.substring(0, match.index).split('\n').length;
      violations.push({
        ruleId: '4.1.2',
        ruleName: 'Name, Role, Value',
        severity: 'warning',
        line: lineNum,
        content: divTag.substring(0, 50),
        issue: 'Custom interactive element missing keyboard handlers',
        recommendation: 'Add @keydown handler for keyboard accessibility',
      });
    }
  }

  return violations;
}

/**
 * Main validator for 4.1.2
 */
export function validate4_1_2(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  violations.push(...checkButtonNames(component));
  violations.push(...checkFormControlNames(component));
  violations.push(...checkCustomElementRoles(component));

  return violations;
}
