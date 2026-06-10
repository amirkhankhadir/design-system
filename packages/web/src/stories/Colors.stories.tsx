import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded', controls: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ── Shared components ──────────────────────────────────────

function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="ds-headline-large-2" style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 8px' }}>{children}</h1>;
}

function PageSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="ds-text-large-1" style={{ color: 'var(--ds-color-text-secondary)', margin: '0 0 48px' }}>{children}</p>;
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

// ── Color table: token | light | dark ──────────────────────

function ColorTable({
  rows,
  variants,
  getVariable,
  showBorderFor,
}: {
  rows: string[];
  variants: string[];
  getVariable: (row: string, variant: string) => string;
  showBorderFor?: (row: string, variant: string) => boolean;
}) {
  // Single variant = no variant column header, just token name
  const multiVariant = variants.length > 1 && variants[0] !== 'value';

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: multiVariant ? '200px 1fr 120px 120px' : '200px 120px 120px',
        gap: 12,
        paddingBottom: 8,
        borderBottom: '1px solid var(--ds-color-border-subtle)',
        marginBottom: 0,
      }}>
        <p className="ds-text-xsmall-2" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Token</p>
        {multiVariant && <div />}
        <p className="ds-text-xsmall-2" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Light</p>
        <p className="ds-text-xsmall-2" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dark</p>
      </div>

      {/* Rows */}
      {rows.map(row =>
        variants.map(variant => {
          const variable = getVariable(row, variant);
          const hasBorder = showBorderFor ? showBorderFor(row, variant) : false;
          const label = multiVariant ? variant : row;
          const subLabel = multiVariant ? row : undefined;

          return (
            <div key={`${row}-${variant}`} style={{
              display: 'grid',
              gridTemplateColumns: multiVariant ? '200px 1fr 120px 120px' : '200px 120px 120px',
              gap: 12,
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid var(--ds-color-border-subtle)',
            }}>
              {/* Token name */}
              <div>
                {subLabel && <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: '0 0 2px', textTransform: 'capitalize' }}>{subLabel}</p>}
                <p className="ds-text-small-1" style={{ color: 'var(--ds-color-text-secondary)', margin: 0, textTransform: 'capitalize' }}>{label}</p>
              </div>

              {/* Variable name (only in multi-variant) */}
              {multiVariant && (
                <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0, wordBreak: 'break-all' }}>{variable}</p>
              )}

              {/* Light swatch */}
              <div data-theme="light" style={{ background: 'transparent' }}>
                <div style={{
                  height: 36,
                  borderRadius: 'var(--ds-radius-6)',
                  background: `var(${variable})`,
                  border: hasBorder ? '1px solid var(--ds-color-border-default)' : undefined,
                }} />
                {!multiVariant && <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: '4px 0 0', wordBreak: 'break-all' }}>{variable}</p>}
              </div>

              {/* Dark swatch */}
              <div data-theme="dark" style={{ background: 'transparent' }}>
                <div style={{
                  height: 36,
                  borderRadius: 'var(--ds-radius-6)',
                  background: `var(${variable})`,
                  border: '1px solid rgba(255,255,255,0.08)',
                }} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ── Story ──────────────────────────────────────────────────

export const All: Story = {
  name: 'All Colors',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 860 }}>
      <PageTitle>Colors</PageTitle>
      <PageSubtitle>Semantic color tokens — use these in all components. Never reference primitives directly.</PageSubtitle>

      <SectionLabel>Background</SectionLabel>
      <ColorTable
        rows={['default','subtle','muted']}
        variants={['value']}
        getVariable={(row) => `--ds-color-background-${row}`}
        showBorderFor={() => true}
      />

      <SectionLabel>Surface</SectionLabel>
      <ColorTable
        rows={['1','2','3','4']}
        variants={['value']}
        getVariable={(row) => `--ds-color-surface-${row}`}
        showBorderFor={() => true}
      />

      <SectionLabel>Text</SectionLabel>
      <ColorTable
        rows={['primary','secondary','tertiary','disabled','inverse','on-brand']}
        variants={['value']}
        getVariable={(row) => `--ds-color-text-${row}`}
        showBorderFor={(row) => row === 'inverse' || row === 'on-brand'}
      />

      <SectionLabel>Icon</SectionLabel>
      <ColorTable
        rows={['default','secondary','disabled','inverse','on-brand']}
        variants={['value']}
        getVariable={(row) => `--ds-color-icon-${row}`}
        showBorderFor={(row) => row === 'inverse' || row === 'on-brand'}
      />

      <SectionLabel>Border</SectionLabel>
      <ColorTable
        rows={['subtle','default','strong','focus']}
        variants={['value']}
        getVariable={(row) => `--ds-color-border-${row}`}
        showBorderFor={() => true}
      />

      <SectionLabel>Brand</SectionLabel>
      <ColorTable
        rows={['default','subtle','text']}
        variants={['value']}
        getVariable={(row) => `--ds-color-brand-${row}`}
        showBorderFor={(row) => row === 'subtle'}
      />

      <Divider />

      <SectionLabel>Status</SectionLabel>
      <ColorTable
        rows={['success','warning','error','info']}
        variants={['default','subtle','text','border']}
        getVariable={(row, variant) => `--ds-color-status-${row}-${variant}`}
        showBorderFor={(_, v) => v === 'subtle' || v === 'text'}
      />

      <Divider />

      <SectionLabel>Extended Palette</SectionLabel>
      <ColorTable
        rows={['lime','mint','cyan','blue','indigo','purple','pink','rose','yellow']}
        variants={['default','subtle','text']}
        getVariable={(row, variant) => `--ds-color-extended-${row}-${variant}`}
        showBorderFor={(_, v) => v === 'subtle'}
      />

      <Divider />

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
                width: 120, height: 80,
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
