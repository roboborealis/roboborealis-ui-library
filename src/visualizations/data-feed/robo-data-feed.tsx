import * as React from 'react';

import { RoboButton } from '@/core/button/robo-button';
import { cn } from '@/lib/utils';
import type { RoboOsintEntity, RoboOsintEvent, RoboOsintSeverity } from '@/visualizations/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoboDataFeedProps {
  events: RoboOsintEvent[];
  entities: RoboOsintEntity[];
  /** Max items to display (no virtual windowing — just slice). Default: 100 */
  maxItems?: number;
  /** Called when user clicks an event row (focus the entity) */
  onEventClick?: (event: RoboOsintEvent) => void;
  /** Called when user clicks an entity name chip inside an event row */
  onEntityClick?: (entityId: string) => void;
  /** Currently focused entity ID — highlights related events */
  focusedEntityId?: string | null;
  /** Stagger-fade event rows in on mount. Default: false */
  animateItems?: boolean;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

/** Maps severity levels to Tailwind CSS color classes for the dot indicator. */
const SEVERITY_DOT_CLASS: Record<string, string> = {
  info:     'bg-[var(--alert-info)]',
  low:      'bg-[var(--success)]',
  medium:   'bg-[var(--alert-watch)]',
  high:     'bg-[var(--alert-warning)]',
  critical: 'bg-[var(--alert-emergency)]',
};

const SEVERITY_LABEL: Record<string, string> = {
  info: 'Info',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

function getSeverityDotClass(severity: RoboOsintSeverity | undefined): string {
  if (!severity) return 'bg-[var(--muted-foreground)]';
  return SEVERITY_DOT_CLASS[severity] ?? 'bg-[var(--muted-foreground)]';
}

function getSeverityLabel(severity: RoboOsintSeverity | undefined): string {
  if (!severity) return 'Unknown';
  return SEVERITY_LABEL[severity] ?? severity;
}

// ---------------------------------------------------------------------------
// Sub-components — defined outside the parent to avoid rerender-no-inline-components
// ---------------------------------------------------------------------------

interface EventRowProps {
  event: RoboOsintEvent;
  entityName: string | undefined;
  isFocused: boolean;
  onRowClick: (event: RoboOsintEvent) => void;
  onEntityNameClick: (entityId: string, e: React.MouseEvent) => void;
  animationDelay?: string;
}

const EventRow = React.memo(function EventRow({
  event,
  entityName,
  isFocused,
  onRowClick,
  onEntityNameClick,
  animationDelay,
}: EventRowProps) {
  const dotClass = getSeverityDotClass(event.severity);
  const severityLabel = getSeverityLabel(event.severity);
  const relativeTime = formatRelativeTime(event.timestamp);

  return (
    <li
      data-slot='event-row'
      data-event-id={event.id}
      onClick={() => onRowClick(event)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRowClick(event);
        }
      }}
      role='button'
      tabIndex={0}
      aria-label={`Event: ${event.description}, severity ${severityLabel}, ${relativeTime}`}
      aria-pressed={isFocused}
      style={animationDelay ? { animationDelay } : undefined}
      className={cn(
        'flex items-start gap-2.5 px-3 py-2.5 cursor-pointer',
        'transition-colors rounded-[var(--radius)]',
        'focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset',
        isFocused
          ? 'bg-[var(--accent)]'
          : 'hover:bg-[var(--accent)]/60',
        animationDelay && 'animate-in fade-in duration-[var(--duration-normal)]',
      )}
    >
      {/* Severity dot */}
      <span
        className={cn('mt-1.5 h-2 w-2 rounded-full flex-shrink-0', dotClass)}
        aria-hidden='true'
      />

      {/* Content */}
      <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
        {/* Entity name + source badge row */}
        <div className='flex items-center gap-1.5 flex-wrap'>
          {entityName !== undefined ? (
            <RoboButton
              variant='ghost'
              size='sm'
              onClick={(e) => onEntityNameClick(event.entityId, e)}
              className='p-0 h-auto text-sm font-semibold text-[var(--foreground)] leading-tight hover:text-[var(--primary)] hover:bg-transparent'
            >
              {entityName}
            </RoboButton>
          ) : (
            <span className='text-sm font-semibold text-[var(--muted-foreground)] leading-tight'>
              Unknown entity
            </span>
          )}

          {/* Source badge */}
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5',
              'rounded-full text-xs font-medium leading-none',
              'bg-[var(--muted)] text-[var(--muted-foreground)]',
              'border border-[var(--border)]',
            )}
          >
            {event.source}
          </span>
        </div>

        {/* Description */}
        <p className='text-sm text-[var(--muted-foreground)] leading-snug line-clamp-2'>
          {event.description}
        </p>

        {/* Timestamp */}
        <time
          dateTime={new Date(event.timestamp).toISOString()}
          className='text-xs text-[var(--muted-foreground)]/70 mt-0.5'
        >
          {relativeTime}
        </time>
      </div>
    </li>
  );
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * RoboDataFeed — scrollable real-time OSINT activity feed.
 *
 * Renders a list of `RoboOsintEvent` items with severity indicators,
 * entity name links, source badges, and relative timestamps.
 * Events related to the `focusedEntityId` are highlighted.
 *
 * @example
 * ```tsx
 * <RoboDataFeed
 *   events={events}
 *   entities={entities}
 *   focusedEntityId={selectedId}
 *   onEventClick={(ev) => setFocusedId(ev.entityId)}
 *   onEntityClick={(id) => setFocusedId(id)}
 * />
 * ```
 */
function RoboDataFeed({
  events,
  entities,
  maxItems = 100,
  onEventClick,
  onEntityClick,
  focusedEntityId,
  animateItems = false,
  className,
  ref,
}: RoboDataFeedProps) {
    // Build entity lookup map once — O(1) per event row
    const entityMap = React.useMemo(
      () => new Map(entities.map((e) => [e.id, e])),
      [entities],
    );

    const visibleEvents = React.useMemo(
      () => events.slice(0, maxItems),
      [events, maxItems],
    );

    const handleRowClick = React.useCallback(
      (event: RoboOsintEvent) => {
        onEventClick?.(event);
      },
      [onEventClick],
    );

    const handleEntityNameClick = React.useCallback(
      (entityId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onEntityClick?.(entityId);
      },
      [onEntityClick],
    );

    return (
      <div
        ref={ref}
        data-slot='data-feed'
        className={cn(
          'flex flex-col',
          'bg-[var(--card)] text-[var(--card-foreground)]',
          'border border-[var(--border)] rounded-[var(--radius)]',
          className,
        )}
      >
        {/* Header */}
        <div className='flex items-center gap-2 px-3 py-2.5 border-b border-[var(--border)]'>
          <h3 className='text-sm font-semibold text-[var(--foreground)]'>Activity Feed</h3>

          {/* Live indicator dot */}
          <span className='relative flex h-2 w-2' aria-label='Live' role='img'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75' />
            <span className='relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]' />
          </span>

          {/* Event count */}
          <span className='ml-auto text-xs text-[var(--muted-foreground)] tabular-nums'>
            {visibleEvents.length}
            {events.length > maxItems ? `/${events.length}` : ''} events
          </span>
        </div>

        {/* Event list */}
        {visibleEvents.length === 0 ? (
          <div
            className='flex items-center justify-center px-4 py-8'
            aria-live='polite'
          >
            <p className='text-sm text-[var(--muted-foreground)] italic'>
              No events match current filters
            </p>
          </div>
        ) : (
          <ul
            role='list'
            aria-label='OSINT activity events'
            aria-live='polite'
            aria-relevant='additions'
            className='max-h-[400px] overflow-y-auto flex flex-col gap-0.5 p-1.5'
          >
            {visibleEvents.map((event, idx) => (
              <EventRow
                key={event.id}
                event={event}
                entityName={entityMap.get(event.entityId)?.name}
                isFocused={focusedEntityId === event.entityId}
                onRowClick={handleRowClick}
                onEntityNameClick={handleEntityNameClick}
                animationDelay={animateItems ? `${idx * 40}ms` : undefined}
              />
            ))}
          </ul>
        )}
      </div>
    );
}
RoboDataFeed.displayName = 'RoboDataFeed';

export { RoboDataFeed };
