# Backlog

Items agreed but not yet started. Add new items here, mark done with ✅.

---

## ✅ A — Contrast token fixes (done)

Apply the following semantic token changes (all values from existing primitives).
Visual before/after reference: `contrast-audit.html` at repo root.

| Semantic token | Current primitive | New primitive | Contrast change |
|---|---|---|---|
| `brand-default`, `brand-text` | `primary/40` (#039be6) | `primary/20` (#007bbd) | 3.07 → 4.60 ✅ |
| `text-tertiary` | `neutral/40` (#8b8b8b) | `neutral/30` (#737373) | 3.41 → 4.74 ✅ |
| `success-default`, `success-border` | `success/30` (#2db77b) | `success/20` (#1e9863) | 2.57 → 3.67 ✅ |
| `warning-default`, `warning-border` | `warning/50` (#ffa530) | `warning/30` (#c8760b) | 1.97 → 3.47 ✅ |

**Scope per fix — touch all three layers:**
1. Figma: update `brand-theme-semantics` variable values (Light + Dark modes)
2. Token source files: update semantic → primitive mappings
3. `npm run build` → regenerates `dist/web/tokens.light.css` + `tokens.dark.css`
4. Verify Storybook Colors story renders correctly

---

## ✅ B — Accessibility / Contrast documentation page in Storybook (done)

Create `Accessibility.stories.tsx` under `title: 'Foundations'`.

Content:
- Intro: WCAG 2.1 AA requirements (4.5:1 text, 3:1 UI)
- Contrast matrix table: all semantic token pairs with ratios and pass/fail
- Live swatches (same style as Colors story)
- Note on disabled-state exemption

Replaces `contrast-audit.html` as the canonical reference. Remove `contrast-audit.html` when done.

---

## ✅ E — Checkbox/Radio: top-align вместо center при многострочном лейбле (done)

Сейчас `.checkbox` и `.radio` используют `align-items: center` — при переносе лейбла на несколько строк box визуально "плавает" по центру блока текста, теряя связь с первой строкой. В списке чекбоксов с разной длиной текста это создаёт скачущее выравнивание между строками.

**Решение:** `align-items: flex-start` вместо `center`. Для однострочных лейблов (основной случай использования) визуально ничего не меняется — риск регрессии минимален.

**Scope — везде, где используется этот паттерн:**
1. `packages/web/src/components/Checkbox/Checkbox.css` — `.checkbox`
2. `packages/web/src/components/Radio/Radio.css` — `.radio`
3. Figma-компонент `checkbox` (страница `checkbox`) — пересобрать выравнивание в каждом из 15 вариантов
4. Figma-компонент `radio` — когда будет создан (см. пункт D)
5. Storybook: добавить multi-line label кейс в `AllStates`/стори, чтобы регрессия была видна сразу

**Обнаружено:** при ревью документации Checkbox в Figma (длинный лейбл "Don't write long labels" пример).

---

## ✅ F — Radio в Figma (done)

Компонент `radio` (`567:133`), 10 вариантов (`checked: unchecked/checked` × `state`), top-align с самого начала (box-wrapper paddingTop spacing/2), props `show-label`/`label` в правильном порядке. Структурный аудит — 0 проблем. Документация `DOCUMENTATION — Radio` (`572:133`, 8 секций, +Grouping) финализирована.

Сделать компонент `radio` в Figma по аналогии с Checkbox (которая уже готова — см. пункт D). При сборке сразу применить `align-items: flex-start` (top-align) на корневом auto-layout — не наследовать center, как было изначально в Checkbox (см. пункт E).

---

## G — Toggle компонент + секция «Checkbox vs Toggle» в документации

Пользователь просил добавить в документацию Checkbox раздел «когда Checkbox, а когда Toggle». Отложено, потому что компонента Toggle ещё нет (ни в коде, ни в Figma), а правило документации требует реального визуального примера в каждой секции — заглушку ставить нельзя.

**Scope:**
1. Создать компонент `Toggle` в коде (`packages/web/src/components/Toggle/`) — switch-control для мгновенного вкл/выкл, по аналогии с Checkbox/Radio.
2. Создать `Toggle` в Figma.
3. Вернуться к `DOCUMENTATION — Checkbox` (`520:148`) и добавить секцию «Checkbox vs Toggle» с реальными инстансами обоих компонентов: Checkbox = отложенный выбор (применяется при submit формы), Toggle = немедленное действие (применяется сразу).

**Обнаружено:** при создании документации Checkbox в Figma (эта сессия).

---

## ✅ D — Checkbox в Figma (done)

Компонент `checkbox` (`500:133`), 15 вариантов (`checked` × `state`), + документация `DOCUMENTATION — Checkbox` (`520:148`). Готово.

Сделать компонент `checkbox` в Figma по аналогии с Button/IconButton/Tooltip.

**Состояния:**
- Default: unchecked / checked / indeterminate
- Error: unchecked / checked
- Disabled: unchecked / checked / indeterminate
- Standalone (без лейбла): unchecked / checked / indeterminate / disabled / error

**Scope:**
1. Создать страницу `checkbox` в файле `SmpZhN2JSWj1F6NplzoGUN`
2. Компонент с вариантами по осям: `state` (default/error/disabled) × `checked` (false/true/indeterminate) × `has-label` (true/false)
3. Все визуальные свойства привязаны к переменным
4. Добавить в CLAUDE.md в таблицу Figma

---

## ✅ C — Dark mode: Tooltip и IconButton (done)

Проверить почему Tooltip и IconButton некорректно отображаются в Storybook в тёмной теме.

**Scope:**
1. Открыть `Components/Tooltip` и `Components/Buttons/IconButton` в dark mode
2. Зафиксировать все визуальные проблемы (скриншоты)
3. Найти причину — токены, CSS specificity, `DARK_OVERRIDE` в preview.tsx, или что-то в компонентах
4. Починить
5. Задокументировать выводы в `.claude/mistakes.md` — паттерн ошибки и как избегать в будущих компонентах
