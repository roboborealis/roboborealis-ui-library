import * as React from 'react';
import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboProgress, RoboSkeletonLoading } from '@roboborealis/components/feedback';
import { RoboCard, RoboCardBody, RoboCardHeader, RoboChip } from '@roboborealis/components/core';
import {
  RoboTable,
  RoboTableHeader,
  RoboTableBody,
  RoboTableRow,
  RoboTableHead,
  RoboTableCell,
} from '@roboborealis/components/tables';


// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATE_DURATION_MS = 3000;
const PROGRESS_TICK_MS = 50;

const outerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  padding: 24,
};

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const stateLabelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--muted-foreground)',
  margin: 0,
};

const panelsRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 16,
};

const panelHeadingStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--muted-foreground)',
  marginBottom: 10,
};

const avatarCircleStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--primary-foreground)',
  fontWeight: 700,
  fontSize: '0.875rem',
  flexShrink: 0,
};

const avatarRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const avatarTextStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const avatarNameStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--foreground)',
  margin: 0,
};

const avatarRoleStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--muted-foreground)',
  margin: 0,
};

const tableRows = [
  { satellite: 'Sentinel Relay', flag: 'NASA', status: 'In Orbit' as const },
  { satellite: 'Aurora Telescope', flag: 'ESA', status: 'Docked' as const },
  { satellite: 'Vega Probe', flag: 'JAXA', status: 'Signal Loss' as const },
];

const statusVariantMap: Record<string, 'success' | 'primary' | 'warning'> = {
  'In Orbit': 'success',
  'Docked': 'primary',
  'Signal Loss': 'warning',
};

const skeletonColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

// ---------------------------------------------------------------------------
// Sub-panels
// ---------------------------------------------------------------------------

function Panel1Skeleton() {
  return (
    <RoboCard>
      <RoboCardHeader>
        <RoboSkeletonLoading variant='text' width='60%' />
      </RoboCardHeader>
      <RoboCardBody>
        <div style={skeletonColStyle}>
          <RoboSkeletonLoading variant='rect' height={48} />
          <RoboSkeletonLoading variant='text' width='80%' />
          <RoboSkeletonLoading variant='text' width='50%' />
        </div>
      </RoboCardBody>
    </RoboCard>
  );
}

function Panel1Loaded() {
  return (
    <RoboCard>
      <RoboCardHeader>
        <strong style={{ fontSize: '0.875rem' }}>Satellite Report</strong>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>
          Final report — FR-4421
        </p>
      </RoboCardHeader>
      <RoboCardBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            ['Satellite', 'Sentinel Relay'],
            ['Destination', 'Geostationary Orbit'],
            ['Inserted', '14:30 UTC'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--muted-foreground)' }}>{label}</span>
              <span style={{ color: 'var(--foreground)' }}>{value}</span>
            </div>
          ))}
        </div>
      </RoboCardBody>
    </RoboCard>
  );
}

function Panel2Skeleton() {
  return (
    <RoboCard>
      <RoboCardBody>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <RoboSkeletonLoading variant='circle' width={40} height={40} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <RoboSkeletonLoading variant='text' width='70%' />
            <RoboSkeletonLoading variant='text' width='50%' />
          </div>
        </div>
      </RoboCardBody>
    </RoboCard>
  );
}

function Panel2Loaded() {
  return (
    <RoboCard>
      <RoboCardBody>
        <div style={avatarRowStyle}>
          <div style={avatarCircleStyle}>MT</div>
          <div style={avatarTextStyle}>
            <p style={avatarNameStyle}>Matt Taylor</p>
            <p style={avatarRoleStyle}>Constellation Coordinator</p>
          </div>
        </div>
      </RoboCardBody>
    </RoboCard>
  );
}

function Panel3Skeleton() {
  return (
    <RoboCard>
      <RoboCardBody>
        <div style={skeletonColStyle}>
          <RoboSkeletonLoading variant='rect' height={28} />
          <RoboSkeletonLoading variant='rect' height={28} />
          <RoboSkeletonLoading variant='rect' height={28} />
        </div>
      </RoboCardBody>
    </RoboCard>
  );
}

function Panel3Loaded() {
  return (
    <RoboCard>
      <RoboCardBody>
        <RoboTable>
          <RoboTableHeader>
            <RoboTableRow>
              <RoboTableHead>Satellite</RoboTableHead>
              <RoboTableHead>Operator</RoboTableHead>
              <RoboTableHead>Status</RoboTableHead>
            </RoboTableRow>
          </RoboTableHeader>
          <RoboTableBody>
            {tableRows.map((row) => (
              <RoboTableRow key={row.satellite}>
                <RoboTableCell>{row.satellite}</RoboTableCell>
                <RoboTableCell>{row.flag}</RoboTableCell>
                <RoboTableCell>
                  <RoboChip variant={statusVariantMap[row.status]} size='sm'>
                    {row.status}
                  </RoboChip>
                </RoboTableCell>
              </RoboTableRow>
            ))}
          </RoboTableBody>
        </RoboTable>
      </RoboCardBody>
    </RoboCard>
  );
}

// ---------------------------------------------------------------------------
// Main demo component
// ---------------------------------------------------------------------------

function LoadingSequencesDemo() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(STATE_DURATION_MS / 1000);

  useEffect(() => {
    const stateTimer = setInterval(() => {
      setIsLoading((v) => !v);
      setProgress(0);
      setCountdown(STATE_DURATION_MS / 1000);
    }, STATE_DURATION_MS);

    return () => clearInterval(stateTimer);
  }, []);

  useEffect(() => {
    setProgress(0);
    setCountdown(STATE_DURATION_MS / 1000);

    const increment = 100 / (STATE_DURATION_MS / PROGRESS_TICK_MS);
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + increment, 100));
    }, PROGRESS_TICK_MS);

    const countdownTimer = setInterval(() => {
      setCountdown((c) => Math.max(c - 1, 0));
    }, 1000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(countdownTimer);
    };
  }, [isLoading]);

  return (
    <div style={outerStyle}>
      {/* Status bar */}
      <div style={headerRowStyle}>
        <RoboProgress value={progress} />
        <p style={stateLabelStyle}>
          {isLoading
            ? 'Loading...'
            : `Loaded — switching in ${countdown}s...`}
        </p>
      </div>

      {/* Three panels */}
      <div style={panelsRowStyle}>
        <div>
          <p style={panelHeadingStyle}>Card</p>
          {isLoading ? <Panel1Skeleton /> : <Panel1Loaded />}
        </div>
        <div>
          <p style={panelHeadingStyle}>Avatar Row</p>
          {isLoading ? <Panel2Skeleton /> : <Panel2Loaded />}
        </div>
        <div>
          <p style={panelHeadingStyle}>Data Table</p>
          {isLoading ? <Panel3Skeleton /> : <Panel3Loaded />}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Loading/Loading Sequences',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const LoadingSequences: Story = {
  name: 'Loading Sequences — Skeleton → Content',
  render: () => <LoadingSequencesDemo />,
};
