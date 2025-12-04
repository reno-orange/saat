/**
 * SAAT Configuration - Example: Strict Mode
 * 
 * This configuration runs a strict subset of WCAG rules
 * suitable for critical components requiring high compliance.
 * 
 * Copy this to saat.config.ts and customize as needed.
 */

import type { SaatConfig } from './src/core/config-types.js';

const strictConfig: SaatConfig = {
  // Only audit critical components
  componentsDir: 'front/src/components',
  outputDir: 'front/a11y/reports',

  // Focus on critical WCAG Level A rules only
  rules: [
    '1.1.1', // Non-text Content (critical for blind users)
    '2.1.1', // Keyboard Access (critical for mobility users)
    '4.1.2', // Name, Role, Value (critical for screen readers)
    '3.3.2', // Labels or Instructions (critical for form accessibility)
  ],

  // Require 95% conformity for strict mode
  minConformity: 95,

  // Only audit Items and Modals (not Pages/Sections)
  componentTypes: ['Item', 'Modal'],

  // Generate all outputs
  generateBadge: true,
  output: {
    json: true,
    markdown: true,
    rulesSummary: true,
    prettyJson: true,
  },

  // Verbose logging for debugging
  logging: {
    level: 'verbose',
    timing: true,
  },
};

export default strictConfig;
