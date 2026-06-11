import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import type { TooltipPlacement } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A non-interactive label appearing on hover or keyboard focus. Use for supplementary context — truncated text, icon button labels, keyboard shortcuts. **Do not use** for critical information the user must act on, or for rich/interactive content (use a Popover instead).',
      },
    },
  },
  decorators: [
    Story => (
      <div style={{ padding: '72px 80px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
    delay: { control: { type: 'number', min: 0, max: 2000, step: 50 } },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// ── Default ──────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    placement: 'top',
  },
  render: args => (
    <Tooltip {...args}>
      <Button variant="secondary">Hover me</Button>
    </Tooltip>
  ),
};

// ── With Title ───────────────────────────────────────────────────
export const WithTitle: Story = {
  args: {
    title: 'Tooltip title',
    content: 'Additional details or explanation about this action.',
    placement: 'top',
  },
  render: args => (
    <Tooltip {...args}>
      <Button variant="secondary">With title</Button>
    </Tooltip>
  ),
};

// ── Long Content ─────────────────────────────────────────────────
export const LongContent: Story = {
  args: {
    content: 'This is a longer tooltip text that wraps across multiple lines. Max width is 240px.',
    placement: 'top',
  },
  render: args => (
    <Tooltip {...args}>
      <Button variant="secondary">Long text</Button>
    </Tooltip>
  ),
};

// ── All Placements ───────────────────────────────────────────────
type PlacementGrid = TooltipPlacement | null;

const TOP_ROW: PlacementGrid[] = [null, 'top-start', 'top', 'top-end', null];
const MIDDLE_TOP: PlacementGrid[] = ['left-start', null, null, null, 'right-start'];
const MIDDLE: PlacementGrid[] = ['left', null, null, null, 'right'];
const MIDDLE_BOT: PlacementGrid[] = ['left-end', null, null, null, 'right-end'];
const BOT_ROW: PlacementGrid[] = [null, 'bottom-start', 'bottom', 'bottom-end', null];

const GRID: PlacementGrid[][] = [TOP_ROW, MIDDLE_TOP, MIDDLE, MIDDLE_BOT, BOT_ROW];

export const Placements: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 100px)',
        gridTemplateRows: 'repeat(5, 48px)',
        gap: 8,
        alignItems: 'center',
        justifyItems: 'center',
        padding: 48,
      }}
    >
      {GRID.flat().map((placement, i) =>
        placement ? (
          <Tooltip key={placement} content={placement} placement={placement} delay={0}>
            <Button variant="secondary" size="sm">
              {placement}
            </Button>
          </Tooltip>
        ) : (
          <div key={i} />
        )
      )}
    </div>
  ),
};

// ── On Icon Button ───────────────────────────────────────────────
export const OnIconButton: Story = {
  render: () => (
    <Tooltip content="Add item" placement="bottom">
      <IconButton variant="primary" icon="add" aria-label="Add item" />
    </Tooltip>
  ),
};
