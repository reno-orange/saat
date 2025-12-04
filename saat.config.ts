/**
 * Default SAAT Configuration
 * Copy and modify this file to customize your audit
 */

import type { SaatConfig } from './src/core/config-types.js';

const config: SaatConfig = {
  // Path to Vue components directory
  componentsDir: 'front/src/components',

  // Path where reports will be written
  outputDir: 'front/a11y/reports',

  // WCAG rules to test (all 16 available)
  rules: [
    '1.1.1', // Non-text Content
    '1.3.1', // Info and Relationships
    '1.3.2', // Meaningful Sequence
    '1.4.1', // Use of Color
    '2.1.1', // Keyboard Access
    '2.2.1', // Timing
    '2.4.1', // Bypass Blocks
    '2.4.3', // Focus Order
    '2.4.4', // Link Purpose
    '2.5.1', // Pointer Gestures
    '3.1.1', // Language of Page
    '3.2.4', // Consistent Identification
    '3.3.1', // Error Identification
    '3.3.2', // Labels or Instructions
    '4.1.2', // Name, Role, Value
    '4.1.3', // Status Messages
  ],

  // Minimum conformity percentage to pass (0-100)
  minConformity: 85,

  // Component types to audit
  componentTypes: ['Page', 'Section', 'Item', 'Modal'],

  // Generate badge after audit
  generateBadge: true,

  // Output format options
  output: {
    json: true,
    markdown: true,
    rulesSummary: true,
    prettyJson: true,
  },

  // Logging options
  logging: {
    level: 'normal', // 'verbose' | 'normal' | 'quiet'
    timing: true,
  },
};

export default config;
