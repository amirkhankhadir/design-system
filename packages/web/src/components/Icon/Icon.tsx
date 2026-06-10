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
  /** Icon name from Material Symbols, e.g. "home", "arrow_back" */
  name: string;
  /** Outlined or rounded style */
  variant?: IconVariant;
  /** Filled version of the icon */
  filled?: boolean;
  /** Size in px (default 24) */
  size?: number;
  /** Color — maps to ds-color-icon-* tokens */
  color?: IconColor;
  className?: string;
  'aria-label'?: string;
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
    // Virtual module resolved by materialIconsPlugin in vite.config.ts
    const mod = await import(/* @vite-ignore */ `virtual:icon/${variant}/${name}${suffix}`);
    if (!mod.default) throw new Error('not found');
    const svg = injectCurrentColor(mod.default as string);
    svgCache.set(key, svg);
    return svg;
  } catch {
    svgCache.set(key, FALLBACK_SVG);
    return FALLBACK_SVG;
  }
}

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
    return () => { cancelled = true; };
  }, [name, variant, filled]);

  return (
    <span
      className={[
        'icon',
        `icon--${color}`,
        className,
      ].filter(Boolean).join(' ')}
      style={{ width: size, height: size, fontSize: size }}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
