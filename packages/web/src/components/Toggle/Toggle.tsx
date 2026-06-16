import { forwardRef } from 'react';
import './Toggle.css';

export interface ToggleProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type' | 'size'
> {
  /**
   * Whether the toggle is on.
   * Omit for uncontrolled usage; provide for controlled.
   */
  checked?: boolean;
  /**
   * Optional text label rendered to the right of the track.
   * Omit for standalone usage — e.g. inside a settings row with its own layout.
   */
  label?: string;
  /**
   * Called when the user flips the toggle.
   * Receives the new `checked` value and the native event.
   */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * A switch for a single setting that takes effect immediately.
 *
 * **When to use:** toggling one independent on/off setting where the change
 * applies right away (e.g. "Wi-Fi", "Email notifications").
 *
 * **When NOT to use:**
 * - Selecting options that only apply after a form submit → use Checkbox
 * - Choosing one option from several → use Radio
 *
 * **Accessibility:** built on a native `<input type="checkbox">` with
 * `role="switch"`, so screen readers announce it as a switch and keyboard
 * focus + Space activation work automatically.
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { checked, disabled, label, className, onChange, id, ...rest },
  ref
) {
  const labelClasses = ['toggle', disabled && 'toggle--disabled', className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={labelClasses} htmlFor={id}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        role="switch"
        className="toggle__input"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange?.(e.target.checked, e)}
        {...rest}
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb ds-elevation-1" />
      </span>
      {label && <span className="toggle__label ds-text-medium-1">{label}</span>}
    </label>
  );
});

Toggle.displayName = 'Toggle';
