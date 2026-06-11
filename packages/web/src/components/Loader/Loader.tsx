import './Loader.css';

export type LoaderSize = 'sm' | 'md' | 'lg' | number;
export type LoaderColor = 'brand' | 'inverse' | 'on-brand' | 'static-white' | 'static-black';

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

// Stroke scales proportionally: ~1/10 of diameter, clamped 1.5–8px
function getStrokeWidth(px: number) {
  return Math.min(6, Math.max(1.5, px / 14));
}

function getGeometry(size: LoaderSize) {
  const px = typeof size === 'number' ? size : PRESET_SIZES[size];
  const strokeWidth = getStrokeWidth(px);
  const cx = px / 2;
  const cy = px / 2;
  const r = (px - strokeWidth * 2) / 2;
  const circum = 2 * Math.PI * r;
  const dash = circum * 0.75;
  const gap = circum * 0.25;

  return { px, cx, cy, r, strokeWidth, dash, gap };
}

export function Loader({
  size = 'md',
  color = 'brand',
  label = 'Loading…',
  className,
}: LoaderProps) {
  const { px, cx, cy, r, strokeWidth, dash, gap } = getGeometry(size);
  const isPreset = typeof size === 'string';

  return (
    <span
      className={['loader', isPreset && `loader--${size}`, `loader--${color}`, className]
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
        <circle className="loader__track" cx={cx} cy={cy} r={r} strokeWidth={strokeWidth} />
        {/* Animated arc — dasharray calculated from actual radius */}
        <circle
          className="loader__fill"
          cx={cx}
          cy={cy}
          r={r}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${gap}`}
        />
      </svg>
    </span>
  );
}
