import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SatelliteIcon,
  RocketIcon,
  PlanetIcon,
  TelescopeIcon,
  StarIcon,
  OrbitIcon,
  CometIcon,
  CompassIcon,
  RadarIcon,
  WaypointIcon,
  ReportIcon,
} from './celestial';
import {
  Search,
  Menu,
  X,
  Settings,
  Bell,
  Filter,
  Download,
  Edit,
  Eye,
  Navigation,
  Map,
  Layers,
} from 'lucide-react';

const allCelestialIcons = [
  { name: 'SatelliteIcon', Icon: SatelliteIcon },
  { name: 'RocketIcon', Icon: RocketIcon },
  { name: 'PlanetIcon', Icon: PlanetIcon },
  { name: 'TelescopeIcon', Icon: TelescopeIcon },
  { name: 'StarIcon', Icon: StarIcon },
  { name: 'OrbitIcon', Icon: OrbitIcon },
  { name: 'CometIcon', Icon: CometIcon },
  { name: 'CompassIcon', Icon: CompassIcon },
  { name: 'RadarIcon', Icon: RadarIcon },
  { name: 'WaypointIcon', Icon: WaypointIcon },
  { name: 'ReportIcon', Icon: ReportIcon },
];

const lucideFavorites = [
  { name: 'Search', Icon: Search },
  { name: 'Menu', Icon: Menu },
  { name: 'X', Icon: X },
  { name: 'Settings', Icon: Settings },
  { name: 'Bell', Icon: Bell },
  { name: 'Filter', Icon: Filter },
  { name: 'Download', Icon: Download },
  { name: 'Edit', Icon: Edit },
  { name: 'Eye', Icon: Eye },
  { name: 'Navigation', Icon: Navigation },
  { name: 'Map', Icon: Map },
  { name: 'Layers', Icon: Layers },
];

const meta: Meta = {
  title: 'Elements/Icons',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj;

const iconCellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  padding: '12px 8px',
  borderRadius: 8,
  border: '1px solid var(--border, #e5e7eb)',
  minWidth: 80,
};

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  textAlign: 'center',
  opacity: 0.7,
  wordBreak: 'break-word',
  maxWidth: 72,
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Celestial Icons ({allCelestialIcons.length})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {allCelestialIcons.map(({ name, Icon }) => (
            <div key={name} style={iconCellStyle}>
              <Icon size={24} />
              <span style={labelStyle}>{name.replace('Icon', '')}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Size Variants</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          {[16, 24, 32, 48].map((size) => (
            <div key={size} style={{ ...iconCellStyle, minWidth: size + 24 }}>
              <SatelliteIcon size={size} />
              <span style={labelStyle}>{size}px</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Lucide Re-exports ({lucideFavorites.length})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {lucideFavorites.map(({ name, Icon }) => (
            <div key={name} style={iconCellStyle}>
              <Icon size={24} />
              <span style={labelStyle}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const CelestialGallery: Story = {
  name: 'Celestial Icons — Gallery',
  render: () => (
    <div>
      <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Celestial Icons (11)</h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {allCelestialIcons.map(({ name, Icon }) => (
          <div key={name} style={iconCellStyle}>
            <Icon size={24} />
            <span style={labelStyle}>{name.replace('Icon', '')}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const CelestialSizes: Story = {
  name: 'Celestial Icons — Size Variants',
  render: () => (
    <div>
      <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>SatelliteIcon — size variants</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        {[16, 24, 32, 48].map((size) => (
          <div key={size} style={{ ...iconCellStyle, minWidth: size + 24 }}>
            <SatelliteIcon size={size} />
            <span style={labelStyle}>{size}px</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LucideFavoritesSection: Story = {
  name: 'Lucide Re-exports — Favorites',
  render: () => (
    <div>
      <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Lucide Icons (re-exported)</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {lucideFavorites.map(({ name, Icon }) => (
          <div key={name} style={iconCellStyle}>
            <Icon size={24} />
            <span style={labelStyle}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
