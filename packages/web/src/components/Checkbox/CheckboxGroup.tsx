import './Checkbox.css';

export interface CheckboxGroupProps {
  /**
   * Group label rendered as a `<legend>` above the checkboxes.
   * Screen readers announce this as the group name.
   */
  label?: string;
  /**
   * Layout direction of the checkboxes.
   * - `vertical` — stacked column (default, recommended for 3+ options).
   * - `horizontal` — side by side, wraps at narrow widths.
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Disables all child checkboxes via the native `<fieldset disabled>` attribute.
   * Individual checkboxes may also be disabled independently.
   */
  disabled?: boolean;
  children: React.ReactNode;
}

/**
 * Layout wrapper for a related group of `Checkbox` components.
 *
 * Uses a native `<fieldset>` + `<legend>` for correct screen reader grouping.
 * Value coordination is handled by the consumer — CheckboxGroup only manages
 * layout and labelling.
 *
 * **When to use:** presenting 2–7 non-exclusive options. For a single toggle
 * or binary setting, use `Checkbox` directly.
 */
export function CheckboxGroup({
  label,
  orientation = 'vertical',
  disabled,
  children,
}: CheckboxGroupProps) {
  return (
    <fieldset className={`checkbox-group checkbox-group--${orientation}`} disabled={disabled}>
      {label && <legend className="checkbox-group__label ds-text-small-2">{label}</legend>}
      <div className="checkbox-group__items">{children}</div>
    </fieldset>
  );
}

CheckboxGroup.displayName = 'CheckboxGroup';
