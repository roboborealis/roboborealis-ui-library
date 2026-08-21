import * as React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboSwitch } from '@roboborealis/components/forms';
import { RoboCard, RoboCardBody, RoboCardHeader } from '@roboborealis/components/core';


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LayerToggle {
  key: string;
  label: string;
  description: string;
  defaultOn: boolean;
}

// ---------------------------------------------------------------------------
// Layer configuration
// ---------------------------------------------------------------------------

const LAYER_TOGGLES: LayerToggle[] = [
  {
    key: 'assetLayer',
    label: 'Show Asset Layer',
    description: 'Renders satellite markers and tracks on the map canvas.',
    defaultOn: true,
  },
  {
    key: 'floatingPanels',
    label: 'Show Floating Panels',
    description: 'Displays draggable info panels anchored to map corners.',
    defaultOn: true,
  },
  {
    key: 'mapLegend',
    label: 'Show Map Legend',
    description: 'Shows the color key for satellite status indicators.',
    defaultOn: false,
  },
  {
    key: 'coordinateDisplay',
    label: 'Show Coordinate Display',
    description: 'Real-time lat/lon readout following the cursor.',
    defaultOn: true,
  },
  {
    key: 'timeline',
    label: 'Show Timeline',
    description: 'Scrubber bar for replaying historical satellite positions.',
    defaultOn: false,
  },
  {
    key: 'alertPanel',
    label: 'Show Alert Panel',
    description: 'Live zone alert notifications in a floating panel.',
    defaultOn: true,
  },
  {
    key: 'liveTracking',
    label: 'Live Tracking',
    description: 'Continuously poll for satellite position updates.',
    defaultOn: false,
  },
];

const MOCK_PANELS: Array<{
  key: string;
  title: string;
  description: string;
  corner: string;
}> = [
  {
    key: 'assetLayer',
    title: 'Asset Layer',
    description: 'Satellite icons rendered via Mapbox symbol layer using GeoJSON source.',
    corner: 'center',
  },
  {
    key: 'floatingPanels',
    title: 'Floating Panels',
    description: 'RoboFloatingPanel components snapped to map corners. Draggable + collapsible.',
    corner: 'top-right',
  },
  {
    key: 'mapLegend',
    title: 'Map Legend',
    description: 'Color key: green = active, amber = overdue, red = alert, grey = unknown.',
    corner: 'bottom-left',
  },
  {
    key: 'coordinateDisplay',
    title: 'Coordinate Display',
    description: 'Lat/lon updates on mousemove. Displays decimal degrees or DMS format.',
    corner: 'bottom-right',
  },
  {
    key: 'timeline',
    title: 'Timeline Control',
    description: 'Scrubber bar with play/pause. Replays position history at configurable speed.',
    corner: 'bottom',
  },
  {
    key: 'alertPanel',
    title: 'Alert Panel',
    description: 'Real-time zone alerts with severity chips: Advisory → Emergency.',
    corner: 'top-left',
  },
  {
    key: 'liveTracking',
    title: 'Live Tracking',
    description: 'WebSocket connection active. Satellite positions refresh every 5 seconds.',
    corner: 'top-right',
  },
];

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const outerStyle: React.CSSProperties = {
  display: 'flex',
  gap: 0,
  height: 640,
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
};

const leftPanelStyle: React.CSSProperties = {
  width: '40%',
  flexShrink: 0,
  borderRight: '1px solid var(--border)',
  background: 'var(--card)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const leftHeaderStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderBottom: '1px solid var(--border)',
  flexShrink: 0,
};

const leftTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.875rem',
  fontWeight: 700,
  color: 'var(--foreground)',
};

const leftSubtitleStyle: React.CSSProperties = {
  margin: '2px 0 0',
  fontSize: '0.75rem',
  color: 'var(--muted-foreground)',
};

const toggleListStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '8px 0',
};

const toggleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 20px',
  borderBottom: '1px solid var(--border)',
};

const toggleTextStyle: React.CSSProperties = {
  flex: 1,
};

const toggleLabelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--foreground)',
};

const toggleDescStyle: React.CSSProperties = {
  margin: '2px 0 0',
  fontSize: '0.75rem',
  color: 'var(--muted-foreground)',
};

const rightPanelStyle: React.CSSProperties = {
  flex: 1,
  background: 'var(--muted)',
  position: 'relative',
  overflow: 'hidden',
};

const mapGridSvgStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  opacity: 0.12,
  pointerEvents: 'none',
};

const mapLabelStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '0.75rem',
  color: 'var(--muted-foreground)',
  pointerEvents: 'none',
  userSelect: 'none',
  textAlign: 'center',
};

const panelsOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  overflowY: 'auto',
};

const mockPanelCardStyle: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: '8px 12px',
};

const mockPanelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--foreground)',
};

const mockPanelDescStyle: React.CSSProperties = {
  margin: '3px 0 0',
  fontSize: '0.7rem',
  color: 'var(--muted-foreground)',
};

const mockPanelCornerStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: 4,
  padding: '1px 6px',
  background: 'var(--muted)',
  borderRadius: 4,
  fontSize: '0.65rem',
  color: 'var(--muted-foreground)',
  fontFamily: 'var(--font-mono)',
};

const emptyCanvasStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--muted-foreground)',
  fontSize: '0.8rem',
};

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

function MapGridBackground() {
  return (
    <svg style={mapGridSvgStyle} xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <defs>
        <pattern id='builder-grid' width='40' height='40' patternUnits='userSpaceOnUse'>
          <path d='M 40 0 L 0 0 0 40' fill='none' stroke='var(--border)' strokeWidth='1' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#builder-grid)' />
    </svg>
  );
}

function MockPanelCard({ title, description, corner }: { title: string; description: string; corner: string }) {
  return (
    <div style={mockPanelCardStyle}>
      <p style={mockPanelTitleStyle}>{title}</p>
      <p style={mockPanelDescStyle}>{description}</p>
      <span style={mockPanelCornerStyle}>{corner}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main playground component
// ---------------------------------------------------------------------------

function MapBuilderDemo() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const t of LAYER_TOGGLES) {
      initial[t.key] = t.defaultOn;
    }
    return initial;
  });

  function handleToggle(key: string) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const visiblePanels = MOCK_PANELS.filter((p) => toggles[p.key]);

  return (
    <div style={{ padding: 24 }}>
      <div style={outerStyle}>
        {/* Left: configuration panel */}
        <div style={leftPanelStyle}>
          <div style={leftHeaderStyle}>
            <p style={leftTitleStyle}>Map Builder</p>
            <p style={leftSubtitleStyle}>Toggle layers and panels to configure the map view</p>
          </div>
          <div style={toggleListStyle}>
            {LAYER_TOGGLES.map((toggle) => (
              <div key={toggle.key} style={toggleRowStyle}>
                <div style={toggleTextStyle}>
                  <p style={toggleLabelStyle}>{toggle.label}</p>
                  <p style={toggleDescStyle}>{toggle.description}</p>
                </div>
                <RoboSwitch
                  checked={toggles[toggle.key]}
                  onCheckedChange={() => handleToggle(toggle.key)}
                  aria-label={toggle.label}
                  size='sm'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: mock map canvas */}
        <div style={rightPanelStyle}>
          <MapGridBackground />

          {visiblePanels.length === 0 ? (
            <div style={emptyCanvasStyle}>
              Enable a layer to see it here
            </div>
          ) : (
            <div style={panelsOverlayStyle}>
              {visiblePanels.map((panel) => (
                <MockPanelCard
                  key={panel.key}
                  title={panel.title}
                  description={panel.description}
                  corner={panel.corner}
                />
              ))}
            </div>
          )}

          <div style={mapLabelStyle}>
            {visiblePanels.length === 0 ? null : (
              <span>{visiblePanels.length} panel{visiblePanels.length !== 1 ? 's' : ''} active</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export const patternMeta = {
  demonstrates: 'An interactive layer-toggle configurator: switches that turn individual map layers and panels on and off, with a live mock preview of each.',
  whenToUse: 'Use as the reference when a feature needs to let a user compose or configure which map layers and panels are active, rather than a fixed map layout.',
  keywords: ['layer toggle', 'map configurator', 'switch panel', 'map builder', 'layer switches', 'panel preview'],
  agentPriority: 'Prioritize this pattern specifically for layer-configuration UI. For the maps themselves once layers are chosen, use one of the Maps-category patterns such as Constellation Monitor, Multi-Domain Operations, or Emergency Response as the live-map reference instead.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Forms/Map Builder',
  excludeStories: ['patternMeta'],
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const MapBuilderPlayground: Story = {
  name: 'Map Builder — Layer & Panel Configurator',
  render: () => <MapBuilderDemo />,
};
