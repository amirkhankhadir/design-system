import { useState, useId, useRef, useCallback, type ReactElement } from 'react';
import './Tooltip.css';

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface TooltipProps {
  /** Main tooltip text — keep it short (1–2 sentences max). */
  content: string;
  /**
   * Optional bold title shown above the content.
   * Use when the tooltip needs a heading, e.g. keyboard shortcut name + description.
   */
  title?: string;
  /**
   * Position of the tooltip relative to its trigger element.
   * Includes center (`top`, `bottom`, `left`, `right`) and
   * edge-aligned variants (`top-start`, `top-end`, etc.) — 12 options total.
   * Default: `top`.
   */
  placement?: TooltipPlacement;
  /**
   * Delay in milliseconds before the tooltip opens after hover/focus.
   * A short delay (default `400ms`) prevents accidental triggers while
   * moving the cursor across the page.
   */
  delay?: number;
  /** The element that triggers the tooltip on hover/focus. Must be a single React element. */
  children: ReactElement;
}

/**
 * A non-interactive label that appears on hover or keyboard focus, providing
 * supplementary context for an element.
 *
 * **When to use:**
 * - Clarifying an icon button's purpose (prefer the `tooltip` prop on `IconButton`).
 * - Showing a full value that is truncated in the UI.
 * - Providing a keyboard shortcut hint.
 *
 * **When NOT to use:**
 * - Critical information the user must read to proceed → always visible text.
 * - Rich content with links or interactive elements → use a Popover.
 * - Error messages → use inline validation feedback.
 *
 * **Accessibility:** uses `role="tooltip"` and links to the trigger via
 * `aria-describedby`. Triggered by both mouse hover and keyboard focus.
 * The tooltip content is supplementary — do not put essential information here only.
 */
export function Tooltip({
  content,
  title,
  placement = 'top',
  delay = 400,
  children,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const tooltipId = useId();

  const show = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setOpen(false);
  }, []);

  return (
    <span
      className="tooltip-trigger"
      aria-describedby={open ? tooltipId : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`tooltip tooltip--${placement} ds-elevation-2${title ? ' tooltip--has-title' : ''}`}
        >
          {title && <p className="tooltip__title ds-text-small-2">{title}</p>}
          <p className="tooltip__content ds-text-small-1">{content}</p>
        </div>
      )}
    </span>
  );
}
