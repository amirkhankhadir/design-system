import './Loader.css';

export type LoaderSize  = 'sm' | 'md' | 'lg';
export type LoaderColor = 'brand' | 'white' | 'current';

export interface LoaderProps {
  /** Visual size of the spinner */
  size?: LoaderSize;
  /** Color variant */
  color?: LoaderColor;
  /** Accessible label — announced by screen readers */
  label?: string;
  className?: string;
}

const VIEWBOX: Record<LoaderSize, { size: number; r: number; cx: number; cy: number }> = {
  sm: { size: 16, r: 6,  cx: 8,  cy: 8  },
  md: { size: 20, r: 8,  cx: 10, cy: 10 },
  lg: { size: 24, r: 10, cx: 12, cy: 12 },
};

export function Loader({
  size  = 'md',
  color = 'brand',
  label = 'Loading…',
  className,
}: LoaderProps) {
  const { size: px, r, cx, cy } = VIEWBOX[size];

  return (
    <span
      className={[
        'loader',
        `loader--${size}`,
        `loader--${color}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-label={label}
    >
      <svg
        className="loader__svg"
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        fill="none"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle className="loader__track" cx={cx} cy={cy} r={r} />
        {/* Animated arc */}
        <circle className="loader__fill"  cx={cx} cy={cy} r={r} />
      </svg>
    </span>
  );
}
