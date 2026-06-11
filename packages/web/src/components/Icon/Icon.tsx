import { useState, useEffect } from 'react';
import './Icon.css';

export type IconVariant = 'outlined' | 'rounded';
export type IconColor =
  | 'default'
  | 'secondary'
  | 'disabled'
  | 'inverse'
  | 'on-brand'
  | 'static-white'
  | 'static-black'
  | 'brand';

export interface IconProps {
  /**
   * Icon name from the Material Symbols library.
   * Use snake_case as listed on [fonts.google.com/icons](https://fonts.google.com/icons),
   * e.g. `"home"`, `"arrow_back"`, `"check_circle"`.
   */
  name: string;
  /** Shape style. `outlined` (default) for standard UI; `rounded` for softer aesthetics. */
  variant?: IconVariant;
  /** Filled variant of the icon — higher visual weight, useful for active/selected states. */
  filled?: boolean;
  /** Size in px. Default is `24`. Common values: `16`, `20`, `24`, `32`. */
  size?: number;
  /**
   * Color — maps to `ds-color-icon-*` tokens.
   * - `default` — primary icon color, use in most cases.
   * - `secondary` — lower emphasis.
   * - `disabled` — non-interactive state.
   * - `inverse` — on dark backgrounds.
   * - `on-brand` — on brand-colored backgrounds.
   * - `brand` — brand accent color.
   * - `static-white` / `static-black` — fixed color regardless of theme.
   */
  color?: IconColor;
  className?: string;
  /**
   * Accessible label. Provide when the icon conveys meaning not available
   * from surrounding context (e.g. standalone icon buttons, status icons).
   * Omit and set `aria-hidden` when the icon is purely decorative.
   */
  'aria-label'?: string;
  /** Hides the icon from assistive technologies. Set to `true` for decorative icons. */
  'aria-hidden'?: boolean;
}

const FALLBACK_SVG = `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

// Module-level SVG cache — persists across renders
const svgCache = new Map<string, string>();

function buildKey(name: string, variant: IconVariant, filled: boolean) {
  return `${variant}/${name}${filled ? '-fill' : ''}`;
}

function injectCurrentColor(raw: string): string {
  return raw.replace('<svg ', '<svg fill="currentColor" ');
}

async function loadSvg(name: string, variant: IconVariant, filled: boolean): Promise<string> {
  const key = buildKey(name, variant, filled);
  if (svgCache.has(key)) return svgCache.get(key)!;

  const suffix = filled ? '-fill' : '';
  try {
    // Dev server middleware at /__icons/ served by materialIconsPlugin in vite.config.ts
    const res = await fetch(`/__icons/${variant}/${name}${suffix}.svg`);
    if (!res.ok) throw new Error(`${res.status}`);
    const text = await res.text();
    const svg = injectCurrentColor(text);
    svgCache.set(key, svg);
    return svg;
  } catch {
    svgCache.set(key, FALLBACK_SVG);
    return FALLBACK_SVG;
  }
}

/**
 * Renders a single icon from the Material Symbols library.
 * Icons are loaded as inline SVG from a local cache served by the Vite dev plugin.
 *
 * **When to use:** anywhere a visual symbol helps communicate meaning — navigation,
 * actions, status indicators, labels.
 *
 * **When NOT to use:** as the only label on an interactive element without
 * `aria-label` — use `IconButton` instead, which enforces `aria-label`.
 *
 * **Accessibility:**
 * - Decorative icons (next to visible text): `aria-hidden` is `true` by default.
 * - Meaningful standalone icons: pass `aria-label` describing what the icon represents.
 */
export function Icon({
  name,
  variant = 'outlined',
  filled = false,
  size = 24,
  color = 'default',
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const [svg, setSvg] = useState<string>(() => {
    // Return from cache synchronously if available
    const key = buildKey(name, variant, filled);
    return svgCache.get(key) ?? '';
  });

  useEffect(() => {
    let cancelled = false;
    loadSvg(name, variant, filled).then(result => {
      if (!cancelled) setSvg(result);
    });
    return () => {
      cancelled = true;
    };
  }, [name, variant, filled]);

  return (
    <span
      className={['icon', `icon--${color}`, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size, fontSize: size }}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
