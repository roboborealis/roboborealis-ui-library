import * as React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoboInput } from '@roboborealis/components/core';
import { RoboCheckbox, RoboRadioGroup, RoboSelect, RoboSlider, RoboSwitch, RoboTextarea } from '@roboborealis/components/forms';


// ---------------------------------------------------------------------------
// Options data
// ---------------------------------------------------------------------------

const regionOptions = [
  { value: 'galaxy', label: 'Galaxy' },
  { value: 'nebula', label: 'Nebula' },
  { value: 'open-cluster', label: 'Open Cluster' },
  { value: 'globular-cluster', label: 'Globular Cluster' },
  { value: 'double-star', label: 'Double Star' },
  { value: 'variable-star', label: 'Variable Star' },
];

const reportTypeOptions = [
  { value: 'ol', label: 'Observation Log (OL)', description: 'Visual or imaging session notes' },
  { value: 'ph', label: 'Photometry (PH)', description: 'Brightness measurement' },
  { value: 'sp', label: 'Spectroscopy (SP)', description: 'Spectral analysis' },
  { value: 'as', label: 'Astrometry (AS)', description: 'Position measurement' },
];

const notificationOptions = [
  { value: 'email', label: 'Email alerts' },
  { value: 'sms', label: 'SMS alerts' },
  { value: 'push', label: 'Push notifications' },
];

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  padding: 24,
  maxWidth: 860,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 24,
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--muted-foreground)',
  margin: '0 0 12px',
  paddingBottom: 4,
  borderBottom: '1px solid var(--border)',
};

const fieldGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const liveLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--muted-foreground)',
  margin: 0,
};

const liveValueStyle: React.CSSProperties = {
  color: 'var(--foreground)',
  fontWeight: 600,
};

const switchGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const checkboxGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

// ---------------------------------------------------------------------------
// Helper component
// ---------------------------------------------------------------------------

function LiveValue({ label, value }: { label: string; value: string }) {
  return (
    <p style={liveLabelStyle}>
      {label}: <span style={liveValueStyle}>{value}</span>
    </p>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function FormControlsDemo() {
  // Text input
  const [inputValue, setInputValue] = useState('');

  // Select
  const [selectedRegion, setSelectedRegion] = useState('');

  // Switches
  const [switches, setSwitches] = useState({ darkMode: false, autoRefresh: true, sounds: false });

  // Slider
  const [sliderValue, setSliderValue] = useState([14]);

  // Checkboxes
  const [checkedItems, setCheckedItems] = useState<string[]>(['email']);

  // Radio
  const [radioValue, setRadioValue] = useState('ph');

  // Textarea
  const [textareaValue, setTextareaValue] = useState('');

  function toggleSwitch(key: keyof typeof switches) {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleCheckbox(value: string) {
    setCheckedItems((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  const selectedRegionLabel = regionOptions.find((o) => o.value === selectedRegion)?.label ?? '—';
  const checkedLabels = checkedItems.length > 0 ? checkedItems.join(', ') : 'none';
  const selectedReportLabel = reportTypeOptions.find((o) => o.value === radioValue)?.label ?? '—';

  return (
    <div style={pageStyle}>
      <div style={gridStyle}>
        {/* RoboInput */}
        <div style={fieldGroupStyle}>
          <p style={sectionHeadingStyle}>RoboInput</p>
          <RoboInput
            label='Object designation'
            placeholder='e.g. M42'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            helperText={`${inputValue.length} characters`}
          />
          <LiveValue label='Value' value={inputValue || '—'} />
        </div>

        {/* RoboSelect */}
        <div style={fieldGroupStyle}>
          <p style={sectionHeadingStyle}>RoboSelect</p>
          <RoboSelect
            label='Object type'
            placeholder='Select type…'
            options={regionOptions}
            value={selectedRegion}
            onValueChange={setSelectedRegion}
          />
          <LiveValue label='Selected' value={selectedRegionLabel} />
        </div>

        {/* RoboSwitch group */}
        <div style={fieldGroupStyle}>
          <p style={sectionHeadingStyle}>RoboSwitch (3 controls)</p>
          <div style={switchGroupStyle}>
            <RoboSwitch
              label='Dark mode'
              description='Switch to dark theme'
              checked={switches.darkMode}
              onCheckedChange={() => toggleSwitch('darkMode')}
            />
            <RoboSwitch
              label='Auto-refresh'
              description='Update positions every 30 seconds'
              checked={switches.autoRefresh}
              onCheckedChange={() => toggleSwitch('autoRefresh')}
            />
            <RoboSwitch
              label='Sound alerts'
              description='Play a chime on new alerts'
              checked={switches.sounds}
              onCheckedChange={() => toggleSwitch('sounds')}
            />
          </div>
          <LiveValue
            label='On'
            value={
              Object.entries(switches)
                .filter(([, v]) => v)
                .map(([k]) => k)
                .join(', ') || 'none'
            }
          />
        </div>

        {/* RoboSlider */}
        <div style={fieldGroupStyle}>
          <p style={sectionHeadingStyle}>RoboSlider</p>
          <RoboSlider
            label='Limiting magnitude'
            min={6}
            max={22}
            step={0.5}
            value={sliderValue}
            onChange={setSliderValue}
            showValue
            formatValue={(v) => `mag ${v}`}
          />
          <LiveValue label='Value' value={`mag ${sliderValue[0]}`} />
        </div>

        {/* RoboCheckbox group */}
        <div style={fieldGroupStyle}>
          <p style={sectionHeadingStyle}>RoboCheckbox Group</p>
          <div style={checkboxGroupStyle}>
            {notificationOptions.map((opt) => (
              <RoboCheckbox
                key={opt.value}
                label={opt.label}
                checked={checkedItems.includes(opt.value)}
                onCheckedChange={() => toggleCheckbox(opt.value)}
              />
            ))}
          </div>
          <LiveValue label='Checked' value={checkedLabels} />
        </div>

        {/* RoboRadioGroup */}
        <div style={fieldGroupStyle}>
          <p style={sectionHeadingStyle}>RoboRadioGroup</p>
          <RoboRadioGroup
            label='Report type'
            options={reportTypeOptions}
            value={radioValue}
            onValueChange={setRadioValue}
          />
          <LiveValue label='Selected' value={selectedReportLabel} />
        </div>

        {/* RoboTextarea — spans both columns */}
        <div style={{ ...fieldGroupStyle, gridColumn: '1 / -1' }}>
          <p style={sectionHeadingStyle}>RoboTextarea</p>
          <RoboTextarea
            label='Observation notes'
            placeholder='Add any additional notes about this observation…'
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            showCount
            maxLength={300}
            rows={4}
            helperText='Max 300 characters.'
          />
          <LiveValue label='Length' value={`${textareaValue.length} / 300 chars`} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export const patternMeta = {
  demonstrates: 'A gallery of the core form control family together: text inputs, checkboxes, radios, selects, sliders, switches, and textareas.',
  whenToUse: 'Use as the reference to see every basic form control rendered together before composing a form, or to check visual and spacing consistency across control types.',
  keywords: ['form controls', 'input gallery', 'checkbox', 'radio group', 'select', 'slider', 'switch', 'textarea'],
  agentPriority: 'Prioritize this pattern for control-level reference only. For a full validated form page, use Observation Log (Form + Validation archetype) instead, and for a table-driven edit form, use Flows/Target List Editor.',
};

const meta: Meta = {
  title: 'Showcase/Patterns/Forms/Form Controls',
  excludeStories: ['patternMeta'],
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const FormControlsPlayground: Story = {
  name: 'Form Controls — Interactive Playground',
  render: () => <FormControlsDemo />,
};
