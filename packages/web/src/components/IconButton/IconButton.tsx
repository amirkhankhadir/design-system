import { forwardRef } from 'react';
import { Loader } from '../Loader/Loader';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import type { TooltipPlacement } from '../Tooltip/Tooltip';
import './IconButton.css';

export type IconButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Material Symbol name, e.g. `"add"`, `"settings"`, `"delete"`. */
  icon: string;
  /**
   * Visual style — same hierarchy as `Button`.
   * - `primary` — high emphasis, use sparingly.
   * - `ghost` — no background, lowest visual weight. Most common for toolbars.
   */
  variant?: IconButtonVariant;
  /**
   * Size tier (square button).
   * - `sm` — 32px
   * - `md` — 40px (default)
   * - `lg` — 48px
   */
  size?: IconButtonSize;
  /** Destructive mode — turns the button red. Use for Delete / Remove actions. */
  danger?: boolean;
  /** Shows a spinner and disables interaction while preserving button dimensions. */
  loading?: boolean;
  /**
   * Accessible label announced by screen readers — **required**.
   * Describe the action, not the icon: `"Delete item"`, not `"Trash icon"`.
   */
  'aria-label': string;
  /**
   * Tooltip shown on hover, helping mouse users discover the button's purpose.
   * Recommended for all icon buttons. Does not replace `aria-label`.
   */
  tooltip?: string;
  /** Placement of the tooltip relative to the button (default: `top`). */
  tooltipPlacement?: TooltipPlacement;
}

const ICON_SIZE: Record<IconButtonSize, number> = { sm: 16, md: 20, lg: 24 };
const LOADER_SIZE: Record<IconButtonSize, number> = { sm: 14, md: 16, lg: 18 };

// Loading shows disabled bg (background-muted) → inverse (dark) is visible on it.
// link uses brand color to match its icon color.
const LOADER_COLOR: Record<IconButtonVariant, 'inverse' | 'brand'> = {
  primary: 'inverse',
  secondary: 'inverse',
  tertiary: 'inverse',
  link: 'brand',
  ghost: 'brand',
};

/**
 * An icon-only button. Same variants and states as `Button`, but renders
 * a single icon with no label visible on screen.
 *
 * **When to use:** toolbars, action menus, compact UIs where a label would
 * take too much space (e.g. edit, delete, settings in a table row).
 *
 * **When NOT to use:**
 * - If space allows, prefer `Button` with a label — it's more discoverable.
 * - Never omit `aria-label` — without it the button is inaccessible.
 *
 * **Accessibility:** `aria-label` is **required**. Add a `tooltip` prop so
 * mouse users can also discover the action on hover.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'primary',
      size = 'md',
      danger = false,
      loading = false,
      disabled,
      className,
      tooltip,
      tooltipPlacement = 'top',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const classes = [
      'icon-btn',
      `icon-btn--${variant}`,
      `icon-btn--${size}`,
      danger && 'icon-btn--danger',
      loading && 'icon-btn--loading',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const button = (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...rest}
      >
        <span className="icon-btn__content" aria-hidden={loading || undefined}>
          <Icon name={icon} size={ICON_SIZE[size]} aria-hidden />
        </span>

        {loading && (
          <span className="icon-btn__loader" aria-hidden="true">
            <Loader size={LOADER_SIZE[size]} color={LOADER_COLOR[variant]} />
          </span>
        )}
      </button>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip} placement={tooltipPlacement}>
          {button}
        </Tooltip>
      );
    }

    return button;
  }
);

IconButton.displayName = 'IconButton';
