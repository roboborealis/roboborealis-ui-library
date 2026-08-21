// ---------------------------------------------------------------------------
// Storybook-only Overview layout helpers
//
// The standard shape for a multi-section "Overview" showcase story: each
// section is a collapsible accordion group, all open by default, so a reader
// can jump to the part they care about and collapse the rest.
//
// Extracted once and reused across every Overview story so the layout can't
// drift page-to-page. NOT part of any tsup lib entry — stories and their
// helpers are never bundled into the published package.
//
// Usage:
//   <OverviewAccordion>
//     <OverviewGroup value="buttons" title="Buttons" description={<>Every <strong>variant</strong>.</>}>
//       <OverviewSection title="Variants" description="Primary through ghost.">
//         ...content...
//       </OverviewSection>
//     </OverviewGroup>
//   </OverviewAccordion>
// ---------------------------------------------------------------------------

import * as React from 'react';

import {
  RoboAccordion,
  RoboAccordionItem,
  RoboAccordionTrigger,
  RoboAccordionContent,
} from '../../core/accordion/robo-accordion';
import { cn } from '../utils';

// ---------------------------------------------------------------------------
// Group title — the big collapsible trigger label
// ---------------------------------------------------------------------------

function GroupTitle({ title, description }: { title: string; description?: React.ReactNode }) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
      <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-heading, var(--font-sans))' }}>
        {title}
      </span>
      {description != null && (
        <span style={{ fontSize: '0.85rem', fontWeight: 400, lineHeight: 1.5, color: 'var(--secondary-text)', maxWidth: '52ch' }}>
          {description}
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// OverviewAccordion — wraps every group, auto-opens all of them
// ---------------------------------------------------------------------------

export interface OverviewAccordionProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Which groups start expanded. `'all'` (default) opens every group — best for
   * light pages. `'first'` opens only the first group and collapses the rest —
   * use for heavy pages (e.g. many live charts) so they don't all mount at once.
   */
  open?: 'all' | 'first';
}

/**
 * Root of an Overview page. Renders a `type="multiple"` accordion. By default it
 * opens every child `OverviewGroup` — the open set is derived from the children's
 * `value` props, so a caller can never forget to expand one. Pass `open="first"`
 * on heavy pages to expand only the first group.
 */
export function OverviewAccordion({ children, className, open = 'all' }: OverviewAccordionProps) {
  const values = React.Children.toArray(children)
    .filter((child): child is React.ReactElement<OverviewGroupProps> => React.isValidElement(child))
    .map((child) => child.props.value)
    .filter((value): value is string => Boolean(value));

  const defaultValue = open === 'first' ? values.slice(0, 1) : values;

  return (
    <RoboAccordion
      type="multiple"
      defaultValue={defaultValue}
      className={cn('flex flex-col gap-2', className)}
    >
      {children}
    </RoboAccordion>
  );
}

// ---------------------------------------------------------------------------
// OverviewGroup — one collapsible top-level section
// ---------------------------------------------------------------------------

export interface OverviewGroupProps {
  /** Unique accordion value; also the key used to open the group by default. */
  value: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}

export function OverviewGroup({ value, title, description, children }: OverviewGroupProps) {
  return (
    <RoboAccordionItem value={value}>
      <RoboAccordionTrigger>
        <GroupTitle title={title} description={description} />
      </RoboAccordionTrigger>
      <RoboAccordionContent className="bg-transparent">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingTop: 8 }}>
          {children}
        </div>
      </RoboAccordionContent>
    </RoboAccordionItem>
  );
}

// ---------------------------------------------------------------------------
// OverviewSection — a sub-section inside a group
// ---------------------------------------------------------------------------

export interface OverviewSectionProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}

export function OverviewSection({ title, description, children }: OverviewSectionProps) {
  return (
    <section>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-heading, var(--font-sans))' }}>
          {title}
        </h3>
        {description != null && (
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--secondary-text)', maxWidth: '48ch' }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// OverviewStack — plain open column of sections (no accordion chrome)
// ---------------------------------------------------------------------------

export interface OverviewStackProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A non-collapsible column of `OverviewSection`s. Use for single-component
 * "All Variants" pages, where per-block accordions would add chevrons/borders
 * without helping the reader skim — everything stays visible at once. Reserve
 * `OverviewAccordion`/`OverviewGroup` for multi-component overview pages.
 */
export function OverviewStack({ children, className }: OverviewStackProps) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 40, padding: '8px 0' }}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// StoryLink — clickable link from one story to another in the Storybook manager
// ---------------------------------------------------------------------------

export interface StoryLinkProps {
  /** Exact story id from stories-catalog.json, e.g. "elements-flags--overview". */
  id: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Navigates the Storybook manager to another story. Stories render inside the
 * preview iframe (`/iframe.html?id=…`), so a bare `?path=` would resolve against
 * `iframe.html` and break — `./?path=` resolves to the manager and survives a
 * future base path. `target="_top"` breaks out of the iframe to the manager.
 */
export function StoryLink({ id, children, className }: StoryLinkProps) {
  return (
    <a
      href={`./?path=/story/${id}`}
      target="_top"
      className={className}
      style={{ color: 'var(--primary-text)', textDecoration: 'none', fontWeight: 500 }}
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// OverviewLinkCards — the "showcase" landing style: a grid of cards, each with
// a title, description, and pill links to related stories.
// ---------------------------------------------------------------------------

export interface OverviewCardLink {
  label: string;
  id: string;
}

export interface OverviewCard {
  title: string;
  description?: React.ReactNode;
  links: OverviewCardLink[];
}

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 11,
  fontWeight: 600,
  padding: '3px 9px',
  borderRadius: 999,
  background: 'color-mix(in oklch, var(--primary) 12%, transparent)',
  border: '1px solid color-mix(in oklch, var(--primary) 40%, transparent)',
  color: 'var(--primary-text)',
  cursor: 'pointer',
};

/**
 * Grid of link cards — the standard "section landing" / root-overview layout.
 * Each card links out to related stories via pill-styled `StoryLink`s.
 */
export function OverviewLinkCards({ cards }: { cards: OverviewCard[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
      {cards.map((card) => (
        <div
          key={card.title}
          style={{ padding: '16px 18px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)' }}
        >
          <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 13 }}>{card.title}</p>
          {card.description != null && (
            <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--secondary-text)', lineHeight: 1.5 }}>
              {card.description}
            </p>
          )}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {card.links.map((l) => (
              <StoryLink key={l.id} id={l.id}>
                <span style={pillStyle}>{l.label} <span aria-hidden="true">→</span></span>
              </StoryLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
