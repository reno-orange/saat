/**
 * JSON Reporter
 * Generates JSON output from audit results with enhanced statistics
 */

import { writeFileSync } from 'fs';
import type { EnhancedAuditResult, EnhancedComponentAuditResult, RuleStats } from '../core/types.js';

export class JsonReporter {
  /**
   * Calculate per-rule statistics
   */
  private calculateRuleStats(
    components: EnhancedComponentAuditResult[],
    ruleId: string,
    ruleName: string,
  ): RuleStats {
    let passed = 0;
    let failed = 0;
    let notApplicable = 0;

    for (const component of components) {
      const ruleStatus = component.ruleStatuses.find(rs => rs.ruleId === ruleId);
      if (!ruleStatus) continue;

      if (ruleStatus.status === 'PASSED') passed++;
      else if (ruleStatus.status === 'FAILED') failed++;
      else if (ruleStatus.status === 'NOT_APPLICABLE') notApplicable++;
    }

    const totalApplicable = passed + failed;
    const conformityPercent = totalApplicable > 0 ? (passed / totalApplicable) * 100 : 100;

    return {
      ruleId,
      ruleName,
      passed,
      failed,
      notApplicable,
      totalApplicable,
      conformityPercent,
    };
  }

  /**
   * Calculate overall conformity percentage
   */
  private calculateOverallConformity(ruleStats: RuleStats[]): number {
    const totalApplicable = ruleStats.reduce((sum, r) => sum + r.totalApplicable, 0);
    const totalPassed = ruleStats.reduce((sum, r) => sum + r.passed, 0);
    return totalApplicable > 0 ? (totalPassed / totalApplicable) * 100 : 100;
  }

  generateReport(
    components: EnhancedComponentAuditResult[],
    rulesApplied: string[],
    startTime: Date,
    endTime: Date,
  ): EnhancedAuditResult {
    const durationMs = endTime.getTime() - startTime.getTime();

    // Calculate summary
    const totalViolations = components.reduce((sum, c) => sum + c.violations.length, 0);
    const componentsWithViolations = components.filter(c => c.violations.length > 0).length;

    // Group violations by rule
    const byRule: Record<string, number> = {};
    const ruleNames: Record<string, string> = {};

    for (const component of components) {
      for (const violation of component.violations) {
        byRule[violation.ruleId] = (byRule[violation.ruleId] ?? 0) + 1;
        ruleNames[violation.ruleId] = violation.ruleName;
      }
    }

    // Fill in missing rules with 0
    for (const rule of rulesApplied) {
      if (!(rule in byRule)) {
        byRule[rule] = 0;
      }
    }

    // Calculate per-rule statistics
    const ruleStatistics = rulesApplied.map(rule => 
      this.calculateRuleStats(components, rule, ruleNames[rule] || rule)
    );

    // Calculate overall conformity
    const overallConformityPercent = this.calculateOverallConformity(ruleStatistics);

    const result: EnhancedAuditResult = {
      timestamp: new Date().toISOString(),
      audit: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationMs,
        scope: {
          componentsScanned: components.length,
          componentsWithViolations,
          rulesApplied,
        },
      },
      components,
      summary: {
        totalComponents: components.length,
        componentsWithViolations,
        totalViolations,
        overallConformityPercent,
        byRule,
        ruleStatistics,
      },
    };

    return result;
  }

  writeToFile(report: EnhancedAuditResult, outputPath: string): void {
    writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  }

  printSummary(report: EnhancedAuditResult): void {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║         SAAT Audit Report - Summary                      ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.log(`📊 Scope:`);
    console.log(`   Components Scanned: ${report.audit.scope.componentsScanned}`);
    console.log(`   With Violations: ${report.audit.scope.componentsWithViolations}`);
    console.log(`   Rules Applied: ${report.audit.scope.rulesApplied.join(', ')}`);

    console.log(`\n📈 Summary:`);
    console.log(`   Total Violations: ${report.summary.totalViolations}`);
    console.log(`   Overall Conformity: ${report.summary.overallConformityPercent.toFixed(1)}%`);
    console.log(`   Duration: ${report.audit.durationMs}ms`);

    console.log(`\n⚠️  Violations by Rule:`);
    for (const [rule, count] of Object.entries(report.summary.byRule)) {
      if (count > 0) {
        console.log(`   ${rule}: ${count} violation${count !== 1 ? 's' : ''}`);
      }
    }

    console.log(`\n📊 Conformity by Rule:`);
    for (const ruleStat of report.summary.ruleStatistics) {
      console.log(`   ${ruleStat.ruleId}: ${ruleStat.conformityPercent.toFixed(1)}% (${ruleStat.passed}/${ruleStat.totalApplicable})`);
    }

    console.log(`\n Output: ${report.timestamp}`);
  }
}
