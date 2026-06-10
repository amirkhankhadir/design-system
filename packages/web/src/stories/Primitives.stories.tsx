import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Primitives',
  parameters: { layout: 'padded', controls: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ── Helpers ────────────────────────────────────────────────

function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="ds-headline-large-2" style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 8px' }}>{children}</h1>;
}
function PageSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="ds-text-large-1" style={{ color: 'var(--ds-color-text-secondary)', margin: '0 0 8px' }}>{children}</p>;
}
function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      background: 'var(--ds-color-status-warning-subtle)',
      border: '1px solid var(--ds-color-status-warning-border)',
      borderRadius: 'var(--ds-radius-8)',
      padding: '10px 14px',
      margin: '0 0 48px',
    }}>
      <span style={{ fontSize: 14, lineHeight: '20px' }}>⚠️</span>
      <p className="ds-text-small-1" style={{ color: 'var(--ds-color-text-primary)', margin: 0 }}>{children}</p>
    </div>
  );
}
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="ds-text-small-2" style={{
      color: 'var(--ds-color-text-tertiary)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      margin: '0 0 16px',
    }}>{children}</p>
  );
}
function Divider() {
  return <div style={{ borderTop: '1px solid var(--ds-color-border-subtle)', margin: '8px 0 40px' }} />;
}

// Determine if text on a given hex should be light or dark
function isLight(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length !== 6) return true;
  const r = parseInt(c.slice(0,2), 16);
  const g = parseInt(c.slice(2,4), 16);
  const b = parseInt(c.slice(4,6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

// Single color swatch in a scale row
function Swatch({ label, value }: { label: string; value: string }) {
  const isRgba = value.startsWith('rgba');
  const bg = isRgba ? value : value;
  const textColor = isRgba ? 'var(--ds-color-text-primary)' : isLight(value) ? '#000' : '#fff';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
      <div style={{
        height: 48,
        background: bg,
        borderRadius: 'var(--ds-radius-6)',
        border: '1px solid var(--ds-color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
      }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: textColor, opacity: 0.85, lineHeight: 1.2, textAlign: 'center' }}>{label}</span>
      </div>
      <p style={{ fontSize: 9, color: 'var(--ds-color-text-tertiary)', margin: '4px 0 0', textAlign: 'center', wordBreak: 'break-all' }}>{value}</p>
    </div>
  );
}

// A full palette scale
function Scale({ name, swatches }: { name: string; swatches: { label: string; value: string }[] }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p className="ds-text-small-2" style={{ color: 'var(--ds-color-text-secondary)', margin: '0 0 8px' }}>{name}</p>
      <div style={{ display: 'flex', gap: 6 }}>
        {swatches.map(s => <Swatch key={s.label} label={s.label} value={s.value} />)}
      </div>
    </div>
  );
}

// ── Story ──────────────────────────────────────────────────

export const All: Story = {
  name: 'All Primitives',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 900 }}>
      <PageTitle>Primitives</PageTitle>
      <PageSubtitle>Raw color values that power all semantic tokens.</PageSubtitle>
      <Warning>
        Primitives are raw values only. Never reference them directly in components — always use semantic tokens (<code>--ds-color-*</code>) instead.
      </Warning>

      {/* Base */}
      <SectionLabel>Base</SectionLabel>
      <Scale name="base" swatches={[
        { label: 'white', value: '#ffffff' },
        { label: 'black', value: '#000000' },
      ]} />
      <Divider />

      {/* Primary */}
      <SectionLabel>Primary</SectionLabel>
      <Scale name="primary" swatches={[
        { label: '0',  value: '#001e30' },
        { label: '5',  value: '#002e47' },
        { label: '10', value: '#004063' },
        { label: '15', value: '#0072b8' },
        { label: '20', value: '#007bbd' },
        { label: '30', value: '#038dd1' },
        { label: '40', value: '#039be6' },
        { label: '50', value: '#35afeb' },
        { label: '60', value: '#56bcee' },
        { label: '70', value: '#8bd1f4' },
        { label: '80', value: '#b1e0f7' },
        { label: '90', value: '#e6f5fd' },
      ]} />
      <Divider />

      {/* Neutral */}
      <SectionLabel>Neutral</SectionLabel>
      <Scale name="neutral" swatches={[
        { label: '0',  value: '#161616' },
        { label: '5',  value: '#2a2a2a' },
        { label: '10', value: '#454545' },
        { label: '20', value: '#5c5c5c' },
        { label: '30', value: '#737373' },
        { label: '40', value: '#8b8b8b' },
        { label: '50', value: '#a2a2a2' },
        { label: '60', value: '#b9b9b9' },
        { label: '70', value: '#d0d0d0' },
        { label: '80', value: '#f1f1f1' },
        { label: '90', value: '#f8f8f8' },
        { label: '95', value: '#fcfcfc' },
      ]} />
      <Divider />

      {/* Status */}
      <SectionLabel>Status</SectionLabel>
      <Scale name="success" swatches={[
        { label: '0',  value: '#03140d' }, { label: '5',  value: '#0b442b' },
        { label: '10', value: '#137149' }, { label: '20', value: '#1e9863' },
        { label: '30', value: '#2db77b' }, { label: '40', value: '#47d094' },
        { label: '50', value: '#68e3ad' }, { label: '60', value: '#92f0c7' },
        { label: '70', value: '#c2f9e1' }, { label: '80', value: '#dbfcee' },
        { label: '90', value: '#f6fffb' },
      ]} />
      <Scale name="warning" swatches={[
        { label: '0',  value: '#140c00' }, { label: '5',  value: '#462900' },
        { label: '10', value: '#774400' }, { label: '20', value: '#a25e03' },
        { label: '30', value: '#c8760b' }, { label: '40', value: '#e68e19' },
        { label: '50', value: '#ffa530' }, { label: '60', value: '#ffbc5b' },
        { label: '70', value: '#ffd28d' }, { label: '80', value: '#ffe8c2' },
        { label: '90', value: '#fffbf5' },
      ]} />
      <Scale name="danger" swatches={[
        { label: '0',  value: '#1f0400' }, { label: '5',  value: '#530a00' },
        { label: '10', value: '#851203' }, { label: '20', value: '#b21f0d' },
        { label: '30', value: '#d6331f' }, { label: '40', value: '#e94e3a' },
        { label: '50', value: '#f77160' }, { label: '60', value: '#ff9b8f' },
        { label: '70', value: '#ffccc5' }, { label: '80', value: '#ffe2de' },
        { label: '90', value: '#fff9f8' },
      ]} />
      <Divider />

      {/* Extended */}
      <SectionLabel>Extended</SectionLabel>
      <Scale name="blue" swatches={[
        { label: '0',  value: '#0a1628' }, { label: '5',  value: '#0d2244' },
        { label: '10', value: '#172e65' }, { label: '20', value: '#2c57ba' },
        { label: '30', value: '#2060d0' }, { label: '40', value: '#376be5' },
        { label: '50', value: '#497cf6' }, { label: '60', value: '#86a8f9' },
        { label: '70', value: '#a4bdfb' }, { label: '80', value: '#c2d3fc' },
        { label: '90', value: '#ecf1fe' }, { label: '95', value: '#f6f8ff' },
      ]} />
      <Scale name="indigo" swatches={[
        { label: '10', value: '#1c1554' }, { label: '40', value: '#4737cc' },
        { label: '50', value: '#5c4af5' }, { label: '60', value: '#8d80f8' },
        { label: '70', value: '#aaa0fa' }, { label: '80', value: '#c6c0fc' },
        { label: '90', value: '#f0edff' },
      ]} />
      <Scale name="purple" swatches={[
        { label: '10', value: '#2a135c' }, { label: '40', value: '#6f39e5' },
        { label: '50', value: '#8754f6' }, { label: '60', value: '#af8df9' },
        { label: '70', value: '#c3a9fb' }, { label: '80', value: '#d7c6fc' },
        { label: '90', value: '#f3edff' },
      ]} />
      <Scale name="pink" swatches={[
        { label: '10', value: '#3f1436' }, { label: '40', value: '#9e3186' },
        { label: '50', value: '#be3ba1' }, { label: '60', value: '#d67ac2' },
        { label: '70', value: '#e09bd1' }, { label: '80', value: '#eabde0' },
        { label: '90', value: '#ffedfb' },
      ]} />
      <Scale name="rose" swatches={[
        { label: '10', value: '#3f131f' }, { label: '40', value: '#9e2f4e' },
        { label: '50', value: '#be385e' }, { label: '60', value: '#d77792' },
        { label: '70', value: '#e199ad' }, { label: '80', value: '#ebbbc9' },
        { label: '90', value: '#ffedf2' },
      ]} />
      <Scale name="cyan" swatches={[
        { label: '10', value: '#13344d' }, { label: '40', value: '#2871a8' },
        { label: '50', value: '#4c92c7' }, { label: '60', value: '#89bbe1' },
        { label: '70', value: '#a6cce9' }, { label: '80', value: '#c4ddf0' },
        { label: '90', value: '#ebf4fc' },
      ]} />
      <Scale name="mint" swatches={[
        { label: '10', value: '#17331d' }, { label: '40', value: '#316f3f' },
        { label: '50', value: '#3b854b' }, { label: '60', value: '#6cbe7e' },
        { label: '70', value: '#91ce9e' }, { label: '80', value: '#cef5d5' },
        { label: '90', value: '#ebfcef' },
      ]} />
      <Scale name="lime" swatches={[
        { label: '10', value: '#2c3912' }, { label: '40', value: '#5c7a22' },
        { label: '50', value: '#83aa36' }, { label: '60', value: '#b0d16e' },
        { label: '70', value: '#c4dd92' }, { label: '80', value: '#daebbc' },
        { label: '90', value: '#f5fceb' },
      ]} />
      <Scale name="yellow" swatches={[
        { label: '10', value: '#332b10' }, { label: '40', value: '#876b0e' },
        { label: '50', value: '#b88e07' }, { label: '60', value: '#f7ce45' },
        { label: '70', value: '#fbdc76' }, { label: '80', value: '#fce9ac' },
        { label: '90', value: '#fcf8eb' },
      ]} />
      <Divider />

      {/* Overlay */}
      <SectionLabel>Overlay</SectionLabel>
      <Scale name="overlay / black" swatches={[
        { label: '4%',  value: 'rgba(0,0,0,0.04)' },
        { label: '8%',  value: 'rgba(0,0,0,0.08)' },
        { label: '12%', value: 'rgba(0,0,0,0.12)' },
        { label: '16%', value: 'rgba(0,0,0,0.16)' },
        { label: '32%', value: 'rgba(0,0,0,0.32)' },
      ]} />
      <Scale name="overlay / white" swatches={[
        { label: '8%',  value: 'rgba(255,255,255,0.08)' },
        { label: '12%', value: 'rgba(255,255,255,0.12)' },
        { label: '16%', value: 'rgba(255,255,255,0.16)' },
        { label: '20%', value: 'rgba(255,255,255,0.20)' },
        { label: '32%', value: 'rgba(255,255,255,0.32)' },
      ]} />
      <Scale name="overlay / scrim" swatches={[
        { label: '40%', value: 'rgba(0,0,0,0.40)' },
      ]} />

    </div>
  ),
};
