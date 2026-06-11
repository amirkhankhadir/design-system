import React, { useRef, useState, useId, useMemo } from 'react';
import {
  useFloating,
  useHover,
  useFocus,
  useInteractions,
  useTransitionStyles,
  FloatingArrow,
  FloatingPortal,
  arrow,
  flip,
  shift,
  offset,
  autoUpdate,
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/react';
import './Tooltip.css';

export type TooltipPlacement = Placement;

export interface TooltipProps {
  /** Main tooltip text */
  content: string;
  /** Optional bold title shown above the content */
  title?: string;
  /** Preferred placement — auto-flips when there's not enough space */
  placement?: TooltipPlacement;
  /** Delay before the tooltip opens, in ms (default: 400) */
  delay?: number;
  /** The element that triggers the tooltip. Must be a DOM element or a ref-forwarding component. */
  children: React.ReactElement;
}

export function Tooltip({
  content,
  title,
  placement = 'top',
  delay = 400,
  children,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);
  const tooltipId = useId();

  // Floating UI reads arrowRef.current only during positioning (layout effect),
  // not during render — safe to pass the ref object here.
  const middleware = useMemo(
    () => [
      offset(8),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }), // eslint-disable-line react-hooks/refs
    ],
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware,
  });

  const hover = useHover(context, { delay: { open: delay, close: 0 } });
  const focus = useFocus(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus]);

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 150,
    initial: { opacity: 0, transform: 'scale(0.96)' },
    open: { opacity: 1, transform: 'scale(1)' },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trigger = React.cloneElement(
    children as React.ReactElement<Record<string, any>>,
    getReferenceProps({
      ref: refs.setReference,
      'aria-describedby': open ? tooltipId : undefined,
    })
  );

  return (
    <>
      {trigger}
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            id={tooltipId}
            role="tooltip"
            className={`tooltip${title ? ' tooltip--has-title' : ''}`}
            style={{ ...floatingStyles, ...transitionStyles }}
            {...getFloatingProps()}
          >
            {title && <p className="tooltip__title">{title}</p>}
            <p className="tooltip__content">{content}</p>
            <FloatingArrow ref={arrowRef} context={context} className="tooltip__arrow" />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
