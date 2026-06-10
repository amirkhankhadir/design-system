import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Dimensions',
  parameters: { layout: 'padded', controls: { disable: true } },
};
export default meta;
type Story = StoryObj;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--ds-font-family-primary, sans-serif)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--ds-color-text-tertiary)',
      margin: '0 0 12px',
    }}>{children}</p>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: 'var(--ds-font-family-primary, sans-serif)',
      fontSize: 11,
      color: 'var(--ds-color-text-tertiary)',
      minWidth: 80,
    }}>{children}</span>
  );
}

export const All: Story = {
  name: 'All Dimensions',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 600 }}>

      {/* Spacing */}
      <div style={{ marginBottom: 48 }}>
        <SectionTitle>Spacing</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[0,2,4,6,8,12,16,20,24,32,40,48,64].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Label>spacing-{n}</Label>
              <div style={{
                height: 8,
                width: `var(--ds-spacing-${n})`,
                minWidth: n === 0 ? 2 : undefined,
                background: 'var(--ds-color-brand-default)',
                borderRadius: 2,
              }} />
              <span style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)' }}>{n}px</span>
            </div>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div style={{ marginBottom: 48 }}>
        <SectionTitle>Radius</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {[
            { name: 'radius-0',    val: '0px',     var: '--ds-radius-0' },
            { name: 'radius-4',    val: '4px',     var: '--ds-radius-4' },
            { name: 'radius-6',    val: '6px',     var: '--ds-radius-6' },
            { name: 'radius-8',    val: '8px',     var: '--ds-radius-8' },
            { name: 'radius-10',   val: '10px',    var: '--ds-radius-10' },
            { name: 'radius-12',   val: '12px',    var: '--ds-radius-12' },
            { name: 'radius-16',   val: '16px',    var: '--ds-radius-16' },
            { name: 'radius-24',   val: '24px',    var: '--ds-radius-24' },
            { name: 'radius-40',   val: '40px',    var: '--ds-radius-40' },
            { name: 'radius-full', val: '9999px',  var: '--ds-radius-full' },
          ].map(r => (
            <div key={r.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 56,
                height: 56,
                background: 'var(--ds-color-brand-subtle)',
                border: '1.5px solid var(--ds-color-brand-default)',
                borderRadius: `var(${r.var})`,
              }} />
              <span style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)', textAlign: 'center' }}>{r.name.replace('radius-','')}</span>
              <span style={{ fontSize: 10, color: 'var(--ds-color-text-tertiary)' }}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Border width */}
      <div style={{ marginBottom: 48 }}>
        <SectionTitle>Border Width</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,4].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Label>border-width-{n}</Label>
              <div style={{
                width: 120,
                height: 0,
                borderTop: `var(--ds-border-width-${n}) solid var(--ds-color-text-primary)`,
              }} />
              <span style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)' }}>{n}px</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sizing */}
      <div style={{ marginBottom: 48 }}>
        <SectionTitle>Sizing (touch targets / buttons)</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          {[
            { name: 'xs', val: '24px', var: '--ds-sizing-xs' },
            { name: 'sm', val: '32px', var: '--ds-sizing-sm' },
            { name: 'md', val: '40px', var: '--ds-sizing-md' },
            { name: 'lg', val: '48px', var: '--ds-sizing-lg' },
            { name: 'xl', val: '56px', var: '--ds-sizing-xl' },
          ].map(s => (
            <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: `var(${s.var})`,
                height: `var(${s.var})`,
                background: 'var(--ds-color-brand-subtle)',
                border: '1.5px solid var(--ds-color-brand-default)',
                borderRadius: 'var(--ds-radius-8)',
              }} />
              <span style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)' }}>{s.name}</span>
              <span style={{ fontSize: 10, color: 'var(--ds-color-text-tertiary)' }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  ),
};
