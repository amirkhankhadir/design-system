import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single option in a mutually exclusive set. Use for choosing exactly one option from a small visible list; for independent options use Checkbox.',
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
        'Whether the radio is selected. Omit for uncontrolled usage; provide together with `onChange` for controlled.',
    },
    error: {
      control: 'boolean',
      description: 'Marks the field as invalid. Renders a red border.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and applies muted styling.',
    },
    label: {
      control: 'text',
      description:
        'Text label rendered to the right of the radio. Omit for standalone usage (e.g. inside a table cell).',
    },
    name: {
      control: 'text',
      description:
        'Groups radios for native keyboard navigation. Radios sharing a `name` are mutually exclusive — use `RadioGroup` to avoid repeating it on every item.',
    },
    onChange: {
      description: 'Called with the new `checked` value when the user selects the radio.',
    },
  },
};

// ── Default (for autodocs controls) ──────────────────────────

export const Default: Story = {
  args: {
    label: 'Design',
    name: 'default-demo',
    checked: false,
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

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
        <Radio name="all-states-default" label="Unselected" />
        <Radio name="all-states-default-2" label="Selected" checked onChange={() => {}} />
      </Row>
      <Row label="Error">
        <Radio name="all-states-error" label="Unselected" error />
        <Radio name="all-states-error-2" label="Selected" error checked onChange={() => {}} />
      </Row>
      <Row label="Disabled">
        <Radio name="all-states-disabled" label="Unselected" disabled />
        <Radio name="all-states-disabled-2" label="Selected" disabled checked onChange={() => {}} />
      </Row>
      <Row label="Standalone (no label)">
        <Radio name="all-states-standalone" />
        <Radio name="all-states-standalone-2" checked onChange={() => {}} />
        <Radio name="all-states-standalone-3" disabled />
        <Radio name="all-states-standalone-4" error />
      </Row>
      <Row label="Long label (wraps)">
        <div style={{ maxWidth: 240 }}>
          <Radio
            name="all-states-long-label"
            label="I would like to receive promotional emails, product updates, and occasional surveys about my experience"
          />
        </div>
      </Row>
    </div>
  ),
};

// ── Interactive ───────────────────────────────────────────────

function InteractiveDemo() {
  const options = [
    { value: 'design', label: 'Design' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'product', label: 'Product' },
  ];
  const [value, setValue] = useState('design');

  return (
    <div style={{ display: 'flex', gap: 32 }}>
      {options.map(o => (
        <Radio
          key={o.value}
          name="interactive-demo"
          label={o.label}
          checked={value === o.value}
          onChange={() => setValue(o.value)}
        />
      ))}
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive',
  render: () => <InteractiveDemo />,
};

// ── Group ─────────────────────────────────────────────────────

const GROUP_OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
];

function GroupDemo() {
  const [value, setValue] = useState('design');

  return (
    <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <RadioGroup label="Team (vertical)" name="group-vertical">
        {GROUP_OPTIONS.map(o => (
          <Radio
            key={o.value}
            label={o.label}
            checked={value === o.value}
            onChange={() => setValue(o.value)}
          />
        ))}
      </RadioGroup>

      <RadioGroup label="Team (horizontal)" name="group-horizontal" orientation="horizontal">
        {GROUP_OPTIONS.map(o => (
          <Radio
            key={o.value}
            label={o.label}
            checked={value === o.value}
            onChange={() => setValue(o.value)}
          />
        ))}
      </RadioGroup>

      <RadioGroup label="Disabled group" name="group-disabled" disabled>
        {GROUP_OPTIONS.slice(0, 3).map(o => (
          <Radio key={o.value} label={o.label} checked={value === o.value} onChange={() => {}} />
        ))}
      </RadioGroup>
    </div>
  );
}

export const Group: Story = {
  name: 'Group',
  render: () => <GroupDemo />,
};
