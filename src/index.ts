#!/usr/bin/env node

/**
 * SAAT CLI - Static Application Accessibility Testing
 * Command-line interface for running audits
 */

import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
import { loadConfig } from './core/config-loader.js';
import { runAudit } from './audit.js';
import { JsonReporter } from './reporters/json-reporter.js';
import { generateWCAGBadges } from './tools/badge-generator.js';

// Get __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(new URL('.', import.meta.url).pathname);

async function runCLI(): Promise<void> {
  try {
    // Get config path from command line arguments or use default
    const configPath = process.argv.find(arg => arg.startsWith('--config='))?.split('=')[1];
    const config = await loadConfig(configPath);

    // Resolve paths relative to the current working directory (where command is executed)
    const componentsDir = resolve(process.cwd(), config.componentsDir);
    const outputDir = resolve(process.cwd(), config.outputDir);
    const outputFile = join(outputDir, 'saat-audit.json');

    // Create a modified config with resolved paths
    const resolvedConfig = {
      ...config,
      componentsDir,
      outputDir,
    };

    // Ensure output directory exists
    mkdirSync(outputDir, { recursive: true });

    // Run audit using the reusable audit function
    const report = await runAudit(resolvedConfig);

    // Write JSON report
    const reporter = new JsonReporter();
    reporter.writeToFile(report, outputFile);
    console.log(`📄 Report saved to: ${outputFile}`);

    // Generate badge if configured
    if (config.generateBadge) {
      try {
        generateWCAGBadges(outputFile, outputDir);
        console.log(`🎯 Badges generated in: ${outputDir}`);
      } catch (error) {
        console.warn(
          `⚠️  Badge generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    // Check minimum conformity threshold
    if (report.summary.overallConformityPercent < config.minConformity) {
      console.warn(
        `\n⚠️  Conformity ${report.summary.overallConformityPercent.toFixed(1)}% is below threshold ${config.minConformity}%`,
      );
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

// Run CLI
runCLI();

