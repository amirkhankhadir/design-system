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
  /** Main tooltip text */
  content: string;
  /** Optional bold title shown above the content */
  title?: string;
  /** Placement relative to the trigger (default: top) */
  placement?: TooltipPlacement;
  /** Delay before opening, in ms (default: 400) */
  delay?: number;
  /** The element that triggers the tooltip */
  children: ReactElement;
}

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
