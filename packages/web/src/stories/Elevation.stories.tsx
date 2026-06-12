import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      description: {
        component: `
Four box-shadow levels for establishing visual hierarchy between layers.

**When to use each level:**
- \`elevation-0\` — flat surfaces at the base layer: cards on a plain background, inline elements.
- \`elevation-1\` — elements slightly above the canvas: cards, panels, sidebars.
- \`elevation-2\` — floating elements: dropdowns, popovers, tooltips.
- \`elevation-3\` — high-priority overlays: modals, dialogs, drawers.

**CSS class:** \`ds-elevation-{0–3}\`

**Dark mode:** shadow opacity is automatically increased (~4×) so elevation remains perceptible on dark backgrounds. This follows the same approach as Fluent 2. Values come from the \`color/shadow/sm|md|lg\` semantic tokens.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ── Shadow value table ────────────────────────────────────────

const SHADOW_TOKENS = [
  { token: 'color/shadow/sm', light: 'rgba(0,0,0,0.06)', dark: 'rgba(0,0,0,0.24)' },
  { token: 'color/shadow/md', light: 'rgba(0,0,0,0.10)', dark: 'rgba(0,0,0,0.32)' },
  { token: 'color/shadow/lg', light: 'rgba(0,0,0,0.16)', dark: 'rgba(0,0,0,0.40)' },
];

function ShadowTokenTable() {
  return (
    <div style={{ marginBottom: 40 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'var(--ds-color-text-tertiary)',
          margin: '0 0 6px',
        }}
      >
        Shadow tokens
      </p>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          paddingBottom: 6,
          borderBottom: '1px solid var(--ds-color-border-subtle)',
        }}
      >
        {['Token', 'Light', 'Dark'].map((h, i) => (
          <p
            key={h}
            style={{
              flex: i === 0 ? '0 0 200px' : 1,
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--ds-color-text-tertiary)',
              margin: 0,
              letterSpacing: '0.05em',
            }}
          >
            {h}
          </p>
        ))}
      </div>
      {SHADOW_TOKENS.map(({ token, light, dark }) => (
        <div
          key={token}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            padding: '7px 0',
            borderBottom: '1px solid var(--ds-color-border-subtle)',
          }}
        >
          <p
            style={{
              flex: '0 0 200px',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--ds-color-text-primary)',
              margin: 0,
              fontFamily: 'monospace',
            }}
          >
            {token}
          </p>
          <p style={{ flex: 1, fontSize: 11, color: 'var(--ds-color-text-secondary)', margin: 0 }}>
            {light}
          </p>
          <p style={{ flex: 1, fontSize: 11, color: 'var(--ds-color-text-secondary)', margin: 0 }}>
            {dark}
          </p>
        </div>
      ))}
    </div>
  );
}

export const ElevationLevels: Story = {
  name: 'Elevation',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 800 }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--ds-color-text-primary)',
          margin: '0 0 8px',
        }}
      >
        Elevation
      </h1>
      <p
        style={{
          fontSize: 14,
          color: 'var(--ds-color-text-secondary)',
          margin: '0 0 32px',
          lineHeight: 1.5,
        }}
      >
        Box-shadow levels for visual hierarchy. Toggle the theme in the toolbar to see how shadows
        adapt between Light and Dark.
      </p>

      <ShadowTokenTable />

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: '8px 0 32px' }}>
        {[0, 1, 2, 3].map(level => (
          <div key={level} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              className={`ds-elevation-${level}`}
              style={{
                width: 160,
                height: 100,
                borderRadius: 'var(--ds-radius-12)',
                background: 'var(--ds-color-background-default)',
                border: level === 0 ? '1px solid var(--ds-color-border-default)' : undefined,
              }}
            />
            <div>
              <p
                className="ds-text-small-2"
                style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 2px' }}
              >
                elevation-{level}
              </p>
              <p
                className="ds-text-xsmall-1"
                style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}
              >
                .ds-elevation-{level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
