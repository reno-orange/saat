/**
 * WCAG Conformity Badge Generator
 * Generates SVG badges showing WCAG 2.1 conformity level and percentage
 * Reads from saat-audit.json and creates dynamic badges
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface AuditSummary {
  overallConformityPercent: number;
  totalViolations: number;
  totalComponents?: number;
  ruleStatistics?: Array<{ruleId: string; conformity: number}>;
}

interface BadgeConfig {
  conformity: number;
  violations: number;
  level: 'A' | 'AA' | 'AAA';
  color: string;
  status: string;
}

/**
 * Determine WCAG conformity level based on percentage
 */
function determineWCAGLevel(conformity: number): 'A' | 'AA' | 'AAA' {
  if (conformity >= 95) return 'AAA'; // 95%+ = AAA (highest)
  if (conformity >= 85) return 'AA';  // 85%+ = AA (standard)
  return 'A';                          // Below = A
}

/**
 * Get color based on conformity percentage
 */
function getConformityColor(conformity: number): string {
  if (conformity >= 95) return '#28a745'; // Green (AAA)
  if (conformity >= 85) return '#ffc107'; // Yellow (AA)
  if (conformity >= 70) return '#fd7e14'; // Orange
  return '#dc3545';                       // Red (critical)
}

/**
 * Get status text based on conformity
 */
function getStatusText(conformity: number): string {
  if (conformity >= 95) return 'Excellent';
  if (conformity >= 85) return 'Good';
  if (conformity >= 70) return 'Fair';
  return 'Critical';
}

/**
 * Generate SVG badge for conformity
 */
function generateBadgeSvg(config: BadgeConfig): string {
  const conformityPercent = config.conformity.toFixed(1);
  const leftWidth = 140;
  const rightWidth = 150;
  const totalWidth = leftWidth + rightWidth;
  const height = 20;
  const textY = 15;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${height}" role="img" aria-label="WCAG Conformity: ${conformityPercent}%">
  <title>WCAG Conformity Badge</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb"/>
    <stop offset="1" stop-color="#999"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="${height}" fill="#555"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="${height}" fill="${config.color}"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#s)" opacity="0.1"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text aria-hidden="true" x="${leftWidth / 2 + 7}" y="${textY}" fill="#010101" fill-opacity="0.3" transform="scale(.1)" textLength="${(leftWidth - 14) * 10}">
      WCAG ${config.level}
    </text>
    <text x="${leftWidth / 2 + 7}" y="14" transform="scale(.1)" fill="#fff" textLength="${(leftWidth - 14) * 10}">
      WCAG ${config.level}
    </text>
    <text aria-hidden="true" x="${leftWidth + rightWidth / 2 + 7}" y="${textY}" fill="#010101" fill-opacity="0.3" transform="scale(.1)" textLength="${(rightWidth - 14) * 10}">
      ${conformityPercent}% (${config.status})
    </text>
    <text x="${leftWidth + rightWidth / 2 + 7}" y="14" transform="scale(.1)" fill="#fff" textLength="${(rightWidth - 14) * 10}">
      ${conformityPercent}% (${config.status})
    </text>
  </g>
</svg>`;
}

/**
 * Generate detailed badge showing rule breakdown
 */
function generateDetailedBadgeSvg(config: BadgeConfig, ruleCount = 16): string {
  const passedRules = Math.round((config.conformity / 100) * ruleCount);
  const leftWidth = 160;
  const rightWidth = 180;
  const totalWidth = leftWidth + rightWidth;
  const height = 20;
  const textY = 15;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${height}" role="img" aria-label="WCAG Conformity: ${passedRules}/${ruleCount} rules">
  <title>WCAG Rules Conformity Badge</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb"/>
    <stop offset="1" stop-color="#999"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="${height}" fill="#555"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="${height}" fill="${config.color}"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#s)" opacity="0.1"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text aria-hidden="true" x="${leftWidth / 2 + 7}" y="${textY}" fill="#010101" fill-opacity="0.3" transform="scale(.1)" textLength="${(leftWidth - 14) * 10}">
      WCAG 2.1 Level ${config.level}
    </text>
    <text x="${leftWidth / 2 + 7}" y="14" transform="scale(.1)" fill="#fff" textLength="${(leftWidth - 14) * 10}">
      WCAG 2.1 Level ${config.level}
    </text>
    <text aria-hidden="true" x="${leftWidth + rightWidth / 2 + 7}" y="${textY}" fill="#010101" fill-opacity="0.3" transform="scale(.1)" textLength="${(rightWidth - 14) * 10}">
      ${passedRules}/${ruleCount} rules passing
    </text>
    <text x="${leftWidth + rightWidth / 2 + 7}" y="14" transform="scale(.1)" fill="#fff" textLength="${(rightWidth - 14) * 10}">
      ${passedRules}/${ruleCount} rules passing
    </text>
  </g>
</svg>`;
}

/**
 * Generate markdown badge syntax
 */
function generateMarkdownBadge(conformity: number, level: 'A' | 'AA' | 'AAA', badgePath: string): string {
  const conformityPercent = conformity.toFixed(1);
  return `[![WCAG ${level} Conformity ${conformityPercent}%](${badgePath})](./doc/a11y/README.md)`;
}

/**
 * Main badge generation function
 */
export function generateWCAGBadges(auditJsonPath: string, outputDir: string): void {
  try {
    // Read audit data
    console.log(`📖 Reading audit data from: ${auditJsonPath}`);
    const auditContent = readFileSync(auditJsonPath, 'utf-8');
    const auditData = JSON.parse(auditContent);
    const summary: AuditSummary = auditData.summary;

    if (!summary || !summary.overallConformityPercent) {
      throw new Error('Invalid audit JSON: missing summary.overallConformityPercent');
    }

    const conformity = summary.overallConformityPercent;
    const level = determineWCAGLevel(conformity);
    const color = getConformityColor(conformity);
    const status = getStatusText(conformity);
    const violations = summary.totalViolations || 0;

    const config: BadgeConfig = {conformity, violations, level, color, status};

    // Ensure output directory exists
    mkdirSync(outputDir, {recursive: true});

    // Generate simple badge
    console.log('🎨 Generating WCAG conformity badge...');
    const simpleBadgeSvg = generateBadgeSvg(config);
    const simpleBadgePath = join(outputDir, 'wcag-conformity.svg');
    writeFileSync(simpleBadgePath, simpleBadgeSvg);
    console.log(`   ✅ Simple badge: ${simpleBadgePath}`);

    // Generate detailed badge
    console.log('🎨 Generating detailed badge with rule count...');
    const detailedBadgeSvg = generateDetailedBadgeSvg(config, 16);
    const detailedBadgePath = join(outputDir, 'wcag-conformity-detailed.svg');
    writeFileSync(detailedBadgePath, detailedBadgeSvg);
    console.log(`   ✅ Detailed badge: ${detailedBadgePath}`);

    // Generate markdown snippet
    console.log('📝 Generating markdown snippet...');
    const markdownBadge = generateMarkdownBadge(conformity, level, `public/wcag-conformity.svg`);
    const markdownPath = join(outputDir, 'wcag-badge.md');
    writeFileSync(markdownPath, markdownBadge);
    console.log(`   ✅ Markdown snippet: ${markdownPath}`);

    // Generate summary report
    const summary_report = `# WCAG Conformity Badge - Summary

## Badge Information
- **WCAG Level**: ${level}
- **Conformity**: ${conformity.toFixed(2)}%
- **Status**: ${status}
- **Violations**: ${violations}
- **Generated**: ${new Date().toISOString()}

## Badge Files Generated
1. \`wcag-conformity.svg\` - Simple badge showing level and percentage
2. \`wcag-conformity-detailed.svg\` - Detailed badge with rule count
3. \`wcag-badge.md\` - Markdown snippet for README

## Usage in README.md
\`\`\`markdown
${markdownBadge}
\`\`\`

## Color Coding
- 🟢 Green (#28a745): ≥95% (AAA)
- 🟡 Yellow (#ffc107): ≥85% (AA)
- 🟠 Orange (#fd7e14): ≥70%
- 🔴 Red (#dc3545): <70% (Critical)

## Conformity Levels
- **Level A**: <85%
- **Level AA**: 85-94%
- **Level AAA**: ≥95%

## Next Steps
1. Copy badge SVG files to \`public/\` directory
2. Add badge markdown to README.md
3. Regenerate badges after each audit run

---
Generated by SAAT Badge Generator v1.0.0
`;
    const reportPath = join(outputDir, 'wcag-badge-summary.md');
    writeFileSync(reportPath, summary_report);
    console.log(`   ✅ Summary report: ${reportPath}`);

    // Print summary
    console.log(`\n✅ Badge generation complete!\n`);
    console.log(`📊 Conformity Summary:`);
    console.log(`   Level: WCAG ${level}`);
    console.log(`   Conformity: ${conformity.toFixed(2)}%`);
    console.log(`   Status: ${status}`);
    console.log(`   Violations: ${violations}`);
    console.log(`\n📍 Badges saved to: ${outputDir}\n`);

  } catch (error) {
    console.error('❌ Badge generation failed:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}


