import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded', controls: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ── Helpers ────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{
        fontFamily: 'var(--ds-font-family-primary, sans-serif)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--ds-color-text-tertiary)',
        margin: '0 0 12px',
      }}>{title}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
    </div>
  );
}

function Swatch({ name, variable, border }: { name: string; variable: string; border?: boolean }) {
  return (
    <div style={{ width: 80 }}>
      <div style={{
        width: 80,
        height: 48,
        borderRadius: 8,
        background: `var(${variable})`,
        border: border ? '1px solid var(--ds-color-border-default)' : undefined,
        marginBottom: 6,
      }} />
      <p style={{
        fontFamily: 'var(--ds-font-family-primary, sans-serif)',
        fontSize: 11,
        color: 'var(--ds-color-text-secondary)',
        margin: 0,
        lineHeight: 1.4,
        wordBreak: 'break-all',
      }}>{name}</p>
    </div>
  );
}

function StatusGroup({ name, vars }: { name: string; vars: string[] }) {
  const labels = ['default', 'subtle', 'text', 'border'];
  return (
    <div style={{ marginRight: 24, marginBottom: 16 }}>
      <p style={{
        fontFamily: 'var(--ds-font-family-primary, sans-serif)',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--ds-color-text-primary)',
        margin: '0 0 8px',
      }}>{name}</p>
      <div style={{ display: 'flex', gap: 4 }}>
        {vars.map((v, i) => (
          <div key={v} style={{ width: 56 }}>
            <div style={{
              width: 56,
              height: 40,
              borderRadius: 6,
              background: `var(${v})`,
              border: labels[i] === 'subtle' || labels[i] === 'text'
                ? '1px solid var(--ds-color-border-default)' : undefined,
              marginBottom: 4,
            }} />
            <p style={{
              fontFamily: 'var(--ds-font-family-primary, sans-serif)',
              fontSize: 10,
              color: 'var(--ds-color-text-tertiary)',
              margin: 0,
            }}>{labels[i]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stories ────────────────────────────────────────────────

export const All: Story = {
  name: 'All Colors',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)' }}>

      <Section title="Background">
        <Swatch name="default"  variable="--ds-color-background-default" border />
        <Swatch name="subtle"   variable="--ds-color-background-subtle" border />
        <Swatch name="muted"    variable="--ds-color-background-muted" border />
      </Section>

      <Section title="Surface">
        <Swatch name="surface-1" variable="--ds-color-surface-1" border />
        <Swatch name="surface-2" variable="--ds-color-surface-2" border />
        <Swatch name="surface-3" variable="--ds-color-surface-3" border />
        <Swatch name="surface-4" variable="--ds-color-surface-4" border />
      </Section>

      <Section title="Text">
        <Swatch name="primary"   variable="--ds-color-text-primary" />
        <Swatch name="secondary" variable="--ds-color-text-secondary" />
        <Swatch name="tertiary"  variable="--ds-color-text-tertiary" />
        <Swatch name="disabled"  variable="--ds-color-text-disabled" />
        <Swatch name="inverse"   variable="--ds-color-text-inverse" border />
        <Swatch name="on-brand"  variable="--ds-color-text-on-brand" border />
      </Section>

      <Section title="Icon">
        <Swatch name="default"   variable="--ds-color-icon-default" />
        <Swatch name="secondary" variable="--ds-color-icon-secondary" />
        <Swatch name="disabled"  variable="--ds-color-icon-disabled" />
        <Swatch name="inverse"   variable="--ds-color-icon-inverse" border />
        <Swatch name="on-brand"  variable="--ds-color-icon-on-brand" border />
      </Section>

      <Section title="Border">
        <Swatch name="subtle"  variable="--ds-color-border-subtle" border />
        <Swatch name="default" variable="--ds-color-border-default" border />
        <Swatch name="strong"  variable="--ds-color-border-strong" border />
        <Swatch name="focus"   variable="--ds-color-border-focus" />
      </Section>

      <Section title="Brand">
        <Swatch name="default" variable="--ds-color-brand-default" />
        <Swatch name="subtle"  variable="--ds-color-brand-subtle" border />
        <Swatch name="text"    variable="--ds-color-brand-text" />
      </Section>

      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--ds-color-text-tertiary)',
          margin: '0 0 12px',
        }}>Status</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <StatusGroup name="Success" vars={['--ds-color-status-success-default','--ds-color-status-success-subtle','--ds-color-status-success-text','--ds-color-status-success-border']} />
          <StatusGroup name="Warning" vars={['--ds-color-status-warning-default','--ds-color-status-warning-subtle','--ds-color-status-warning-text','--ds-color-status-warning-border']} />
          <StatusGroup name="Error"   vars={['--ds-color-status-error-default','--ds-color-status-error-subtle','--ds-color-status-error-text','--ds-color-status-error-border']} />
          <StatusGroup name="Info"    vars={['--ds-color-status-info-default','--ds-color-status-info-subtle','--ds-color-status-info-text','--ds-color-status-info-border']} />
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--ds-color-text-tertiary)',
          margin: '0 0 12px',
        }}>Extended Palette</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['lime','mint','cyan','blue','indigo','purple','pink','rose','yellow'].map(color => (
            <div key={color} style={{ width: 64 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ width: 64, height: 32, borderRadius: 6, background: `var(--ds-color-extended-${color}-default)` }} />
                <div style={{ width: 64, height: 32, borderRadius: 6, background: `var(--ds-color-extended-${color}-subtle)`, border: '1px solid var(--ds-color-border-default)' }} />
                <div style={{ width: 64, height: 32, borderRadius: 6, background: `var(--ds-color-extended-${color}-text)` }} />
              </div>
              <p style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)', margin: '6px 0 0', textAlign: 'center' }}>{color}</p>
            </div>
          ))}
        </div>
      </div>

      <Section title="Shadow">
        <Swatch name="sm" variable="--ds-color-shadow-sm" border />
        <Swatch name="md" variable="--ds-color-shadow-md" border />
        <Swatch name="lg" variable="--ds-color-shadow-lg" border />
      </Section>

    </div>
  ),
};
