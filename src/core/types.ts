/**
 * SAAT Core Types
 * Defines interfaces for components, violations, and audit results
 */

// Rule evaluation status
export type RuleStatus = 'PASSED' | 'FAILED' | 'NOT_APPLICABLE';

export interface VueComponent {
  name: string;
  path: string;
  template: string;
  script: string;
}

export type VueParsedComponent = VueComponent;

export interface Violation {
  ruleId: string;
  ruleName: string;
  severity: 'error' | 'warning' | 'info';
  element?: {
    type: string; // 'img', 'svg', 'button', etc.
    tag: string;
    line: number;
    content: string;
    attributes: Record<string, string | null>;
  };
  // Simplified fields for static analysis
  line?: number;
  content?: string;
  issue: string;
  recommendation: string;
}

export interface ComponentAuditResult {
  name: string;
  path: string;
  violations: Violation[];
}

// Per-component rule evaluation status
export interface ComponentRuleStatus {
  ruleId: string;
  status: RuleStatus;
  violationCount: number;
}

// Enhanced component result with rule statuses
export interface EnhancedComponentAuditResult extends ComponentAuditResult {
  ruleStatuses: ComponentRuleStatus[];
}

export interface AuditResult {
  timestamp: string;
  audit: {
    startTime: string;
    endTime: string;
    durationMs: number;
    scope: {
      componentsScanned: number;
      componentsWithViolations: number;
      rulesApplied: string[];
    };
  };
  components: ComponentAuditResult[];
  summary: {
    totalComponents: number;
    componentsWithViolations: number;
    totalViolations: number;
    byRule: Record<string, number>;
  };
}

// Per-rule conformity statistics
export interface RuleStats {
  ruleId: string;
  ruleName: string;
  passed: number;
  failed: number;
  notApplicable: number;
  totalApplicable: number;
  conformityPercent: number;
}

// Enhanced audit result with detailed statistics
export interface EnhancedAuditResult extends AuditResult {
  components: EnhancedComponentAuditResult[];
  summary: {
    totalComponents: number;
    componentsWithViolations: number;
    totalViolations: number;
    overallConformityPercent: number;
    byRule: Record<string, number>;
    ruleStatistics: RuleStats[];
  };
}

export interface Validator {
  ruleId: string;
  ruleName: string;
  validate(component: VueComponent): Violation[];
}
