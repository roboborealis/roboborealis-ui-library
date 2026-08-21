import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Satellite, AlertTriangle, CheckCircle, Settings } from 'lucide-react';

import { RoboButton } from './button/robo-button';
import { RoboIconButton } from './button/robo-icon-button';
import { RoboAvatar, RoboAvatarGroup } from './avatar/robo-avatar';
import { RoboBadge } from './badge/robo-badge';
import { RoboCard, RoboCardHeader, RoboCardBody, RoboCardFooter } from './card/robo-card';
import { RoboChip } from './chip/robo-chip';
import { RoboInput } from './input/robo-input';
import { RoboSeparator } from './separator/robo-separator';
import {
  RoboAccordion,
  RoboAccordionItem,
  RoboAccordionTrigger,
  RoboAccordionContent,
} from './accordion/robo-accordion';
import { RoboCopyButton } from './copy-button/robo-copy-button';
import { RoboExportButton } from './export-button/robo-export-button';
import { RoboPrintButton } from './print-button/robo-print-button';
import { RoboActionButton } from './action-button/robo-action-button';
import { RoboDescriptionList } from './description-list/robo-description-list';
import { RoboFieldList } from './field-list/robo-field-list';
import { RoboKbd } from './kbd/robo-kbd';
import { RoboCourseIndicator } from './course-indicator/robo-course-indicator';
import { RoboTooltipProvider } from '../feedback/tooltip/robo-tooltip';
import { OverviewAccordion, OverviewGroup, OverviewSection, StoryLink } from '../lib/storybook/overview-layout';
import { Download, Printer, Trash2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  padding: '32px 24px',
  maxWidth: 900,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

const mockData = [{ name: 'Satellite Alpha', status: 'Active', position: '26.5N 56.3E' }];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Elements/Actions',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const Overview: Story = {
  name: 'Actions Overview',
  decorators: [(Story) => <RoboTooltipProvider><Story /></RoboTooltipProvider>],
  render: () => (
    <div style={pageStyle}>
      <OverviewAccordion>

        {/* -------------------------------------------------------------- */}
        {/* Buttons & Actions                                              */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="buttons" title="Buttons & Actions">
          <OverviewSection title="Button variants">
            <div style={rowStyle}>
              <RoboButton variant='default'>Primary</RoboButton>
              <RoboButton variant='secondary'>Secondary</RoboButton>
              <RoboButton variant='tertiary'>Tertiary</RoboButton>
              <RoboButton variant='ghost'>Ghost</RoboButton>
              <RoboButton variant='destructive'>Destructive</RoboButton>
              <RoboButton variant='outline'>Outline</RoboButton>
            </div>
          </OverviewSection>

          <OverviewSection title="Button sizes">
            <div style={rowStyle}>
              <RoboButton size='sm'>Small</RoboButton>
              <RoboButton size='md'>Medium</RoboButton>
              <RoboButton size='lg'>Large</RoboButton>
            </div>
          </OverviewSection>

          <OverviewSection title="Icon buttons">
            <div style={rowStyle}>
              <RoboIconButton aria-label='Settings sm' size='sm' variant='ghost'>
                <Settings style={{ width: 14, height: 14 }} aria-hidden='true' />
              </RoboIconButton>
              <RoboIconButton aria-label='Settings md' size='md' variant='default'>
                <Settings style={{ width: 16, height: 16 }} aria-hidden='true' />
              </RoboIconButton>
              <RoboIconButton aria-label='Settings lg' size='lg' variant='outline'>
                <Settings style={{ width: 20, height: 20 }} aria-hidden='true' />
              </RoboIconButton>
            </div>
          </OverviewSection>

          <OverviewSection title="Utility buttons">
            <div style={rowStyle}>
              <RoboCopyButton value='338234511' label='Copy NORAD ID' />
              <RoboCopyButton value='338234511' label='Copy NORAD ID' iconOnly />
              <RoboExportButton data={mockData} filename='satellites' />
              <RoboExportButton data={mockData} filename='satellites' format='xlsx' />
              <RoboPrintButton />
              <RoboPrintButton iconOnly label='Print' />
            </div>
          </OverviewSection>

          <OverviewSection title="Action buttons" description="Icon+label button with a built-in tooltip. Supports icon-only.">
            <div style={rowStyle}>
              <RoboActionButton icon={<Download className='h-3.5 w-3.5' aria-hidden='true' />} label='Download' onClick={() => {}} />
              <RoboActionButton icon={<Printer className='h-3.5 w-3.5' aria-hidden='true' />} label='Print' iconOnly onClick={() => {}} />
              <RoboActionButton icon={<Trash2 className='h-3.5 w-3.5' aria-hidden='true' />} label='Delete' variant='destructive' onClick={() => {}} />
            </div>
          </OverviewSection>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* Avatar                                                         */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="avatar" title="Avatar">
          <OverviewSection title="Sizes">
            <div style={rowStyle}>
              {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <RoboAvatar key={size} size={size} fallback='MT' alt='Matt Taylor' />
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Status indicators">
            <div style={rowStyle}>
              {(['online', 'away', 'busy', 'offline'] as const).map((status) => (
                <RoboAvatar key={status} size='md' fallback='MT' alt='Matt Taylor' status={status} />
              ))}
            </div>
          </OverviewSection>

          <OverviewSection title="Group with overflow">
            <RoboAvatarGroup max={3}>
              {['MT', 'JD', 'RK', 'AL', 'OB'].map((f) => (
                <RoboAvatar key={f} size='md' fallback={f} alt={f} />
              ))}
            </RoboAvatarGroup>
          </OverviewSection>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* Badge                                                          */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="badge" title="Badge">
          <OverviewSection title="Label usage × colors">
            <div style={rowStyle}>
              <RoboBadge usage='label' color='default'>Default</RoboBadge>
              <RoboBadge usage='label' color='primary'>Primary</RoboBadge>
              <RoboBadge usage='label' color='success'>Success</RoboBadge>
              <RoboBadge usage='label' color='warning'>Warning</RoboBadge>
              <RoboBadge usage='label' color='destructive'>Destructive</RoboBadge>
            </div>
          </OverviewSection>

          <OverviewSection title="Status usage">
            <div style={rowStyle}>
              <RoboBadge usage='status' color='success'>Online</RoboBadge>
              <RoboBadge usage='status' color='warning'>Away</RoboBadge>
              <RoboBadge usage='status' color='destructive'>Alert</RoboBadge>
              <RoboBadge usage='status' color='default'>Offline</RoboBadge>
            </div>
          </OverviewSection>

          <OverviewSection title="Count usage">
            <div style={rowStyle}>
              <RoboBadge usage='count' color='primary' count={5}>Alerts</RoboBadge>
              <RoboBadge usage='count' color='destructive' count={99}>Errors</RoboBadge>
              <RoboBadge usage='count' color='primary' count={100}>Notifs</RoboBadge>
            </div>
          </OverviewSection>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* Card                                                           */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="card" title="Card">
          <div style={rowStyle}>
            <RoboCard style={{ width: 220 }}>
              <RoboCardHeader>
                <p style={{ margin: 0, fontWeight: 600 }}>Default Card</p>
              </RoboCardHeader>
              <RoboCardBody>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  Card body content goes here.
                </p>
              </RoboCardBody>
              <RoboCardFooter>
                <RoboButton size='sm' variant='ghost'>Action</RoboButton>
              </RoboCardFooter>
            </RoboCard>

            <RoboCard variant='outlined' style={{ width: 220 }}>
              <RoboCardHeader>
                <p style={{ margin: 0, fontWeight: 600 }}>Outlined Card</p>
              </RoboCardHeader>
              <RoboCardBody>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  2px border, no shadow.
                </p>
              </RoboCardBody>
            </RoboCard>

            <RoboCard variant='elevated' hoverable style={{ width: 220 }}>
              <RoboCardHeader>
                <p style={{ margin: 0, fontWeight: 600 }}>Elevated + Hoverable</p>
              </RoboCardHeader>
              <RoboCardBody>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  Shadow on hover.
                </p>
              </RoboCardBody>
            </RoboCard>
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* Chip                                                           */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="chip" title="Chip">
          <OverviewSection title="Variants">
            <div style={rowStyle}>
              <RoboChip variant='default'>Default</RoboChip>
              <RoboChip variant='primary'>Primary</RoboChip>
              <RoboChip variant='success'>Success</RoboChip>
              <RoboChip variant='warning'>Warning</RoboChip>
              <RoboChip variant='destructive'>Destructive</RoboChip>
              <RoboChip variant='outline'>Outline</RoboChip>
            </div>
          </OverviewSection>

          <OverviewSection title="With icons">
            <div style={rowStyle}>
              <RoboChip variant='success' icon={<CheckCircle style={{ width: 12, height: 12 }} aria-hidden='true' />}>Active</RoboChip>
              <RoboChip variant='destructive' icon={<AlertTriangle style={{ width: 12, height: 12 }} aria-hidden='true' />}>Alert</RoboChip>
              <RoboChip variant='primary' icon={<Satellite style={{ width: 12, height: 12 }} aria-hidden='true' />}>In transit</RoboChip>
            </div>
          </OverviewSection>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* Input                                                          */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="input" title="Input">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
            <RoboInput label='Default' placeholder='e.g. Voyager 1' />
            <RoboInput label='Error state' state='error' helperText='NORAD ID must be 5 digits.' defaultValue='123' />
            <RoboInput label='Success state' state='success' helperText='Satellite found.' defaultValue='25544' />
            <RoboInput label='Warning state' state='warning' helperText='Not found — check and resubmit.' defaultValue='11111' />
            <div style={rowStyle}>
              <RoboInput placeholder='Small' inputSize='sm' style={{ maxWidth: 120 }} />
              <RoboInput placeholder='Medium' inputSize='md' style={{ maxWidth: 140 }} />
              <RoboInput placeholder='Large' inputSize='lg' style={{ maxWidth: 160 }} />
            </div>
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* Separator                                                      */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="separator" title="Separator">
          <div style={{ maxWidth: 360 }}>
            <p style={{ margin: '0 0 8px', fontSize: '0.875rem', color: 'var(--foreground)' }}>Section A</p>
            <RoboSeparator />
            <p style={{ margin: '8px 0', fontSize: '0.875rem', color: 'var(--foreground)' }}>Section B</p>
            <RoboSeparator label='Or continue with' />
            <p style={{ margin: '8px 0', fontSize: '0.875rem', color: 'var(--foreground)' }}>Section C</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 40 }}>
            <span style={{ fontSize: '0.875rem' }}>Left</span>
            <RoboSeparator orientation='vertical' />
            <span style={{ fontSize: '0.875rem' }}>Center</span>
            <RoboSeparator orientation='vertical' />
            <span style={{ fontSize: '0.875rem' }}>Right</span>
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* Accordion                                                      */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="accordion" title="Accordion">
          <div style={{ maxWidth: 520 }}>
            <RoboAccordion type='single' collapsible>
              <RoboAccordionItem value='identity'>
                <RoboAccordionTrigger>Satellite Identity</RoboAccordionTrigger>
                <RoboAccordionContent>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    COSPAR ID, NORAD ID, call sign, operator, and launch mass.
                  </p>
                </RoboAccordionContent>
              </RoboAccordionItem>
              <RoboAccordionItem value='mission'>
                <RoboAccordionTrigger>Current Mission</RoboAccordionTrigger>
                <RoboAccordionContent>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    Launch site, destination, arrival, and current velocity.
                  </p>
                </RoboAccordionContent>
              </RoboAccordionItem>
              <RoboAccordionItem value='reports'>
                <RoboAccordionTrigger>Filed Reports</RoboAccordionTrigger>
                <RoboAccordionContent>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    Telemetry, tracking, and orbit-determination logs.
                  </p>
                </RoboAccordionContent>
              </RoboAccordionItem>
            </RoboAccordion>
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* Description List                                               */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="description-list" title="Description List">
          <div style={{ maxWidth: 420 }}>
            <RoboDescriptionList
              items={{
                spacecraft_name: 'Voyager 1',
                operator: 'NASA',
                norad_id: 25544,
                signal_active: true,
                last_contact: 'Goldstone, CA',
                destination: null,
              }}
            />
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* Field List                                                    */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="field-list" title="Field List">
          <div style={{ maxWidth: 320 }}>
            <RoboFieldList
              fields={[
                { label: 'Spacecraft', value: 'VOYAGER 1' },
                { label: 'NORAD ID', value: '25544' },
                { label: 'Altitude', value: '420 km' },
                { label: 'Velocity', value: '7.66 km/s' },
                { label: 'Last Contact', value: '2026-07-04 14:02Z' },
              ]}
            />
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* Keyboard (Kbd)                                                 */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="kbd" title="Keyboard (Kbd)">
          <div style={{ ...rowStyle, gap: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <RoboKbd>⌘K</RoboKbd>
              <RoboKbd>↵</RoboKbd>
              <RoboKbd>esc</RoboKbd>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <RoboKbd size='md'>Ctrl</RoboKbd><span>+</span>
              <RoboKbd size='md'>Shift</RoboKbd><span>+</span>
              <RoboKbd size='md'>P</RoboKbd>
            </span>
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* Course Indicator                                              */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="course-indicator" title="Course Indicator">
          <div style={{ ...rowStyle, gap: 24 }}>
            {[0, 45, 135, 225, 315].map((course) => (
              <RoboCourseIndicator key={course} course={course} size='md' aria-label={`Course: ${course} degrees`} />
            ))}
          </div>
        </OverviewGroup>

        {/* -------------------------------------------------------------- */}
        {/* More core components (link out — stateful / provider-bound)     */}
        {/* -------------------------------------------------------------- */}
        <OverviewGroup value="more" title="More">
          <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 2 }}>
            <li><StoryLink id="components-forms-robokeybindrecorder--all-states">RoboKeybindRecorder</StoryLink> — record a keyboard shortcut</li>
            <li><StoryLink id="foundation-providers-roboproducttour--interactive">RoboProductTour</StoryLink> — guided first-run tour</li>
          </ul>
        </OverviewGroup>

      </OverviewAccordion>
    </div>
  ),
};
