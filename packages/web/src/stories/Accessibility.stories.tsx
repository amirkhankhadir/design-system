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

Thresholds: 4.5:1 for normal text · 3:1 for large text, UI components and icons.
Disabled states are exempt per WCAG 1.4.3.
        `.trim(),
      },
    },
  },
};
export default meta;
type Story = StoryObj;

// ── Badge ─────────────────────────────────────────────────────

type BadgeKind = 'aaa' | 'aa' | 'aa-ui' | 'exempt';

const BADGE: Record<BadgeKind, { bg: string; color: string; label: string }> = {
  aaa: { bg: '#dcfce7', color: '#166534', label: 'AAA' },
  aa: { bg: '#dbeafe', color: '#1e40af', label: 'AA' },
  'aa-ui': { bg: '#e0f2fe', color: '#0369a1', label: 'AA · UI' },
  exempt: { bg: '#f4f4f5', color: '#71717a', label: 'Exempt' },
};

function Badge({ kind }: { kind: BadgeKind }) {
  const s = BADGE[kind];
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 11,
        fontWeight: 700,
        padding: '2px 7px',
        borderRadius: 4,
        background: s.bg,
        color: s.color,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

// ── Dot icon (neutral, no semantic meaning) ───────────────────

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

// ── Theme preview (dot + text on real bg) ─────────────────────

function ThemePreview({
  fg,
  bg,
  ratio,
  badge,
}: {
  fg: string;
  bg: string;
  ratio: string;
  badge: BadgeKind;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '4px 10px',
          borderRadius: 6,
          background: bg,
          minWidth: 110,
        }}
      >
        <Dot color={fg} />
        <span style={{ fontSize: 12, color: fg }}>Sample text</span>
      </div>
      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--ds-color-text-primary)',
          minWidth: 42,
        }}
      >
        {ratio}
      </span>
      <Badge kind={badge} />
    </div>
  );
}

// ── Checklist row ─────────────────────────────────────────────

interface RowProps {
  token: string;
  cssVar: string;
  fgLight: string;
  fgDark: string;
  bgLight?: string;
  bgDark?: string;
  ratioLight: string;
  ratioDark: string;
  badgeLight: BadgeKind;
  badgeDark: BadgeKind;
  note?: string;
}

function Row({
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
  note,
}: RowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: '8px 0',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}
    >
      {/* Token */}
      <div style={{ width: 200, flexShrink: 0, paddingRight: 16 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--ds-color-text-primary)',
            margin: '0 0 1px',
          }}
        >
          {token}
        </p>
        <p style={{ fontSize: 10, color: 'var(--ds-color-text-tertiary)', margin: 0 }}>{cssVar}</p>
        {note && (
          <p
            style={{
              fontSize: 10,
              color: 'var(--ds-color-text-tertiary)',
              margin: '2px 0 0',
              fontStyle: 'italic',
            }}
          >
            {note}
          </p>
        )}
      </div>

      {/* Light */}
      <ThemePreview fg={fgLight} bg={bgLight} ratio={ratioLight} badge={badgeLight} />

      {/* Separator */}
      <div
        style={{
          width: 1,
          height: 28,
          background: 'var(--ds-color-border-subtle)',
          flexShrink: 0,
          margin: '0 16px',
        }}
      />

      {/* Dark */}
      <ThemePreview fg={fgDark} bg={bgDark} ratio={ratioDark} badge={badgeDark} />
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'var(--ds-color-text-tertiary)',
          margin: '0 0 4px',
        }}
      >
        {title}
      </p>
      {/* Column headers */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          paddingBottom: 6,
          borderBottom: '1px solid var(--ds-color-border-subtle)',
        }}
      >
        <div style={{ width: 200, flexShrink: 0 }} />
        <p
          style={{
            flex: 1,
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--ds-color-text-tertiary)',
            margin: 0,
            letterSpacing: '0.05em',
          }}
        >
          ☀ Light
        </p>
        <div style={{ width: 1, margin: '0 16px' }} />
        <p
          style={{
            flex: 1,
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--ds-color-text-tertiary)',
            margin: 0,
            letterSpacing: '0.05em',
          }}
        >
          ◗ Dark
        </p>
      </div>
      {children}
    </div>
  );
}

// ── Req chip ──────────────────────────────────────────────────

function Req({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '10px 14px',
        borderRadius: 8,
        background: 'var(--ds-color-background-muted)',
        border: '1px solid var(--ds-color-border-subtle)',
        minWidth: 130,
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--ds-color-text-tertiary)',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </p>
      <p
        style={{ fontSize: 16, fontWeight: 700, color: 'var(--ds-color-text-primary)', margin: 0 }}
      >
        {value}
      </p>
    </div>
  );
}

// ── Story ─────────────────────────────────────────────────────

export const Accessibility: Story = {
  name: 'Accessibility',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 820 }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--ds-color-text-primary)',
          margin: '0 0 8px',
        }}
      >
        Accessibility
      </h1>
      <p
        style={{
          fontSize: 14,
          color: 'var(--ds-color-text-secondary)',
          margin: '0 0 32px',
          lineHeight: 1.5,
        }}
      >
        WCAG 2.1 AA contrast audit — all semantic color tokens, Light and Dark themes.
      </p>

      {/* Thresholds */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
        <Req label="Normal text" value="≥ 4.5:1" />
        <Req label="Large text ≥ 18px" value="≥ 3:1" />
        <Req label="Icons & UI" value="≥ 3:1" />
        <Req label="Disabled" value="Exempt" />
      </div>

      <div style={{ borderTop: '1px solid var(--ds-color-border-subtle)', margin: '0 0 36px' }} />

      {/* Text */}
      <Section title="Text — on background-default">
        <Row
          token="text-primary"
          cssVar="--ds-color-text-primary"
          fgLight="#2a2a2a"
          fgDark="#f8f8f8"
          ratioLight="14.35"
          ratioDark="17.04"
          badgeLight="aaa"
          badgeDark="aaa"
        />
        <Row
          token="text-secondary"
          cssVar="--ds-color-text-secondary"
          fgLight="#5c5c5c"
          fgDark="#d0d0d0"
          ratioLight="6.69"
          ratioDark="11.73"
          badgeLight="aa"
          badgeDark="aaa"
        />
        <Row
          token="text-tertiary"
          cssVar="--ds-color-text-tertiary"
          fgLight="#737373"
          fgDark="#a2a2a2"
          ratioLight="4.74"
          ratioDark="7.09"
          badgeLight="aa"
          badgeDark="aaa"
        />
        <Row
          token="text-disabled"
          cssVar="--ds-color-text-disabled"
          fgLight="#b9b9b9"
          fgDark="#737373"
          ratioLight="1.96"
          ratioDark="3.82"
          badgeLight="exempt"
          badgeDark="exempt"
          note="Inactive UI — exempt per WCAG 1.4.3"
        />
      </Section>

      {/* Text on colored bg */}
      <Section title="Text — on colored backgrounds">
        <Row
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
          note="White on brand-default"
        />
        <Row
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
          note="On background-inverse"
        />
      </Section>

      <div
        style={{ borderTop: '1px solid var(--ds-color-border-subtle)', margin: '-8px 0 36px' }}
      />

      {/* Icons */}
      <Section title="Icons — on background-default">
        <Row
          token="icon-default"
          cssVar="--ds-color-icon-default"
          fgLight="#454545"
          fgDark="#f1f1f1"
          ratioLight="9.59"
          ratioDark="16.02"
          badgeLight="aaa"
          badgeDark="aaa"
        />
        <Row
          token="icon-secondary"
          cssVar="--ds-color-icon-secondary"
          fgLight="#737373"
          fgDark="#b9b9b9"
          ratioLight="4.74"
          ratioDark="9.22"
          badgeLight="aa"
          badgeDark="aaa"
        />
        <Row
          token="icon-disabled"
          cssVar="--ds-color-icon-disabled"
          fgLight="#b9b9b9"
          fgDark="#737373"
          ratioLight="1.96"
          ratioDark="3.82"
          badgeLight="exempt"
          badgeDark="exempt"
          note="Inactive UI — exempt per WCAG 1.4.3"
        />
      </Section>

      <div
        style={{ borderTop: '1px solid var(--ds-color-border-subtle)', margin: '-8px 0 36px' }}
      />

      {/* Brand & Focus */}
      <Section title="Brand & Focus — on background-default">
        <Row
          token="brand-default / brand-text"
          cssVar="--ds-color-brand-default"
          fgLight="#007bbd"
          fgDark="#007bbd"
          ratioLight="4.60"
          ratioDark="3.94"
          badgeLight="aa"
          badgeDark="aa-ui"
          note="Dark: 3.94 passes UI 3:1"
        />
        <Row
          token="border-focus"
          cssVar="--ds-color-border-focus"
          fgLight="#039be6"
          fgDark="#35afeb"
          ratioLight="3.07"
          ratioDark="7.31"
          badgeLight="aa-ui"
          badgeDark="aaa"
          note="Focus ring — UI threshold (3:1)"
        />
      </Section>

      <div
        style={{ borderTop: '1px solid var(--ds-color-border-subtle)', margin: '-8px 0 36px' }}
      />

      {/* Status */}
      <Section title="Status — on background-default">
        <Row
          token="status-success-default"
          cssVar="--ds-color-status-success-default"
          fgLight="#1e9863"
          fgDark="#47d094"
          ratioLight="3.67"
          ratioDark="9.24"
          badgeLight="aa-ui"
          badgeDark="aaa"
        />
        <Row
          token="status-warning-default"
          cssVar="--ds-color-status-warning-default"
          fgLight="#c8760b"
          fgDark="#ffa530"
          ratioLight="3.47"
          ratioDark="9.20"
          badgeLight="aa-ui"
          badgeDark="aaa"
        />
        <Row
          token="status-error-default"
          cssVar="--ds-color-status-error-default"
          fgLight="#d6331f"
          fgDark="#e94e3a"
          ratioLight="4.82"
          ratioDark="4.84"
          badgeLight="aa"
          badgeDark="aa"
        />
        <Row
          token="status-info-default"
          cssVar="--ds-color-status-info-default"
          fgLight="#376be5"
          fgDark="#497cf6"
          ratioLight="4.78"
          ratioDark="4.74"
          badgeLight="aa"
          badgeDark="aa"
        />
      </Section>
    </div>
  ),
};
