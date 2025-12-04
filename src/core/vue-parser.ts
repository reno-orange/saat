/**
 * Vue File Parser
 * Extracts template and script from .vue files without rendering
 */

import { readFileSync } from 'fs';
import type { VueComponent } from './types.js';

export function parseVueFile(filePath: string): VueComponent {
  const content = readFileSync(filePath, 'utf-8');
  const name = extractComponentName(filePath, content);

  const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/);
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);

  return {
    name,
    path: filePath,
    template: templateMatch?.[1] ?? '',
    script: scriptMatch?.[1] ?? '',
  };
}

/**
 * Extract component name from file path or script export
 */
function extractComponentName(filePath: string, content: string): string {
  // Try to extract from export default
  const exportMatch = content.match(/export\s+default\s+{[\s\S]*?name:\s*['"]([\w]+)['"]/);
  if (exportMatch?.[1]) {
    return exportMatch[1];
  }

  // Fallback: extract from filename
  const fileNameMatch = filePath.match(/([A-Za-z0-9]+)\.vue$/);
  return fileNameMatch?.[1] ?? 'UnknownComponent';
}

/**
 * Extract all HTML elements of a specific type from template
 */
export function extractElements(template: string, selector: string): Array<{ tag: string; content: string; line: number; attributes: Record<string, string | null> }> {
  const elements: Array<{ tag: string; content: string; line: number; attributes: Record<string, string | null> }> = [];

  // Simple regex-based extraction (not perfect, but works for most cases)
  const regex = new RegExp(`<${selector}[^>]*>`, 'gi');
  let match;
  let lineNumber = 1;
  let lastIndex = 0;

  while ((match = regex.exec(template)) !== null) {
    // Count newlines to track line numbers
    lineNumber += (template.substring(lastIndex, match.index).match(/\n/g) || []).length;

    const fullTag = match[0];
    const attributes = parseAttributes(fullTag);

    elements.push({
      tag: selector,
      content: fullTag,
      line: lineNumber,
      attributes,
    });

    lastIndex = match.index + match[0].length;
  }

  return elements;
}

/**
 * Parse HTML attributes from a tag string
 */
function parseAttributes(tagString: string): Record<string, string | null> {
  const attributes: Record<string, string | null> = {};

  // Match attribute="value", attribute='value', or attribute
  const attrRegex = /\s+([^\s=]+)(?:=["']([^"']*)["'])?/g;
  let match;

  while ((match = attrRegex.exec(tagString)) !== null) {
    const key = match[1];
    const value = match[2] ?? null;
    attributes[key] = value;
  }

  return attributes;
}

/**
 * Extract SVG title/desc elements
 */
export function extractSvgTitles(template: string): Array<{ line: number; content: string }> {
  const titles: Array<{ line: number; content: string }> = [];

  const titleRegex = /<svg[^>]*>[\s\S]*?<title[^>]*>([\s\S]*?)<\/title>[\s\S]*?<\/svg>/gi;
  let match;
  let lineNumber = 1;

  while ((match = titleRegex.exec(template)) !== null) {
    lineNumber += (template.substring(0, match.index).match(/\n/g) || []).length;
    titles.push({
      line: lineNumber,
      content: match[0],
    });
  }

  return titles;
}
