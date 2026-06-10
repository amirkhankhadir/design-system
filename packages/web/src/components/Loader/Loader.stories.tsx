import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader } from './Loader';

const meta: Meta<typeof Loader> = {
  title: 'Components/Loader',
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
      options: ['brand', 'white', 'current'],
    },
    label: {
      control: 'text',
      description: 'Screen reader label',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

// ── Default ────────────────────────────────────────────────

export const Default: Story = {
  args: {
    size: 20,
    color: 'brand',
  },
};

// ── Custom size ────────────────────────────────────────────

export const CustomSize: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Loader size={12} />
      <Loader size={32} />
      <Loader size={48} />
      <Loader size={64} />
    </div>
  ),
};

// ── Colors ─────────────────────────────────────────────────

export const OnLight: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Loader color="brand" />
      <Loader color="current" />
    </div>
  ),
};

export const OnBrand: Story = {
  decorators: [(Story) => (
    <div style={{ background: '#039be6', padding: 32, borderRadius: 8 }}>
      <Story />
    </div>
  )],
  render: () => <Loader color="white" />,
};

export const OnDark: Story = {
  decorators: [(Story) => (
    <div style={{ background: '#161616', padding: 32, borderRadius: 8 }}>
      <Story />
    </div>
  )],
  render: () => <Loader color="white" />,
};
