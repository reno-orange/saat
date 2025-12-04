# SAAT Configuration Guide

SAAT (Static Application Accessibility Testing) supports flexible configuration through `saat.config.ts`. This allows you to customize which WCAG rules to test, where to find components, and where to save reports.

## Quick Start

1. Create a `saat.config.ts` file in the SAAT root directory:

```typescript
import type { SaatConfig } from './src/core/config-types.js';

const config: SaatConfig = {
  componentsDir: 'front/src/components',
  outputDir: 'front/a11y/reports',
  rules: [
    '1.1.1', '1.3.1', '1.3.2', '1.4.1',
    '2.1.1', '2.2.1', '2.4.1', '2.4.3', '2.4.4',
    '2.5.1', '3.1.1', '3.2.4', '3.3.1', '3.3.2',
    '4.1.2', '4.1.3',
  ],
  minConformity: 85,
  componentTypes: ['Page', 'Section', 'Item', 'Modal'],
  generateBadge: true,
  output: {
    json: true,
    markdown: true,
    rulesSummary: true,
    prettyJson: true,
  },
  logging: {
    level: 'normal',
    timing: true,
  },
};

export default config;
```

2. Run the audit:
```bash
npm run dev
```

## Configuration Options

### `componentsDir` (required)
- **Type:** `string`
- **Description:** Path to Vue components directory (relative to project root)
- **Example:** `'front/src/components'`

### `outputDir` (required)
- **Type:** `string`
- **Description:** Path where audit reports will be saved (relative to project root)
- **Example:** `'front/a11y/reports'`

### `rules` (required)
- **Type:** `WCAGRule[]`
- **Description:** Array of WCAG rules to test
- **Available Rules:**
  ```
  '1.1.1' - Non-text Content
  '1.3.1' - Info and Relationships
  '1.3.2' - Meaningful Sequence
  '1.4.1' - Use of Color
  '2.1.1' - Keyboard Access
  '2.2.1' - Timing
  '2.4.1' - Bypass Blocks
  '2.4.3' - Focus Order
  '2.4.4' - Link Purpose
  '2.5.1' - Pointer Gestures
  '3.1.1' - Language of Page
  '3.2.4' - Consistent Identification
  '3.3.1' - Error Identification
  '3.3.2' - Labels or Instructions
  '4.1.2' - Name, Role, Value
  '4.1.3' - Status Messages
  ```
- **Example:** `['1.1.1', '2.1.1', '4.1.2']` (test 3 critical rules)

### `minConformity`
- **Type:** `number` (0-100)
- **Default:** `85`
- **Description:** Minimum conformity percentage required to pass audit
- **Example:** `90` (require 90% conformity)

### `componentTypes`
- **Type:** `ComponentType[]`
- **Default:** `['Page', 'Section', 'Item', 'Modal']`
- **Description:** Component types to include in audit
- **Available Values:** `'Page' | 'Section' | 'Item' | 'Modal'`
- **Example:** `['Item', 'Modal']` (audit only Items and Modals)

### `generateBadge`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Generate WCAG conformity badge after audit
- **Example:** `false` (skip badge generation)

### `output` (object)
Configure output formats:

- **`json`** (boolean): Generate JSON audit report
- **`markdown`** (boolean): Generate markdown summary report
- **`rulesSummary`** (boolean): Generate WCAG rules configuration report
- **`prettyJson`** (boolean): Pretty-print JSON (readable format)

### `logging` (object)
Configure logging behavior:

- **`level`** (`'verbose' | 'normal' | 'quiet'`): Logging verbosity
  - `verbose`: Detailed progress for each component
  - `normal`: Summary information
  - `quiet`: Minimal output
- **`timing`** (boolean): Show performance metrics

## Example Configurations

### Strict Mode (Critical Rules Only)

Test only the most critical WCAG Level A rules with high conformity threshold:

```typescript
const config: SaatConfig = {
  componentsDir: 'front/src/components',
  outputDir: 'front/a11y/reports',
  rules: ['1.1.1', '2.1.1', '4.1.2', '3.3.2'],
  minConformity: 95,
  componentTypes: ['Item', 'Modal'],
  generateBadge: true,
  output: { json: true, markdown: true, rulesSummary: true, prettyJson: true },
  logging: { level: 'verbose', timing: true },
};
```

### Single Rule Testing

Focus on fixing one accessibility issue at a time:

```typescript
const config: SaatConfig = {
  componentsDir: 'front/src/components',
  outputDir: 'front/a11y/reports',
  rules: ['1.1.1'], // Test only alt text
  minConformity: 80,
  componentTypes: ['Page', 'Section', 'Item', 'Modal'],
  generateBadge: false,
  output: { json: true, markdown: true, rulesSummary: true, prettyJson: true },
  logging: { level: 'normal', timing: false },
};
```

### Full Audit (All Rules)

Test all 16 WCAG rules across all component types:

```typescript
const config: SaatConfig = {
  componentsDir: 'front/src/components',
  outputDir: 'front/a11y/reports',
  rules: [
    '1.1.1', '1.3.1', '1.3.2', '1.4.1',
    '2.1.1', '2.2.1', '2.4.1', '2.4.3', '2.4.4',
    '2.5.1', '3.1.1', '3.2.4', '3.3.1', '3.3.2',
    '4.1.2', '4.1.3',
  ],
  minConformity: 85,
  componentTypes: ['Page', 'Section', 'Item', 'Modal'],
  generateBadge: true,
  output: { json: true, markdown: true, rulesSummary: true, prettyJson: true },
  logging: { level: 'normal', timing: true },
};
```

### Items Only (Quick Scan)

Fast audit of reusable components:

```typescript
const config: SaatConfig = {
  componentsDir: 'front/src/components',
  outputDir: 'front/a11y/reports',
  rules: [
    '1.1.1', '1.3.1', '1.3.2', '1.4.1',
    '2.1.1', '2.5.1', '3.3.1', '3.3.2', '4.1.2',
  ],
  minConformity: 90,
  componentTypes: ['Item'],
  generateBadge: true,
  output: { json: true, markdown: false, rulesSummary: true, prettyJson: true },
  logging: { level: 'normal', timing: false },
};
```

## WCAG Rule Applicability

Not all rules apply to all component types:

| Rule | Applicable To |
|------|---|
| 2.4.1 (Bypass Blocks) | Page, Section |
| 3.1.1 (Language of Page) | Page, Section |
| All others | Page, Section, Item, Modal |

SAAT automatically filters rules based on component type. If you select a rule that doesn't apply to a component type, it will be marked as "NOT_APPLICABLE" in the report.

## Output Files

After running an audit, SAAT generates:

- **`saat-audit.json`** - Full audit data with all violations
- **`wcag-rules-summary.md`** - Configuration report showing which rules were tested
- **`wcag-conformity.svg`** - Badge showing overall conformity
- **`wcag-conformity-detailed.svg`** - Detailed badge with rule count

## Using Configuration Examples

Example configs are provided as templates:

```bash
# Copy strict mode example
cp saat.config.example.strict.ts saat.config.ts

# Copy single rule example
cp saat.config.example.single-rule.ts saat.config.ts

# Run audit with custom config
npm run dev
```

## Tips & Best Practices

1. **Start with a subset** - Test critical rules first (1.1.1, 2.1.1, 4.1.2)
2. **Focus on one issue** - Use single-rule mode when fixing specific problems
3. **Gradually expand** - Add more rules as you improve conformity
4. **Set realistic thresholds** - Don't expect 100% immediately
5. **Use verbose logging** - Enable during development to see details
6. **Regular audits** - Include SAAT in your CI/CD pipeline

## Next Steps

- Review [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) for rule details
- Check generated reports for specific violations
- Fix violations based on recommendations
- Re-run audit to verify improvements
- Track conformity over time with badges

---

For more information, see the main [SAAT documentation](../README.md).
