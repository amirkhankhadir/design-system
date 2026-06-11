import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Dimensions',
  parameters: { layout: 'padded', controls: { disable: true } },
};
export default meta;
type Story = StoryObj;

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="ds-headline-large-2"
      style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 8px' }}
    >
      {children}
    </h1>
  );
}

function PageSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="ds-text-large-1"
      style={{ color: 'var(--ds-color-text-secondary)', margin: '0 0 48px' }}
    >
      {children}
    </p>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="ds-text-small-2"
      style={{
        color: 'var(--ds-color-text-tertiary)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        margin: '0 0 16px',
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div style={{ borderTop: '1px solid var(--ds-color-border-subtle)', margin: '8px 0 40px' }} />
  );
}

export const All: Story = {
  name: 'All Dimensions',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 640 }}>
      <PageTitle>Dimensions</PageTitle>
      <PageSubtitle>
        Spacing, radius, border width and sizing — theme-independent tokens.
      </PageSubtitle>

      {/* Spacing */}
      <SectionLabel>Spacing</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
        {[0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64].map(n => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <p
              className="ds-text-small-1"
              style={{
                color: 'var(--ds-color-text-tertiary)',
                margin: 0,
                width: 100,
                flexShrink: 0,
              }}
            >
              spacing-{n}
            </p>
            <div
              style={{
                height: 6,
                width: `max(${n}px, 2px)`,
                background: 'var(--ds-color-brand-default)',
                borderRadius: 'var(--ds-radius-full)',
                flexShrink: 0,
              }}
            />
            <p
              className="ds-text-small-1"
              style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}
            >
              {n}px
            </p>
          </div>
        ))}
      </div>

      <Divider />

      {/* Radius */}
      <SectionLabel>Radius</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
        {[
          { name: '0', px: '0px' },
          { name: '4', px: '4px' },
          { name: '6', px: '6px' },
          { name: '8', px: '8px' },
          { name: '10', px: '10px' },
          { name: '12', px: '12px' },
          { name: '16', px: '16px' },
          { name: '24', px: '24px' },
          { name: '40', px: '40px' },
          { name: 'full', px: '∞' },
        ].map(r => (
          <div
            key={r.name}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                background: 'var(--ds-color-brand-subtle)',
                border: '1.5px solid var(--ds-color-brand-default)',
                borderRadius: `var(--ds-radius-${r.name})`,
              }}
            />
            <p
              className="ds-text-xsmall-2"
              style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}
            >
              {r.name}
            </p>
            <p
              className="ds-text-xsmall-1"
              style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}
            >
              {r.px}
            </p>
          </div>
        ))}
      </div>

      <Divider />

      {/* Border width */}
      <SectionLabel>Border Width</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
        {[1, 2, 4].map(n => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <p
              className="ds-text-small-1"
              style={{
                color: 'var(--ds-color-text-tertiary)',
                margin: 0,
                width: 120,
                flexShrink: 0,
              }}
            >
              border-width-{n}
            </p>
            <div
              style={{
                flex: 1,
                maxWidth: 200,
                borderTop: `var(--ds-border-width-${n}) solid var(--ds-color-text-primary)`,
              }}
            />
            <p
              className="ds-text-small-1"
              style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}
            >
              {n}px
            </p>
          </div>
        ))}
      </div>

      <Divider />

      {/* Sizing */}
      <SectionLabel>Sizing</SectionLabel>
      <p
        className="ds-text-small-1"
        style={{ color: 'var(--ds-color-text-tertiary)', margin: '0 0 20px' }}
      >
        Touch targets and component heights
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 40 }}>
        {[24, 32, 40, 48, 56].map(n => (
          <div
            key={n}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <div
              style={{
                width: `var(--ds-sizing-${n})`,
                height: `var(--ds-sizing-${n})`,
                background: 'var(--ds-color-brand-subtle)',
                border: '1.5px solid var(--ds-color-brand-default)',
                borderRadius: 'var(--ds-radius-8)',
              }}
            />
            <p
              className="ds-text-xsmall-2"
              style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}
            >
              sizing-{n}
            </p>
            <p
              className="ds-text-xsmall-1"
              style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}
            >
              {n}px
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};
