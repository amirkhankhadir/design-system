import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import type { IconColor } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Utilities/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    name: { control: 'text', description: 'Material Symbol name, e.g. "home"' },
    variant: { control: 'select', options: ['outlined', 'rounded'] },
    filled: { control: 'boolean' },
    size: { control: { type: 'number' }, description: 'Size in px' },
    color: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'disabled',
        'inverse',
        'on-brand',
        'static-white',
        'static-black',
        'brand',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

// ── Default ────────────────────────────────────────────────

export const Default: Story = {
  args: { name: 'home', size: 24, color: 'default', variant: 'outlined', filled: false },
};

// ── Outlined vs Rounded ────────────────────────────────────

export const Variants: Story = {
  name: 'Outlined vs Rounded',
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      {[
        { variant: 'outlined' as const, filled: false, label: 'outlined' },
        { variant: 'rounded' as const, filled: false, label: 'rounded' },
        { variant: 'outlined' as const, filled: true, label: 'outlined filled' },
        { variant: 'rounded' as const, filled: true, label: 'rounded filled' },
      ].map(({ variant, filled, label }) => (
        <div
          key={label}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Icon name="home" variant={variant} filled={filled} size={32} />
          <p
            className="ds-text-xsmall-1"
            style={{ color: 'var(--ds-color-text-tertiary)', margin: 0 }}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  ),
};

// ── Colors ─────────────────────────────────────────────────

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: 420 }}>
      {[
        {
          color: 'default',
          bg: 'var(--ds-color-background-default)',
          label: 'default',
          token: '--ds-color-icon-default',
        },
        {
          color: 'secondary',
          bg: 'var(--ds-color-background-default)',
          label: 'secondary',
          token: '--ds-color-icon-secondary',
        },
        {
          color: 'disabled',
          bg: 'var(--ds-color-background-default)',
          label: 'disabled',
          token: '--ds-color-icon-disabled',
        },
        {
          color: 'brand',
          bg: 'var(--ds-color-background-default)',
          label: 'brand',
          token: '--ds-color-brand-default',
        },
        { color: 'inverse', bg: '#161616', label: 'inverse', token: '--ds-color-icon-inverse' },
        {
          color: 'on-brand',
          bg: 'var(--ds-color-brand-default)',
          label: 'on-brand',
          token: '--ds-color-icon-on-brand',
        },
        {
          color: 'static-white',
          bg: '#0a0a0a',
          label: 'static-white',
          token: '--ds-color-icon-static-white',
        },
        {
          color: 'static-black',
          bg: '#ffffff',
          label: 'static-black',
          token: '--ds-color-icon-static-black',
        },
      ].map(({ color, bg, label, token }, i, arr) => {
        const isDark = bg.startsWith('#') && parseInt(bg.slice(1, 3), 16) < 100;
        const isBrand = bg.includes('brand');
        const textPrimary = isDark || isBrand ? '#ffffff' : 'var(--ds-color-text-primary)';
        const textSecondary =
          isDark || isBrand ? 'rgba(255,255,255,0.5)' : 'var(--ds-color-text-tertiary)';
        return (
          <div
            key={color}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '12px 16px',
              background: bg,
              border: '1px solid var(--ds-color-border-subtle)',
              borderTop: i === 0 ? '1px solid var(--ds-color-border-subtle)' : 'none',
              borderRadius: i === 0 ? '8px 8px 0 0' : i === arr.length - 1 ? '0 0 8px 8px' : 0,
            }}
          >
            <Icon name="home" size={24} color={color as IconColor} />
            <div>
              <p className="ds-text-small-2" style={{ color: textPrimary, margin: '0 0 2px' }}>
                {label}
              </p>
              <p className="ds-text-xsmall-1" style={{ color: textSecondary, margin: 0 }}>
                {token}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  ),
};

// ── Icon grid ──────────────────────────────────────────────

const SAMPLE_ICONS = [
  'home',
  'search',
  'settings',
  'person',
  'notifications',
  'arrow_back',
  'arrow_forward',
  'close',
  'check',
  'add',
  'delete',
  'edit',
  'share',
  'favorite',
  'star',
  'visibility',
  'visibility_off',
  'lock',
  'mail',
  'phone',
  'calendar_today',
  'schedule',
  'location_on',
  'attach_file',
  'download',
  'upload',
  'refresh',
  'filter_list',
  'sort',
  'more_vert',
];

export const IconGrid: Story = {
  name: 'Icon Grid',
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <p
        className="ds-text-small-1"
        style={{ color: 'var(--ds-color-text-tertiary)', margin: '0 0 20px' }}
      >
        Sample from Material Symbols — thousands more available at{' '}
        <a
          href="https://fonts.google.com/icons"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--ds-color-brand-default)' }}
        >
          fonts.google.com/icons
        </a>
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {SAMPLE_ICONS.map(name => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '12px 8px',
              border: '1px solid var(--ds-color-border-subtle)',
              borderRadius: 'var(--ds-radius-8)',
              width: 80,
              background: 'var(--ds-color-background-default)',
            }}
          >
            <Icon name={name} size={24} color="default" />
            <p
              style={{
                fontSize: 9,
                color: 'var(--ds-color-text-tertiary)',
                margin: 0,
                textAlign: 'center',
                wordBreak: 'break-all',
              }}
            >
              {name}
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};
