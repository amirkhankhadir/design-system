# Backlog

Items agreed but not yet started. Add new items here, mark done with ✅.

---

## J — Figma documentation: canon-compliance audit (raised 2026-07-03)

Discovered while building the Toggle doc: docs were historically built by copying a sibling frame, not derived from `.claude/documentation.md` (see mistakes #41). An audit of all 6 doc frames against the canon surfaced the items below. **Scheduled work — do not fix inline.**

### J1 — ✗/✕ glyph bug (recurrence of mistakes #34) · HIGH
`✗` (U+2717) and `✕` (U+2715) aren't in Source Sans 3 → render as a mismatched serif glyph or nothing at all. Replace with ASCII **"X"** (Checkbox/Radio/Toggle already do this correctly).
- **Tooltip** (`297:26`): "✗ When NOT to use" (`299:108`), "✗ Don't write long tooltips" (`305:190`), "✗ Don't" (`301:137`)
- **Button** (`325:26`): "✕" markers in the When-NOT-to-use list (`334:228`, `334:234`, …)
- **IconButton** (`366:253`): "✗ Don't" ×3 (`371:334`, `371:353`, `371:372`)
- Verify each in a screenshot before/after. Leave Checkbox/Radio/Toggle (already "X").

### J2 — Behavior/keyboard cards are text-only · MED
Canon: "Never write text-only documentation; keyboard card → key-chip illustration." Text-only keyboard cards:
- **Checkbox** behavior-Keyboard (`524:225`), **Radio** Keyboard navigation (`574:218`), **Toggle** Behavior/Keyboard.
- Upgrade to Tab/Space key-chips using the pattern already shipped in **IconButton** (`420:400`) and **Tooltip** (`286:340`). Key-chip recipe is in `documentation.md`.

### J3 — Missing Composition sections · MED
- **Toggle**: add "Composition — toggle in a settings row" (mirror the `SettingsList` story).
- **Checkbox**: add Grouping/Composition for `CheckboxGroup` (vertical/horizontal) — Radio has a Grouping section, Checkbox doesn't, despite shipping CheckboxGroup.

### J4 — "Checkbox vs Toggle" section (was G.4) · MED
Add to `DOCUMENTATION — Checkbox` (`520:148`) with real instances of both: Checkbox = deferred choice (applies on submit), Toggle = immediate action. Now that Toggle exists, no placeholders. (Moved here from G.4.)

### J5 — Reconcile `documentation.md` with the actual family standard · LOW
The guide's "Card visual style" section still describes the Tooltip-era spec; the whole family has since standardized on a newer look. Make guide and docs agree (one source of truth):
- section separators: divider line + 40px spacers (guide says `itemSpacing: 48`)
- doc frame `paddingBottom: 80` (guide says 64)
- cards: fill `surface` (`71:77`), **no** stroke (guide says fill `background/default` + `border/subtle` stroke)
- section-label letter-spacing: docs use 0; guide contradicts itself (line ~69 says 8%, line ~197 says never add). Pick 0, fix the table.

### J6 — Finalize Toggle doc · after J2/J3
Toggle doc (`662:133`, page `toggle`) is built and visually approved, but pending J2 (key-chips) + J3 (Composition) before it fully matches canon. Finalize (and confirm CLAUDE.md row) once those land.

---

## I — Portfolio case: design system + mini-app, angle "работа с ИИ"

Идея (обсуждали 2026-06-17): упаковать этот проект как портфолио-кейс для собеседований. **Стержень нарратива — сотрудничество дизайнера с ИИ** (где вёл, где ловил баги, какие решения принимал), а не просто «вот моя дизайн-система».

**План (направление зафиксировано, детали — позже):**
1. Собрать связный базовый набор компонентов.
2. Построить **маленькое работающее приложение** как витрину системы — оно служит системе, показывает live light/dark, доступность, состояния (error/disabled/loading), композицию.
3. Упаковать как case-study (CASE_STUDY.md: проблема → решение → как устроено → что можно объяснить) + репетиция интервью-вопросов.

**Открытый вопрос — идея приложения** (пользователь отложил выбор). Кандидаты: настройки/профиль продукта (low scope, нужен Input+Card); onboarding-флоу (формы/валидация/шаги, нужны Input+Select+степпер); трекер привычек/задач (списки/empty/loading, нужны Input+Card). «Точка упаковки» = связный набор + одно приложение + нарратив, а не количество компонентов.

**Недостающие компоненты под почти любое приложение:** Input (минимум), вероятно Select и Card.

---

## H — Pre-handoff: publish package + complete mobile token output

Raised during the 2026-06-16 hand-off strategy discussion (see memory `project-handoff-strategy-discussion`). Not urgent — захвачено, чтобы не потерять перед реальной передачей разработчикам.

1. **Publish `@design-system/web` to a registry.** Currently npm-shaped (exports/types/lib build, changesets configured) but `npm run release` never run, root is `private`. Decide registry (public npm vs private/GitHub Packages), then enable publishing so web-разработчики могут `npm install` вместо копирования из репо.
2. ✅ **Complete mobile token output (done 2026-06-17).** `build-tokens.js` now emits typography + elevation for iOS (`Typography`/`Elevation` enums in Swift) and Android (`type.xml` text styles + `ds_elevation_*` dp in dimens.xml). 28 text styles per platform, matching web. Android elevation is an approximate dp (noted in README). `dist/` regenerated, README Current Status updated.

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

## G — Toggle: документация + секция «Checkbox vs Toggle»

**Сделано:**
1. ✅ Компонент `Toggle` в коде (`packages/web/src/components/Toggle/`) — switch для мгновенного вкл/выкл.
2. ✅ `Toggle` в Figma (`591:133`, 8 вариантов).

**Осталось:**
3. Документация `DOCUMENTATION — Toggle` в Figma (по аналогии с Checkbox/Radio; подумать какие секции актуальны именно для toggle).
4. Вернуться к `DOCUMENTATION — Checkbox` (`520:148`) и добавить секцию «Checkbox vs Toggle» с реальными инстансами обоих: Checkbox = отложенный выбор (применяется при submit формы), Toggle = немедленное действие (применяется сразу). Теперь Toggle есть — заглушек не будет.

**Обнаружено:** при создании документации Checkbox в Figma.

---

## 📌 Незакрытая документация (следующая сессия)

Сводка того, что осталось по документации на момент конца сессии:

| # | Что | Где | Статус |
|---|-----|-----|--------|
| 1 | `DOCUMENTATION — Toggle` (Figma doc-фрейм) | страница `toggle` (`662:133`) | ✅ построен и визуально одобрен 2026-07-03; canon-полировка в J6 (см. J2/J3) |
| 2 | Секция «Checkbox vs Toggle» | `DOCUMENTATION — Checkbox` (`520:148`) | ❌ не начато — перенесено в **J4** |

Всё остальное по компонентам Checkbox / Radio / Toggle закрыто: код + Storybook autodocs + Figma-компоненты + Figma-документация (кроме Toggle-дока). Storybook-документация у всех трёх есть.

Напоминание про процесс дока: каждый компонент свой — не копировать секции вслепую, думать какие актуальны (см. как делали Grouping у Radio, которого нет у Checkbox).

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
