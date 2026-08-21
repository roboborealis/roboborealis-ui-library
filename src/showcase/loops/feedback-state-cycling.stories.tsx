import * as React from 'react';
import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboAlert, RoboProgress, RoboSpinnerLoading } from '@roboborealis/components/feedback';
import { RoboChip } from '@roboborealis/components/core';


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'emergency';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEP_DURATION_MS = 2500;
const PROGRESS_TICK_MS = 50;

const ALERT_STEPS: Array<{
  variant: AlertVariant;
  title: string;
  message: string;
}> = [
  {
    variant: 'info',
    title: 'System Notice',
    message: 'Constellation data sync completed. All satellite positions are current.',
  },
  {
    variant: 'success',
    title: 'Report Filed',
    message: 'Mission report PR-4421 was successfully submitted and acknowledged.',
  },
  {
    variant: 'warning',
    title: 'Satellite Overdue',
    message: 'Polaris Sentinel has not filed a telemetry report in 48 hours.',
  },
  {
    variant: 'error',
    title: 'Submission Failed',
    message: 'Unable to reach the reporting server. Retrying in 60 seconds.',
  },
  {
    variant: 'emergency',
    title: 'ANOMALY ALERT — Satellite in Distress',
    message: 'Andromeda Probe has broadcast an anomaly beacon — attitude control lost.',
  },
];

const CHIP_STATUSES: Array<{
  label: string;
  variant: 'success' | 'warning' | 'destructive' | 'primary' | 'default';
}> = [
  { label: 'In Orbit', variant: 'success' },
  { label: 'Overdue', variant: 'warning' },
  { label: 'Alert', variant: 'destructive' },
  { label: 'Docked', variant: 'primary' },
  { label: 'Unknown', variant: 'default' },
];

const SPINNER_SIZES: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  maxWidth: 560,
  padding: 24,
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--muted-foreground)',
  margin: 0,
};

const stepLabelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--muted-foreground)',
  margin: 0,
};

const spinnerRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 32,
};

const spinnerItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
};

const spinnerSizeLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--muted-foreground)',
};

const chipRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

// ---------------------------------------------------------------------------
// Helper component
// ---------------------------------------------------------------------------

function FeedbackStateCyclingDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((i) => (i + 1) % ALERT_STEPS.length);
      setProgress(0);
    }, STEP_DURATION_MS);

    return () => clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    setProgress(0);
    const increment = 100 / (STEP_DURATION_MS / PROGRESS_TICK_MS);
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + increment, 100));
    }, PROGRESS_TICK_MS);

    return () => clearInterval(progressTimer);
  }, [stepIndex]);

  const currentStep = ALERT_STEPS[stepIndex];

  return (
    <div style={containerStyle}>
      {/* Progress bar */}
      <div style={sectionStyle}>
        <RoboProgress value={progress} />
        <p style={stepLabelStyle}>
          Step {stepIndex + 1} of {ALERT_STEPS.length} — {currentStep.variant}
        </p>
      </div>

      {/* Alert cycling */}
      <div style={sectionStyle}>
        <p style={sectionLabelStyle}>Alert Variant</p>
        <RoboAlert variant={currentStep.variant} title={currentStep.title}>
          {currentStep.message}
        </RoboAlert>
      </div>

      {/* Spinner sizes */}
      <div style={sectionStyle}>
        <p style={sectionLabelStyle}>Spinners — All Sizes</p>
        <div style={spinnerRowStyle}>
          {SPINNER_SIZES.map((size) => (
            <div key={size} style={spinnerItemStyle}>
              <RoboSpinnerLoading size={size} />
              <span style={spinnerSizeLabelStyle}>{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chip status row */}
      <div style={sectionStyle}>
        <p style={sectionLabelStyle}>Status Chips</p>
        <div style={chipRowStyle}>
          {CHIP_STATUSES.map(({ label, variant }) => (
            <RoboChip key={label} variant={variant} size='sm'>
              {label}
            </RoboChip>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Feedback/Feedback State Cycling',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const FeedbackStateCycling: Story = {
  name: 'Feedback State Cycling — Alert + Toast + Progress',
  render: () => <FeedbackStateCyclingDemo />,
};
