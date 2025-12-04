/**
 * WCAG 2.5.1 - Pointer Gestures (Level A)
 * All functionality using multipoint or path-based gestures must have keyboard alternative
 * Detects: Touch/pointer events without keyboard alternatives, swipe gestures
 */

import type { VueComponent, Violation } from '../core/types.js';

export function validate2_5_1(component: VueComponent): Violation[] {
  const violations: Violation[] = [];
  const template = component.template;

  // Pattern 1: @pointerdown, @pointerup, @pointermove without keyboard handlers
  const pointerEventPattern = /@(pointerdown|pointerup|pointermove|gesturestart|gesturechange|gestureend)(?:\s*\(|\s*=)/gi;
  let match;

  while ((match = pointerEventPattern.exec(template)) !== null) {
    const eventType = match[1];
    const lineNum = template.substring(0, match.index).split('\n').length;

    // Extract the element tag to get full context
    const tagStart = template.lastIndexOf('<', match.index);
    const tagEnd = template.indexOf('>', match.index) + 1;
    const fullTag = template.substring(tagStart, tagEnd);

    // Check if keyboard handler exists
    if (!/@(keydown|keyup|keypress)\s*=/i.test(fullTag)) {
      violations.push({
        ruleId: '2.5.1',
        ruleName: 'Pointer Gestures',
        severity: 'error',
        line: lineNum,
        content: fullTag.substring(0, 60),
        issue: `Pointer event @${eventType} detected without keyboard handler`,
        recommendation: `Add @keydown or @keyup handler to provide keyboard alternative for @${eventType}`,
      });
    }
  }

  // Pattern 2: Touch event handlers without keyboard alternatives
  const touchEventPattern = /@(touchstart|touchend|touchmove|swipe|tap)(?:\s*\(|\s*=)/gi;

  while ((match = touchEventPattern.exec(template)) !== null) {
    const eventType = match[1];
    const lineNum = template.substring(0, match.index).split('\n').length;

    // Extract the element tag
    const tagStart = template.lastIndexOf('<', match.index);
    const tagEnd = template.indexOf('>', match.index) + 1;
    const fullTag = template.substring(tagStart, tagEnd);

    // Check if keyboard handler exists
    if (!/@(keydown|keyup|keypress)\s*=/i.test(fullTag)) {
      violations.push({
        ruleId: '2.5.1',
        ruleName: 'Pointer Gestures',
        severity: 'error',
        line: lineNum,
        content: fullTag.substring(0, 60),
        issue: `Touch event @${eventType} detected without keyboard handler`,
        recommendation: `Add @keydown or @keyup handler to provide keyboard alternative for @${eventType}`,
      });
    }
  }

  // Pattern 3: v-touch directive or custom touch libraries
  const vTouchPattern = /v-touch[:\s]/gi;

  while ((match = vTouchPattern.exec(template)) !== null) {
    const lineNum = template.substring(0, match.index).split('\n').length;

    // Extract the element tag
    const tagStart = template.lastIndexOf('<', match.index);
    const tagEnd = template.indexOf('>', match.index) + 1;
    const fullTag = template.substring(tagStart, tagEnd);

    // Check if keyboard handler exists
    if (!/@(keydown|keyup|keypress|click)\s*=/i.test(fullTag)) {
      violations.push({
        ruleId: '2.5.1',
        ruleName: 'Pointer Gestures',
        severity: 'error',
        line: lineNum,
        content: fullTag.substring(0, 60),
        issue: 'v-touch directive detected without keyboard handler',
        recommendation: 'Add @keydown or @keyup handler to provide keyboard alternative for touch gestures',
      });
    }
  }

  // Pattern 4: Double-tap or multi-touch patterns (data attributes)
  const multiTouchPattern = /(double-tap|long-press|pinch-zoom|two-finger)/gi;

  while ((match = multiTouchPattern.exec(template)) !== null) {
    const lineNum = template.substring(0, match.index).split('\n').length;

    // Extract context
    const contextStart = Math.max(0, match.index - 100);
    const contextEnd = Math.min(template.length, match.index + 100);
    const context = template.substring(contextStart, contextEnd);

    violations.push({
      ruleId: '2.5.1',
      ruleName: 'Pointer Gestures',
      severity: 'warning',
      line: lineNum,
      content: context.substring(0, 60),
      issue: `Multi-touch gesture pattern detected (${match[0]}), verify keyboard alternative`,
      recommendation: 'Ensure all multi-touch gestures have keyboard-accessible alternatives',
    });
  }

  return violations;
}
