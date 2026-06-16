import { forwardRef, useContext } from 'react';
import './Radio.css';
import { RadioGroupContext } from './RadioGroup';

export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type' | 'size'
> {
  /**
   * Whether the radio is selected.
   * Omit for uncontrolled usage; provide for controlled.
   */
  checked?: boolean;
  /**
   * Marks the field as invalid. Renders a red border.
   * Show a descriptive error message nearby via your own UI.
   */
  error?: boolean;
  /**
   * Optional text label rendered to the right of the radio.
   * Omit for standalone usage — e.g. inside a table cell.
   */
  label?: string;
  /**
   * Called when the user selects the radio.
   * Receives the new `checked` value and the native event.
   */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * A single option in a mutually exclusive set.
 *
 * **When to use:** choosing exactly one option from 2–7 visible options.
 *
 * **When NOT to use:**
 * - Independent, non-exclusive options → use Checkbox
 * - More than ~7 options, or options hidden until interaction → use Select
 *
 * **Accessibility:** built on a native `<input type="radio">`. Give all radios
 * in the same set the same `name` — use `RadioGroup` to avoid repeating it —
 * so keyboard arrow keys move between them and screen readers announce the
 * group size and position.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { checked, disabled, error, label, className, onChange, id, name, ...rest },
  ref
) {
  const group = useContext(RadioGroupContext);
  const resolvedName = name ?? group?.name;
  const resolvedDisabled = disabled ?? group?.disabled;

  const labelClasses = [
    'radio',
    resolvedDisabled && 'radio--disabled',
    error && 'radio--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={labelClasses} htmlFor={id}>
      <input
        ref={ref}
        id={id}
        type="radio"
        className="radio__input"
        name={resolvedName}
        checked={checked}
        disabled={resolvedDisabled}
        onChange={e => onChange?.(e.target.checked, e)}
        {...rest}
      />
      <span className="radio__circle" aria-hidden="true">
        <span className="radio__dot" />
      </span>
      {label && <span className="radio__label ds-text-medium-1">{label}</span>}
    </label>
  );
});

Radio.displayName = 'Radio';
