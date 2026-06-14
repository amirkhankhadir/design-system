import { forwardRef, useRef, useEffect, useCallback } from 'react';
import './Checkbox.css';

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type' | 'size'
> {
  /**
   * Whether the checkbox is checked.
   * Omit for uncontrolled usage; provide for controlled.
   */
  checked?: boolean;
  /**
   * Third visual state — neither checked nor unchecked.
   * Use for "select all" when only some children are selected.
   * Takes visual priority over `checked`.
   */
  indeterminate?: boolean;
  /**
   * Marks the field as invalid. Renders a red border.
   * Show a descriptive error message nearby via your own UI.
   */
  error?: boolean;
  /**
   * Optional text label rendered to the right of the checkbox.
   * Omit for standalone usage — e.g. inside a table cell or checkbox card.
   */
  label?: string;
  /**
   * Called when the user toggles the checkbox.
   * Receives the new `checked` value and the native event.
   */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * A binary (or tri-state) selection control.
 *
 * **When to use:** selecting one or more independent options from a list,
 * or toggling a single setting on/off.
 *
 * **When NOT to use:**
 * - Mutually exclusive options → use Radio
 * - Immediate on/off action → use Toggle
 * - Multiple selections with visual cards → compose with CheckboxGroup and custom card wrappers
 *
 * **Accessibility:** built on a native `<input type="checkbox">` so keyboard focus,
 * Space activation, and `disabled` are handled automatically.
 * The `indeterminate` state sets `aria-checked="mixed"` for screen readers.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { checked, indeterminate = false, disabled, error, label, className, onChange, id, ...rest },
  forwardedRef
) {
  const localRef = useRef<HTMLInputElement>(null);

  // Merge local ref (needed for indeterminate) with forwarded ref
  const refCallback = useCallback(
    (node: HTMLInputElement | null) => {
      (localRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
    },
    [forwardedRef]
  );

  // indeterminate cannot be set via HTML attribute — must use DOM property
  useEffect(() => {
    if (localRef.current) localRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const labelClasses = [
    'checkbox',
    disabled && 'checkbox--disabled',
    error && 'checkbox--error',
    indeterminate && 'checkbox--indeterminate',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={labelClasses} htmlFor={id}>
      <input
        ref={refCallback}
        id={id}
        type="checkbox"
        className="checkbox__input"
        checked={checked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : checked}
        onChange={e => onChange?.(e.target.checked, e)}
        {...rest}
      />
      <span className="checkbox__box" aria-hidden="true">
        {(checked || indeterminate) && (
          <svg
            className="checkbox__icon"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {indeterminate ? (
              <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            ) : (
              <path
                d="M2 6L4.5 8.5L10 3"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        )}
      </span>
      {label && <span className="checkbox__label ds-text-medium-1">{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
