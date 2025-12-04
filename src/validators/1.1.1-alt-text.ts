/**
 * WCAG 2.1 Rule 1.1.1: Non-text Content (Level A)
 *
 * All non-text content that is presented to the user has a text alternative
 * that serves the equivalent purpose, except for specific situations.
 *
 * Common patterns checked:
 * - Images have alt attributes (not empty)
 * - SVGs have title or aria-label
 * - Icon buttons have labels
 */

import type { VueComponent, Violation } from '../core/types';

/**
 * Check if images have alt text
 */
function checkImageAltText(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  // Find all img elements
  const imgRegex = /<img[^>]*>/g;
  let match;

  while ((match = imgRegex.exec(component.template)) !== null) {
    const imgTag = match[0];
    const hasAlt = /alt=["']([^"']*)["']/.test(imgTag);
    const altValue = RegExp.$1;

    const hasAriaLabel = /aria-label=["']([^"']*)["']/.test(imgTag);
    // const ariaLabelValue = RegExp.$1;

    // Check if it's a decorative image (role="presentation" or aria-hidden)
    const isDecorative = /role=["']presentation["']|aria-hidden=["']true["']/.test(imgTag);

    if (isDecorative) {
      // Decorative images should have empty alt
      if (hasAlt && altValue.trim().length > 0) {
        const lineNum = component.template.substring(0, match.index).split('\n').length;
        violations.push({
          ruleId: '1.1.1',
          ruleName: 'Non-text Content',
          severity: 'warning',
          line: lineNum,
          content: imgTag,
          issue: 'Decorative image has non-empty alt text',
          recommendation: 'Use alt="" for purely decorative images',
        });
      }
    } else {
      // Content images must have alt or aria-label
      if (!hasAlt && !hasAriaLabel) {
        const lineNum = component.template.substring(0, match.index).split('\n').length;
        violations.push({
          ruleId: '1.1.1',
          ruleName: 'Non-text Content',
          severity: 'error',
          line: lineNum,
          content: imgTag,
          issue: 'Image missing alt attribute',
          recommendation: 'Add descriptive alt text: alt="description of image content"',
        });
      } else if (hasAlt && !altValue.trim().length) {
        const lineNum = component.template.substring(0, match.index).split('\n').length;
        violations.push({
          ruleId: '1.1.1',
          ruleName: 'Non-text Content',
          severity: 'error',
          line: lineNum,
          content: imgTag,
          issue: 'Image has empty alt attribute',
          recommendation: 'Provide meaningful alt text or use role="presentation" for decorative images',
        });
      }
    }
  }

  return violations;
}

/**
 * Check if SVGs have alt text/title
 */
function checkSvgAltText(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  // Find all svg elements
  const svgRegex = /<svg[^>]*>(.*?)<\/svg>/gs;
  let match;

  while ((match = svgRegex.exec(component.template)) !== null) {
    const svgTag = match[0];
    const svgContent = match[1];

    const hasTitle = /<title[^>]*>/i.test(svgContent);
    const hasAriaLabel = /aria-label=/.test(svgTag);
    const hasAriaLabelledby = /aria-labelledby=/.test(svgTag);
    const isDecorative = /role=["']presentation["']|aria-hidden=["']true["']/.test(svgTag);

    if (!isDecorative && !hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
      const lineNum = component.template.substring(0, match.index).split('\n').length;
      violations.push({
        ruleId: '1.1.1',
        ruleName: 'Non-text Content',
        severity: 'error',
        line: lineNum,
        content: svgTag.substring(0, 50) + '...',
        issue: 'SVG missing accessible name',
        recommendation: 'Add <title> element inside SVG or aria-label attribute',
      });
    }
  }

  return violations;
}

/**
 * Check if icon-only buttons have labels
 */
function checkIconButtonLabels(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  // Find buttons with only svg or icon components (no text)
  const iconButtonRegex = /<button[^>]*>\s*(?:<svg|<i\s|<Icon|<VIcon)[^<]*(?:<\/svg>|<\/i>|<\/Icon>|<\/VIcon>)?\s*<\/button>/gi;
  let match;

  while ((match = iconButtonRegex.exec(component.template)) !== null) {
    const buttonTag = match[0];
    const hasAriaLabel = /aria-label=/.test(buttonTag);
    const hasTitle = /<title[^>]*>/.test(buttonTag);

    if (!hasAriaLabel && !hasTitle) {
      const lineNum = component.template.substring(0, match.index).split('\n').length;
      violations.push({
        ruleId: '1.1.1',
        ruleName: 'Non-text Content',
        severity: 'error',
        line: lineNum,
        content: buttonTag.substring(0, 50),
        issue: 'Icon-only button missing accessible name',
        recommendation: 'Add aria-label="button description" to the button element',
      });
    }
  }

  return violations;
}

/**
 * Main validator for 1.1.1
 */
export function validate1_1_1(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  violations.push(...checkImageAltText(component));
  violations.push(...checkSvgAltText(component));
  violations.push(...checkIconButtonLabels(component));

  return violations;
}
