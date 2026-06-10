/**
 * Design Token Build Script
 * Reads tokens/ JSON → generates platform outputs in dist/
 *
 * Outputs:
 *   dist/web/tokens.light.css   — CSS custom properties, light theme
 *   dist/web/tokens.dark.css    — CSS custom properties, dark theme
 *   dist/ios/DesignTokens.swift — Swift constants for SwiftUI
 *   dist/android/colors.xml     — Android color resources
 *   dist/android/dimens.xml     — Android dimension resources
 */

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// ─── Load token files ─────────────────────────────────────────────────────────

const primitives = JSON.parse(readFileSync('tokens/primitives.json', 'utf8'));
const semantics  = JSON.parse(readFileSync('tokens/semantics.json',  'utf8'));
const display    = JSON.parse(readFileSync('tokens/display.json',    'utf8'));
const typography = JSON.parse(readFileSync('tokens/typography.json', 'utf8'));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Flatten nested object to dot-path entries: { 'color.base.white': '#fff' } */
function flatten(obj, prefix = '') {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue; // skip metadata
    const path = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === 'object' && !Array.isArray(val) &&
        !('Light' in val) && !('Dark' in val) && !('Value' in val) &&
        !('$alias' in val)) {
      Object.assign(result, flatten(val, path));
    } else {
      result[path] = val;
    }
  }
  return result;
}

/** Extract value for a given mode from a token value */
function modeValue(val, mode) {
  if (val === null || val === undefined) return val;
  if (typeof val === 'object' && mode in val) return val[mode];
  if (typeof val === 'object' && 'Value' in val) return val['Value'];
  if (typeof val === 'object' && '$alias' in val) return val['$value'] ?? val['$alias'];
  return val;
}

/** CSS variable name from dot-path */
function cssVar(path) {
  return '--ds-' + path.replace(/\./g, '-');
}

/** Resolve a primitive alias like "{color.base.white}" to its hex value */
const primFlat = flatten(primitives);
function resolvePrim(val) {
  if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
    const key = val.slice(1, -1);
    return primFlat[key] ?? val;
  }
  return val;
}

// ─── Build CSS ────────────────────────────────────────────────────────────────

function buildCSS(mode) {
  const lines = [];

  // display tokens (mode-independent)
  const dispFlat = flatten(display);
  for (const [path, val] of Object.entries(dispFlat)) {
    const v = modeValue(val, 'Value');
    const resolved = resolvePrim(v);
    const unit = (path.startsWith('spacing') || path.startsWith('radius') ||
                  path.startsWith('border') || path.startsWith('sizing') ||
                  path.startsWith('dimensions')) && typeof resolved === 'number'
      ? `${resolved}px` : resolved;
    lines.push(`  ${cssVar(path)}: ${unit};`);
  }

  lines.push('');

  // typography tokens
  const typoVars = typography.variables ?? {};
  const typoFlat = flatten(typoVars);
  for (const [path, val] of Object.entries(typoFlat)) {
    let unit;
    if (path.startsWith('font-size') || path.startsWith('line-height')) {
      unit = `${val}px`;
    } else if (path.startsWith('font-family') && typeof val === 'string' && val.includes(' ')) {
      unit = `"${val}"`;  // quote multi-word font names
    } else {
      unit = val;
    }
    lines.push(`  ${cssVar(path)}: ${unit};`);
  }

  lines.push('');

  // semantic color tokens for this mode
  const semFlat = flatten(semantics.color ?? {});
  for (const [path, val] of Object.entries(semFlat)) {
    const v = modeValue(val, mode);
    const resolved = resolvePrim(v);
    lines.push(`  ${cssVar('color.' + path)}: ${resolved};`);
  }

  const selector = mode === 'Light' ? ':root' : '[data-theme="dark"]';
  return `/* Auto-generated — do not edit. Source: tokens/ */\n\n${selector} {\n${lines.join('\n')}\n}\n`;
}

// ─── Build text-style CSS classes ─────────────────────────────────────────────

const WEIGHT_MAP = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 };

function buildTextStyleCSS() {
  const lines = ['\n/* ── Text styles ────────────────────────────────────────────────── */'];
  const styles = typography['text-styles'] ?? {};

  for (const [category, sizes] of Object.entries(styles)) {
    for (const [size, variants] of Object.entries(sizes)) {
      for (const [variant, def] of Object.entries(variants)) {
        const className = `.ds-${category}-${size}-${variant}`;
        lines.push(`${className} {`);
        lines.push(`  font-family: var(--ds-font-family-primary, sans-serif);`);
        lines.push(`  font-size: ${def.size}px;`);
        lines.push(`  line-height: ${def.lineHeight}px;`);
        lines.push(`  font-weight: ${WEIGHT_MAP[def.weight] ?? 400};`);
        lines.push(`}`);
      }
    }
  }

  return lines.join('\n') + '\n';
}

// ─── Build elevation CSS classes ──────────────────────────────────────────────

function buildElevationCSS() {
  const lines = ['\n/* ── Elevation ──────────────────────────────────────────────────── */'];
  const elevations = typography['effect-styles']?.elevation ?? {};

  // Shadow colors live in semantics → resolve via primitives
  const semFlat = flatten(semantics.color ?? {});
  function resolveSem(alias) {
    const key = alias.slice(1, -1).replace(/^color\./, '');
    const semVal = semFlat[key];
    if (!semVal) return alias;
    const lightVal = typeof semVal === 'object' && 'Light' in semVal ? semVal['Light'] : semVal;
    return resolvePrim(lightVal);
  }

  const colorMap = {
    '{color.shadow.sm}': resolveSem('{color.shadow.sm}'),
    '{color.shadow.md}': resolveSem('{color.shadow.md}'),
    '{color.shadow.lg}': resolveSem('{color.shadow.lg}'),
  };

  for (const [level, shadows] of Object.entries(elevations)) {
    const className = `.ds-elevation-${level}`;
    if (!Array.isArray(shadows) || shadows.length === 0) {
      lines.push(`${className} { box-shadow: none; }`);
    } else {
      const boxShadow = shadows.map(s => {
        const color = colorMap[s.boundColor] ?? 'rgba(0,0,0,0.1)';
        return `${s.offset.x}px ${s.offset.y}px ${s.radius}px ${s.spread}px ${color}`;
      }).join(', ');
      lines.push(`${className} { box-shadow: ${boxShadow}; }`);
    }
  }

  return lines.join('\n') + '\n';
}

// ─── Build Swift ──────────────────────────────────────────────────────────────

function buildSwift() {
  const lines = [
    '// Auto-generated — do not edit. Source: tokens/',
    'import SwiftUI',
    '',
    'public enum DesignTokens {',
    '',
  ];

  // Colors
  lines.push('  public enum Color {');
  const semFlat = flatten(semantics.color ?? {});
  for (const [path, val] of Object.entries(semFlat)) {
    const light = resolvePrim(modeValue(val, 'Light'));
    const dark  = resolvePrim(modeValue(val, 'Dark'));
    const name  = path.split('.').map((s, i) =>
      i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)
    ).join('').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    lines.push(`    public static let ${name} = UIColor { t in`);
    lines.push(`      t.userInterfaceStyle == .dark ? UIColor(hex: "${dark}") : UIColor(hex: "${light}")`);
    lines.push('    }');
  }
  lines.push('  }', '');

  // Spacing
  lines.push('  public enum Spacing {');
  const dispFlat = flatten(display);
  for (const [path, val] of Object.entries(dispFlat)) {
    if (!path.startsWith('spacing')) continue;
    const v = resolvePrim(modeValue(val, 'Value'));
    const name = 'spacing' + path.split('.').slice(1).map(s =>
      s.charAt(0).toUpperCase() + s.slice(1)
    ).join('');
    lines.push(`    public static let ${name}: CGFloat = ${v}`);
  }
  lines.push('  }', '');

  // Radius
  lines.push('  public enum Radius {');
  for (const [path, val] of Object.entries(dispFlat)) {
    if (!path.startsWith('radius')) continue;
    const v = resolvePrim(modeValue(val, 'Value'));
    const name = 'radius' + path.split('.').slice(1).map(s =>
      s.charAt(0).toUpperCase() + s.slice(1)
    ).join('');
    lines.push(`    public static let ${name}: CGFloat = ${v}`);
  }
  lines.push('  }');

  lines.push('}');
  return lines.join('\n') + '\n';
}

// ─── Build Android XML ────────────────────────────────────────────────────────

function buildAndroidColors() {
  const lines = ['<?xml version="1.0" encoding="utf-8"?>', '<!-- Auto-generated — do not edit -->', '<resources>'];
  const semFlat = flatten(semantics.color ?? {});
  for (const [path, val] of Object.entries(semFlat)) {
    const light = resolvePrim(modeValue(val, 'Light'));
    const name  = 'ds_' + path.replace(/\./g, '_').replace(/-/g, '_');
    if (light && light.startsWith('#')) {
      lines.push(`  <color name="${name}">${light}</color>`);
    }
  }
  lines.push('</resources>');
  return lines.join('\n') + '\n';
}

function buildAndroidDimens() {
  const lines = ['<?xml version="1.0" encoding="utf-8"?>', '<!-- Auto-generated — do not edit -->', '<resources>'];
  const dispFlat = flatten(display);
  for (const [path, val] of Object.entries(dispFlat)) {
    const v = resolvePrim(modeValue(val, 'Value'));
    const name = 'ds_' + path.replace(/\./g, '_').replace(/-/g, '_');
    if (typeof v === 'number') {
      lines.push(`  <dimen name="${name}">${v}dp</dimen>`);
    }
  }
  lines.push('</resources>');
  return lines.join('\n') + '\n';
}

// ─── Write files ──────────────────────────────────────────────────────────────

mkdirSync('dist/web',     { recursive: true });
mkdirSync('dist/ios',     { recursive: true });
mkdirSync('dist/android', { recursive: true });

const textStyleCSS = buildTextStyleCSS();
const elevationCSS = buildElevationCSS();

writeFileSync('dist/web/tokens.light.css',     buildCSS('Light') + textStyleCSS + elevationCSS);
writeFileSync('dist/web/tokens.dark.css',      buildCSS('Dark')  + textStyleCSS + elevationCSS);
writeFileSync('dist/ios/DesignTokens.swift',   buildSwift());
writeFileSync('dist/android/colors.xml',       buildAndroidColors());
writeFileSync('dist/android/dimens.xml',       buildAndroidDimens());

console.log('✓ dist/web/tokens.light.css');
console.log('✓ dist/web/tokens.dark.css');
console.log('✓ dist/ios/DesignTokens.swift');
console.log('✓ dist/android/colors.xml');
console.log('✓ dist/android/dimens.xml');
