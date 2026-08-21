import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  RoboAccordion,
  RoboAccordionContent,
  RoboAccordionItem,
  RoboAccordionTrigger,
} from '@/core/accordion/robo-accordion';
import { RoboButton } from '@/core/button/robo-button';
import {
  RoboDescriptionList,
  RoboDescriptionTerm,
  RoboDescriptionDetail,
} from '@/core/description-list/robo-description-list';

import type { RoboOsintEntity, RoboOsintEvent, RoboOsintRelationship } from '../../types';
import type { RoboTypeRegistry } from '../../registry';
import { RoboDossierPropertyGrid } from './robo-dossier-property-grid';
import { getEntityIcon } from '../entity-icon-map';
import {
  confidenceColor,
  riskBadgeStyle,
  riskLabel,
  severityDotStyle,
  SECTION_HEADER_CLASS,
  MAX_EVENTS_SHOWN,
} from './dossier-helpers';

interface HeaderSectionProps {
  entity: RoboOsintEntity;
  registry: RoboTypeRegistry;
  onClose?: () => void;
}

export function HeaderSection({ entity, registry, onClose }: HeaderSectionProps) {
  const typeConfig = registry.getEntityTypeConfig(entity.type);
  const confidencePct = Math.round(entity.confidence * 100);
  const EntityIcon = getEntityIcon(typeConfig.icon);

  return (
    <div data-slot='entity-dossier-header' className='flex flex-col gap-3 p-4'>
      {/* Top row: icon + name + close button */}
      <div className='flex items-start gap-3'>
        {/* Entity type icon — colored circle with Lucide glyph */}
        <div
          aria-hidden='true'
          className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white'
          style={{ backgroundColor: typeConfig.color }}
        >
          <EntityIcon className='h-5 w-5' aria-hidden='true' />
        </div>

        <div className='flex-1 min-w-0'>
          <h2
            className='text-lg font-semibold leading-snug text-[var(--foreground)] truncate'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {entity.name}
          </h2>

          {/* Type badge + operator badge */}
          <div className='mt-1 flex flex-wrap gap-1.5'>
            <span
              className='inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white'
              style={{ backgroundColor: typeConfig.color }}
            >
              {typeConfig.label}
            </span>
            {entity.operator && (
              <span className='inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)] uppercase tracking-wider'>
                {entity.operator}
              </span>
            )}
          </div>
        </div>

        {onClose && (
          <RoboButton
            variant='ghost'
            size='sm'
            aria-label='Close dossier'
            className='shrink-0 -mr-1 -mt-1 h-8 w-8 p-0'
            onClick={onClose}
          >
            <X className='h-4 w-4' aria-hidden='true' />
          </RoboButton>
        )}
      </div>

      {/* Confidence bar */}
      <div>
        <div className='mb-1 flex items-center justify-between'>
          <span className='text-xs text-[var(--muted-foreground)]'>Confidence</span>
          <span className='text-xs font-medium text-[var(--foreground)]'>
            {confidencePct}%
          </span>
        </div>
        <div
          role='meter'
          aria-label={`Confidence ${confidencePct}%`}
          aria-valuenow={confidencePct}
          aria-valuemin={0}
          aria-valuemax={100}
          className='h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]'
        >
          <div
            className='h-full rounded-full transition-all'
            style={{
              width: `${confidencePct}%`,
              backgroundColor: confidenceColor(entity.confidence),
            }}
          />
        </div>
      </div>

      {/* Risk score badge */}
      {entity.riskScore !== undefined && (
        <div className='flex items-center gap-2'>
          <span className='text-xs text-[var(--muted-foreground)]'>Risk</span>
          <span
            className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'
            style={riskBadgeStyle(entity.riskScore)}
          >
            {riskLabel(entity.riskScore)} · {entity.riskScore}
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

interface SourcesSectionProps {
  sources: string[];
}

export function SourcesSection({ sources }: SourcesSectionProps) {
  if (sources.length === 0) return null;

  return (
    <div data-slot='entity-dossier-sources' className='px-4 py-3'>
      <p className={cn(SECTION_HEADER_CLASS, 'mb-2')}>Data Sources</p>
      <div className='flex flex-wrap gap-1.5'>
        {sources.map((src) => (
          <span
            key={src}
            className='inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-xs font-medium text-[var(--muted-foreground)]'
          >
            {src}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface RelationshipsListProps {
  entity: RoboOsintEntity;
  relationships: RoboOsintRelationship[];
  allEntities: RoboOsintEntity[];
  registry: RoboTypeRegistry;
  onRelatedEntityClick?: (entityId: string) => void;
}

/** Grouped-by-type relationship list — the shared body used by both the
 *  accordion section and the tabs-mode "Events & Relationships" panel. */
function RelationshipsList({
  entity,
  relationships,
  allEntities,
  registry,
  onRelatedEntityClick,
}: RelationshipsListProps) {
  const entityMap = React.useMemo(
    () => new Map(allEntities.map((e) => [e.id, e])),
    [allEntities],
  );

  // Group by relationship type
  const grouped = React.useMemo(() => {
    const map = new Map<string, RoboOsintRelationship[]>();
    for (const rel of relationships) {
      const existing = map.get(rel.type) ?? [];
      map.set(rel.type, [...existing, rel]);
    }
    return map;
  }, [relationships]);

  if (relationships.length === 0) return null;

  return (
    <ul className='space-y-3' role='list' aria-label='Entity relationships'>
      {Array.from(grouped.entries()).map(([type, rels]) => {
              const relConfig = registry.getRelationshipTypeConfig(type);
              return (
                <li key={type}>
                  <p
                    className='mb-1 text-[10px] font-semibold uppercase tracking-widest'
                    style={{ color: relConfig.color }}
                  >
                    {relConfig.label}
                  </p>
                  <ul className='space-y-1' role='list'>
                    {rels.map((rel) => {
                      const isSource = rel.sourceEntityId === entity.id;
                      const relatedId = isSource ? rel.targetEntityId : rel.sourceEntityId;
                      const relatedEntity = entityMap.get(relatedId);
                      const relatedName = relatedEntity?.name ?? relatedId;
                      const direction = isSource ? '→' : '←';

                      return (
                        <li
                          key={rel.id}
                          className='flex items-center gap-1.5 text-sm'
                        >
                          <span
                            aria-hidden='true'
                            className='text-xs font-bold text-[var(--muted-foreground)]'
                          >
                            {direction}
                          </span>
                          {onRelatedEntityClick ? (
                            <button
                              type='button'
                              onClick={() => onRelatedEntityClick(relatedId)}
                              className='text-left text-sm text-[var(--primary)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 rounded-sm'
                            >
                              {relatedName}
                            </button>
                          ) : (
                            <span className='text-sm text-[var(--foreground)]'>
                              {relatedName}
                            </span>
                          )}
                          {rel.label && (
                            <span className='text-xs text-[var(--muted-foreground)]'>
                              · {rel.label}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
    </ul>
  );
}

/** Accordion-mode wrapper around {@link RelationshipsList}. */
export function RelationshipsSection(props: RelationshipsListProps) {
  const total = props.relationships.length;
  if (total === 0) return null;

  return (
    <RoboAccordionItem value='relationships' data-slot='entity-dossier-relationships'>
      <RoboAccordionTrigger>
        <span className={SECTION_HEADER_CLASS}>
          Relationships ({total})
        </span>
      </RoboAccordionTrigger>
      <RoboAccordionContent>
        <RelationshipsList {...props} />
      </RoboAccordionContent>
    </RoboAccordionItem>
  );
}

// ---------------------------------------------------------------------------

interface EventTimelineListProps {
  events: RoboOsintEvent[];
  formatTimestamp: (epochMs: number) => string;
}

/** Sorted event timeline with "show more" — the shared body used by both the
 *  accordion section and the tabs-mode "Events & Relationships" panel. */
function EventTimelineList({ events, formatTimestamp }: EventTimelineListProps) {
  const [showAll, setShowAll] = React.useState(false);

  const sorted = React.useMemo(
    () => [...events].sort((a, b) => b.timestamp - a.timestamp),
    [events],
  );

  const visible = showAll ? sorted : sorted.slice(0, MAX_EVENTS_SHOWN);
  const hasMore = sorted.length > MAX_EVENTS_SHOWN;

  if (sorted.length === 0) return null;

  return (
    <>
      <ol className='space-y-3' role='list' aria-label='Event timeline'>
        {visible.map((event) => (
          <li
            key={event.id}
            className='flex items-start gap-2'
          >
            {/* Severity dot */}
            <span
              role='presentation'
              className='mt-1.5 h-2 w-2 shrink-0 rounded-full'
              style={severityDotStyle(event.severity)}
              aria-hidden='true'
            />

            <div className='min-w-0 flex-1'>
              {/* Timestamp + type badge */}
              <div className='flex flex-wrap items-center gap-1.5'>
                <time
                  dateTime={new Date(event.timestamp).toISOString()}
                  className='text-xs text-[var(--muted-foreground)]'
                >
                  {formatTimestamp(event.timestamp)}
                </time>
                <span className='inline-flex items-center rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 py-px text-[10px] font-medium text-[var(--muted-foreground)]'>
                  {event.type}
                </span>
              </div>

              {/* Description */}
              <p className='mt-0.5 text-sm text-[var(--foreground)]'>
                {event.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {hasMore && !showAll && (
        <button
          type='button'
          onClick={() => setShowAll(true)}
          className='mt-3 text-xs text-[var(--primary)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 rounded-sm'
        >
          Show {sorted.length - MAX_EVENTS_SHOWN} more events
        </button>
      )}
    </>
  );
}

/** Accordion-mode wrapper around {@link EventTimelineList}. */
export function EventTimelineSection({ events, formatTimestamp }: EventTimelineListProps) {
  if (events.length === 0) return null;

  return (
    <RoboAccordionItem value='events' data-slot='entity-dossier-events'>
      <RoboAccordionTrigger>
        <span className={SECTION_HEADER_CLASS}>
          Events ({events.length})
        </span>
      </RoboAccordionTrigger>
      <RoboAccordionContent>
        <EventTimelineList events={events} formatTimestamp={formatTimestamp} />
      </RoboAccordionContent>
    </RoboAccordionItem>
  );
}

// ---------------------------------------------------------------------------
// Tabs-mode tab content
// ---------------------------------------------------------------------------

interface EventsAndRelationshipsTabContentProps {
  entity: RoboOsintEntity;
  relationships: RoboOsintRelationship[];
  events: RoboOsintEvent[];
  allEntities: RoboOsintEntity[];
  registry: RoboTypeRegistry;
  onRelatedEntityClick?: (entityId: string) => void;
  formatTimestamp: (epochMs: number) => string;
}

export function EventsAndRelationshipsTabContent({
  entity,
  relationships,
  events,
  allEntities,
  registry,
  onRelatedEntityClick,
  formatTimestamp,
}: EventsAndRelationshipsTabContentProps) {
  if (relationships.length === 0 && events.length === 0) {
    return (
      <p className='text-xs text-[var(--muted-foreground)] italic'>
        No relationships or events recorded.
      </p>
    );
  }

  // Reuses the exact same accordion-item components as the `accordion`
  // layout mode (rather than the flat, always-expanded blocks this used to
  // render) — collapsing either section here shrinks the tab/panel the same
  // way collapsing a section does in accordion mode. Both start expanded to
  // match that layout's "expanded by default" convention.
  return (
    <RoboAccordion type='multiple' defaultValue={['events', 'relationships']}>
      <EventTimelineSection events={events} formatTimestamp={formatTimestamp} />
      <RelationshipsSection
        entity={entity}
        relationships={relationships}
        allEntities={allEntities}
        registry={registry}
        onRelatedEntityClick={onRelatedEntityClick}
      />
    </RoboAccordion>
  );
}

interface MoreDataTabContentProps {
  entity: RoboOsintEntity;
  formatTimestamp: (epochMs: number) => string;
}

export function MoreDataTabContent({ entity, formatTimestamp }: MoreDataTabContentProps) {
  return (
    <div className='flex flex-col gap-4'>
      <RoboDossierPropertyGrid properties={entity.properties} />
      {entity.aliases && entity.aliases.length > 0 && (
        <div>
          <p className='mb-1 text-xs font-medium text-[var(--muted-foreground)]'>Aliases</p>
          <p className='text-sm text-[var(--foreground)]'>{entity.aliases.join(', ')}</p>
        </div>
      )}
      <RoboDescriptionList className='gap-y-1'>
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
      {entity.position && (
        <div>
          <span className='text-xs text-[var(--muted-foreground)]'>Position</span>
          <p className='text-sm text-[var(--foreground)]'>
            {`${entity.position.lat.toFixed(6)}, ${entity.position.lng.toFixed(6)}`}
          </p>
        </div>
      )}
      {entity.iconKey && (
        <div>
          <span className='text-xs text-[var(--muted-foreground)]'>Symbol Code (icon key)</span>
          <p className='font-mono text-sm text-[var(--foreground)]'>{entity.iconKey}</p>
        </div>
      )}
    </div>
  );
}

interface AdvancedTabContentProps {
  relationships: RoboOsintRelationship[];
  events: RoboOsintEvent[];
  registry: RoboTypeRegistry;
  formatTimestamp: (epochMs: number) => string;
}

export function AdvancedTabContent({ relationships, events, registry, formatTimestamp }: AdvancedTabContentProps) {
  const eventsWithMetadata = events.filter((e) => e.metadata && Object.keys(e.metadata).length > 0);

  if (relationships.length === 0 && eventsWithMetadata.length === 0) {
    return (
      <p className='text-xs text-[var(--muted-foreground)] italic'>
        No advanced details available.
      </p>
    );
  }

  // Same accordion-per-section treatment as EventsAndRelationshipsTabContent
  // — each block can be collapsed independently to shorten the tab.
  return (
    <RoboAccordion type='multiple' defaultValue={['relationship-provenance', 'event-metadata']}>
      {relationships.length > 0 && (
        <RoboAccordionItem value='relationship-provenance' data-slot='entity-dossier-relationship-provenance'>
          <RoboAccordionTrigger>
            <span className={SECTION_HEADER_CLASS}>Relationship Provenance</span>
          </RoboAccordionTrigger>
          <RoboAccordionContent>
            <ul className='space-y-3' role='list'>
              {relationships.map((rel) => (
                <li key={rel.id} className='rounded-md border border-[var(--border)] p-2 text-xs'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium text-[var(--foreground)]'>
                      {registry.getRelationshipTypeConfig(rel.type).label}
                    </span>
                    <span className='text-[var(--muted-foreground)]'>
                      {Math.round(rel.confidence * 100)}% confidence
                    </span>
                  </div>
                  <RoboDescriptionList className='mt-1 gap-x-3 gap-y-0.5'>
                    <RoboDescriptionTerm className='font-normal text-[var(--muted-foreground)]'>Source</RoboDescriptionTerm>
                    <RoboDescriptionDetail className='text-xs'>{rel.source}</RoboDescriptionDetail>
                    {rel.strength !== undefined && (
                      <>
                        <RoboDescriptionTerm className='font-normal text-[var(--muted-foreground)]'>Strength</RoboDescriptionTerm>
                        <RoboDescriptionDetail className='text-xs'>{Math.round(rel.strength * 100)}%</RoboDescriptionDetail>
                      </>
                    )}
                    <RoboDescriptionTerm className='font-normal text-[var(--muted-foreground)]'>First Seen</RoboDescriptionTerm>
                    <RoboDescriptionDetail className='text-xs'>{formatTimestamp(rel.firstSeen)}</RoboDescriptionDetail>
                    <RoboDescriptionTerm className='font-normal text-[var(--muted-foreground)]'>Last Seen</RoboDescriptionTerm>
                    <RoboDescriptionDetail className='text-xs'>{formatTimestamp(rel.lastSeen)}</RoboDescriptionDetail>
                  </RoboDescriptionList>
                  {rel.metadata && Object.keys(rel.metadata).length > 0 && (
                    <div className='mt-2'>
                      <RoboDossierPropertyGrid properties={rel.metadata} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </RoboAccordionContent>
        </RoboAccordionItem>
      )}
      {eventsWithMetadata.length > 0 && (
        <RoboAccordionItem value='event-metadata' data-slot='entity-dossier-event-metadata'>
          <RoboAccordionTrigger>
            <span className={SECTION_HEADER_CLASS}>Event Metadata</span>
          </RoboAccordionTrigger>
          <RoboAccordionContent>
            <ul className='space-y-3' role='list'>
              {eventsWithMetadata.map((event) => (
                <li key={event.id} className='rounded-md border border-[var(--border)] p-2 text-xs'>
                  <p className='mb-1 font-medium text-[var(--foreground)]'>{event.description}</p>
                  <RoboDossierPropertyGrid properties={event.metadata!} />
                </li>
              ))}
            </ul>
          </RoboAccordionContent>
        </RoboAccordionItem>
      )}
    </RoboAccordion>
  );
}
