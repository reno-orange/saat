/**
 * SAAT Audit Engine
 * Core audit functionality extracted for reusability
 */

import { join, resolve } from 'path';
import { scanComponents } from './core/component-scanner.js';
import { parseVueFile } from './core/vue-parser.js';
import { validate1_1_1 } from './validators/1.1.1-alt-text.js';
import { validate1_3_1 } from './validators/1.3.1-semantics.js';
import { validate1_3_2 } from './validators/1.3.2-meaningful-sequence.js';
import { validate1_4_1 } from './validators/1.4.1-use-of-color.js';
import { validate2_1_1 } from './validators/2.1.1-keyboard-access.js';
import { validate2_2_1 } from './validators/2.2.1-timing.js';
import { validate2_4_1 } from './validators/2.4.1-bypass-blocks.js';
import { validate2_4_3 } from './validators/2.4.3-focus-order.js';
import { validate2_4_4 } from './validators/2.4.4-link-purpose.js';
import { validate2_5_1 } from './validators/2.5.1-pointer-gestures.js';
import { validate3_1_1 } from './validators/3.1.1-language-of-page.js';
import { validate3_2_4 } from './validators/3.2.4-consistent-identification.js';
import { validate3_3_1 } from './validators/3.3.1-error-identification.js';
import { validate3_3_2 } from './validators/3.3.2-labels-instructions.js';
import { validate4_1_2 } from './validators/4.1.2-name-role-value.js';
import { validate4_1_3 } from './validators/4.1.3-status-messages.js';

import { JsonReporter } from './reporters/json-reporter.js';

import type {
  ComponentRuleStatus,
  Violation,
  VueComponent,
  EnhancedComponentAuditResult,
  EnhancedAuditResult,
} from './core/types.js';
import type { SaatConfig } from './core/config-types.js';

interface SimpleValidator {
  ruleId: string;
  ruleName: string;
  validate(component: VueComponent): Violation[];
}

/**
 * Convert any violation type to standard Violation format
 */
function convertViolation(
  ruleId: string,
  ruleName: string,
  v: { severity?: 'error' | 'warning' | 'info'; line?: number; content?: string; issue: string },
): Violation {
  return {
    ruleId,
    ruleName,
    severity: v.severity || 'error',
    line: v.line,
    content: v.content,
    issue: v.issue || '',
    recommendation: `Fix violation: ${v.issue || 'Unknown issue'}`,
  };
}

/**
 * Build rule status matrix for a component
 */
function buildRuleStatuses(
  violations: Violation[],
  rulesApplied: string[],
): ComponentRuleStatus[] {
  const ruleStatuses: ComponentRuleStatus[] = [];

  for (const ruleId of rulesApplied) {
    const violationsForRule = violations.filter((v) => v.ruleId === ruleId);
    ruleStatuses.push({
      ruleId,
      status: violationsForRule.length > 0 ? 'FAILED' : 'PASSED',
      violationCount: violationsForRule.length,
    });
  }

  return ruleStatuses;
}

// Validators to apply
const VALIDATORS: SimpleValidator[] = [
  {
    ruleId: '1.1.1',
    ruleName: 'Non-text Content',
    validate: validate1_1_1,
  },
  {
    ruleId: '1.3.1',
    ruleName: 'Info and Relationships',
    validate: validate1_3_1,
  },
  {
    ruleId: '1.3.2',
    ruleName: 'Meaningful Sequence',
    validate: (component) =>
      validate1_3_2(component.template).map((v) =>
        convertViolation('1.3.2', 'Meaningful Sequence', v),
      ),
  },
  {
    ruleId: '1.4.1',
    ruleName: 'Use of Color',
    validate: (component) =>
      validate1_4_1(component.template).map((v) => convertViolation('1.4.1', 'Use of Color', v)),
  },
  {
    ruleId: '2.1.1',
    ruleName: 'Keyboard Access',
    validate: validate2_1_1,
  },
  {
    ruleId: '2.2.1',
    ruleName: 'Timing',
    validate: (component) =>
      validate2_2_1(component.template, component.script).map((v) =>
        convertViolation('2.2.1', 'Timing', v),
      ),
  },
  {
    ruleId: '2.4.1',
    ruleName: 'Bypass Blocks',
    validate: validate2_4_1,
  },
  {
    ruleId: '2.4.3',
    ruleName: 'Focus Order',
    validate: (component) =>
      validate2_4_3(component.template).map((v) => convertViolation('2.4.3', 'Focus Order', v)),
  },
  {
    ruleId: '2.4.4',
    ruleName: 'Link Purpose',
    validate: (component) =>
      validate2_4_4(component.template).map((v) =>
        convertViolation('2.4.4', 'Link Purpose', v),
      ),
  },
  {
    ruleId: '2.5.1',
    ruleName: 'Pointer Gestures',
    validate: validate2_5_1,
  },
  {
    ruleId: '3.1.1',
    ruleName: 'Language of Page',
    validate: (component) =>
      validate3_1_1(component.template).map((v) =>
        convertViolation('3.1.1', 'Language of Page', v),
      ),
  },
  {
    ruleId: '3.2.4',
    ruleName: 'Consistent Identification',
    validate: (component) =>
      validate3_2_4(component.template).map((v) =>
        convertViolation('3.2.4', 'Consistent Identification', v),
      ),
  },
  {
    ruleId: '3.3.1',
    ruleName: 'Error Identification',
    validate: (component) =>
      validate3_3_1(component.template).map((v) =>
        convertViolation('3.3.1', 'Error Identification', v),
      ),
  },
  {
    ruleId: '3.3.2',
    ruleName: 'Labels or Instructions',
    validate: validate3_3_2,
  },
  {
    ruleId: '4.1.2',
    ruleName: 'Name, Role, Value',
    validate: validate4_1_2,
  },
  {
    ruleId: '4.1.3',
    ruleName: 'Status Messages',
    validate: (component) =>
      validate4_1_3(component.template).map((v) =>
        convertViolation('4.1.3', 'Status Messages', v),
      ),
  },
];

/**
 * Run audit with configuration
 * 
 * @param config - SAAT configuration
 * @returns Enhanced audit result with detailed statistics
 */
export async function runAudit(config: SaatConfig): Promise<EnhancedAuditResult> {
  if (config.logging?.level !== 'quiet') {
    console.log('🚀 Starting SAAT Audit...\n');
  }

  const startTime = new Date();

  // Step 1: Scan components
  if (config.logging?.level !== 'quiet') {
    console.log('📍 Step 1: Scanning components...');
  }
  const componentsDir = resolve(config.componentsDir);
  if (config.logging?.level !== 'quiet') {
    console.log(`   Scanning directory: ${componentsDir}`);
  }
  const componentMetadata = scanComponents(componentsDir);
  if (config.logging?.level !== 'quiet') {
    console.log(`   Found ${componentMetadata.length} components\n`);
  }

  // Step 2: Parse and validate each component
  if (config.logging?.level !== 'quiet') {
    console.log('🔍 Step 2: Analyzing components...');
  }
  const results: EnhancedComponentAuditResult[] = [];
  let parsed = 0;
  let failed = 0;

  const rulesApplied: string[] = VALIDATORS.filter((v: SimpleValidator) =>
    (config.rules as string[]).includes(v.ruleId),
  ).map((v: SimpleValidator) => v.ruleId);

  if (config.logging?.level !== 'quiet') {
    console.log(`   Testing ${rulesApplied.length} rules: ${rulesApplied.join(', ')}\n`);
  }

  for (const metadata of componentMetadata) {
    try {
      const component = parseVueFile(metadata.path);
      const violations: Violation[] = [];

      // Run only configured validators
      for (const validator of VALIDATORS) {
        if (!rulesApplied.includes(validator.ruleId)) continue;

        try {
          const validatorViolations = validator.validate(component);
          violations.push(...validatorViolations);
        } catch (error) {
          if (config.logging?.level === 'verbose') {
            console.warn(
              `   ⚠️  Validator ${validator.ruleId} failed for ${component.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
          }
        }
      }

      // Build rule statuses for this component
      const ruleStatuses = buildRuleStatuses(violations, rulesApplied);

      results.push({
        name: component.name,
        path: metadata.path,
        violations,
        ruleStatuses,
      });
      parsed++;
    } catch (error) {
      if (config.logging?.level !== 'quiet') {
        console.warn(
          `   ⚠️  Failed to parse ${metadata.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
      failed++;
    }
  }

  if (config.logging?.level !== 'quiet') {
    console.log(`   Analyzed ${parsed} components (${failed} failures)\n`);
  }

  // Step 3: Generate report
  if (config.logging?.level !== 'quiet') {
    console.log('📊 Step 3: Generating report...');
  }
  const reporter = new JsonReporter();
  const endTime = new Date();
  const report = reporter.generateReport(results, rulesApplied, startTime, endTime);

  // Step 4: Output handling complete

  if (config.logging?.level !== 'quiet') {
    reporter.printSummary(report);
    if (config.logging?.timing) {
      const duration = endTime.getTime() - startTime.getTime();
      console.log(`\n⏱️  Audit took ${duration}ms`);
    }
    console.log('\n✅ Audit complete!\n');
  }

  return report;
}
