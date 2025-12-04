/**
 * WCAG 2.1 Rule 2.4.1: Bypass Blocks (Level A)
 *
 * A mechanism is available to bypass blocks of content that are repeated
 * on multiple Web pages.
 *
 * Common patterns checked:
 * - Has main landmark or skip link
 * - Navigation is properly identified
 */

import type { VueComponent, Violation } from '../core/types';

export function validate2_4_1(component: VueComponent): Violation[] {
  const violations: Violation[] = [];

  // Check if component is a Page (has layout structure)
  const isPage = component.name.startsWith('Page') || component.path.includes('/pages/');

  if (isPage) {
    // Check for main landmark
    const hasMain = /<main[^>]*>/.test(component.template);

    // Check for skip link
    const hasSkipLink = /href=["']#main["']|href=["']#content["']/.test(component.template);

    // Check for navigation
    const hasNav = /<nav[^>]*>|<header[^>]*>/.test(component.template);

    if (!hasMain && !hasSkipLink) {
      violations.push({
        ruleId: '2.4.1',
        ruleName: 'Bypass Blocks',
        severity: 'error',
        issue: 'No main landmark or skip link found',
        recommendation: 'Add <main> element or provide a skip to content link at the beginning of the page',
      });
    }

    if (!hasNav) {
      violations.push({
        ruleId: '2.4.1',
        ruleName: 'Bypass Blocks',
        severity: 'warning',
        issue: 'No navigation landmark found',
        recommendation: 'Consider using <nav> or <header> to mark up navigation areas',
      });
    }
  }

  return violations;
}
