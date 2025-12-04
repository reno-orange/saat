/**
 * SAAT Configuration Types
 * Defines the shape of saat.config.ts configuration
 */

export type WCAGRule = 
  | '1.1.1' | '1.3.1' | '1.3.2' | '1.4.1'
  | '2.1.1' | '2.2.1' | '2.4.1' | '2.4.3' | '2.4.4'
  | '2.5.1' | '3.1.1' | '3.2.4' | '3.3.1' | '3.3.2'
  | '4.1.2' | '4.1.3';

export type WCAGLevel = 'A' | 'AA' | 'AAA';

export interface SaatConfig {
  /** Path to Vue components directory (relative to project root) */
  componentsDir: string;

  /** Path where reports should be written (relative to project root) */
  outputDir: string;

  /** WCAG rules to test (subset of all available rules) */
  rules: WCAGRule[];

  /** Minimum conformity percentage to pass (0-100) */
  minConformity: number;

  /** Generate badge after audit */
  generateBadge: boolean;

  /** Output format options */
  output: {
    /** Generate JSON report */
    json: boolean;
    /** Generate summary markdown report */
    markdown: boolean;
    /** Generate rules summary */
    rulesSummary: boolean;
    /** Pretty print JSON (readable format) */
    prettyJson: boolean;
  };

  /** Logging options */
  logging: {
    /** Log level: 'verbose' | 'normal' | 'quiet' */
    level: 'verbose' | 'normal' | 'quiet';
    /** Show timing information */
    timing: boolean;
  };
}

export interface RuleInfo {
  id: WCAGRule;
  name: string;
  level: WCAGLevel;
  description: string;
}

export interface RulesSummaryReport {
  timestamp: string;
  totalRulesTested: number;
  rulesConfiguration: RuleInfo[];
  conformityThreshold: number;
}
