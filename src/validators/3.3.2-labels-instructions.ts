/**
 * WCAG 3.3.2 - Labels or Instructions (Level A)
 * Labels or instructions are provided when content requires user input
 * Detects: Inputs without labels, placeholder misuse, form controls without names
 */

import type { VueComponent, Violation } from '../core/types.js';

export function validate3_3_2(component: VueComponent): Violation[] {
  const violations: Violation[] = [];
  const template = component.template;

  // Pattern 1: Input elements without associated label
  const inputPattern = /<input([^>]*)>/gi;
  let match;
  const inputMatches: Array<{ index: number; attributes: string; fullTag: string }> = [];

  while ((match = inputPattern.exec(template)) !== null) {
    inputMatches.push({
      index: match.index,
      attributes: match[1],
      fullTag: match[0],
    });
  }

  for (const input of inputMatches) {
    const hasAriaLabel = /aria-label\s*=/i.test(input.attributes);
    const hasAriaLabelledBy = /aria-labelledby\s*=/i.test(input.attributes);
    const hasTitle = /title\s*=/i.test(input.attributes);
    const hasName = /name\s*=/i.test(input.attributes);
    const inputId = input.attributes.match(/id\s*=\s*["']([^"']*)["']/i)?.[1];
    const isHidden = /type\s*=\s*["']hidden["']/i.test(input.attributes);
    const isButton = /type\s*=\s*["'](submit|reset|button)["']/i.test(input.attributes);

    // Skip hidden inputs and button-type inputs
    if (isHidden || isButton) continue;

    // Check if input has direct label attributes
    const hasDirectLabel = hasAriaLabel || hasAriaLabelledBy || hasTitle;

    // Check if input is associated with a <label> element
    let hasAssociatedLabel = false;
    if (inputId) {
      const labelPattern = new RegExp(`<label[^>]*for\\s*=\\s*["']${inputId}["'][^>]*>`, 'i');
      hasAssociatedLabel = labelPattern.test(template);
    }

    if (!hasDirectLabel && !hasAssociatedLabel && hasName) {
      const lineNum = template.substring(0, input.index).split('\n').length;

      violations.push({
        ruleId: '3.3.2',
        ruleName: 'Labels or Instructions',
        severity: 'error',
        line: lineNum,
        content: input.fullTag.substring(0, 60),
        issue: 'Input field has no associated label or aria-label',
        recommendation: 'Add <label for="id"> element or use aria-label/aria-labelledby attributes',
      });
    }

    // Pattern 2: Placeholder misuse (placeholder should NOT replace label)
    const hasPlaceholder = /placeholder\s*=/i.test(input.attributes);
    if (hasPlaceholder && !hasDirectLabel && !hasAssociatedLabel) {
      const lineNum = template.substring(0, input.index).split('\n').length;

      violations.push({
        ruleId: '3.3.2',
        ruleName: 'Labels or Instructions',
        severity: 'warning',
        line: lineNum,
        content: input.fullTag.substring(0, 60),
        issue: 'Placeholder attribute used as substitute for label (placeholder disappears on input)',
        recommendation: 'Add a separate <label> element; use placeholder only as additional hint, not replacement',
      });
    }
  }

  // Pattern 3: Select elements without labels
  const selectPattern = /<select([^>]*)>/gi;
  let selectMatch;

  while ((selectMatch = selectPattern.exec(template)) !== null) {
    const attributes = selectMatch[1];
    const fullTag = selectMatch[0];

    const hasAriaLabel = /aria-label\s*=/i.test(attributes);
    const hasAriaLabelledBy = /aria-labelledby\s*=/i.test(attributes);
    const selectId = attributes.match(/id\s*=\s*["']([^"']*)["']/i)?.[1];

    const hasDirectLabel = hasAriaLabel || hasAriaLabelledBy;
    let hasAssociatedLabel = false;

    if (selectId) {
      const labelPattern = new RegExp(`<label[^>]*for\\s*=\\s*["']${selectId}["'][^>]*>`, 'i');
      hasAssociatedLabel = labelPattern.test(template);
    }

    if (!hasDirectLabel && !hasAssociatedLabel) {
      const lineNum = template.substring(0, selectMatch.index).split('\n').length;

      violations.push({
        ruleId: '3.3.2',
        ruleName: 'Labels or Instructions',
        severity: 'error',
        line: lineNum,
        content: fullTag.substring(0, 60),
        issue: 'Select element has no associated label',
        recommendation: 'Add <label for="id"> element or use aria-label/aria-labelledby attributes',
      });
    }
  }

  // Pattern 4: Textarea without labels
  const textareaPattern = /<textarea([^>]*)>/gi;
  let textareaMatch;

  while ((textareaMatch = textareaPattern.exec(template)) !== null) {
    const attributes = textareaMatch[1];
    const fullTag = textareaMatch[0];

    const hasAriaLabel = /aria-label\s*=/i.test(attributes);
    const hasAriaLabelledBy = /aria-labelledby\s*=/i.test(attributes);
    const textareaId = attributes.match(/id\s*=\s*["']([^"']*)["']/i)?.[1];

    const hasDirectLabel = hasAriaLabel || hasAriaLabelledBy;
    let hasAssociatedLabel = false;

    if (textareaId) {
      const labelPattern = new RegExp(`<label[^>]*for\\s*=\\s*["']${textareaId}["'][^>]*>`, 'i');
      hasAssociatedLabel = labelPattern.test(template);
    }

    if (!hasDirectLabel && !hasAssociatedLabel) {
      const lineNum = template.substring(0, textareaMatch.index).split('\n').length;

      violations.push({
        ruleId: '3.3.2',
        ruleName: 'Labels or Instructions',
        severity: 'error',
        line: lineNum,
        content: fullTag.substring(0, 60),
        issue: 'Textarea element has no associated label',
        recommendation: 'Add <label for="id"> element or use aria-label/aria-labelledby attributes',
      });
    }
  }

  // Pattern 5: Form with no fieldset/legend for grouped inputs
  const formPattern = /<form([^>]*)>([\s\S]*?)<\/form>/gi;
  let formMatch;

  while ((formMatch = formPattern.exec(template)) !== null) {
    const formContent = formMatch[2];

    // Check if form has multiple unlabeled inputs
    const multipleInputs = (formContent.match(/<input[^>]*>/gi) || []).length > 1;
    const hasFieldset = /<fieldset/i.test(formContent);

    if (multipleInputs && !hasFieldset) {
      const lineNum = template.substring(0, formMatch.index).split('\n').length;

      violations.push({
        ruleId: '3.3.2',
        ruleName: 'Labels or Instructions',
        severity: 'warning',
        line: lineNum,
        content: '<form>...</form>',
        issue: 'Form with multiple inputs lacks fieldset/legend for grouping',
        recommendation: 'Use <fieldset> with <legend> to group related inputs and provide instructions',
      });
    }
  }

  return violations;
}
