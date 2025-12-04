/**
 * SAAT - Static Application Accessibility Testing
 * Public API for programmatic usage
 * 
 * This module exports the core functionality as a library
 * for use in other Node.js applications.
 * 
 * @example
 * ```typescript
 * import { runAudit, loadConfig } from '@reno-orange/saat';
 * 
 * const config = await loadConfig('./saat.config.ts');
 * const result = await runAudit(config);
 * console.log(result.summary);
 * ```
 */

// Core functions
export { scanComponents } from './core/component-scanner.js';
export { parseVueFile, extractElements, extractSvgTitles } from './core/vue-parser.js';
export { loadConfig } from './core/config-loader.js';
export { runAudit } from './audit.js';

// Types - Core
export type {
  VueComponent,
  Violation,
  ComponentAuditResult,
  EnhancedComponentAuditResult,
  ComponentRuleStatus,
  AuditResult,
  EnhancedAuditResult,
  RuleStatus,
  RuleStats,
  Validator,
  VueParsedComponent,
} from './core/types.js';

// Types - Configuration
export type {
  SaatConfig,
  WCAGRule,
  RuleInfo,
  RulesSummaryReport,
} from './core/config-types.js';

// Reporters
export { JsonReporter } from './reporters/json-reporter.js';

// Tools
export { generateWCAGBadges } from './tools/badge-generator.js';

// Scanner types (for advanced usage)
export type { ComponentMetadata } from './core/component-scanner.js';
