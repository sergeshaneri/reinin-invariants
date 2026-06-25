# Tetrachotomy UI Handoff

Дата: 2026-06-24

## Срочно для следующего окна

Не продолжать старую ошибку: не делать главным результатом новые списки ТИМов, классы, паттерны или selected-class previews. Главная задача пользователя: показать, что общего у представителей выбранной тетрады в модели А, то есть source-derived формулы отображения аспектов/аспектных блоков в функции/функциональные блоки.

Важная поправка после обсуждения: нельзя заменять source formula тремя обычными dichotomy `View.mappings`. `View.mappings` полезны как язык и визуальная аналогия, но главный источник для тетрахотомической диаграммы - `harness/theory/tetrachotomy-source.docx`.

## Обязательные правила чтения

Русский текст читать через PowerShell только с UTF-8 консолью и явным `-Encoding UTF8`, например:

```powershell
[Console]::InputEncoding = [Text.UTF8Encoding]::new(); [Console]::OutputEncoding = [Text.UTF8Encoding]::new(); $OutputEncoding = [Text.UTF8Encoding]::new(); Get-Content -Raw -Encoding UTF8 harness\failure-log.md
```

Предыдущая ошибка в этом окне: `Get-Content` без `-Encoding UTF8` дал mojibake для `plans/roadmap/tetrachotomy-ui-handoff.md`. Файл не был испорчен.

## Текущий UX-курс

- Не удалять наработки старого агента.
- Вторичные и дублирующие блоки держать под аккордеонами.
- На первом плане оставить только то, что ведет к главной цели.
- Главная цель: source-derived диаграмма "Отображение аспектов в функции".
- Типы, классы, композиция, паттерны - только supporting/advanced material.

## Что уже сделано до этого handoff

- `src/components/PartitionChooser.tsx`: в режиме тетрахотомий открыт только `Источник`; `По шагам` и `Паттерны` скрыты под аккордеоном `По шагам и паттерны`; октотомии оставлены прежними.
- `src/components/TetrachotomyView.tsx`: после source formula добавлен главный placeholder `Отображение аспектов в функции`; `Композиция`, `Классы тетрахотомии` и `PartitionTypesPanel` спрятаны вниз под `Доп материалы`; старые блоки не удалены.
- `src/components/TetrachotomyFormulaPanel.tsx`: показывает source formula, target trait, basis traits и 4 клетки классов по формуле.
- `tests/e2e/app.spec.ts`: обновлены проверки под новые аккордеоны.
- `harness/failure-log.md`: есть запись `Tetrachotomy UI Task Misalignment`.

Проверки, которые уже проходили до этого handoff по словам пользователя: `npm run lint`, `npm run smoke:render`, focused e2e 26/26, полный `npm run validate`, browser на localhost:3000.

## Dirty scope на момент handoff

Ожидаемый dirty scope:

- `M harness/failure-log.md`
- `M src/components/PartitionChooser.tsx`
- `M src/components/TetrachotomyView.tsx`
- `M src/data/selectors.test.ts`
- `M src/data/selectors.ts`
- `M tests/e2e/app.spec.ts`
- `?? plans/roadmap/tetrachotomy-ui-handoff.md`
- `?? src/components/TetrachotomyFormulaPanel.tsx`

Не откатывать эти изменения. Работать поверх них.

В этом окне был ошибочно создан `src/components/TetrachotomyAspectFunctionPanel.tsx` с неверной моделью через три `View.mappings`; файл удален в этом handoff и не должен использоваться как направление.

## Источники данных

### Primary source

- `harness/theory/tetrachotomy-source.docx`

Там лежат реальные формулы тетрад, например:

```text
— ИЛЭ ЭИЭ ЛИЭ ИЭЭ — Рыцари — Уникальность —
[ЧИ | Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные] → (мерность 4 | 1 8 | экстравертные оценочные сильные)
[БИ | Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные] → (мерность 3 | 2 7 | интровертные ситуативные сильные)
[ЧС | Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные] → (мерность 2 | 3 6 | экстравертные ситуативные слабые)
[БС | Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные] → (мерность 1 | 4 5 | интровертные оценочные слабые)
```

Звездочку и сноску из первого примера не показывать в приложении. Они не актуальны для UI.

### Existing extracted catalog

- `plans/roadmap/tetrachotomy-doc-extract.json`
- `src/data/tetrachotomies.ts`

Сейчас extract хранит 35 таблиц, `formula`, `relation`, `nearbyLabel`, группы типов, цвета и клетки. Он не хранит source rows вида `[аспекты | признаки] -> (функции | признаки)`.

### Existing language helpers

- `src/components/FormulaPanel.tsx`
- `src/diagrams/AspectFunctionDiagram.tsx`
- `src/data/socionics.ts`

Использовать как визуальный/языковой аналог:

- левая часть: аспект или аспектный блок + признаки;
- правая часть: блок функций + функции + признаки;
- для блочных перестановок не рисовать ложные жесткие пары.

Но не использовать `View.mappings` как источник тетрахотомической истины вместо DOCX.

## Уточненная модель для первой итерации

Начать только с тетрахотомий, где **не используются блочные перестановки**.

Это значит:

- брать source rows с прямой стрелкой `→`;
- не брать `~`-эквивалентности;
- не брать последовательности с `>`;
- не брать block permutation cases;
- шаблон строк не фиксировать на 4 строки.

Главный объект UI:

```text
[аспект(ы) | признаки аспектов] -> [блок функций: название + функции + признаки]
```

Пример правой части:

```text
мерность 4 | 1 8 | экстравертные оценочные сильные
```

Важная поправка пользователя: `мерность 4`, `мерность 3` и т.д. - это **название блока функций**, а не отдельное числовое поле рядом с функциями. В UI это должен быть label функционального блока.

Не у каждой тетрады есть label/название. Если label есть (`Рыцари`, `Уникальность`, `Открытые` и т.п.) - показывать. Если нет - не выдумывать.

## Как читать DOCX без внешних зависимостей

Можно прочитать `word/document.xml` как zip. Пример, который уже сработал:

```powershell
[Console]::InputEncoding = [Text.UTF8Encoding]::new(); [Console]::OutputEncoding = [Text.UTF8Encoding]::new(); $OutputEncoding = [Text.UTF8Encoding]::new(); @'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$docx = 'harness\theory\tetrachotomy-source.docx'
$zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $docx))
$entry = $zip.GetEntry('word/document.xml')
$reader = New-Object System.IO.StreamReader($entry.Open(), [Text.Encoding]::UTF8)
$xmlText = $reader.ReadToEnd()
$reader.Close(); $zip.Dispose()
[xml]$xml = $xmlText
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace('w','http://schemas.openxmlformats.org/wordprocessingml/2006/main')
$paras = $xml.SelectNodes('//w:p', $ns) | ForEach-Object { ($_.SelectNodes('.//w:t', $ns) | ForEach-Object { $_.'#text' }) -join '' } | Where-Object { $_.Trim().Length -gt 0 }
$paras | Select-String -Pattern 'Рыцари|Уникальность|ИЛЭ ЭИЭ ЛИЭ ИЭЭ|мерность|ЧИ' -Context 2,4 | Select-Object -First 80
'@ | powershell -NoProfile -Command -
```

Это показало, что DOCX содержит source rows прямо в тексте.

## Предлагаемый следующий шаг

1. Извлечь из `tetrachotomy-source.docx` структуру source rows для тетрахотомий без блочных перестановок.
2. Сопоставить source groups с текущими `TetrachotomyFormulaRecord.groups` по набору `typeIds`, чтобы выбранная клетка UI находила свои source rows.
3. Добавить доменную структуру, например:

```ts
interface TetrachotomySourceFormulaBlock {
  typeIds: readonly SocionicTypeId[];
  labels: readonly string[];
  rows: readonly {
    aspectText: string;
    aspectFeaturesText?: string;
    functionBlockLabel?: string; // например "мерность 4"
    functionIds: readonly number[];
    functionFeaturesText?: string;
  }[];
  status: 'extracted';
}
```

4. В UI заменить placeholder `data-tetrachotomy-model-a-slot` реальной source-based диаграммой.
5. Если выбранная тетрахотомия пока относится к блочным/sequence/`~` cases, показать честный fallback: "Для этой формулы source-разбор будет добавлен отдельно", но не выводить фальшивую диаграмму.
6. Обновить e2e/smoke под главный блок.
7. Запустить `npm run validate`.

## Stop conditions

Остановиться и спросить пользователя, если:

- нужно решить, как трактовать `~`-эквивалентности, sequence formulas или блочные перестановки;
- парсер DOCX не может надежно отделить rows от соседних notes;
- source text неоднозначно связывает rows с группой типов;
- нужна новая соционическая интерпретация, которой нет в источнике.

Не импровизировать socionics ground truth.
