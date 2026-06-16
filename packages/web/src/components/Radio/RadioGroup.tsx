import { createContext } from 'react';
import './Radio.css';

export interface RadioGroupContextValue {
  name: string;
  disabled?: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  /**
   * Shared `name` passed to every child `Radio` — required for native
   * keyboard grouping (arrow keys move between radios with the same name).
   */
  name: string;
  /**
   * Group label rendered as a `<legend>` above the radios.
   * Screen readers announce this as the group name.
   */
  label?: string;
  /**
   * Layout direction of the radios.
   * - `vertical` — stacked column (default, recommended for 3+ options).
   * - `horizontal` — side by side, wraps at narrow widths.
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Disables all child radios via the native `<fieldset disabled>` attribute
   * and applies muted styling to each one.
   */
  disabled?: boolean;
  children: React.ReactNode;
}

/**
 * Layout wrapper for a mutually exclusive set of `Radio` components.
 *
 * Uses a native `<fieldset>` + `<legend>` for correct screen reader grouping,
 * and supplies `name` (and `disabled`) to children via context so they don't
 * need to be repeated on every `Radio`. Selection state is still managed by
 * the consumer — `RadioGroup` only manages layout, labelling, and grouping.
 *
 * **When to use:** presenting 2–7 mutually exclusive options. For independent,
 * non-exclusive options, use `CheckboxGroup`.
 */
export function RadioGroup({
  name,
  label,
  orientation = 'vertical',
  disabled,
  children,
}: RadioGroupProps) {
  return (
    <fieldset className={`radio-group radio-group--${orientation}`} disabled={disabled}>
      {label && <legend className="radio-group__label ds-text-small-2">{label}</legend>}
      <RadioGroupContext.Provider value={{ name, disabled }}>
        <div className="radio-group__items">{children}</div>
      </RadioGroupContext.Provider>
    </fieldset>
  );
}

RadioGroup.displayName = 'RadioGroup';
