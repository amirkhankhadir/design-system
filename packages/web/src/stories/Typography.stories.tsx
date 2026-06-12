import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      description: {
        component: `
**Typeface:** Source Sans 3

**Three groups:**
- \`display\` — 56–40px. Marketing and hero sections. Not for product UI.
- \`headline\` — 32–20px. Page titles (H1) and section headers (H2, H3).
- \`text\` — 18–10px. All UI body copy, labels, captions.

**Suffix = weight tier:**
- \`/1\` — Regular (400)
- \`/2\` — SemiBold (600), or Medium (500) for \`headline/medium\` and \`headline/small\`
- \`/3\` — Bold (700), or SemiBold (600) for \`headline/small\`

**CSS class pattern:** \`ds-{group}-{size}-{number}\` — e.g. \`ds-text-medium-1\`, \`ds-headline-large-2\`
        `.trim(),
      },
    },
  },
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
        margin: '0 0 4px',
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

function StyleRow({ className, label, meta }: { className: string; label: string; meta: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr 130px',
        alignItems: 'baseline',
        gap: 16,
        padding: '12px 0',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}
    >
      <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}>
        {label}
      </p>
      <span className={className} style={{ color: 'var(--ds-color-text-primary)' }}>
        The quick brown fox
      </span>
      <p
        className="ds-text-xsmall-1"
        style={{ color: 'var(--ds-color-text-tertiary)', margin: 0, textAlign: 'right' }}
      >
        {meta}
      </p>
    </div>
  );
}

export const TextStyles: Story = {
  name: 'Typography',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 800 }}>
      <PageTitle>Typography</PageTitle>
      <PageSubtitle>
        Source Sans 3 — display, headline and text styles with weight variants.
      </PageSubtitle>

      <SectionLabel>Display</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <StyleRow className="ds-display-large-1" label="display / large / 1" meta="56 · 68 · 400" />
        <StyleRow className="ds-display-large-2" label="display / large / 2" meta="56 · 68 · 600" />
        <StyleRow
          className="ds-display-medium-1"
          label="display / medium / 1"
          meta="48 · 56 · 400"
        />
        <StyleRow
          className="ds-display-medium-2"
          label="display / medium / 2"
          meta="48 · 56 · 600"
        />
        <StyleRow className="ds-display-small-1" label="display / small / 1" meta="40 · 48 · 400" />
        <StyleRow className="ds-display-small-2" label="display / small / 2" meta="40 · 48 · 600" />
      </div>

      <Divider />

      <SectionLabel>Headline</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <StyleRow
          className="ds-headline-large-1"
          label="headline / large / 1"
          meta="32 · 36 · 400"
        />
        <StyleRow
          className="ds-headline-large-2"
          label="headline / large / 2"
          meta="32 · 36 · 600"
        />
        <StyleRow
          className="ds-headline-medium-1"
          label="headline / medium / 1"
          meta="24 · 28 · 400"
        />
        <StyleRow
          className="ds-headline-medium-2"
          label="headline / medium / 2"
          meta="24 · 28 · 500"
        />
        <StyleRow
          className="ds-headline-small-1"
          label="headline / small / 1"
          meta="20 · 24 · 400"
        />
        <StyleRow
          className="ds-headline-small-2"
          label="headline / small / 2"
          meta="20 · 24 · 500"
        />
        <StyleRow
          className="ds-headline-small-3"
          label="headline / small / 3"
          meta="20 · 24 · 600"
        />
      </div>

      <Divider />

      <SectionLabel>Text</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <StyleRow className="ds-text-xlarge-1" label="text / xlarge / 1" meta="18 · 22 · 400" />
        <StyleRow className="ds-text-xlarge-2" label="text / xlarge / 2" meta="18 · 22 · 600" />
        <StyleRow className="ds-text-xlarge-3" label="text / xlarge / 3" meta="18 · 22 · 700" />
        <StyleRow className="ds-text-large-1" label="text / large / 1" meta="16 · 20 · 400" />
        <StyleRow className="ds-text-large-2" label="text / large / 2" meta="16 · 20 · 600" />
        <StyleRow className="ds-text-large-3" label="text / large / 3" meta="16 · 20 · 700" />
        <StyleRow className="ds-text-medium-1" label="text / medium / 1" meta="14 · 20 · 400" />
        <StyleRow className="ds-text-medium-2" label="text / medium / 2" meta="14 · 20 · 600" />
        <StyleRow className="ds-text-medium-3" label="text / medium / 3" meta="14 · 20 · 700" />
        <StyleRow className="ds-text-small-1" label="text / small / 1" meta="12 · 16 · 400" />
        <StyleRow className="ds-text-small-2" label="text / small / 2" meta="12 · 16 · 600" />
        <StyleRow className="ds-text-small-3" label="text / small / 3" meta="12 · 16 · 700" />
        <StyleRow className="ds-text-xsmall-1" label="text / xsmall / 1" meta="10 · 14 · 400" />
        <StyleRow className="ds-text-xsmall-2" label="text / xsmall / 2" meta="10 · 14 · 600" />
        <StyleRow className="ds-text-xsmall-3" label="text / xsmall / 3" meta="10 · 14 · 700" />
      </div>
    </div>
  ),
};
