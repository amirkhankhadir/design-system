import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A switch for a single setting that takes effect immediately. Use for independent on/off settings; for options that apply only after a form submit use Checkbox.\n\n**Accessibility:** the on state (white thumb on brand track) meets 4.6:1 — above the 3:1 UI-component minimum. The off state uses a light track in Light theme (thumb-vs-track ≈ 2.2:1, like iOS and most switch designs); the on/off state is conveyed by thumb position and track hue, and the thumb is separated from the track by its elevation shadow rather than by track contrast alone. Dark theme passes at 6.2:1.',
      },
    },
  },
  decorators: [
    Story => (
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    checked: {
      control: 'boolean',
      description:
        'Whether the toggle is on. Omit for uncontrolled usage; provide together with `onChange` for controlled.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and applies muted styling.',
    },
    label: {
      control: 'text',
      description:
        'Text label rendered to the right of the track. Omit for standalone usage (e.g. inside a settings row).',
    },
    onChange: {
      description: 'Called with the new `checked` value when the user flips the toggle.',
    },
  },
};

// ── Default (for autodocs controls) ──────────────────────────

export const Default: Story = {
  args: {
    label: 'Email notifications',
    checked: false,
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

// ── Helpers ───────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--ds-color-text-tertiary)',
          margin: 0,
        }}
      >
        {label}
      </p>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        {children}
      </div>
    </div>
  );
}

// ── All States ────────────────────────────────────────────────

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row label="Default">
        <Toggle label="Off" />
        <Toggle label="On" checked onChange={() => {}} />
      </Row>
      <Row label="Disabled">
        <Toggle label="Off" disabled />
        <Toggle label="On" disabled checked onChange={() => {}} />
      </Row>
      <Row label="Standalone (no label)">
        <Toggle />
        <Toggle checked onChange={() => {}} />
        <Toggle disabled />
      </Row>
      <Row label="Long label (wraps)">
        <div style={{ maxWidth: 240 }}>
          <Toggle label="Send me product updates, tips, and occasional surveys by email" />
        </div>
      </Row>
    </div>
  ),
};

// ── Interactive ───────────────────────────────────────────────

function InteractiveDemo() {
  const [checked, setChecked] = useState(false);
  return <Toggle label={checked ? 'On' : 'Off'} checked={checked} onChange={setChecked} />;
}

export const Interactive: Story = {
  name: 'Interactive',
  render: () => <InteractiveDemo />,
};

// ── Settings list ─────────────────────────────────────────────

function SettingsListDemo() {
  const [settings, setSettings] = useState({
    wifi: true,
    bluetooth: false,
    notifications: true,
  });
  const set = (key: keyof typeof settings) => (value: boolean) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid var(--ds-color-border-subtle)',
  };

  return (
    <div style={{ width: 280 }}>
      <div style={rowStyle}>
        <span className="ds-text-medium-1">Wi-Fi</span>
        <Toggle checked={settings.wifi} onChange={set('wifi')} />
      </div>
      <div style={rowStyle}>
        <span className="ds-text-medium-1">Bluetooth</span>
        <Toggle checked={settings.bluetooth} onChange={set('bluetooth')} />
      </div>
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <span className="ds-text-medium-1">Notifications</span>
        <Toggle checked={settings.notifications} onChange={set('notifications')} />
      </div>
    </div>
  );
}

export const SettingsList: Story = {
  name: 'Settings list',
  render: () => <SettingsListDemo />,
};
