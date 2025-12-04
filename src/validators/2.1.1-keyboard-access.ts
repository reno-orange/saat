/**
 * WCAG 2.1.1 - Keyboard Access (Level A)
 * All functionality must be operable via keyboard interface
 * Detects: disabled buttons, non-focusable inputs, disabled form controls
 */

import type { VueComponent, Violation } from '../core/types.js';

export function validate2_1_1(component: VueComponent): Violation[] {
  const violations: Violation[] = [];
  const template = component.template;

  // Pattern 1: Disabled buttons/inputs
  const disabledPattern = /<(button|input|select|textarea)([^>]*\s+)?disabled(?:\s*=\s*["']disabled["'])?([^>]*)>/gi;
  let match;

  while ((match = disabledPattern.exec(template)) !== null) {
    const elementType = match[1].toLowerCase();
    const fullTag = match[0];
    const lineNum = template.substring(0, match.index).split('\n').length;

    // Disabled elements are keyboard inaccessible
    violations.push({
      ruleId: '2.1.1',
      ruleName: 'Keyboard Access',
      severity: 'error',
      line: lineNum,
      content: fullTag.substring(0, 60),
      issue: `${elementType.charAt(0).toUpperCase() + elementType.slice(1)} element is disabled and not keyboard accessible`,
      recommendation: 'Remove disabled attribute or provide a keyboard-accessible alternative to enable/disable functionality',
    });
  }

  // Pattern 2: Input elements without tabindex when in a complex widget
  // (simplified: only flag inputs that are clearly not focusable)
  const inputPattern = /<input([^>]*)>/gi;
  disabledPattern.lastIndex = 0;

  while ((match = inputPattern.exec(template)) !== null) {
    const attributes = match[1];
    const fullTag = match[0];
    const lineNum = template.substring(0, match.index).split('\n').length;

    // Check for pointer-events: none (common anti-pattern)
    if (/pointer-events\s*:\s*none/i.test(attributes)) {
      violations.push({
        ruleId: '2.1.1',
        ruleName: 'Keyboard Access',
        severity: 'error',
        line: lineNum,
        content: fullTag.substring(0, 60),
        issue: 'Input element has pointer-events: none, making it not keyboard accessible',
        recommendation: 'Remove pointer-events: none or provide a keyboard-accessible alternative',
      });
    }

    // Check for hidden tabindex (tabindex="-1" on interactive elements)
    if (/tabindex\s*=\s*["']-1["']/i.test(attributes) && !/(readonly|disabled)/i.test(attributes)) {
      violations.push({
        ruleId: '2.1.1',
        ruleName: 'Keyboard Access',
        severity: 'warning',
        line: lineNum,
        content: fullTag.substring(0, 60),
        issue: 'Input has tabindex="-1", removing it from keyboard navigation',
        recommendation: 'Only use tabindex="-1" for non-interactive elements or provide an alternative keyboard path',
      });
    }
  }

  // Pattern 3: Buttons with onclick handlers only (no keyboard support)
  const buttonPattern = /<button([^>]*)>([^<]*)/gi;

  while ((match = buttonPattern.exec(template)) !== null) {
    const attributes = match[1];
    const fullTag = match[0];
    const lineNum = template.substring(0, match.index).split('\n').length;

    // Button with @click or @mousedown but no @keydown
    if (/@(click|mousedown|mouseup)\s*=/i.test(attributes) && !/@keydown/i.test(attributes) && !/@keyup/i.test(attributes)) {
      // Only warn if also has style that makes it not look like a button
      if (/role\s*=\s*["'](?!button)/i.test(attributes)) {
        violations.push({
          ruleId: '2.1.1',
          ruleName: 'Keyboard Access',
          severity: 'warning',
          line: lineNum,
          content: fullTag.substring(0, 60),
          issue: 'Button with mouse handler but no keyboard handler detected',
          recommendation: 'Add @keydown or @keyup handler for keyboard accessibility (or native <button> handles this)',
        });
      }
    }
  }

  // Pattern 4: Custom interactive divs with pointer-events but no keyboard
  const divClickPattern = /<div([^>]*@(click|pointerdown|pointerup|mousedown)[^>]*)>/gi;

  while ((match = divClickPattern.exec(template)) !== null) {
    const attributes = match[1];
    const fullTag = match[0];
    const lineNum = template.substring(0, match.index).split('\n').length;

    // Div with click handler but no keyboard handler and no button role
    if (!/@(keydown|keyup)\s*=/i.test(attributes) && !/(role\s*=\s*["']button["']|role\s*=\s*["'](?:menuitem|tab|option))/i.test(attributes)) {
      violations.push({
        ruleId: '2.1.1',
        ruleName: 'Keyboard Access',
        severity: 'error',
        line: lineNum,
        content: fullTag.substring(0, 60),
        issue: 'Interactive div has pointer handlers but no keyboard handlers',
        recommendation: 'Add @keydown handler or use native <button> element; ensure role="button" if custom widget',
      });
    }
  }

  return violations;
}
