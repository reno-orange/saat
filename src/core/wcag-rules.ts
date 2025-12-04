/**
 * WCAG 2.2 Rules Definitions
 * Centralized source of truth for all WCAG rules used in SAAT
 */

export interface WcagRuleDefinition {
  code: string;
  name: string;
  description: string;
  fullDescription: string;
}

export const WCAG_RULES: Record<string, WcagRuleDefinition> = {
  '1.1.1': {
    code: '1.1.1',
    name: 'Non-text Content',
    description: 'All non-text content that is presented to the user has a text alternative that serves the equivalent purpose.',
    fullDescription: 'Images, icons, and other non-text content must have text alternatives. This includes alt text for images, captions for videos, and descriptions for diagrams. Screen readers rely on text alternatives to convey the content to users with visual impairments.',
  },
  '1.3.1': {
    code: '1.3.1',
    name: 'Info and Relationships',
    description: 'Information, structure, and relationships conveyed through presentation can be programmatically determined.',
    fullDescription: 'The structure and relationships in the content must be clear not just visually but also in the code. This means using proper semantic HTML (headings, lists, tables) so assistive technologies can understand the content structure.',
  },
  '1.3.2': {
    code: '1.3.2',
    name: 'Meaningful Sequence',
    description: 'When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined.',
    fullDescription: 'The order in which content is read by screen readers (DOM order) must match the visual and logical sequence. Use CSS flexbox and grid carefully, as they can change visual order without changing DOM order.',
  },
  '1.4.1': {
    code: '1.4.1',
    name: 'Use of Color',
    description: 'Color is not used as the only visual means of conveying information.',
    fullDescription: 'Never rely on color alone to convey information. Always use additional visual indicators (patterns, icons, text labels) alongside color. For example, use both red color and an error icon/message, not just red.',
  },
  '2.1.1': {
    code: '2.1.1',
    name: 'Keyboard Access',
    description: 'All functionality of the content is operable through a keyboard interface.',
    fullDescription: 'Every interactive element must be accessible via keyboard. Users must be able to tab to elements, activate them with Enter/Space, and navigate menus with arrow keys. Avoid click-only interactions.',
  },
  '2.2.1': {
    code: '2.2.1',
    name: 'Timing Adjustable',
    description: 'For each time limit, provide a mechanism for the user to turn off, adjust, or extend it.',
    fullDescription: 'If content has time limits (auto-playing carousels, session timeouts), users must be able to pause, stop, hide, or extend the time. Real-time content can be exempt.',
  },
  '2.4.1': {
    code: '2.4.1',
    name: 'Bypass Blocks',
    description: 'A mechanism is available to bypass blocks of content that are repeated on multiple Web pages.',
    fullDescription: 'Provide a "Skip to main content" link at the top of pages. This allows keyboard users and screen reader users to bypass repetitive navigation elements.',
  },
  '2.4.3': {
    code: '2.4.3',
    name: 'Focus Order',
    description: 'If a web page can be navigated sequentially and the navigation sequences affect the meaning or operation, focusable components receive focus in an order that preserves meaning and operability.',
    fullDescription: 'The tab order (DOM order) must be logical and match the visual layout. Use tabindex sparingly; restructure HTML instead. Never use tabindex with positive values.',
  },
  '2.4.4': {
    code: '2.4.4',
    name: 'Link Purpose',
    description: 'The purpose of each link can be determined from the link text alone or from the link text together with its context.',
    fullDescription: 'Link text must be descriptive. Avoid "Click here" or "Read more". Screen reader users often browse by link text alone, so each link must be understandable without surrounding context.',
  },
  '2.5.1': {
    code: '2.5.1',
    name: 'Pointer Gestures',
    description: 'All functionality that uses multipoint or path-based gestures for operation can be operated with a single pointer without a path-based gesture.',
    fullDescription: 'Complex gestures (pinch, swipe, multi-touch) must have single-pointer alternatives. Users with motor impairments or using a keyboard cannot perform complex gestures.',
  },
  '3.1.1': {
    code: '3.1.1',
    name: 'Language of Page',
    description: 'The default human language of each Web page can be programmatically determined.',
    fullDescription: 'Specify the language using the lang attribute on the <html> element (e.g., lang="fr" for French). This helps screen readers pronounce text correctly.',
  },
  '3.2.4': {
    code: '3.2.4',
    name: 'Consistent Identification',
    description: 'Components that have the same functionality are identified consistently throughout the set of Web pages.',
    fullDescription: 'If a feature appears in multiple places (search button, menu, etc.), it should look and work the same way everywhere. Users rely on consistent patterns.',
  },
  '3.3.1': {
    code: '3.3.1',
    name: 'Error Identification',
    description: 'If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text.',
    fullDescription: 'When form validation fails, clearly identify which field has the error and provide a descriptive error message. Use text, not just color.',
  },
  '3.3.2': {
    code: '3.3.2',
    name: 'Labels or Instructions',
    description: 'Labels or instructions are provided when content requires user input.',
    fullDescription: 'Form inputs must have associated labels using <label> elements or aria-label. Never rely on placeholder text alone. Provide clear instructions for complex inputs.',
  },
  '4.1.2': {
    code: '4.1.2',
    name: 'Name, Role, Value',
    description: 'For all user interface components, the name, role, and current value can be programmatically determined.',
    fullDescription: 'All interactive components must have an accessible name (visible text or aria-label), a role (button, link, etc.), and current state (checked, expanded). Use semantic HTML or ARIA.',
  },
  '4.1.3': {
    code: '4.1.3',
    name: 'Status Messages',
    description: 'In content implemented using markup languages, status messages can be programmatically determined through role or properties.',
    fullDescription: 'Dynamic status messages (loading, errors, confirmations) must be announced to screen readers. Use ARIA live regions (aria-live, aria-role="alert") to announce updates.',
  },
};
