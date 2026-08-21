import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  RoboAccordion,
  RoboAccordionContent,
  RoboAccordionItem,
  RoboAccordionTrigger,
} from '@/core/accordion/robo-accordion';
import {
  RoboDescriptionList,
  RoboDescriptionTerm,
  RoboDescriptionDetail,
} from '@/core/description-list/robo-description-list';
import { RoboTabs, RoboTabsList, RoboTabsTrigger, RoboTabsContent } from '@/navigation/tabs/robo-tabs';

import type { RoboOsintEntity, RoboOsintEvent, RoboOsintRelationship } from '../types';
import type { RoboTypeRegistry } from '../registry';
import { RoboDossierPropertyGrid } from './dossier-sections/robo-dossier-property-grid';
import { SECTION_HEADER_CLASS } from './dossier-sections/dossier-helpers';
import {
  HeaderSection,
  SourcesSection,
  RelationshipsSection,
  EventTimelineSection,
  EventsAndRelationshipsTabContent,
  MoreDataTabContent,
  AdvancedTabContent,
} from './dossier-sections/robo-dossier-sections';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface RoboEntityDossierProps {
  entity: RoboOsintEntity;
  /** All relationships involving this entity (source or target). */
  relationships: RoboOsintRelationship[];
  /** All events for this entity. */
  events: RoboOsintEvent[];
  /** Needed to resolve related entity names. */
  allEntities: RoboOsintEntity[];
  registry: RoboTypeRegistry;
  /** Custom timestamp formatter — consumers provide this to match user date/time preferences. */
  formatTimestamp?: (epochMs: number) => string;
  onClose?: () => void;
  onRelatedEntityClick?: (entityId: string) => void;
  className?: string;
  /**
   * Caps the dossier's own height as a CSS length (e.g. `'76vh'`), letting it
   * shrink to fit its content — collapsing an accordion section (Properties/
   * Relationships/Events) shrinks the whole dossier instead of leaving empty
   * space below. Internal scrolling still kicks in past the cap. When
   * omitted, keeps the original `h-full` behavior (fills a parent that
   * already provides an explicit height) for full backward compatibility —
   * pass this instead of wrapping the dossier in your own fixed-`height`
   * div, which fights this shrink-to-fit behavior.
   */
  maxHeight?: string;
  /**
   * Controlled set of currently-expanded accordion section ids (a subset of
   * `ALL_DOSSIER_SECTIONS`). Pair with `onExpandedSectionsChange` to drive
   * an external "expand all"/"collapse all" control. Omit for normal
   * uncontrolled behavior (all sections expanded by default).
   */
  expandedSections?: string[];
  onExpandedSectionsChange?: (sections: string[]) => void;
  /**
   * `'accordion'` (default) — Properties/Relationships/Events as collapsible
   * sections under a static Data Sources strip, unchanged from before.
   * `'tabs'` — everything below the header (Events & Relationships, More
   * Data, Data Sources, Advanced) becomes 4 tabs instead, ordered by
   * relevance. `expandedSections`/`onExpandedSectionsChange` have no effect
   * in tabs mode.
   */
  layout?: 'accordion' | 'tabs';
  ref?: React.Ref<HTMLDivElement>;
}

/** All accordion section ids the dossier can render, in display order. */
export const ALL_DOSSIER_SECTIONS = ['properties', 'relationships', 'events'] as const;

/** All tab ids the dossier can render in `layout="tabs"`, in display order. */
export const DOSSIER_TAB_IDS = ['events-relationships', 'more-data', 'data-sources', 'advanced'] as const;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function defaultFormatTimestamp(epochMs: number): string {
  return new Date(epochMs).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * RoboEntityDossier — a detailed information panel for a selected OSINT entity.
 *
 * Displays entity metadata, properties, data sources, relationships, and an
 * event timeline in a vertically scrollable panel.
 *
 * @example
 * ```tsx
 * <RoboEntityDossier
 *   entity={selectedEntity}
 *   relationships={relatedRels}
 *   events={entityEvents}
 *   allEntities={allEntities}
 *   registry={registry}
 *   onClose={() => setSelected(null)}
 *   onRelatedEntityClick={(id) => setSelected(id)}
 * />
 * ```
 */
function RoboEntityDossier({
  entity,
  relationships,
  events,
  allEntities,
  registry,
  formatTimestamp = defaultFormatTimestamp,
  onClose,
  onRelatedEntityClick,
  className,
  maxHeight,
  expandedSections: controlledExpandedSections,
  onExpandedSectionsChange,
  layout = 'accordion',
  ref,
}: RoboEntityDossierProps) {
    const [uncontrolledExpandedSections, setUncontrolledExpandedSections] = React.useState<string[]>(
      () => [...ALL_DOSSIER_SECTIONS],
    );
    const isControlled = controlledExpandedSections !== undefined;
    const expandedSections = isControlled ? controlledExpandedSections : uncontrolledExpandedSections;

    const handleExpandedSectionsChange = React.useCallback(
      (next: string[]) => {
        if (!isControlled) setUncontrolledExpandedSections(next);
        onExpandedSectionsChange?.(next);
      },
      [isControlled, onExpandedSectionsChange],
    );

    return (
      <div
        ref={ref}
        data-slot='entity-dossier'
        role='region'
        aria-label={`Dossier: ${entity.name}`}
        className={cn(
          'flex flex-col overflow-hidden',
          maxHeight ? undefined : 'h-full',
          'bg-[var(--card)] text-[var(--card-foreground)]',
          'rounded-[var(--radius-lg)] border border-[var(--border)]',
          className,
        )}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {/* Scrollable content */}
        <div className='flex-1 min-h-0 overflow-y-auto'>
          {/* Header */}
          <HeaderSection entity={entity} registry={registry} onClose={onClose} />

          <hr className='border-[var(--border)]' aria-hidden='true' />

          {layout === 'tabs' ? (
            <RoboTabs defaultValue={DOSSIER_TAB_IDS[0]} className='flex-1 min-h-0'>
              {/* pill/orange reads more clearly as "tabs" than the flat
                  underline default; compact padding/font keeps 4 tabs from
                  overflowing the ~400px panel width. */}
              <RoboTabsList variant='pill' tone='orange' className='mx-4 flex-nowrap'>
                <RoboTabsTrigger variant='pill' tone='orange' value='events-relationships' className='px-2 py-2 text-xs'>
                  Events & Relationships
                </RoboTabsTrigger>
                <RoboTabsTrigger variant='pill' tone='orange' value='more-data' className='px-2 py-2 text-xs'>More Data</RoboTabsTrigger>
                <RoboTabsTrigger variant='pill' tone='orange' value='data-sources' className='px-2 py-2 text-xs'>Data Sources</RoboTabsTrigger>
                <RoboTabsTrigger variant='pill' tone='orange' value='advanced' className='px-2 py-2 text-xs'>Advanced</RoboTabsTrigger>
              </RoboTabsList>
              <RoboTabsContent value='events-relationships' tinted className='mx-4'>
                <EventsAndRelationshipsTabContent
                  entity={entity}
                  relationships={relationships}
                  events={events}
                  allEntities={allEntities}
                  registry={registry}
                  onRelatedEntityClick={onRelatedEntityClick}
                  formatTimestamp={formatTimestamp}
                />
              </RoboTabsContent>
              <RoboTabsContent value='more-data' tinted className='mx-4'>
                <MoreDataTabContent entity={entity} formatTimestamp={formatTimestamp} />
              </RoboTabsContent>
              <RoboTabsContent value='data-sources' tinted className='mx-4'>
                <SourcesSection sources={entity.sources} />
              </RoboTabsContent>
              <RoboTabsContent value='advanced' tinted className='mx-4'>
                <AdvancedTabContent
                  relationships={relationships}
                  events={events}
                  registry={registry}
                  formatTimestamp={formatTimestamp}
                />
              </RoboTabsContent>
            </RoboTabs>
          ) : (
            <>
              {/* Sources */}
              <SourcesSection sources={entity.sources} />

              <hr className='border-[var(--border)]' aria-hidden='true' />

              {/* Accordion sections */}
              <RoboAccordion
                type='multiple'
                value={expandedSections}
                onValueChange={handleExpandedSectionsChange}
                className='px-4'
              >
                {/* Properties */}
                <RoboAccordionItem value='properties' data-slot='entity-dossier-properties'>
                  <RoboAccordionTrigger>
                    <span className={SECTION_HEADER_CLASS}>Properties</span>
                  </RoboAccordionTrigger>
                  <RoboAccordionContent>
                    <RoboDossierPropertyGrid properties={entity.properties} />
                    {/* Aliases */}
                    {entity.aliases && entity.aliases.length > 0 && (
                      <div className='mt-3'>
                        <p className='mb-1 text-xs font-medium text-[var(--muted-foreground)]'>
                          Aliases
                        </p>
                        <p className='text-sm text-[var(--foreground)]'>
                          {entity.aliases.join(', ')}
                        </p>
                      </div>
                    )}
                    {/* Timestamps */}
                    <RoboDescriptionList className='mt-3 gap-y-1'>
                      <RoboDescriptionTerm className='font-normal text-[var(--muted-foreground)]'>First Seen</RoboDescriptionTerm>
                      <RoboDescriptionDetail>
                        <time dateTime={new Date(entity.firstSeen).toISOString()}>
                          {formatTimestamp(entity.firstSeen)}
                        </time>
                      </RoboDescriptionDetail>
                      <RoboDescriptionTerm className='font-normal text-[var(--muted-foreground)]'>Last Seen</RoboDescriptionTerm>
                      <RoboDescriptionDetail>
                        <time dateTime={new Date(entity.lastSeen).toISOString()}>
                          {formatTimestamp(entity.lastSeen)}
                        </time>
                      </RoboDescriptionDetail>
                    </RoboDescriptionList>
                  </RoboAccordionContent>
                </RoboAccordionItem>

                {/* Relationships */}
                <RelationshipsSection
                  entity={entity}
                  relationships={relationships}
                  allEntities={allEntities}
                  registry={registry}
                  onRelatedEntityClick={onRelatedEntityClick}
                />

                {/* Event Timeline */}
                <EventTimelineSection events={events} formatTimestamp={formatTimestamp} />
              </RoboAccordion>
            </>
          )}
        </div>
      </div>
    );
}
RoboEntityDossier.displayName = 'RoboEntityDossier';

export { RoboEntityDossier };
