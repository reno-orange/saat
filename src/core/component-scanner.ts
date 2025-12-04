/**
 * Component Scanner
 * Recursively finds all .vue components in the front/src/components directory
 */

import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export interface ComponentMetadata {
  name: string;
  path: string;
}

/**
 * Scan directory recursively and find all .vue files
 */
export function scanComponents(baseDir: string): ComponentMetadata[] {
  const components: ComponentMetadata[] = [];

  function walk(dir: string) {
    try {
      const files = readdirSync(dir);

      for (const file of files) {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Recurse into subdirectories
          walk(fullPath);
        } else if (file.endsWith('.vue')) {
          // Extract component info from filename
          const componentName = file.replace('.vue', '');

          components.push({
            name: componentName,
            path: fullPath,
          });
        }
      }
    } catch {
      // Silently skip inaccessible directories
    }
  }

  walk(baseDir);
  return components.sort((a, b) => a.path.localeCompare(b.path));
}


