import { forwardRef } from 'react';
import { Loader } from '../Loader/Loader';
import { Icon } from '../Icon/Icon';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style */
  variant?: ButtonVariant;
  /** Height tier */
  size?: ButtonSize;
  /** Destructive/danger mode */
  danger?: boolean;
  /** Shows loader, disables interaction, preserves layout */
  loading?: boolean;
  /** Material Symbol name for left icon */
  iconLeft?: string;
  /** Material Symbol name for right icon */
  iconRight?: string;
}

const LOADER_SIZE: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 };

// Maps to valid LoaderColor values from our design system.
// All variants show disabled styling (background-muted = light gray) when loading,
// so 'inverse' (text-primary, dark) is visible on that background for all of them.
const LOADER_COLOR: Record<ButtonVariant, 'inverse' | 'brand'> = {
  primary: 'inverse', // dark on disabled gray — visible
  secondary: 'inverse', // dark on disabled gray — visible
  tertiary: 'inverse', // dark on disabled gray — visible
  link: 'brand', // brand-colored, matches link text
};

const ICON_SIZE: Record<ButtonSize, number> = { sm: 16, md: 20, lg: 20 };

/**
 * Extracts a plain-text label from children for use as aria-label during
 * loading state. Only handles string/number children — for complex children
 * consumers should pass aria-label explicitly.
 */
function extractTextLabel(children: React.ReactNode): string | undefined {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  return undefined;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      danger = false,
      loading = false,
      iconLeft,
      iconRight,
      disabled,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // danger doesn't change loader color — on-brand stays white on red bg,
    // inverse stays theme-adaptive on secondary/tertiary/link
    const loaderColor = LOADER_COLOR[variant];

    // Text style class from our design system
    const textClass = size === 'sm' ? 'ds-text-small-2' : 'ds-text-medium-2';

    // When loading, btn__content is aria-hidden so the button loses its accessible
    // name. Preserve it via aria-label. Consumers can override via their own
    // aria-label prop (spread via ...rest after this).
    const loadingLabel = loading ? extractTextLabel(children) : undefined;

    const classes = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      textClass,
      danger && 'btn--danger',
      loading && 'btn--loading',
      iconLeft && 'btn--has-icon-left',
      iconRight && 'btn--has-icon-right',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-label={loadingLabel}
        {...rest}
      >
        {/* Real content — hidden during loading to preserve width */}
        <span className="btn__content" aria-hidden={loading}>
          {iconLeft && (
            <Icon name={iconLeft} size={ICON_SIZE[size]} className="btn__icon" aria-hidden />
          )}
          {children && <span className="btn__label">{children}</span>}
          {iconRight && (
            <Icon name={iconRight} size={ICON_SIZE[size]} className="btn__icon" aria-hidden />
          )}
        </span>

        {/* Loader overlay — absolutely positioned, preserves button dimensions */}
        {loading && (
          <span className="btn__loader" aria-hidden="true">
            <Loader size={LOADER_SIZE[size]} color={loaderColor} />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
