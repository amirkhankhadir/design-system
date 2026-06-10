import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader } from './Loader';

const meta: Meta<typeof Loader> = {
  title: 'Utilities/Loader',
  component: Loader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'number' },
      description: 'Size in px',
    },
    color: {
      control: { type: 'select' },
      options: ['brand', 'inverse', 'on-brand', 'static-white', 'static-black'],
      description: 'Color variant',
    },
    label: {
      control: 'text',
      description: 'Screen reader label',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

// ── Default (brand) ────────────────────────────────────────

export const Default: Story = {
  args: {
    size: 20,
    color: 'brand',
  },
};

// ── Custom size ────────────────────────────────────────────

export const CustomSize: Story = {
  name: 'Custom Size',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Loader size={12} color="brand" />
      <Loader size={20} color="brand" />
      <Loader size={32} color="brand" />
      <Loader size={48} color="brand" />
      <Loader size={64} color="brand" />
    </div>
  ),
};

// ── All color variants ─────────────────────────────────────

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: 480 }}>

      {/* Brand */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 20px',
        background: 'var(--ds-color-background-default)',
        borderRadius: '8px 8px 0 0',
        border: '1px solid var(--ds-color-border-subtle)',
      }}>
        <Loader size={24} color="brand" />
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--ds-color-text-primary)' }}>brand</p>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--ds-color-text-tertiary)' }}>--ds-color-brand-default · primary actions</p>
        </div>
      </div>

      {/* Inverse */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 20px',
        background: 'var(--ds-color-background-default)',
        borderLeft: '1px solid var(--ds-color-border-subtle)',
        borderRight: '1px solid var(--ds-color-border-subtle)',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}>
        <Loader size={24} color="inverse" />
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--ds-color-text-primary)' }}>inverse</p>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--ds-color-text-tertiary)' }}>--ds-color-text-primary · adapts to theme</p>
        </div>
      </div>

      {/* On Brand */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 20px',
        background: 'var(--ds-color-brand-default)',
        borderLeft: '1px solid var(--ds-color-border-subtle)',
        borderRight: '1px solid var(--ds-color-border-subtle)',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}>
        <Loader size={24} color="on-brand" />
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--ds-color-text-on-brand)' }}>on-brand</p>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--ds-color-text-on-brand)', opacity: 0.7 }}>--ds-color-text-on-brand · on brand-colored surfaces</p>
        </div>
      </div>

      {/* Static White */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 20px',
        background: '#0a0a0a',
        borderLeft: '1px solid var(--ds-color-border-subtle)',
        borderRight: '1px solid var(--ds-color-border-subtle)',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}>
        <Loader size={24} color="static-white" />
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#ffffff' }}>static-white</p>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>--ds-color-icon-static-white · on dark surfaces</p>
        </div>
      </div>

      {/* Static Black */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 20px',
        background: '#ffffff',
        borderRadius: '0 0 8px 8px',
        borderLeft: '1px solid var(--ds-color-border-subtle)',
        borderRight: '1px solid var(--ds-color-border-subtle)',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}>
        <Loader size={24} color="static-black" />
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#000000' }}>static-black</p>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>--ds-color-icon-static-black · on light surfaces</p>
        </div>
      </div>

    </div>
  ),
};
