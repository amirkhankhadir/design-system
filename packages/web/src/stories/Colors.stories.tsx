import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded', controls: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ── Shared components ──────────────────────────────────────

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="ds-headline-large-2" style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 8px' }}>
      {children}
    </h1>
  );
}

function PageSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="ds-text-large-1" style={{ color: 'var(--ds-color-text-secondary)', margin: '0 0 48px' }}>
      {children}
    </p>
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

function Divider() {
  return <div style={{ borderTop: '1px solid var(--ds-color-border-subtle)', margin: '8px 0 40px' }} />;
}

// ── Universal color table ──────────────────────────────────
// rows = color names, columns = variants

function ColorTable({
  group,
  rows,
  variants,
  getVariable,
  showBorderFor,
}: {
  group: string;
  rows: string[];
  variants: string[];
  getVariable: (row: string, variant: string) => string;
  showBorderFor?: (row: string, variant: string) => boolean;
}) {
  const cols = `140px ${variants.map(() => '1fr').join(' ')}`;
  return (
    <div style={{ marginBottom: 40 }}>
      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 8, paddingBottom: 8, borderBottom: '1px solid var(--ds-color-border-subtle)', marginBottom: 4 }}>
        <div />
        {variants.map(v => (
          <p key={v} className="ds-text-xsmall-2" style={{
            color: 'var(--ds-color-text-tertiary)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>{v}</p>
        ))}
      </div>
      {/* Rows */}
      {rows.map(row => (
        <div key={row} style={{
          display: 'grid',
          gridTemplateColumns: cols,
          gap: 8,
          alignItems: 'center',
          padding: '8px 0',
          borderBottom: '1px solid var(--ds-color-border-subtle)',
        }}>
          <p className="ds-text-small-1" style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}>{row}</p>
          {variants.map(variant => {
            const variable = getVariable(row, variant);
            const hasBorder = showBorderFor ? showBorderFor(row, variant) : false;
            return (
              <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{
                  height: 44,
                  borderRadius: 'var(--ds-radius-6)',
                  background: `var(${variable})`,
                  border: hasBorder ? '1px solid var(--ds-color-border-default)' : undefined,
                }} />
                <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0, wordBreak: 'break-all' }}>
                  {variable}
                </p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Story ──────────────────────────────────────────────────

export const All: Story = {
  name: 'All Colors',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 900 }}>
      <PageTitle>Colors</PageTitle>
      <PageSubtitle>Semantic color tokens — use these in all components. Never reference primitives directly.</PageSubtitle>

      {/* Background */}
      <SectionLabel>Background</SectionLabel>
      <ColorTable
        group="background"
        rows={['default', 'subtle', 'muted']}
        variants={['value']}
        getVariable={(row) => `--ds-color-background-${row}`}
        showBorderFor={() => true}
      />

      {/* Surface — shown as overlay on brand bg */}
      <SectionLabel>Surface</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: '0 0 12px' }}>
          Transparency overlays — shown on a neutral background to demonstrate effect
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {['1','2','3','4'].map(n => (
            <div key={n} style={{ flex: 1 }}>
              <div style={{
                height: 44,
                borderRadius: 'var(--ds-radius-6)',
                background: `var(--ds-color-surface-${n})`,
                border: '1px solid var(--ds-color-border-default)',
                marginBottom: 6,
              }} />
              <p className="ds-text-small-1" style={{ color: 'var(--ds-color-text-secondary)', margin: '0 0 2px' }}>surface-{n}</p>
              <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}>--ds-color-surface-{n}</p>
            </div>
          ))}
        </div>
        {/* Same swatches on dark bg */}
        <div style={{ display: 'flex', gap: 12, marginTop: 8, padding: 12, background: '#2a2a2a', borderRadius: 'var(--ds-radius-8)' }}>
          {['1','2','3','4'].map(n => (
            <div key={n} style={{ flex: 1 }}>
              <div style={{
                height: 44,
                borderRadius: 'var(--ds-radius-6)',
                background: `var(--ds-color-surface-${n})`,
                marginBottom: 6,
              }} />
              <p className="ds-text-xsmall-1" style={{ color: '#888', margin: 0, textAlign: 'center' }}>on dark</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Text */}
      <SectionLabel>Text</SectionLabel>
      <ColorTable
        group="text"
        rows={['primary','secondary','tertiary','disabled','inverse','on-brand']}
        variants={['value']}
        getVariable={(row) => `--ds-color-text-${row}`}
        showBorderFor={(row) => row === 'inverse' || row === 'on-brand'}
      />

      {/* Icon */}
      <SectionLabel>Icon</SectionLabel>
      <ColorTable
        group="icon"
        rows={['default','secondary','disabled','inverse','on-brand']}
        variants={['value']}
        getVariable={(row) => `--ds-color-icon-${row}`}
        showBorderFor={(row) => row === 'inverse' || row === 'on-brand'}
      />

      {/* Border */}
      <SectionLabel>Border</SectionLabel>
      <ColorTable
        group="border"
        rows={['subtle','default','strong','focus']}
        variants={['value']}
        getVariable={(row) => `--ds-color-border-${row}`}
        showBorderFor={(_, v) => v === 'value'}
      />

      {/* Brand */}
      <SectionLabel>Brand</SectionLabel>
      <ColorTable
        group="brand"
        rows={['default','subtle','text']}
        variants={['value']}
        getVariable={(row) => `--ds-color-brand-${row}`}
        showBorderFor={(row) => row === 'subtle'}
      />

      <Divider />

      {/* Status */}
      <SectionLabel>Status</SectionLabel>
      <ColorTable
        group="status"
        rows={['success','warning','error','info']}
        variants={['default','subtle','text','border']}
        getVariable={(row, variant) => `--ds-color-status-${row}-${variant}`}
        showBorderFor={(_, variant) => variant === 'subtle' || variant === 'text'}
      />

      <Divider />

      {/* Extended palette */}
      <SectionLabel>Extended Palette</SectionLabel>
      <ColorTable
        group="extended"
        rows={['lime','mint','cyan','blue','indigo','purple','pink','rose','yellow']}
        variants={['default','subtle','text']}
        getVariable={(row, variant) => `--ds-color-extended-${row}-${variant}`}
        showBorderFor={(_, variant) => variant === 'subtle'}
      />

      <Divider />

      {/* Shadow — shown as actual shadows */}
      <SectionLabel>Shadow</SectionLabel>
      <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: '0 0 16px' }}>
        Used as box-shadow values — shown as actual elevation effect
      </p>
      <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
        {(['sm','md','lg'] as const).map(size => {
          const shadows = {
            sm: '0 1px 3px var(--ds-color-shadow-sm), 0 1px 2px var(--ds-color-shadow-sm)',
            md: '0 4px 8px var(--ds-color-shadow-md), 0 2px 4px var(--ds-color-shadow-sm)',
            lg: '0 16px 40px var(--ds-color-shadow-lg), 0 4px 8px var(--ds-color-shadow-md)',
          };
          return (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                width: 120,
                height: 80,
                borderRadius: 'var(--ds-radius-12)',
                background: 'var(--ds-color-background-default)',
                boxShadow: shadows[size],
              }} />
              <div>
                <p className="ds-text-small-2" style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 2px' }}>shadow-{size}</p>
                <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}>--ds-color-shadow-{size}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  ),
};
