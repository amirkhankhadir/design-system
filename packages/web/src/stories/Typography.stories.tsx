import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded', controls: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ── Helpers ────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--ds-font-family-primary, sans-serif)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--ds-color-text-tertiary)',
      margin: '0 0 16px',
    }}>{children}</p>
  );
}

function Divider() {
  return <div style={{ borderTop: '1px solid var(--ds-color-border-subtle)', margin: '40px 0' }} />;
}

function StyleRow({
  className,
  label,
  meta,
}: {
  className: string;
  label: string;
  meta: string;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 24,
      padding: '10px 0',
      borderBottom: '1px solid var(--ds-color-border-subtle)',
    }}>
      <span style={{
        fontFamily: 'var(--ds-font-family-primary, sans-serif)',
        fontSize: 11,
        color: 'var(--ds-color-text-tertiary)',
        minWidth: 160,
        flexShrink: 0,
      }}>{label}</span>
      <span className={className} style={{ color: 'var(--ds-color-text-primary)', flex: 1 }}>
        The quick brown fox
      </span>
      <span style={{
        fontFamily: 'var(--ds-font-family-primary, sans-serif)',
        fontSize: 11,
        color: 'var(--ds-color-text-tertiary)',
        minWidth: 120,
        textAlign: 'right',
        flexShrink: 0,
      }}>{meta}</span>
    </div>
  );
}

// ── Stories ────────────────────────────────────────────────

export const All: Story = {
  name: 'All Styles',
  render: () => (
    <div style={{ maxWidth: 800 }}>

      <div style={{ marginBottom: 40 }}>
        <SectionTitle>Display</SectionTitle>
        <StyleRow className="ds-display-large-1"  label="display / large / 1"  meta="56px · 68 · 400" />
        <StyleRow className="ds-display-large-2"  label="display / large / 2"  meta="56px · 68 · 600" />
        <StyleRow className="ds-display-medium-1" label="display / medium / 1" meta="48px · 56 · 400" />
        <StyleRow className="ds-display-medium-2" label="display / medium / 2" meta="48px · 56 · 600" />
        <StyleRow className="ds-display-small-1"  label="display / small / 1"  meta="40px · 48 · 400" />
        <StyleRow className="ds-display-small-2"  label="display / small / 2"  meta="40px · 48 · 600" />
      </div>

      <Divider />

      <div style={{ marginBottom: 40 }}>
        <SectionTitle>Headline</SectionTitle>
        <StyleRow className="ds-headline-large-1"  label="headline / large / 1"  meta="32px · 36 · 400" />
        <StyleRow className="ds-headline-large-2"  label="headline / large / 2"  meta="32px · 36 · 600" />
        <StyleRow className="ds-headline-medium-1" label="headline / medium / 1" meta="24px · 28 · 400" />
        <StyleRow className="ds-headline-medium-2" label="headline / medium / 2" meta="24px · 28 · 500" />
        <StyleRow className="ds-headline-small-1"  label="headline / small / 1"  meta="20px · 24 · 400" />
        <StyleRow className="ds-headline-small-2"  label="headline / small / 2"  meta="20px · 24 · 500" />
        <StyleRow className="ds-headline-small-3"  label="headline / small / 3"  meta="20px · 24 · 600" />
      </div>

      <Divider />

      <div style={{ marginBottom: 40 }}>
        <SectionTitle>Text</SectionTitle>
        <StyleRow className="ds-text-xlarge-1" label="text / xlarge / 1" meta="18px · 22 · 400" />
        <StyleRow className="ds-text-xlarge-2" label="text / xlarge / 2" meta="18px · 22 · 600" />
        <StyleRow className="ds-text-xlarge-3" label="text / xlarge / 3" meta="18px · 22 · 700" />
        <StyleRow className="ds-text-large-1"  label="text / large / 1"  meta="16px · 20 · 400" />
        <StyleRow className="ds-text-large-2"  label="text / large / 2"  meta="16px · 20 · 600" />
        <StyleRow className="ds-text-large-3"  label="text / large / 3"  meta="16px · 20 · 700" />
        <StyleRow className="ds-text-medium-1" label="text / medium / 1" meta="14px · 20 · 400" />
        <StyleRow className="ds-text-medium-2" label="text / medium / 2" meta="14px · 20 · 600" />
        <StyleRow className="ds-text-medium-3" label="text / medium / 3" meta="14px · 20 · 700" />
        <StyleRow className="ds-text-small-1"  label="text / small / 1"  meta="12px · 16 · 400" />
        <StyleRow className="ds-text-small-2"  label="text / small / 2"  meta="12px · 16 · 600" />
        <StyleRow className="ds-text-small-3"  label="text / small / 3"  meta="12px · 16 · 700" />
        <StyleRow className="ds-text-xsmall-1" label="text / xsmall / 1" meta="10px · 14 · 400" />
        <StyleRow className="ds-text-xsmall-2" label="text / xsmall / 2" meta="10px · 14 · 600" />
        <StyleRow className="ds-text-xsmall-3" label="text / xsmall / 3" meta="10px · 14 · 700" />
      </div>

    </div>
  ),
};

export const Elevation: Story = {
  name: 'Elevation',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)' }}>
      <SectionTitle>Elevation</SectionTitle>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: 32 }}>
        {[0, 1, 2, 3].map(level => (
          <div key={level} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div
              className={`ds-elevation-${level}`}
              style={{
                width: 100,
                height: 100,
                borderRadius: 12,
                background: 'var(--ds-color-background-default)',
                border: level === 0 ? '1px solid var(--ds-color-border-default)' : undefined,
              }}
            />
            <span style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)' }}>
              elevation-{level}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
