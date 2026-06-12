import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      description: {
        component: `
WCAG 2.1 AA compliance audit for all semantic color tokens.

Thresholds: 4.5:1 for normal text · 3:1 for large text and UI components (icons, borders, indicators).
Disabled states are exempt per WCAG 1.4.3.
        `.trim(),
      },
    },
  },
};
export default meta;
type Story = StoryObj;

// ── Shared layout ──────────────────────────────────────────

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
        margin: '0 0 12px',
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

// ── Requirement chips ──────────────────────────────────────

function Req({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '12px 16px',
        borderRadius: 10,
        background: 'var(--ds-color-background-muted)',
        border: '1px solid var(--ds-color-border-subtle)',
        minWidth: 140,
      }}
    >
      <p
        className="ds-text-xsmall-2"
        style={{
          color: 'var(--ds-color-text-tertiary)',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </p>
      <p className="ds-text-large-2" style={{ color: 'var(--ds-color-text-primary)', margin: 0 }}>
        {value}
      </p>
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────

type BadgeKind = 'aaa' | 'aa' | 'aa-ui' | 'exempt';

function Badge({ kind }: { kind: BadgeKind }) {
  const styles: Record<BadgeKind, { bg: string; color: string; label: string }> = {
    aaa: { bg: '#dbfcee', color: '#137149', label: 'AAA' },
    aa: { bg: '#e6f5fd', color: '#004063', label: 'AA' },
    'aa-ui': { bg: '#e6f5fd', color: '#004063', label: 'AA · UI' },
    exempt: {
      bg: 'var(--ds-color-background-muted)',
      color: 'var(--ds-color-text-tertiary)',
      label: 'Exempt',
    },
  };
  const s = styles[kind];
  return (
    <span
      className="ds-text-xsmall-2"
      style={{
        background: s.bg,
        color: s.color,
        padding: '2px 8px',
        borderRadius: 4,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

// ── Contrast row ───────────────────────────────────────────

interface ContrastRowProps {
  token: string;
  cssVar: string;
  fg: string;
  bg: string;
  ratio: string;
  badge: BadgeKind;
  example: React.ReactNode;
  note?: string;
}

const COL = '220px 40px 80px 1fr 80px';

function ContrastRow({ token, cssVar, fg, bg, ratio, badge, example, note }: ContrastRowProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: COL,
        alignItems: 'center',
        gap: 16,
        padding: '10px 0',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}
    >
      {/* Token name + css var */}
      <div>
        <p
          className="ds-text-small-2"
          style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 2px' }}
        >
          {token}
        </p>
        <p
          className="ds-text-xsmall-1"
          style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}
        >
          {cssVar}
        </p>
        {note && (
          <p
            className="ds-text-xsmall-1"
            style={{
              color: 'var(--ds-color-text-tertiary)',
              margin: '2px 0 0',
              fontStyle: 'italic',
            }}
          >
            {note}
          </p>
        )}
      </div>

      {/* Swatch */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: fg,
          border: '1px solid var(--ds-color-border-subtle)',
          flexShrink: 0,
        }}
      />

      {/* Ratio */}
      <p className="ds-text-small-2" style={{ color: 'var(--ds-color-text-primary)', margin: 0 }}>
        {ratio}:1
      </p>

      {/* Example */}
      <div
        style={{
          background: bg,
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid var(--ds-color-border-subtle)',
        }}
      >
        {example}
      </div>

      {/* Badge */}
      <div>
        <Badge kind={badge} />
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: COL,
        gap: 16,
        paddingBottom: 8,
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}
    >
      {['Token', 'Color', 'Ratio', 'Example', 'Status'].map(h => (
        <p
          key={h}
          className="ds-text-xsmall-2"
          style={{
            color: 'var(--ds-color-text-tertiary)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {h}
        </p>
      ))}
    </div>
  );
}

// ── Story ──────────────────────────────────────────────────

export const Accessibility: Story = {
  name: 'Accessibility',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 860 }}>
      <PageTitle>Accessibility</PageTitle>
      <PageSubtitle>
        WCAG 2.1 AA contrast audit — all semantic color tokens against their intended backgrounds.
      </PageSubtitle>

      {/* Requirements */}
      <SectionLabel>WCAG 2.1 AA Thresholds</SectionLabel>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
        <Req label="Normal text" value="≥ 4.5:1" />
        <Req label="Large text (≥ 18px)" value="≥ 3:1" />
        <Req label="UI components & icons" value="≥ 3:1" />
        <Req label="Disabled states" value="Exempt" />
      </div>

      <Divider />

      {/* Text tokens */}
      <SectionLabel>Text — on background-default</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <TableHeader />
        <ContrastRow
          token="text-primary"
          cssVar="--ds-color-text-primary"
          fg="#2a2a2a"
          bg="#ffffff"
          ratio="14.35"
          badge="aaa"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-text-primary)' }}>
              Page title
            </span>
          }
        />
        <ContrastRow
          token="text-secondary"
          cssVar="--ds-color-text-secondary"
          fg="#5c5c5c"
          bg="#ffffff"
          ratio="6.69"
          badge="aa"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-text-secondary)' }}>
              Supporting text
            </span>
          }
        />
        <ContrastRow
          token="text-tertiary"
          cssVar="--ds-color-text-tertiary"
          fg="#737373"
          bg="#ffffff"
          ratio="4.74"
          badge="aa"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-text-tertiary)' }}>
              Last updated 3 days ago
            </span>
          }
        />
        <ContrastRow
          token="text-disabled"
          cssVar="--ds-color-text-disabled"
          fg="#b9b9b9"
          bg="#ffffff"
          ratio="1.96"
          badge="exempt"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-text-disabled)' }}>
              Disabled label
            </span>
          }
          note="Inactive UI — exempt per WCAG 1.4.3"
        />
      </div>

      {/* Text on colored backgrounds */}
      <SectionLabel>Text — on colored backgrounds</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <TableHeader />
        <ContrastRow
          token="text-on-brand"
          cssVar="--ds-color-text-on-brand"
          fg="#ffffff"
          bg="#007bbd"
          ratio="4.60"
          badge="aa"
          example={
            <span className="ds-text-medium-2" style={{ color: '#ffffff' }}>
              Save changes
            </span>
          }
          note="On brand-default background"
        />
        <ContrastRow
          token="text-inverse"
          cssVar="--ds-color-text-inverse"
          fg="#ffffff"
          bg="#2a2a2a"
          ratio="14.35"
          badge="aaa"
          example={
            <span className="ds-text-medium-1" style={{ color: '#ffffff' }}>
              Tooltip content
            </span>
          }
          note="On background-inverse"
        />
      </div>

      <Divider />

      {/* Icons */}
      <SectionLabel>Icons — on background-default</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <TableHeader />
        <ContrastRow
          token="icon-default"
          cssVar="--ds-color-icon-default"
          fg="#454545"
          bg="#ffffff"
          ratio="9.59"
          badge="aaa"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-icon-default)' }}>
              ● Primary icon
            </span>
          }
        />
        <ContrastRow
          token="icon-secondary"
          cssVar="--ds-color-icon-secondary"
          fg="#737373"
          bg="#ffffff"
          ratio="4.74"
          badge="aa"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-icon-secondary)' }}>
              ● Secondary icon
            </span>
          }
        />
        <ContrastRow
          token="icon-disabled"
          cssVar="--ds-color-icon-disabled"
          fg="#b9b9b9"
          bg="#ffffff"
          ratio="1.96"
          badge="exempt"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-icon-disabled)' }}>
              ● Disabled icon
            </span>
          }
          note="Inactive UI — exempt per WCAG 1.4.3"
        />
      </div>

      <Divider />

      {/* Brand & focus */}
      <SectionLabel>Brand & Focus — on background-default</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <TableHeader />
        <ContrastRow
          token="brand-default / brand-text"
          cssVar="--ds-color-brand-default"
          fg="#007bbd"
          bg="#ffffff"
          ratio="4.60"
          badge="aa"
          example={
            <span
              className="ds-text-medium-2"
              style={{ color: 'var(--ds-color-brand-text)', textDecoration: 'underline' }}
            >
              View details →
            </span>
          }
        />
        <ContrastRow
          token="border-focus"
          cssVar="--ds-color-border-focus"
          fg="#039be6"
          bg="#ffffff"
          ratio="3.07"
          badge="aa-ui"
          example={
            <div
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: 6,
                boxShadow: '0 0 0 2px #fff, 0 0 0 4px #039be6',
              }}
            >
              <span className="ds-text-medium-2" style={{ color: 'var(--ds-color-text-primary)' }}>
                Focused element
              </span>
            </div>
          }
          note="Focus ring — UI component threshold applies"
        />
      </div>

      <Divider />

      {/* Status colors */}
      <SectionLabel>Status — on background-default</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <TableHeader />
        <ContrastRow
          token="status-success-default"
          cssVar="--ds-color-status-success-default"
          fg="#1e9863"
          bg="#ffffff"
          ratio="3.67"
          badge="aa-ui"
          example={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--ds-color-status-success-default)',
                  display: 'inline-block',
                }}
              />
              <span
                className="ds-text-medium-1"
                style={{ color: 'var(--ds-color-status-success-text)' }}
              >
                Published
              </span>
            </span>
          }
        />
        <ContrastRow
          token="status-warning-default"
          cssVar="--ds-color-status-warning-default"
          fg="#c8760b"
          bg="#ffffff"
          ratio="3.47"
          badge="aa-ui"
          example={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--ds-color-status-warning-default)',
                  display: 'inline-block',
                }}
              />
              <span
                className="ds-text-medium-1"
                style={{ color: 'var(--ds-color-status-warning-text)' }}
              >
                In review
              </span>
            </span>
          }
        />
        <ContrastRow
          token="status-error-default"
          cssVar="--ds-color-status-error-default"
          fg="#d6331f"
          bg="#ffffff"
          ratio="4.82"
          badge="aa"
          example={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--ds-color-status-error-default)',
                  display: 'inline-block',
                }}
              />
              <span
                className="ds-text-medium-1"
                style={{ color: 'var(--ds-color-status-error-text)' }}
              >
                Failed
              </span>
            </span>
          }
        />
        <ContrastRow
          token="status-info-default"
          cssVar="--ds-color-status-info-default"
          fg="#376be5"
          bg="#ffffff"
          ratio="4.78"
          badge="aa"
          example={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--ds-color-status-info-default)',
                  display: 'inline-block',
                }}
              />
              <span
                className="ds-text-medium-1"
                style={{ color: 'var(--ds-color-status-info-text)' }}
              >
                Processing
              </span>
            </span>
          }
        />
      </div>
    </div>
  ),
};
