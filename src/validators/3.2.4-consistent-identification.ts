/**
 * WCAG 3.2.4 - Consistent Identification
 * Components with the same functionality must be identified consistently.
 * Detects inconsistent button labels, icon usage, and component naming.
 */

export interface ConsistentIdentificationViolation {
  type: 'inconsistent-labels' | 'inconsistent-icons';
  issue: string;
  line: number;
  content: string;
  severity?: 'error' | 'warning';
}

/**
 * Track button/link labels and detect inconsistencies
 */
function detectInconsistentLabels(template: string): ConsistentIdentificationViolation[] {
  const violations: ConsistentIdentificationViolation[] = [];
  
  const lines = template.split('\n');
  
  // Common actions that should have consistent labels
  const commonActions = new Map<string, {label: string; line: number}>();
  
  lines.forEach((line, idx) => {
    // Extract button text and approximate action
    const buttonMatch = /<button[^>]*>([^<]+)<\/button>/.exec(line);
    const linkMatch = /<a[^>]*>([^<]+)<\/a>/.exec(line);
    
    if (buttonMatch) {
      const label = buttonMatch[1].toLowerCase().trim();
      
      // Detect common actions (save, delete, close, cancel, submit, next, back)
      if (/^(save|delete|close|cancel|submit|next|back|previous|continue|done|ok)$/i.test(label)) {
        const previous = commonActions.get(label);
        if (previous) {
          // Check if label varies (case differences that might indicate inconsistency)
          if (buttonMatch[1].toLowerCase() !== previous.label.toLowerCase()) {
            violations.push({
              type: 'inconsistent-labels',
              issue: `Inconsistent label for "${label}" action. Previously used: "${previous.label}" (line ${previous.line}), now: "${buttonMatch[1]}" (line ${idx + 1}).`,
              line: idx + 1,
              content: line.trim(),
              severity: 'warning',
            });
          }
        } else {
          commonActions.set(label, {label: buttonMatch[1], line: idx + 1});
        }
      }
    }
    
    if (linkMatch) {
      const label = linkMatch[1].toLowerCase().trim();
      
      if (/^(close|cancel|delete|back|previous)$/.test(label)) {
        const previous = commonActions.get(label);
        if (previous) {
          if (linkMatch[1].toLowerCase() !== previous.label.toLowerCase()) {
            violations.push({
              type: 'inconsistent-labels',
              issue: `Inconsistent label for "${label}" action. Previously used: "${previous.label}" (line ${previous.line}), now: "${linkMatch[1]}" (line ${idx + 1}).`,
              line: idx + 1,
              content: line.trim(),
              severity: 'warning',
            });
          }
        } else {
          commonActions.set(label, {label: linkMatch[1], line: idx + 1});
        }
      }
    }
  });
  
  return violations;
}

/**
 * Detect inconsistent icon usage for the same function
 */
function detectInconsistentIcons(template: string): ConsistentIdentificationViolation[] {
  const violations: ConsistentIdentificationViolation[] = [];
  
  const lines = template.split('\n');
  
  // Track icon usage for common functions
  const iconUsage = new Map<string, {icon: string; line: number}>();
  
  lines.forEach((line, idx) => {
    // Look for icon patterns with associated text or role
    if (/(?:i\s+class|svg|icon)/.test(line)) {
      // Try to determine what action/function the icon represents
      let actionType: string | null = null;
      
      if (/close|dismiss|exit|×|cancel/i.test(line)) actionType = 'close';
      else if (/delete|remove|trash/i.test(line)) actionType = 'delete';
      else if (/edit|modify|pencil/i.test(line)) actionType = 'edit';
      else if (/save|check|confirm/i.test(line)) actionType = 'save';
      else if (/back|previous|<|arrow-left/i.test(line)) actionType = 'back';
      else if (/next|forward|>|arrow-right/i.test(line)) actionType = 'next';
      
      if (actionType) {
        const iconClass = line.match(/class\s*=\s*["']([^"']+)["']/)?.[1] || 'unknown';
        
        if (iconUsage.has(actionType)) {
          const previous = iconUsage.get(actionType);
          if (previous && iconClass !== previous.icon && iconClass !== 'unknown') {
            violations.push({
              type: 'inconsistent-icons',
              issue: `Inconsistent icon for "${actionType}" action. Previously used: "${previous.icon}" (line ${previous.line}), now: "${iconClass}" (line ${idx + 1}).`,
              line: idx + 1,
              content: line.trim(),
              severity: 'warning',
            });
          }
        } else if (iconClass !== 'unknown') {
          iconUsage.set(actionType, {icon: iconClass, line: idx + 1});
        }
      }
    }
  });
  
  return violations;
}

/**
 * Main WCAG 3.2.4 validator
 */
export function validate3_2_4(template: string): ConsistentIdentificationViolation[] {
  const violations: ConsistentIdentificationViolation[] = [];
  
  violations.push(...detectInconsistentLabels(template));
  violations.push(...detectInconsistentIcons(template));
  
  return violations;
}
