/**
 * @roboborealis/components/agent-context
 *
 * Machine-readable knowledge layer for AI agents and CLI tools.
 * Exports the full component catalog, template registry, story catalog,
 * design rules, and archetype registry.
 *
 * Usage:
 *   import { manifest, templates, storiesCatalog, designGuide, archetypes } from '@roboborealis/components/agent-context';
 */

import manifestJson from './manifest.json';

export { default as manifest } from './manifest.json';
export { default as storiesCatalog } from './stories-catalog.json';
export { designGuide } from './design-guide';
export { archetypes } from './archetypes';
export type { Archetype } from './archetypes';

/**
 * The 10 copy-adaptable page templates of @roboborealis/components/templates:
 * name, kind (shell | starter | content), archetype link, Storybook preview
 * path, and description. Convenience view over `manifest.templates`.
 */
export const templates = manifestJson.templates;
