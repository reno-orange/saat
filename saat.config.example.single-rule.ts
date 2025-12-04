/**
 * SAAT Configuration - Example: Single Rule Testing
 * 
 * This configuration tests a single WCAG rule across all components.
 * Useful for focusing on fixing one accessibility issue at a time.
 * 
 * Copy this to saat.config.ts and customize as needed.
 */

import type { SaatConfig } from './src/core/config-types.js';

const singleRuleConfig: SaatConfig = {
  componentsDir: 'front/src/components',
  outputDir: 'front/a11y/reports',

  // Test only one rule
  rules: ['1.1.1'], // Focus on alt text

  // Lower threshold for single-rule testing
  minConformity: 80,

  // Test all component types
  componentTypes: ['Page', 'Section', 'Item', 'Modal'],

  generateBadge: false,
  output: {
    json: true,
    markdown: true,
    rulesSummary: true,
    prettyJson: true,
  },

  logging: {
    level: 'normal',
    timing: false,
  },
};

export default singleRuleConfig;
