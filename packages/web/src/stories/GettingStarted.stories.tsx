import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Getting Started',
  parameters: { layout: 'padded', controls: { disable: true } },
};
export default meta;
type Story = StoryObj;

function Section({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 48 }}>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="ds-headline-medium-2" style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 8px' }}>
      {children}
    </h2>
  );
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="ds-text-large-1" style={{ color: 'var(--ds-color-text-secondary)', margin: '0 0 24px' }}>
      {children}
    </p>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre style={{
      background: 'var(--ds-color-background-subtle)',
      border: '1px solid var(--ds-color-border-subtle)',
      borderRadius: 'var(--ds-radius-8)',
      padding: '14px 18px',
      margin: '0 0 16px',
      overflowX: 'auto',
      fontFamily: 'ui-monospace, monospace',
      fontSize: 13,
      lineHeight: 1.6,
      color: 'var(--ds-color-text-primary)',
    }}>
      <code>{children}</code>
    </pre>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      background: 'var(--ds-color-background-subtle)',
      border: '1px solid var(--ds-color-border-subtle)',
      borderRadius: 'var(--ds-radius-4)',
      padding: '2px 6px',
      fontFamily: 'ui-monospace, monospace',
      fontSize: '0.875em',
      color: 'var(--ds-color-text-primary)',
    }}>
      {children}
    </code>
  );
}

function Divider() {
  return <div style={{ borderTop: '1px solid var(--ds-color-border-subtle)', margin: '8px 0 48px' }} />;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: 'var(--ds-radius-full)',
      background: 'var(--ds-color-brand-subtle)',
      color: 'var(--ds-color-brand-text)',
      fontSize: 12,
      fontWeight: 500,
      marginRight: 8,
      marginBottom: 8,
    }}>
      {children}
    </span>
  );
}

export const Overview: Story = {
  name: 'Getting Started',
  render: () => (
    <div style={{ fontFamily: 'var(--ds-font-family-primary, sans-serif)', maxWidth: 720 }}>

      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <h1 className="ds-display-large-1" style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 12px' }}>
          Design System
        </h1>
        <p className="ds-text-large-1" style={{ color: 'var(--ds-color-text-secondary)', margin: '0 0 20px' }}>
          A cross-platform token-based design system for Web, iOS and Android.
          Built on semantic design tokens with full light/dark theme support.
        </p>
        <div>
          <Chip>Tokens</Chip>
          <Chip>React</Chip>
          <Chip>iOS</Chip>
          <Chip>Android</Chip>
          <Chip>Figma</Chip>
        </div>
      </div>

      <Divider />

      {/* Architecture */}
      <Section>
        <SectionTitle>Architecture</SectionTitle>
        <SectionSubtitle>
          Tokens flow from a single source of truth to every platform.
        </SectionSubtitle>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12,
          marginBottom: 16,
        }}>
          {[
            { title: 'Primitives', desc: 'Raw values — colors, sizes. Never used directly in components.' },
            { title: 'Semantics', desc: 'Theme-aware aliases of primitives. These are used in components.' },
            { title: 'Display', desc: 'Theme-independent tokens — spacing, radius, border, sizing.' },
          ].map(item => (
            <div key={item.title} style={{
              padding: '16px',
              border: '1px solid var(--ds-color-border-subtle)',
              borderRadius: 'var(--ds-radius-8)',
              background: 'var(--ds-color-background-subtle)',
            }}>
              <p className="ds-text-small-2" style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 4px' }}>{item.title}</p>
              <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="ds-text-small-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}>
          Source: <InlineCode>tokens/</InlineCode> → build: <InlineCode>node build-tokens.js</InlineCode> → output: <InlineCode>dist/web/tokens.light.css</InlineCode>, <InlineCode>dist/ios/DesignTokens.swift</InlineCode>, <InlineCode>dist/android/</InlineCode>
        </p>
      </Section>

      <Divider />

      {/* Web setup */}
      <Section>
        <SectionTitle>Web — Setup</SectionTitle>
        <SectionSubtitle>Import token CSS files once at your app entry point.</SectionSubtitle>
        <Code>{`// main.tsx or App.tsx
import '@design-system/web/dist/tokens.light.css';
import '@design-system/web/dist/tokens.dark.css';`}</Code>
        <p className="ds-text-small-1" style={{ color: 'var(--ds-color-text-secondary)', margin: '0 0 16px' }}>
          Switch themes by setting <InlineCode>data-theme="dark"</InlineCode> on <InlineCode>{'<html>'}</InlineCode>:
        </p>
        <Code>{`document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.removeAttribute('data-theme'); // back to light`}</Code>
      </Section>

      <Divider />

      {/* Using tokens */}
      <Section>
        <SectionTitle>Using Tokens</SectionTitle>
        <SectionSubtitle>
          Always reference semantic tokens. Never use primitives directly.
        </SectionSubtitle>
        <Code>{`/* ✅ Correct — semantic token */
.button {
  background: var(--ds-color-brand-default);
  color: var(--ds-color-text-on-brand);
  padding: var(--ds-spacing-8) var(--ds-spacing-16);
  border-radius: var(--ds-radius-8);
}

/* ❌ Wrong — primitive token */
.button {
  background: #039be6;
}`}</Code>
      </Section>

      <Divider />

      {/* Using components */}
      <Section>
        <SectionTitle>Using Components</SectionTitle>
        <SectionSubtitle>Import components from the package.</SectionSubtitle>
        <Code>{`import { Loader } from '@design-system/web/components/Loader';
import { Icon } from '@design-system/web/components/Icon';

function App() {
  return (
    <>
      <Loader size={24} color="brand" />
      <Icon name="home" size={24} color="default" />
    </>
  );
}`}</Code>
      </Section>

      <Divider />

      {/* Figma */}
      <Section>
        <SectionTitle>Figma</SectionTitle>
        <SectionSubtitle>
          Tokens are synced to Figma variables. Use semantic tokens in all components.
        </SectionSubtitle>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          {[
            { title: 'global-primitives', desc: 'Raw color values. Hidden from component pickers.' },
            { title: 'brand-theme-semantics', desc: 'Light/Dark modes. Use these in all Figma components.' },
            { title: 'display-semantics', desc: 'Spacing, radius, border, sizing. Single mode.' },
            { title: 'typography', desc: 'Font families, sizes, line heights, weights.' },
          ].map(item => (
            <div key={item.title} style={{
              padding: '14px 16px',
              border: '1px solid var(--ds-color-border-subtle)',
              borderRadius: 'var(--ds-radius-8)',
            }}>
              <p className="ds-text-small-2" style={{ color: 'var(--ds-color-text-primary)', margin: '0 0 4px' }}>{item.title}</p>
              <p className="ds-text-xsmall-1" style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Contribution rules */}
      <Section>
        <SectionTitle>Rules</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Always use semantic tokens in components — never primitives.',
            'When adding new tokens: update semantics.json, run build-tokens.js, update Figma variables with correct scopes.',
            'When updating tokens: update Colors story documentation.',
            'All Storybook content must be in English.',
            'Text on dark/brand backgrounds must be light-colored — always check readability.',
            'Icon color variants use --ds-color-icon-* tokens.',
          ].map((rule, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{
                flexShrink: 0,
                width: 20, height: 20,
                borderRadius: 'var(--ds-radius-full)',
                background: 'var(--ds-color-brand-subtle)',
                color: 'var(--ds-color-brand-text)',
                fontSize: 11,
                fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</span>
              <p className="ds-text-small-1" style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}>{rule}</p>
            </div>
          ))}
        </div>
      </Section>

    </div>
  ),
};
