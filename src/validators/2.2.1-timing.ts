/**
 * WCAG 2.2.1 - Timing
 * No session time limits except for real-time events or user-controlled sessions.
 * Checks for hardcoded timeouts and auto-logout patterns without user control.
 */

export interface TimingViolation {
  type: 'auto-logout' | 'hardcoded-timeout' | 'auto-redirect';
  issue: string;
  line: number;
  content: string;
  severity?: 'error' | 'warning';
}

/**
 * Detect auto-logout or session timeout patterns
 */
function detectAutoLogout(template: string, scriptContent: string): TimingViolation[] {
  const violations: TimingViolation[] = [];
  
  const lines = scriptContent.split('\n');
  
  lines.forEach((line, idx) => {
    // Detect setTimeout/setInterval patterns that might indicate auto-logout
    const autoLogoutPatterns = [
      /logout\s*\(\)|signOut\s*\(\)|destroySession|clearSession/i,
      /timeout.*(?:1000|3000|5000|6000|900000|1800000)/i, // Common timeout values (1s, 3s, 5s, 15min, 30min)
      /inactivity.*timeout|session.*expir/i,
    ];
    
    autoLogoutPatterns.forEach(pattern => {
      if (pattern.test(line) && /setTimeout|setInterval/.test(line)) {
        violations.push({
          type: 'auto-logout',
          issue: 'Potential auto-logout or session timeout detected. Ensure users can extend the session or are warned before logout.',
          line: idx + 1,
          content: line.trim(),
          severity: 'warning',
        });
      }
    });
  });
  
  return violations;
}

/**
 * Detect hardcoded timeout values that might be problematic
 */
function detectHardcodedTimeout(template: string, scriptContent: string): TimingViolation[] {
  const violations: TimingViolation[] = [];
  
  const lines = scriptContent.split('\n');
  
  lines.forEach((line, idx) => {
    // Detect setTimeout with short hardcoded values (less than 3 seconds for user operations)
    const shortTimeoutRegex = /setTimeout\s*\(\s*[^,]*,\s*([0-9]+)\s*\)/;
    const match = line.match(shortTimeoutRegex);
    
    if (match) {
      const timeoutMs = Number.parseInt(match[1], 10);
      // Alert on very short timeouts (less than 500ms might indicate uncontrollable behavior)
      if (timeoutMs < 500 && /(?:redirect|navigate|logout|closeModal|dismiss)/i.test(line)) {
        violations.push({
          type: 'hardcoded-timeout',
          issue: `Hardcoded timeout of ${timeoutMs}ms detected. Short timeouts may prevent users from reacting. Consider user-controlled timing.`,
          line: idx + 1,
          content: line.trim(),
          severity: 'warning',
        });
      }
    }
  });
  
  return violations;
}

/**
 * Detect auto-redirect patterns
 */
function detectAutoRedirect(template: string, scriptContent: string): TimingViolation[] {
  const violations: TimingViolation[] = [];
  
  const lines = scriptContent.split('\n');
  
  lines.forEach((line, idx) => {
    // Detect automatic redirects without user action
    const autoRedirectPatterns = [
      /window\.location|router\.push|router\.replace|window\.href/i,
    ];
    
    if (autoRedirectPatterns.some(pattern => pattern.test(line)) && /setTimeout|setInterval/.test(line)) {
      violations.push({
        type: 'auto-redirect',
        issue: 'Automatic redirect detected inside a timeout. Ensure users have enough time to understand and stop the redirect if needed.',
        line: idx + 1,
        content: line.trim(),
        severity: 'warning',
      });
    }
  });
  
  return violations;
}

/**
 * Main WCAG 2.2.1 validator
 */
export function validate2_2_1(template: string, scriptContent = ''): TimingViolation[] {
  const violations: TimingViolation[] = [];
  
  violations.push(...detectAutoLogout(template, scriptContent));
  violations.push(...detectHardcodedTimeout(template, scriptContent));
  violations.push(...detectAutoRedirect(template, scriptContent));
  
  return violations;
}
