import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundation/Design Tokens',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Live CSS variable browser. Values shown are resolved from the active theme and mode — use the toolbar to switch between midnight/aurora and dark/light.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

// ─── Semantic color token definitions ────────────────────────────────────────

const COLOR_TOKENS = [
  { name: '--background',       label: 'Background',        group: 'Surface' },
  { name: '--foreground',       label: 'Foreground',        group: 'Surface' },
  { name: '--card',             label: 'Card',              group: 'Surface' },
  { name: '--card-foreground',  label: 'Card Foreground',   group: 'Surface' },
  { name: '--muted',            label: 'Muted',             group: 'Surface' },
  { name: '--muted-foreground', label: 'Muted Foreground',  group: 'Surface' },
  { name: '--border',           label: 'Border',            group: 'Surface' },
  { name: '--input',            label: 'Input',             group: 'Surface' },
  { name: '--primary',          label: 'Primary',           group: 'Brand' },
  { name: '--primary-foreground', label: 'Primary FG',      group: 'Brand' },
  { name: '--secondary',        label: 'Secondary',         group: 'Brand' },
  { name: '--secondary-foreground', label: 'Secondary FG',  group: 'Brand' },
  { name: '--accent',           label: 'Accent',            group: 'Brand' },
  { name: '--accent-foreground', label: 'Accent FG',        group: 'Brand' },
  { name: '--destructive',      label: 'Destructive',       group: 'Semantic' },
  { name: '--destructive-foreground', label: 'Destructive FG', group: 'Semantic' },
  { name: '--warning',          label: 'Warning',           group: 'Semantic' },
  { name: '--success',          label: 'Success',           group: 'Semantic' },
  { name: '--ring',             label: 'Focus Ring',        group: 'Interaction' },
  { name: '--popover',          label: 'Popover',           group: 'Overlay' },
  { name: '--popover-foreground', label: 'Popover FG',      group: 'Overlay' },
];

const FONT_TOKENS = [
  { name: '--font-sans',    label: 'Sans',    role: 'Body text' },
  { name: '--font-heading', label: 'Heading', role: 'H1–H4 headings' },
  { name: '--font-display', label: 'Display', role: 'CTAs, standout labels' },
  { name: '--font-mono',    label: 'Mono',    role: 'Code, coordinates' },
];

const TYPE_SCALE = [
  { token: 'text-xs',   size: '12px', use: 'Labels, captions' },
  { token: 'text-sm',   size: '14px', use: 'Secondary, helper text' },
  { token: 'text-base', size: '16px', use: 'Body (default)' },
  { token: 'text-lg',   size: '18px', use: 'Emphasized body' },
  { token: 'text-xl',   size: '20px', use: 'Small headings' },
  { token: 'text-2xl',  size: '24px', use: 'H4' },
  { token: 'text-3xl',  size: '30px', use: 'H3' },
  { token: 'text-4xl',  size: '36px', use: 'H2' },
];

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64];

// ─── Sub-components (defined at module level — no inline components) ─────────

interface ColorSwatchProps {
  tokenName: string;
  label: string;
}

function ColorSwatch({ tokenName, label }: ColorSwatchProps) {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(tokenName)
      .trim();
    setValue(resolved);
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: `var(${tokenName})`,
          border: '1px solid var(--border, rgba(0,0,0,0.1))',
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>{tokenName}</div>
        <div style={{ fontSize: 11, opacity: 0.55 }}>{label} {value ? `· ${value}` : ''}</div>
      </div>
    </div>
  );
}

interface TokenGroupProps {
  groupName: string;
  tokens: typeof COLOR_TOKENS;
}

function TokenGroup({ groupName, tokens }: TokenGroupProps) {
  const groupTokens = tokens.filter((t) => t.group === groupName);
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '0 0 10px' }}>
        {groupName}
      </h4>
      {groupTokens.map((t) => (
        <ColorSwatch key={t.name} tokenName={t.name} label={t.label} />
      ))}
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Overview: Story = {
  name: 'Overview',
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700 }}>Design Tokens</h2>
      <p style={{ margin: '0 0 28px', fontSize: 13, opacity: 0.6 }}>
        The design language is built from three token categories. Values resolve live from the
        active theme/mode — switch them in the toolbar. See the dedicated stories for each category.
      </p>

      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '0 0 12px' }}>
          Color ({COLOR_TOKENS.length} tokens)
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {COLOR_TOKENS.map((t) => (
            <div
              key={t.name}
              title={t.name}
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background: `var(${t.name})`,
                border: '1px solid var(--border, rgba(0,0,0,0.1))',
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '0 0 12px' }}>
          Typography ({FONT_TOKENS.length} families · {TYPE_SCALE.length} sizes)
        </h3>
        {FONT_TOKENS.map(({ name, label }) => (
          <div key={name} style={{ fontFamily: `var(${name})`, fontSize: 18, marginBottom: 6 }}>
            {label} — The quick brown fox
          </div>
        ))}
      </div>

      <div>
        <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '0 0 12px' }}>
          Spacing ({SPACING.length} steps · 4px base)
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {SPACING.map((px) => (
            <div
              key={px}
              title={`${px}px`}
              style={{ width: 16, height: px, background: 'var(--primary, #3b82f6)', borderRadius: 3, opacity: 0.8 }}
            />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const ColorTokens: Story = {
  name: 'Color Tokens — Live',
  render: () => {
    const groups = ['Surface', 'Brand', 'Semantic', 'Interaction', 'Overlay'];
    return (
      <div style={{ maxWidth: 700 }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700 }}>Color Tokens</h2>
        <p style={{ margin: '0 0 24px', fontSize: 13, opacity: 0.6 }}>
          Values are resolved live from the active theme. Switch theme/mode in the toolbar to see them update.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {groups.map((g) => (
            <TokenGroup key={g} groupName={g} tokens={COLOR_TOKENS} />
          ))}
        </div>
      </div>
    );
  },
};

export const TypographyTokens: Story = {
  name: 'Typography Tokens',
  render: () => (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700 }}>Typography</h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, opacity: 0.6 }}>Font family tokens and the type scale.</p>

      <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '0 0 16px' }}>
        Font Families
      </h3>
      <div style={{ marginBottom: 32 }}>
        {FONT_TOKENS.map(({ name, label, role }) => (
          <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border, #e5e7eb)' }}>
            <div style={{ minWidth: 120 }}>
              <code style={{ fontSize: 11, opacity: 0.7 }}>{name}</code>
              <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>{role}</div>
            </div>
            <span style={{ fontFamily: `var(${name})`, fontSize: 20 }}>
              {label} — The quick brown fox jumps
            </span>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '0 0 16px' }}>
        Type Scale
      </h3>
      <div>
        {TYPE_SCALE.map(({ token, size, use }) => (
          <div key={token} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10 }}>
            <div style={{ minWidth: 80 }}>
              <code style={{ fontSize: 11, opacity: 0.7 }}>{token}</code>
              <div style={{ fontSize: 11, opacity: 0.45 }}>{size}</div>
            </div>
            <span style={{ fontSize: size, lineHeight: 1.2 }}>Satellite Report — {use}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const SpacingTokens: Story = {
  name: 'Spacing Scale',
  render: () => (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700 }}>Spacing Scale</h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, opacity: 0.6 }}>
        4px base unit. Use Tailwind classes (p-1 = 4px, p-2 = 8px, etc.). Never go below 4px.
      </p>
      {SPACING.map((px) => (
        <div key={px} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
          <div style={{ minWidth: 60, fontSize: 12, opacity: 0.6, fontFamily: 'monospace' }}>{px}px</div>
          <div style={{ height: 20, background: 'var(--primary, #3b82f6)', borderRadius: 3, width: px * 2, minWidth: 4, opacity: 0.8 }} />
          <div style={{ fontSize: 12, opacity: 0.5 }}>p-{px / 4}</div>
        </div>
      ))}
    </div>
  ),
};
