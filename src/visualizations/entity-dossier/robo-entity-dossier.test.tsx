import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { ALL_DOSSIER_SECTIONS, DOSSIER_TAB_IDS, RoboEntityDossier } from './robo-entity-dossier';
import type { RoboOsintEntity, RoboOsintEvent, RoboOsintRelationship } from '../types';
import { createTypeRegistry } from '../registry';


// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const now = Date.now();

const entity: RoboOsintEntity = {
  id: 'e1',
  type: 'spacecraft',
  name: 'Andromeda Probe',
  aliases: ['ANDROMEDA', 'COSPAR 1998-067A'],
  sources: ['telemetry', 'satellite'],
  confidence: 0.85,
  firstSeen: now - 86_400_000 * 30,
  lastSeen: now,
  properties: { noradId: '25544', cosparId: '1998-067A' },
  riskScore: 45,
};

const allEntities: RoboOsintEntity[] = [
  entity,
  {
    id: 'e2',
    type: 'company',
    name: 'Orbital Dynamics Ltd',
    sources: ['registry'],
    confidence: 0.7,
    firstSeen: now - 86_400_000 * 60,
    lastSeen: now,
    properties: {},
  },
];

const relationships: RoboOsintRelationship[] = [
  {
    id: 'r1',
    sourceEntityId: 'e1',
    targetEntityId: 'e2',
    type: 'owner',
    confidence: 0.8,
    source: 'registry',
    firstSeen: now - 86_400_000 * 30,
    lastSeen: now,
  },
];

const events: RoboOsintEvent[] = [
  {
    id: 'ev1',
    entityId: 'e1',
    type: 'ground-contact',
    source: 'ground-network',
    timestamp: now - 3_600_000,
    description: 'Downlink at Goldstone',
    severity: 'info',
  },
];

const registry = createTypeRegistry();

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboEntityDossier', () => {
  it('renders the entity name', () => {
    render(
      <RoboEntityDossier
        entity={entity}
        relationships={relationships}
        events={events}
        allEntities={allEntities}
        registry={registry}
      />,
    );
    expect(screen.getByText('Andromeda Probe')).toBeInTheDocument();
  });

  it('renders data source badges', () => {
    render(
      <RoboEntityDossier
        entity={entity}
        relationships={relationships}
        events={events}
        allEntities={allEntities}
        registry={registry}
      />,
    );
    expect(screen.getByText(/telemetry/i)).toBeInTheDocument();
    expect(screen.getByText(/satellite/i)).toBeInTheDocument();
  });

  it('renders risk score when provided', () => {
    render(
      <RoboEntityDossier
        entity={entity}
        relationships={relationships}
        events={events}
        allEntities={allEntities}
        registry={registry}
      />,
    );
    // Risk badge shows "Medium · 45"
    expect(screen.getByText(/Medium · 45/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <RoboEntityDossier
        entity={entity}
        relationships={relationships}
        events={events}
        allEntities={allEntities}
        registry={registry}
        onClose={onClose}
      />,
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('accepts className prop', () => {
    const { container } = render(
      <RoboEntityDossier
        entity={entity}
        relationships={relationships}
        events={events}
        allEntities={allEntities}
        registry={registry}
        className='custom-dossier'
      />,
    );
    expect(container.firstChild).toHaveClass('custom-dossier');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <RoboEntityDossier
        entity={entity}
        relationships={relationships}
        events={events}
        allEntities={allEntities}
        registry={registry}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('maxHeight', () => {
    it('defaults to h-full and no inline maxHeight when omitted', () => {
      const { container } = render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
        />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain('h-full');
      expect(root.style.maxHeight).toBe('');
    });

    it('applies the maxHeight style and drops h-full when provided', () => {
      const { container } = render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
          maxHeight="76vh"
        />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.style.maxHeight).toBe('76vh');
      expect(root.className).not.toContain('h-full');
    });

    it('gives the scrollable content region flex-1 min-h-0 so it can shrink below its natural content height', () => {
      const { container } = render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
          maxHeight="76vh"
        />,
      );
      const scrollRegion = (container.firstChild as HTMLElement).firstChild as HTMLElement;
      expect(scrollRegion.className).toContain('flex-1');
      expect(scrollRegion.className).toContain('min-h-0');
      expect(scrollRegion.className).toContain('overflow-y-auto');
    });
  });

  describe('empty sections', () => {
    it('hides the Relationships section entirely when there are no relationships', () => {
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={[]}
          events={events}
          allEntities={allEntities}
          registry={registry}
        />,
      );
      expect(screen.queryByText(/Relationships/)).not.toBeInTheDocument();
      expect(screen.queryByText('No relationships found.')).not.toBeInTheDocument();
    });

    it('hides the Events section entirely when there are no events', () => {
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={[]}
          allEntities={allEntities}
          registry={registry}
        />,
      );
      expect(screen.queryByText(/Events/)).not.toBeInTheDocument();
      expect(screen.queryByText('No events recorded.')).not.toBeInTheDocument();
    });

    it('still shows both sections when relationships and events are present', () => {
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
        />,
      );
      expect(screen.getByText('Relationships (1)')).toBeInTheDocument();
      expect(screen.getByText('Events (1)')).toBeInTheDocument();
    });
  });

  describe('controlled expandedSections', () => {
    it('exports ALL_DOSSIER_SECTIONS covering properties/relationships/events', () => {
      expect(ALL_DOSSIER_SECTIONS).toEqual(['properties', 'relationships', 'events']);
    });

    it('defaults to all sections expanded when uncontrolled', () => {
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
        />,
      );
      expect(screen.getByText('Downlink at Goldstone')).toBeInTheDocument();
    });

    it('respects a controlled expandedSections prop — empty array collapses every section', () => {
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
          expandedSections={[]}
        />,
      );
      expect(screen.queryByText('Downlink at Goldstone')).not.toBeInTheDocument();
    });

    it('calls onExpandedSectionsChange when a section is toggled', async () => {
      const user = userEvent.setup();
      const onExpandedSectionsChange = vi.fn();
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
          expandedSections={[...ALL_DOSSIER_SECTIONS]}
          onExpandedSectionsChange={onExpandedSectionsChange}
        />,
      );
      await user.click(screen.getByText('Events (1)'));
      expect(onExpandedSectionsChange).toHaveBeenCalledWith(['properties', 'relationships']);
    });
  });

  describe('layout="tabs"', () => {
    const entityWithExtras: RoboOsintEntity = {
      ...entity,
      position: { lat: 35.43, lng: -116.9 },
      iconKey: 'SFGPUCF----K',
    };

    const relationshipWithExtras: RoboOsintRelationship = {
      ...relationships[0],
      strength: 0.6,
      metadata: { registryCountry: 'US' },
    };

    const eventWithMetadata: RoboOsintEvent = {
      ...events[0],
      metadata: { antenna: 'DSS-14' },
    };

    it('exports DOSSIER_TAB_IDS in display order', () => {
      expect(DOSSIER_TAB_IDS).toEqual(['events-relationships', 'more-data', 'data-sources', 'advanced']);
    });

    it('renders all 4 tab triggers in order', () => {
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
          layout='tabs'
        />,
      );
      const tabs = screen.getAllByRole('tab').map((t) => t.textContent);
      expect(tabs).toEqual(['Events & Relationships', 'More Data', 'Data Sources', 'Advanced']);
    });

    it('renders the header identically regardless of layout', () => {
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
          layout='tabs'
        />,
      );
      expect(screen.getByText('Andromeda Probe')).toBeInTheDocument();
      expect(screen.getByText(/Medium · 45/)).toBeInTheDocument();
    });

    it('"Events & Relationships" tab shows events and relationships by default', () => {
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
          layout='tabs'
        />,
      );
      expect(screen.getByText('Downlink at Goldstone')).toBeInTheDocument();
      expect(screen.getByText('Orbital Dynamics Ltd')).toBeInTheDocument();
    });

    it('"Events & Relationships" tab shows an empty state when both are absent', () => {
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={[]}
          events={[]}
          allEntities={allEntities}
          registry={registry}
          layout='tabs'
        />,
      );
      expect(screen.getByText('No relationships or events recorded.')).toBeInTheDocument();
    });

    it('"More Data" tab shows properties, position, and iconKey', async () => {
      const user = userEvent.setup();
      render(
        <RoboEntityDossier
          entity={entityWithExtras}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
          layout='tabs'
        />,
      );
      await user.click(screen.getByRole('tab', { name: 'More Data' }));
      expect(screen.getByText('25544')).toBeInTheDocument();
      expect(screen.getByText('35.430000, -116.900000')).toBeInTheDocument();
      expect(screen.getByText('SFGPUCF----K')).toBeInTheDocument();
    });

    it('"Data Sources" tab shows the source badges', async () => {
      const user = userEvent.setup();
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
          layout='tabs'
        />,
      );
      await user.click(screen.getByRole('tab', { name: 'Data Sources' }));
      expect(screen.getByText('telemetry')).toBeInTheDocument();
      expect(screen.getByText('satellite')).toBeInTheDocument();
    });

    it('"Advanced" tab shows relationship strength/metadata and event metadata', async () => {
      const user = userEvent.setup();
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={[relationshipWithExtras]}
          events={[eventWithMetadata]}
          allEntities={allEntities}
          registry={registry}
          layout='tabs'
        />,
      );
      await user.click(screen.getByRole('tab', { name: 'Advanced' }));
      expect(screen.getByText('60%')).toBeInTheDocument();
      expect(screen.getByText('US')).toBeInTheDocument();
      expect(screen.getByText('DSS-14')).toBeInTheDocument();
    });

    it('"Advanced" tab shows relationship provenance (confidence/source/dates) even without strength/metadata', async () => {
      const user = userEvent.setup();
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={relationships}
          events={events}
          allEntities={allEntities}
          registry={registry}
          layout='tabs'
        />,
      );
      await user.click(screen.getByRole('tab', { name: 'Advanced' }));
      expect(screen.getByText('80% confidence')).toBeInTheDocument();
      expect(screen.getByText('registry')).toBeInTheDocument();
    });

    it('"Advanced" tab shows an empty state when there are no relationships and no event metadata', async () => {
      const user = userEvent.setup();
      render(
        <RoboEntityDossier
          entity={entity}
          relationships={[]}
          events={events}
          allEntities={allEntities}
          registry={registry}
          layout='tabs'
        />,
      );
      await user.click(screen.getByRole('tab', { name: 'Advanced' }));
      expect(screen.getByText('No advanced details available.')).toBeInTheDocument();
    });

    it('passes axe accessibility checks in tabs layout', async () => {
      const { container } = render(
        <RoboEntityDossier
          entity={entityWithExtras}
          relationships={[relationshipWithExtras]}
          events={[eventWithMetadata]}
          allEntities={allEntities}
          registry={registry}
          layout='tabs'
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
