import StyleDictionary from 'style-dictionary';

/**
 * Style Dictionary configuration
 * Transforms design tokens from tokens/ into platform-specific outputs:
 *   dist/web/     → CSS custom properties
 *   dist/ios/     → Swift constants (SwiftUI)
 *   dist/android/ → XML resources (Compose / View system)
 */

export default {
  source: ['tokens/*.json'],

  platforms: {
    // ─── Web ─────────────────────────────────────────────────────────
    web: {
      transformGroup: 'css',
      prefix: 'ds',
      buildPath: 'dist/web/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root',
          },
        },
        {
          destination: 'tokens.json',
          format: 'json/nested',
        },
      ],
    },

    // ─── iOS / SwiftUI ───────────────────────────────────────────────
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'dist/ios/',
      files: [
        {
          destination: 'DesignTokens.swift',
          format: 'ios-swift/class.swift',
          className: 'DesignTokens',
          filter: token =>
            ['color', 'spacing', 'radius', 'sizing', 'border'].includes(
              token.path[0]
            ),
        },
      ],
    },

    // ─── Android ─────────────────────────────────────────────────────
    android: {
      transformGroup: 'android',
      buildPath: 'dist/android/',
      files: [
        {
          destination: 'colors.xml',
          format: 'android/colors',
          filter: token => token.path[0] === 'color',
        },
        {
          destination: 'dimens.xml',
          format: 'android/dimens',
          filter: token =>
            ['spacing', 'radius', 'sizing', 'border', 'dimensions'].includes(
              token.path[0]
            ),
        },
      ],
    },
  },
};
