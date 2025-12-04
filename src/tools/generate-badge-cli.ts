#!/usr/bin/env node

/**
 * CLI wrapper for WCAG Badge Generator
 * Usage: npm run generate-badge
 */

import { generateWCAGBadges } from './badge-generator.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(new URL('.', import.meta.url).pathname);

// Paths - resolve from current working directory (project root is parent of saat)
const projectRoot = process.cwd().includes('saat') 
  ? resolve(process.cwd(), '..')
  : process.cwd();
const auditPath = join(projectRoot, 'front/a11y/reports/saat-audit.json');
const badgeOutputDir = join(projectRoot, 'public');

console.log('🎨 WCAG Conformity Badge Generator\n');
console.log(`📖 Reading audit from: ${auditPath}`);
console.log(`📁 Writing badges to: ${badgeOutputDir}\n`);

try {
  generateWCAGBadges(auditPath, badgeOutputDir);
  console.log('✅ Badge generation completed successfully!\n');
} catch (error) {
  console.error('❌ Generation failed:', error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
}
