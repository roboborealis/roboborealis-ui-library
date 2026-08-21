import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RoboSpinnerLoading } from './spinner/robo-spinner';
import { RoboSkeletonLoading } from './skeleton/robo-skeleton';
import { RoboLoading } from './loading/robo-loading';
import { RoboErrorState } from './error-state/robo-error-state';
import { RoboTopLoadingBar } from './top-loading-bar/robo-top-loading-bar';
import { OverviewAccordion, OverviewGroup } from '../lib/storybook/overview-layout';

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  padding: '32px',
  maxWidth: '800px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '32px',
  alignItems: 'flex-end',
};

const labelledItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
};

const sizeLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--muted-foreground)',
};

const skeletonCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  width: '240px',
};

const skeletonCardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const skeletonCardTextStyle: React.CSSProperties = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '6px',
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Components/Loading',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

// ---------------------------------------------------------------------------
// Overview story
// ---------------------------------------------------------------------------

export const Overview: Story = {
  name: 'Loading Overview',
  render: () => (
    <div style={pageStyle}>
      <OverviewAccordion>

        {/* -------------------------------------------------------------- */}
        {/* RoboSpinnerLoading                                              */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="spinner"
          title="RoboSpinnerLoading"
          description="Generic inline loading indicator. Use for button loading states and small inline contexts."
        >
          <div style={rowStyle}>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <div key={size} style={labelledItemStyle}>
                <RoboSpinnerLoading size={size} />
                <span style={sizeLabelStyle}>{size}</span>
              </div>
            ))}
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* RoboLoading                                            */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="loading"
          title="RoboLoading"
          description="Branded orbiting-satellite animation. Default loader for charts, tables, and section-level loading states."
        >
          <div style={rowStyle}>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <div key={size} style={labelledItemStyle}>
                <RoboLoading size={size} />
                <span style={sizeLabelStyle}>{size}</span>
              </div>
            ))}
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* RoboErrorState                                                  */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="error-state"
          title="RoboErrorState"
          description="Full-page or section-level branded loader with loading and error variants."
        >
          <div style={rowStyle}>
            <div style={labelledItemStyle}>
              <RoboErrorState size='md' variant='loading' />
              <span style={sizeLabelStyle}>loading</span>
            </div>
            <div style={labelledItemStyle}>
              <RoboErrorState
                size='md'
                variant='error'
                errorMessage='...uh... We have a problem?'
                retryLabel='Retry'
                onRetry={() => {}}
              />
              <span style={sizeLabelStyle}>error</span>
            </div>
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* RoboSkeletonLoading                                             */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="skeleton"
          title="RoboSkeletonLoading"
          description="Content placeholder for cards and lists. Reduces layout shift while data loads."
        >
          <div style={rowStyle}>

            {/* text lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 220 }}>
              <span style={sizeLabelStyle}>Text lines</span>
              <RoboSkeletonLoading variant='text' />
              <RoboSkeletonLoading variant='text' width='80%' />
              <RoboSkeletonLoading variant='text' width='60%' />
            </div>

            {/* circles */}
            <div style={labelledItemStyle}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <RoboSkeletonLoading variant='circle' width={32} height={32} />
                <RoboSkeletonLoading variant='circle' width={48} height={48} />
                <RoboSkeletonLoading variant='circle' width={64} height={64} />
              </div>
              <span style={sizeLabelStyle}>Circle</span>
            </div>

            {/* card skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={sizeLabelStyle}>Card state</span>
              <div style={skeletonCardStyle}>
                <div style={skeletonCardHeaderStyle}>
                  <RoboSkeletonLoading variant='circle' width={36} height={36} />
                  <div style={skeletonCardTextStyle}>
                    <RoboSkeletonLoading variant='text' width='60%' />
                    <RoboSkeletonLoading variant='text' width='40%' />
                  </div>
                </div>
                <RoboSkeletonLoading variant='rect' height={80} />
                <RoboSkeletonLoading variant='text' />
                <RoboSkeletonLoading variant='text' width='75%' />
              </div>
            </div>

          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* RoboTopLoadingBar                                               */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup
          value="top-loading-bar"
          title="RoboTopLoadingBar"
          description="Indeterminate route/page loading bar pinned to the top of its container."
        >
          <div style={{ position: 'relative', height: 48, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
            <RoboTopLoadingBar active />
          </div>
        </OverviewGroup>

      </OverviewAccordion>
    </div>
  ),
};
