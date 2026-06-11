import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    icon: { control: 'text', description: 'Material Symbol name' },
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'link', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    danger: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

// ── Default ────────────────────────────────────────────────

export const Default: Story = {
  args: { icon: 'home', variant: 'primary', size: 'md', 'aria-label': 'Home' },
};

// ── All Variants ───────────────────────────────────────────

function Col({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="ds-text-xsmall-1"
      style={{
        color: 'var(--ds-color-text-tertiary)',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {children}
    </p>
  );
}

export const Variants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {(['primary', 'secondary', 'tertiary', 'link', 'ghost'] as const).map(variant => (
        <Col key={variant}>
          <Label>{variant}</Label>
          <IconButton icon="home" variant={variant} size="md" aria-label={variant} />
          <IconButton
            icon="home"
            variant={variant}
            size="md"
            danger
            aria-label={`${variant} danger`}
          />
          <IconButton
            icon="home"
            variant={variant}
            size="md"
            disabled
            aria-label={`${variant} disabled`}
          />
          <IconButton
            icon="home"
            variant={variant}
            size="md"
            loading
            aria-label={`${variant} loading`}
          />
        </Col>
      ))}
    </div>
  ),
};

// ── Sizes ──────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconButton icon="home" variant="primary" size="sm" aria-label="Home small" />
      <IconButton icon="home" variant="primary" size="md" aria-label="Home medium" />
      <IconButton icon="home" variant="primary" size="lg" aria-label="Home large" />
    </div>
  ),
};
