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
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ElevationLevels: Story = {
  name: 'Elevation',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 800 }}>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: '32px 0' }}>
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
