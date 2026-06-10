import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded', controls: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ── Shared layout primitives ───────────────────────────────

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="ds-headline-large-2" style={{
      color: 'var(--ds-color-text-primary)',
      margin: '0 0 8px',
    }}>{children}</h1>
  );
}

function PageSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="ds-text-large-1" style={{
      color: 'var(--ds-color-text-secondary)',
      margin: '0 0 48px',
    }}>{children}</p>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="ds-text-small-2" style={{
      color: 'var(--ds-color-text-tertiary)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      margin: '0 0 12px',
    }}>{children}</p>
  );
}

function Swatch({
  name,
  variable,
  showBorder,
}: {
  name: string;
  variable: string;
  showBorder?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 96 }}>
      <div style={{
        height: 56,
        borderRadius: 'var(--ds-radius-8)',
        background: `var(${variable})`,
        border: showBorder ? '1px solid var(--ds-color-border-default)' : undefined,
        flexShrink: 0,
      }} />
      <div>
        <p className="ds-text-small-2" style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 2px' }}>{name}</p>
        <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}>{variable}</p>
      </div>
    </div>
  );
}

function SwatchRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>{children}</div>;
}

function Divider() {
  return <div style={{ borderTop: '1px solid var(--ds-color-border-subtle)', margin: '8px 0 40px' }} />;
}

// ── Story ──────────────────────────────────────────────────

export const All: Story = {
  name: 'All Colors',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 960 }}>
      <PageTitle>Colors</PageTitle>
      <PageSubtitle>Semantic color tokens — use these in all components. Never reference primitives directly.</PageSubtitle>

      <SectionLabel>Background</SectionLabel>
      <SwatchRow>
        <Swatch name="default" variable="--ds-color-background-default" showBorder />
        <Swatch name="subtle"  variable="--ds-color-background-subtle"  showBorder />
        <Swatch name="muted"   variable="--ds-color-background-muted"   showBorder />
      </SwatchRow>

      <SectionLabel>Surface</SectionLabel>
      <SwatchRow>
        <Swatch name="surface-1" variable="--ds-color-surface-1" showBorder />
        <Swatch name="surface-2" variable="--ds-color-surface-2" showBorder />
        <Swatch name="surface-3" variable="--ds-color-surface-3" showBorder />
        <Swatch name="surface-4" variable="--ds-color-surface-4" showBorder />
      </SwatchRow>

      <SectionLabel>Text</SectionLabel>
      <SwatchRow>
        <Swatch name="primary"   variable="--ds-color-text-primary" />
        <Swatch name="secondary" variable="--ds-color-text-secondary" />
        <Swatch name="tertiary"  variable="--ds-color-text-tertiary" />
        <Swatch name="disabled"  variable="--ds-color-text-disabled" />
        <Swatch name="inverse"   variable="--ds-color-text-inverse"  showBorder />
        <Swatch name="on-brand"  variable="--ds-color-text-on-brand" showBorder />
      </SwatchRow>

      <SectionLabel>Icon</SectionLabel>
      <SwatchRow>
        <Swatch name="default"   variable="--ds-color-icon-default" />
        <Swatch name="secondary" variable="--ds-color-icon-secondary" />
        <Swatch name="disabled"  variable="--ds-color-icon-disabled" />
        <Swatch name="inverse"   variable="--ds-color-icon-inverse"  showBorder />
        <Swatch name="on-brand"  variable="--ds-color-icon-on-brand" showBorder />
      </SwatchRow>

      <SectionLabel>Border</SectionLabel>
      <SwatchRow>
        <Swatch name="subtle"  variable="--ds-color-border-subtle"  showBorder />
        <Swatch name="default" variable="--ds-color-border-default" showBorder />
        <Swatch name="strong"  variable="--ds-color-border-strong" />
        <Swatch name="focus"   variable="--ds-color-border-focus" />
      </SwatchRow>

      <SectionLabel>Brand</SectionLabel>
      <SwatchRow>
        <Swatch name="default" variable="--ds-color-brand-default" />
        <Swatch name="subtle"  variable="--ds-color-brand-subtle"  showBorder />
        <Swatch name="text"    variable="--ds-color-brand-text" />
      </SwatchRow>

      <Divider />

      <SectionLabel>Status</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr', gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
          <div />
          {(['default', 'subtle', 'text', 'border'] as const).map(v => (
            <p key={v} className="ds-text-xsmall-2" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{v}</p>
          ))}
        </div>
        {/* Rows */}
        {(['success', 'warning', 'error', 'info'] as const).map(status => (
          <div key={status} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
            <p className="ds-text-small-2" style={{ color: 'var(--ds-color-text-primary)', margin: 0, textTransform: 'capitalize' }}>{status}</p>
            {(['default', 'subtle', 'text', 'border'] as const).map(variant => (
              <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{
                  height: 40,
                  borderRadius: 'var(--ds-radius-6)',
                  background: `var(--ds-color-status-${status}-${variant})`,
                  border: variant === 'subtle' || variant === 'text' ? '1px solid var(--ds-color-border-default)' : undefined,
                }} />
                <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}>--ds-color-status-{status}-{variant}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Divider />

      <SectionLabel>Extended Palette</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
          <div />
          {(['default', 'subtle', 'text'] as const).map(v => (
            <p key={v} className="ds-text-xsmall-2" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{v}</p>
          ))}
        </div>
        {/* Color rows */}
        {['lime','mint','cyan','blue','indigo','purple','pink','rose','yellow'].map(color => (
          <div key={color} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
            <p className="ds-text-small-2" style={{ color: 'var(--ds-color-text-primary)', margin: 0, textTransform: 'capitalize' }}>{color}</p>
            {(['default', 'subtle', 'text'] as const).map(variant => (
              <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{
                  height: 40,
                  borderRadius: 'var(--ds-radius-6)',
                  background: `var(--ds-color-extended-${color}-${variant})`,
                  border: variant === 'subtle' ? '1px solid var(--ds-color-border-default)' : undefined,
                }} />
                <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}>--ds-color-extended-{color}-{variant}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Divider />

      <SectionLabel>Shadow</SectionLabel>
      <SwatchRow>
        <Swatch name="sm" variable="--ds-color-shadow-sm" showBorder />
        <Swatch name="md" variable="--ds-color-shadow-md" showBorder />
        <Swatch name="lg" variable="--ds-color-shadow-lg" showBorder />
      </SwatchRow>

    </div>
  ),
};
