import { forwardRef } from 'react';
import { Loader } from '../Loader/Loader';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import type { TooltipPlacement } from '../Tooltip/Tooltip';
import './IconButton.css';

export type IconButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Material Symbol name — required */
  icon: string;
  /** Visual style */
  variant?: IconButtonVariant;
  /** Size tier */
  size?: IconButtonSize;
  /** Destructive/danger mode */
  danger?: boolean;
  /** Shows loader, disables interaction, preserves layout */
  loading?: boolean;
  /** Accessible label — required for screen readers */
  'aria-label': string;
  /**
   * Tooltip text shown on hover. Recommended for all icon buttons so mouse
   * users can discover what the button does. Does not replace aria-label —
   * aria-label is still required for screen readers.
   */
  tooltip?: string;
  /** Tooltip placement (default: top) */
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
