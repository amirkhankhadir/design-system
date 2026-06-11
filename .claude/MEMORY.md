# Design System — Память проекта

## Соглашения

### Именование токенов
Формат: `category/subcategory/variant` (слэш-разделённые)
Примеры: `action/primary/hover`, `color/neutral/500`, `feedback/error/text`

Если токены в Figma не соответствуют этому формату — сообщить пользователю и попросить поправить.

### Источник правды
- **Figma** = главный источник для цветов и визуальных решений
- **Код (JSON)** = главный источник для структуры, именования, новых токенов

### Синк
- Figma → Код: пользователь говорит "забери изменения из Figma" → читаем Variables → обновляем JSON → коммит + пуш
- Код → Figma: меняем JSON здесь → пушим Variables в Figma

## Стек
- Токены: Style Dictionary формат (JSON)
- Репо: https://github.com/amirkhankhadir/design-system
- Figma файл: https://www.figma.com/design/SmpZhN2JSWj1F6NplzoGUN/Claude-Design-System

## Статус
- [x] Primitive токены в JSON (colors, spacing, typography, radius, shadow)
- [x] Semantic токены в JSON (colors, spacing, typography)
- [x] Figma Variables синкнуты (167 переменных, Light/Dark режимы)
- [ ] Style Dictionary настройка
- [ ] Компоненты
- [ ] Storybook
