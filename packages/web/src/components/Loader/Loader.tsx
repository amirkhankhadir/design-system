import './Loader.css';

export type LoaderSize  = 'sm' | 'md' | 'lg' | number;
export type LoaderColor = 'brand' | 'white' | 'current';

export interface LoaderProps {
  /** Predefined size or explicit px value, e.g. size={32} */
  size?: LoaderSize;
  /** Color variant */
  color?: LoaderColor;
  /** Accessible label — announced by screen readers */
  label?: string;
  className?: string;
}

const PRESET_SIZES: Record<string, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const STROKE_WIDTH = 2;

function getGeometry(size: LoaderSize) {
  const px     = typeof size === 'number' ? size : PRESET_SIZES[size];
  const cx     = px / 2;
  const cy     = px / 2;
  // radius leaves room for stroke so it doesn't clip
  const r      = (px - STROKE_WIDTH * 2) / 2;
  // arc covers 75% of the circumference
  const circum = 2 * Math.PI * r;
  const dash   = circum * 0.75;
  const gap    = circum * 0.25;

  return { px, cx, cy, r, dash, gap };
}

export function Loader({
  size  = 'md',
  color = 'brand',
  label = 'Loading…',
  className,
}: LoaderProps) {
  const { px, cx, cy, r, dash, gap } = getGeometry(size);
  const isPreset = typeof size === 'string';

  return (
    <span
      className={[
        'loader',
        isPreset && `loader--${size}`,
        `loader--${color}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={!isPreset ? { width: px, height: px } : undefined}
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
        <circle
          className="loader__track"
          cx={cx}
          cy={cy}
          r={r}
          strokeWidth={STROKE_WIDTH}
        />
        {/* Animated arc — dasharray calculated from actual radius */}
        <circle
          className="loader__fill"
          cx={cx}
          cy={cy}
          r={r}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${dash} ${gap}`}
        />
      </svg>
    </span>
  );
}
