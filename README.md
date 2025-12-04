# SAAT - Static Application Accessibility Testing

Static Application Accessibility Testing (SAAT) is a pure Node.js library that performs automated accessibility compliance checks on Vue.js components without rendering them. It analyzes component templates statically to identify WCAG 2.1 violations.

## Installation

```bash
npm install @reno-orange/saat
# or
yarn add @reno-orange/saat
# or
pnpm add @reno-orange/saat
```

## Quick Start

### As a Library (Programmatic API)

```typescript
import { runAudit, loadConfig } from '@reno-orange/saat';

const config = await loadConfig('./saat.config.ts');
const result = await runAudit(config);

console.log(`Conformity: ${result.summary.overallConformityPercent}%`);
console.log(`Violations: ${result.summary.totalViolations}`);
```

### As a CLI Tool

```bash
# Using npm script
npm run audit

# Or directly
npx saat --config=saat.config.ts
```

**Phase 7 Update:** Now with flexible configuration system! Test any subset of WCAG rules, customize component types, adjust thresholds, and auto-generate rules documentation.

## Features

✅ **16 WCAG 2.1 Rules** - Comprehensive accessibility coverage (Levels A & AA)  
✅ **Static Analysis** - No rendering needed  
✅ **Zero Dependencies** - Only Node.js required  
✅ **Flexible Configuration** - Choose which rules to test  
✅ **Component Filtering** - Audit specific component types  
✅ **Custom Thresholds** - Set conformity requirements  
✅ **Multiple Formats** - JSON, Markdown, SVG badges  
✅ **Performance** - ~30ms for 60+ components  
✅ **Vue 2 & 3** - Works with all Vue versions  
✅ **TypeScript** - Full type support included  

## Configuration

### Default Configuration

```bash
npm run dev
```

Uses `saat.config.ts` with:
- **16 WCAG rules** (all)
- **85% conformity threshold**
- **All component types** (Page, Section, Item, Modal)
- **All output formats** (JSON, Markdown, Badge)

### Custom Configuration

```bash
npm run dev -- --config=path/to/custom.config.ts
```

Choose:
- Which WCAG rules to test (1-16)
- Input/output directories
- Component types to audit
- Conformity threshold
- Output formats
- Logging verbosity

See [CONFIGURATION.md](./CONFIGURATION.md) for complete guide.

## Architecture

### Core Modules

- **component-scanner.ts**: Recursively scans `front/src/components/` and identifies all `.vue` files
- **vue-parser.ts**: Extracts template and script content from Vue files without rendering
- **types.ts**: TypeScript interfaces for components, violations, and audit results
- **config-loader.ts** (NEW): Configuration loading and validation
- **config-types.ts** (NEW): TypeScript interfaces for configuration

### Configuration System (Phase 7)

- **saat.config.ts**: Default configuration file
- **saat.config.example.strict.ts**: Example: strict mode (4 rules, 95% threshold)
- **saat.config.example.single-rule.ts**: Example: single-rule testing
- **config-loader.ts**: Smart loader with defaults and validation
- **rules-summary-reporter.ts**: Auto-generates rules documentation

### Validators

Each WCAG rule has its own validator module that checks for specific patterns:

- **1.1.1-alt-text.ts**: Non-text content (images, SVGs need alt/aria-label)
- **1.3.1-semantics.ts**: Info and relationships (labels, heading hierarchy, semantic elements)
- **1.3.2-meaningful-sequence.ts**: Meaningful sequence (CSS order)
- **1.4.1-use-of-color.ts**: Use of color (not color-only)
- **2.1.1-keyboard-access.ts**: Keyboard access
- **2.2.1-timing.ts**: Timing (no auto-timeouts)
- **2.4.1-bypass-blocks.ts**: Bypass blocks (main landmark, skip links)
- **2.4.3-focus-order.ts**: Focus order (tabindex management)
- **2.4.4-link-purpose.ts**: Link purpose (clear link text)
- **2.5.1-pointer-gestures.ts**: Pointer gestures
- **3.1.1-language-of-page.ts**: Language of page (lang attribute)
- **3.2.4-consistent-identification.ts**: Consistent identification
- **3.3.1-error-identification.ts**: Error identification
- **3.3.2-labels-instructions.ts**: Labels or instructions
- **4.1.2-name-role-value.ts**: Name, role, value (buttons, form controls)
- **4.1.3-status-messages.ts**: Status messages (aria-live)

### Reporters

- **json-reporter.ts**: Generates JSON output and displays console summary
- **rules-summary-reporter.ts** (NEW): Generates markdown documentation of tested rules

## Running the Audit

### Default (All 16 Rules)

```bash
npm run dev
```

Output:
```
🚀 Starting SAAT Audit...

📍 Step 1: Scanning components...
   Found 58 components

🔍 Step 2: Analyzing components...
   Testing 16 rules: 1.1.1, 1.3.1, ...
   Analyzed 58 components (0 failures)

📊 Step 3: Generating report...
   Total Violations: 125
   Overall Conformity: 91.1%

📋 Step 4: Generating rules summary...
   ✅ Rules summary: /path/to/wcag-rules-summary.md

✅ Audit complete!
```

### Strict Mode (4 Rules, Items/Modals Only)

```bash
npm run dev -- --config=saat.config.example.strict.ts
```

Output:
```
📍 Step 1: Scanning components...
   Found 25 components (types: Item, Modal)

🔍 Step 2: Analyzing components...
   Testing 4 rules: 1.1.1, 2.1.1, 4.1.2, 3.3.2
   Analyzed 25 components (0 failures)

📊 Summary:
   Total Violations: 9
   Overall Conformity: 92.0%
```

## Output Format

### audit-report.json (Main Report)

The audit generates a JSON file with complete details:
    }
  }
}
```

## Static Analysis Approach

SAAT uses pure regex and string parsing (no DOM rendering) to analyze Vue templates:

**Advantages:**
- ✅ Fast execution (no rendering overhead)
- ✅ Works with any Vue version
- ✅ Scalable to large component libraries
- ✅ Identifies obvious violations

**Limitations:**
- ❌ Cannot validate computed styles (contrast ratio)
- ❌ Cannot test keyboard interaction
- ❌ Cannot check focus management
- ❌ Limited context awareness (no JavaScript execution)

## Adding New Validators

1. Create a new file: `src/validators/X.X.X-rule-name.ts`
2. Implement a `validateX_X_X(component: VueComponent): Violation[]` function
3. Import and register in `src/index.ts`

Example:
```typescript
export function validate1_1_1(component: VueComponent): Violation[] {
  const violations: Violation[] = [];
  
  // Implement pattern matching logic
  
  return violations;
}
```

## Integration with Audit Pipeline

The SAAT output (`saat-audit.json`) can be integrated with the existing vitest-based a11y audit in `front/a11y/` for a complete accessibility test suite.

## Phase Roadmap

- **Phase 1**: Simple rules (1.1.1, 1.3.1, 4.1.2, 2.4.1) ✅
- **Phase 2**: Add more rules (2.1.1, 2.5.5, 3.1.1, etc.)
- **Phase 3**: Optional rendering for complex validations
- **Phase 4**: CI/CD integration
