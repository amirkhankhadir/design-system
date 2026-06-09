# design-system

Universal design system — tokens, components, documentation.

---

## Tokens

Design tokens are organised in two layers following the [W3C Design Token Community Group](https://www.w3.org/community/design-tokens/) format.

```
tokens/
├── primitive/          # Raw, context-free values
│   ├── colors.json       – full colour palette (neutral, blue, green, red, yellow)
│   ├── spacing.json      – spacing scale (0 → 96, in px)
│   ├── typography.json   – font families, sizes, weights, line-heights, letter-spacings
│   └── radius-shadow.json– border-radius steps and box-shadow elevations
└── semantic/           # Role-mapped aliases that reference primitives
    ├── colors.json       – background, surface, border, text, action, feedback
    ├── typography.json   – display, heading, body, label, and code text styles
    └── spacing.json      – component padding/gap, layout gutter/section/container, inset, stack, inline
```

### Two-layer model

| Layer | Purpose | Example |
|-------|---------|---------|
| **Primitive** | Immutable raw values. No context. | `color.blue.600 → #2563EB` |
| **Semantic** | Named by role/intent, resolve to a primitive. | `color.action.primary.default → {color.blue.600}` |

Components consume **semantic** tokens. Only update a primitive token when the raw value changes; only update a semantic token when the role mapping changes.

### Token format

Each token follows the DTCG format:

```json
"tokenName": {
  "value": "...",
  "type": "color | spacing | fontSize | ..."
}
```

Semantic tokens reference primitives using the `{path.to.primitive}` syntax understood by [Style Dictionary](https://amzn.github.io/style-dictionary/) and compatible tooling.

---

## Contributing

1. Primitive changes go in `tokens/primitive/`.
2. Semantic mapping changes go in `tokens/semantic/`.
3. Never hard-code a raw value in a semantic token — always reference a primitive.
