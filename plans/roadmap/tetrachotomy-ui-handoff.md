# Tetrachotomy UI Handoff

Первоначальный handoff: 2026-06-24. Актуализация source transfer: 2026-10-04.

## Актуальное состояние T4A.2

- Перенесены 32/35 формул: 13 простых, семь с кратией (`02`, `08`, `14`, `20`, `21`, `22`, `23`) и 12 порядкозависимых `(2×4)×4`. У `05`, `26`, `27` sourceBlocks остаются непривязанными.
- Для оставшихся `05`, `26`, `27` по просьбе автора показаны подряд формулы трёх участвующих дихотомий (`TetrachotomyDichotomyPanel`): целевой признак, затем оба множителя. Полюс каждого признака вычисляется по всем четырём типам выбранной тетрады; сохранены обе эквивалентности +/− и ?/! и описание цикла Пц/Рз. Формулы расположены в основном потоке вместо source-fallback заглушки. Это композиционное представление существующих формул дихотомий, без новых source bindings и без статуса буквального переноса. Проверки: 183 unit tests, TypeScript, build, dist smoke и production-preview e2e прошли; шесть новых browser tests проверяют все четыре тетрады каждой формулы, desktop/mobile и dark/light. Aggregate validate по-прежнему блокируется на семи dependency vulnerabilities. Коммит и публикация не выполнялись.
- Новый авторский класс: Пц/Рз — `10`, `17`, `30`, `34`; +/− — `09`, `15`, `24`, `25`; ?/! — `11`, `16`, `31`, `35`. «Социализации» — №9 (+/−, Бс/Пр, Лг/Эт); остальные названия сохранены по сообщению автора. Каждая тетрада владеет всеми восемью аспектами: четыре диады, четыре пересекающиеся четвёрки функций. Образ диады из двух позиций включён в четвёрку; стрелка не означает равенства множеств.
- `TetrachotomyOrderPanel` следует после прямого source-отображения: обычная интерактивная диаграмма Пц/Рз с циклом либо +/− и ?/! с обеими эквивалентностями. Полюс вычисляется по общему членству типов. Source-подсветка хранит обе строки каждой функции; на клавиатуре focus имеет приоритет перед hover. Ключ нового sibling-компонента имеет отдельный префикс `order:`.
- 2026-10-04 автор разрешил исправить первичный DOCX №31: третья группа `ЭСЭ ЛСЭ ИЛИ ИЭЭ` заменена на `ЭСЭ ЛСИ ИЛИ ИЭЭ`. Каталог уже содержал ЛСИ. Исходник сохранён в Git `3ee9391`, blob `ff405b0746ac0009483fa74626e9e270f3dfd6d8`; изменён только один токен заголовка, остальные строки и ZIP parts сохранены. №31 перенесена без correction metadata; все 32 привязанные формулы имеют ноль placement mismatches.
- Проверки нового класса: 48 literal groups, 192 literal rows; 176 unit tests и TypeScript прошли. Новая браузерная матрица — 24 теста для всех 12 формул на desktop/mobile в dark/light, все четыре тетрады, пересечения строк, все варианты порядкового условия; regression кратии — 12 тестов. Build, dist smoke и production-preview e2e прошли. `npm run validate` останавливается на прежних 7 dependency vulnerabilities; полного зелёного aggregate gate нет. Коммит и публикация этой работы не выполнялись.
- Согласованная подборка текущего обсуждения: `08`, `14`, `20`, `21`. Поколение признака и структурный класс диаграммы — разные классификации; положение кратии слева не определяет поколение остальных признаков. `22` и `23` относятся к другому классу и не включаются в эту подборку.
- После прямого отображения добавлен `TetrachotomyCracyPanel`: обычная интерактивная диаграмма кратии с четырьмя вариантами блоков и полная блочная формула. Полюс берётся из общей принадлежности типов выбранной тетрады. Четыре блочных условия сохраняются; отдельные строки 4→4 не заменяют всю структурную формулу.
- Автор подтвердил правильность групп извлечённой таблицы. `tetra-07`: исходное ИЭЭ в группе СЭИ/ИЛИ/СЛИ исправлено на ИЭИ; `tetra-13`: исходное ЭИИ в группе СЭИ/ЛИЭ/СЛИ исправлено на ЭИЭ. DOCX-секции и текст строк этих двух формул не изменены.
- Correction metadata хранит обе группы, formula ID, автора подтверждения и дату. Audit требует совпадения с двумя разрешёнными corrections; строки проверяются внутри исходной DOCX-секции и literal source group.
- Прямые source rows отображаются существующим `TetrachotomyAspectFunctionPanel`; для отдельной диаграммы кратии используется существующий `AspectFunctionDiagram`. E2E проверяет все четыре тетрады и четыре варианта кратии для `08`, `14`, `20`, `21`, `22`, `23` на desktop/mobile в обеих темах. `02` покрыта проверками данных.
- Model A incidence проверяется отдельно от transcription. 2026-10-03 автор согласовал прямую поправку `tetra-28`: четыре левые части рациональных строк переставлены в данных приложения и рабочем DOCX, без новых row-correction metadata. Правые части, группы и остальные строки сохранены; исходник подтверждён в Git `70acb99`, отдельная архивная ветка не создавалась. Placement mismatch отсутствует во всех 13 формулах. Проверены 48 образов, 64 classification decisions, 112 unit и 4 focused desktop/mobile e2e; T4A.2-review завершён, T4A.3 теоретическая готовность не закрыта.
- Разделы ниже описывают историческое состояние; старые pending/deferred статусы не заменяют это обновление.

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
