import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant:  { control: 'select', options: ['primary','secondary','tertiary','link'] },
    size:     { control: 'select', options: ['sm','md','lg'] },
    danger:   { control: 'boolean' },
    loading:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconLeft: { control: 'text', description: 'Material Symbol name' },
    iconRight:{ control: 'text', description: 'Material Symbol name' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── Default ────────────────────────────────────────────────

export const Default: Story = {
  args: { variant: 'primary', size: 'md', children: 'Button' },
};

// ── All variants ───────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'contents' }}>
      <p className="ds-text-small-1" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0, alignSelf: 'center' }}>{label}</p>
      {children}
    </div>
  );
}

export const Variants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr', gap: '16px 24px', alignItems: 'center' }}>
      {/* Header */}
      <div />
      {['primary','secondary','tertiary','link'].map(v => (
        <p key={v} className="ds-text-xsmall-2" style={{ color: 'var(--ds-color-text-tertiary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{v}</p>
      ))}
      {/* Default */}
      <Row label="Default">
        <Button variant="primary">Button</Button>
        <Button variant="secondary">Button</Button>
        <Button variant="tertiary">Button</Button>
        <Button variant="link">Button</Button>
      </Row>
      {/* Hover hint */}
      <Row label="Danger">
        <Button variant="primary" danger>Button</Button>
        <Button variant="secondary" danger>Button</Button>
        <Button variant="tertiary" danger>Button</Button>
        <Button variant="link" danger>Button</Button>
      </Row>
      {/* Disabled */}
      <Row label="Disabled">
        <Button variant="primary" disabled>Button</Button>
        <Button variant="secondary" disabled>Button</Button>
        <Button variant="tertiary" disabled>Button</Button>
        <Button variant="link" disabled>Button</Button>
      </Row>
      {/* Loading */}
      <Row label="Loading">
        <Button variant="primary" loading>Button</Button>
        <Button variant="secondary" loading>Button</Button>
        <Button variant="tertiary" loading>Button</Button>
        <Button variant="link" loading>Button</Button>
      </Row>
      {/* With icons */}
      <Row label="With icons">
        <Button variant="primary" iconLeft="add">Button</Button>
        <Button variant="secondary" iconLeft="add">Button</Button>
        <Button variant="tertiary" iconLeft="add">Button</Button>
        <Button variant="link" iconLeft="add">Button</Button>
      </Row>
    </div>
  ),
};

// ── Sizes ──────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button variant="primary" size="sm" iconLeft="add">Small</Button>
      <Button variant="primary" size="md" iconLeft="add">Medium</Button>
      <Button variant="primary" size="lg" iconLeft="add">Large</Button>
    </div>
  ),
};

// ── Icons ──────────────────────────────────────────────────

export const WithIcons: Story = {
  name: 'With Icons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button variant="primary" iconLeft="add">Left icon</Button>
        <Button variant="primary" iconRight="arrow_forward">Right icon</Button>
        <Button variant="primary" iconLeft="download" iconRight="arrow_forward">Both icons</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button variant="secondary" iconLeft="filter_list">Filter</Button>
        <Button variant="tertiary" iconLeft="edit">Edit</Button>
        <Button variant="link" iconRight="open_in_new">Open link</Button>
      </div>
    </div>
  ),
};

