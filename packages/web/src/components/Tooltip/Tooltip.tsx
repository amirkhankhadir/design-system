import { useRef, useState, useId, useMemo, type ReactElement } from 'react';
import {
  useFloating,
  useHover,
  useFocus,
  useInteractions,
  useTransitionStyles,
  FloatingArrow,
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
  /** The element that triggers the tooltip */
  children: ReactElement;
}

// FloatingArrow is ~7px tall. Offset = arrowHeight + visual gap.
const ARROW_HEIGHT = 7;
const GAP = 4;

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

  const middleware = useMemo(
    () => [
      offset(ARROW_HEIGHT + GAP),
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
    // strategy:'absolute' + position:relative on the wrapper span means
    // Floating UI positions the tooltip relative to the wrapper itself —
    // no viewport/scroll/iframe coordinate issues.
    strategy: 'absolute',
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

  return (
    // position:relative makes this span the offset-parent for the absolute tooltip.
    // display:inline-block makes it hug the trigger tightly — no extra space.
    <span
      ref={refs.setReference} // eslint-disable-line react-hooks/refs
      style={{ position: 'relative', display: 'inline-block' }}
      aria-describedby={open ? tooltipId : undefined}
      {...getReferenceProps()}
    >
      {children}
      {isMounted && (
        <div
          ref={refs.setFloating} // eslint-disable-line react-hooks/refs
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
      )}
    </span>
  );
}
