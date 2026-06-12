import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      description: {
        component: `
WCAG 2.1 AA compliance audit for all semantic color tokens — both Light and Dark themes.

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

const BADGE_STYLES: Record<BadgeKind, { bg: string; color: string; label: string }> = {
  aaa: { bg: '#dbfcee', color: '#137149', label: 'AAA' },
  aa: { bg: '#e6f5fd', color: '#004063', label: 'AA' },
  'aa-ui': { bg: '#e6f5fd', color: '#004063', label: 'AA · UI' },
  exempt: { bg: '#f1f1f1', color: '#737373', label: 'Exempt' },
};

function Badge({ kind }: { kind: BadgeKind }) {
  const s = BADGE_STYLES[kind];
  return (
    <span
      className="ds-text-xsmall-2"
      style={{
        background: s.bg,
        color: s.color,
        padding: '2px 7px',
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
  /** light-mode foreground hex */
  fgLight: string;
  /** dark-mode foreground hex */
  fgDark: string;
  /** light-mode background hex (defaults to #ffffff) */
  bgLight?: string;
  /** dark-mode background hex (defaults to #161616) */
  bgDark?: string;
  ratioLight: string;
  ratioDark: string;
  badgeLight: BadgeKind;
  badgeDark: BadgeKind;
  example: React.ReactNode;
  note?: string;
}

// token | swatch×2 | light ratio | dark ratio | example
const COL = '200px 68px 110px 110px 1fr';

function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: hex,
          border: '1px solid rgba(0,0,0,0.12)',
        }}
      />
      <span
        className="ds-text-xsmall-1"
        style={{ color: 'var(--ds-color-text-tertiary)', fontSize: 9 }}
      >
        {label}
      </span>
    </div>
  );
}

function RatioCell({ ratio, badge, bg }: { ratio: string; badge: BadgeKind; bg: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <p className="ds-text-small-2" style={{ color: 'var(--ds-color-text-primary)', margin: 0 }}>
        {ratio}:1
      </p>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <Badge kind={badge} />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 2,
            background: bg,
            border: '1px solid rgba(0,0,0,0.12)',
            flexShrink: 0,
          }}
          title={`on ${bg}`}
        />
      </div>
    </div>
  );
}

function ContrastRow({
  token,
  cssVar,
  fgLight,
  fgDark,
  bgLight = '#ffffff',
  bgDark = '#161616',
  ratioLight,
  ratioDark,
  badgeLight,
  badgeDark,
  example,
  note,
}: ContrastRowProps) {
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
      {/* Token */}
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

      {/* Swatches */}
      <div style={{ display: 'flex', gap: 6 }}>
        <Swatch hex={fgLight} label="Light" />
        <Swatch hex={fgDark} label="Dark" />
      </div>

      {/* Light ratio */}
      <RatioCell ratio={ratioLight} badge={badgeLight} bg={bgLight} />

      {/* Dark ratio */}
      <RatioCell ratio={ratioDark} badge={badgeDark} bg={bgDark} />

      {/* Example — uses CSS vars, adapts to theme toggle */}
      <div
        style={{
          background: 'var(--ds-color-background-subtle)',
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid var(--ds-color-border-subtle)',
        }}
      >
        {example}
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
      {['Token', 'Color', 'Light', 'Dark', 'Example'].map(h => (
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
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 900 }}>
      <PageTitle>Accessibility</PageTitle>
      <PageSubtitle>
        WCAG 2.1 AA contrast audit — all semantic color tokens, Light and Dark themes.
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

      {/* Text */}
      <SectionLabel>Text — on background-default</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <TableHeader />
        <ContrastRow
          token="text-primary"
          cssVar="--ds-color-text-primary"
          fgLight="#2a2a2a"
          fgDark="#f8f8f8"
          ratioLight="14.35"
          ratioDark="17.04"
          badgeLight="aaa"
          badgeDark="aaa"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-text-primary)' }}>
              Page title
            </span>
          }
        />
        <ContrastRow
          token="text-secondary"
          cssVar="--ds-color-text-secondary"
          fgLight="#5c5c5c"
          fgDark="#d0d0d0"
          ratioLight="6.69"
          ratioDark="11.73"
          badgeLight="aa"
          badgeDark="aaa"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-text-secondary)' }}>
              Supporting text
            </span>
          }
        />
        <ContrastRow
          token="text-tertiary"
          cssVar="--ds-color-text-tertiary"
          fgLight="#737373"
          fgDark="#a2a2a2"
          ratioLight="4.74"
          ratioDark="7.09"
          badgeLight="aa"
          badgeDark="aaa"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-text-tertiary)' }}>
              Last updated 3 days ago
            </span>
          }
        />
        <ContrastRow
          token="text-disabled"
          cssVar="--ds-color-text-disabled"
          fgLight="#b9b9b9"
          fgDark="#737373"
          ratioLight="1.96"
          ratioDark="3.82"
          badgeLight="exempt"
          badgeDark="exempt"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-text-disabled)' }}>
              Disabled label
            </span>
          }
          note="Inactive UI — exempt per WCAG 1.4.3"
        />
      </div>

      {/* Text on colored bg */}
      <SectionLabel>Text — on colored backgrounds</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <TableHeader />
        <ContrastRow
          token="text-on-brand"
          cssVar="--ds-color-text-on-brand"
          fgLight="#ffffff"
          fgDark="#ffffff"
          bgLight="#007bbd"
          bgDark="#007bbd"
          ratioLight="4.60"
          ratioDark="4.60"
          badgeLight="aa"
          badgeDark="aa"
          example={
            <span className="ds-text-medium-2" style={{ color: 'var(--ds-color-text-on-brand)' }}>
              Save changes
            </span>
          }
          note="White text on brand-default (#007bbd)"
        />
        <ContrastRow
          token="text-inverse"
          cssVar="--ds-color-text-inverse"
          fgLight="#ffffff"
          fgDark="#2a2a2a"
          bgLight="#2a2a2a"
          bgDark="#f8f8f8"
          ratioLight="14.35"
          ratioDark="13.52"
          badgeLight="aaa"
          badgeDark="aaa"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-text-inverse)' }}>
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
          fgLight="#454545"
          fgDark="#f1f1f1"
          ratioLight="9.59"
          ratioDark="16.02"
          badgeLight="aaa"
          badgeDark="aaa"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-icon-default)' }}>
              ● Primary icon
            </span>
          }
        />
        <ContrastRow
          token="icon-secondary"
          cssVar="--ds-color-icon-secondary"
          fgLight="#737373"
          fgDark="#b9b9b9"
          ratioLight="4.74"
          ratioDark="9.22"
          badgeLight="aa"
          badgeDark="aaa"
          example={
            <span className="ds-text-medium-1" style={{ color: 'var(--ds-color-icon-secondary)' }}>
              ● Secondary icon
            </span>
          }
        />
        <ContrastRow
          token="icon-disabled"
          cssVar="--ds-color-icon-disabled"
          fgLight="#b9b9b9"
          fgDark="#737373"
          ratioLight="1.96"
          ratioDark="3.82"
          badgeLight="exempt"
          badgeDark="exempt"
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
          fgLight="#007bbd"
          fgDark="#007bbd"
          ratioLight="4.60"
          ratioDark="3.94"
          badgeLight="aa"
          badgeDark="aa-ui"
          example={
            <span
              className="ds-text-medium-2"
              style={{ color: 'var(--ds-color-brand-text)', textDecoration: 'underline' }}
            >
              View details →
            </span>
          }
          note="Dark: 3.94 passes UI 3:1 (button shape on dark bg)"
        />
        <ContrastRow
          token="border-focus"
          cssVar="--ds-color-border-focus"
          fgLight="#039be6"
          fgDark="#35afeb"
          ratioLight="3.07"
          ratioDark="7.31"
          badgeLight="aa-ui"
          badgeDark="aaa"
          example={
            <div
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: 6,
                boxShadow:
                  '0 0 0 2px var(--ds-color-background-default), 0 0 0 4px var(--ds-color-border-focus)',
              }}
            >
              <span className="ds-text-medium-2" style={{ color: 'var(--ds-color-text-primary)' }}>
                Focused element
              </span>
            </div>
          }
          note="Focus ring — UI component threshold (3:1) applies"
        />
      </div>

      <Divider />

      {/* Status */}
      <SectionLabel>Status — on background-default</SectionLabel>
      <div style={{ marginBottom: 40 }}>
        <TableHeader />
        <ContrastRow
          token="status-success-default"
          cssVar="--ds-color-status-success-default"
          fgLight="#1e9863"
          fgDark="#47d094"
          ratioLight="3.67"
          ratioDark="9.24"
          badgeLight="aa-ui"
          badgeDark="aaa"
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
          fgLight="#c8760b"
          fgDark="#ffa530"
          ratioLight="3.47"
          ratioDark="9.20"
          badgeLight="aa-ui"
          badgeDark="aaa"
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
          fgLight="#d6331f"
          fgDark="#e94e3a"
          ratioLight="4.82"
          ratioDark="4.84"
          badgeLight="aa"
          badgeDark="aa"
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
          fgLight="#376be5"
          fgDark="#497cf6"
          ratioLight="4.78"
          ratioDark="4.74"
          badgeLight="aa"
          badgeDark="aa"
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
