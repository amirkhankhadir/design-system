import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A binary (or tri-state) selection control. Use for independent options; for mutually exclusive choices use Radio.',
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
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

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
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" checked onChange={() => {}} />
        <Checkbox label="Indeterminate" indeterminate onChange={() => {}} />
      </Row>
      <Row label="Error">
        <Checkbox label="Unchecked" error />
        <Checkbox label="Checked" error checked onChange={() => {}} />
      </Row>
      <Row label="Disabled">
        <Checkbox label="Unchecked" disabled />
        <Checkbox label="Checked" disabled checked onChange={() => {}} />
        <Checkbox label="Indeterminate" disabled indeterminate onChange={() => {}} />
      </Row>
      <Row label="Standalone (no label)">
        <Checkbox />
        <Checkbox checked onChange={() => {}} />
        <Checkbox indeterminate onChange={() => {}} />
        <Checkbox disabled />
        <Checkbox error />
      </Row>
    </div>
  ),
};

// ── Interactive ───────────────────────────────────────────────

function InteractiveDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox label={checked ? 'Checked' : 'Unchecked'} checked={checked} onChange={setChecked} />
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
  const [selected, setSelected] = useState<string[]>(['design']);

  const toggle = (value: string) =>
    setSelected(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]));

  const allChecked = selected.length === GROUP_OPTIONS.length;
  const someChecked = selected.length > 0 && !allChecked;
  const toggleAll = () => setSelected(allChecked ? [] : GROUP_OPTIONS.map(o => o.value));

  return (
    <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <CheckboxGroup label="Team (vertical)">
        <Checkbox
          label="Select all"
          checked={allChecked}
          indeterminate={someChecked}
          onChange={toggleAll}
        />
        {GROUP_OPTIONS.map(o => (
          <Checkbox
            key={o.value}
            label={o.label}
            checked={selected.includes(o.value)}
            onChange={() => toggle(o.value)}
          />
        ))}
      </CheckboxGroup>

      <CheckboxGroup label="Team (horizontal)" orientation="horizontal">
        {GROUP_OPTIONS.map(o => (
          <Checkbox
            key={o.value}
            label={o.label}
            checked={selected.includes(o.value)}
            onChange={() => toggle(o.value)}
          />
        ))}
      </CheckboxGroup>

      <CheckboxGroup label="Disabled group" disabled>
        {GROUP_OPTIONS.slice(0, 3).map(o => (
          <Checkbox
            key={o.value}
            label={o.label}
            checked={selected.includes(o.value)}
            onChange={() => {}}
          />
        ))}
      </CheckboxGroup>
    </div>
  );
}

export const Group: Story = {
  name: 'Group',
  render: () => <GroupDemo />,
};
