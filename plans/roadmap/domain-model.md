# Domain Model

## Принцип разделения

Доменная модель описывает аспекты, функции, типы, признаки, полюса, тетрахотомии, октохотомии и интерпретации. Она не должна знать о React, URL, Tailwind, темах, иконках как компонентах или раскладке экрана. UI получает уже готовые view models через чистые selectors.

## Существующие сущности

### Aspect

Текущий `Aspect` содержит:

- `id: AspectId` для 8 аспектов: `Ne`, `Si`, `Fe`, `Ti`, `Te`, `Fi`, `Se`, `Ni`.
- `name` и `fullName`.
- 7 бинарных признаков аспектов через `AspectFeatureKey`.

План развития:

- оставить `AspectId` стабильным ключом;
- добавить UI-независимое поле visual metadata, например `iconKey`, только если оно не тянет React-компоненты в домен;
- не заменять `name`, а дать UI возможность показывать symbol, icon и full name вместе.

### SocionicFunction

Текущий `SocionicFunction` содержит:

- `id` от 1 до 8;
- `name`;
- 7 бинарных признаков функций;
- `MODEL_A_LAYOUT` как порядок отображения функций.

План развития:

- сохранить функции как независимую ось модели А;
- не хранить конкретные типы внутри `SocionicFunction`;
- проверять, что каждый тип использует все 8 функций ровно один раз.

### ReininTrait

Текущий `ReininTrait` содержит:

- `id`;
- `name`;
- `class: 1 | 2 | 3`;
- два `poles`;
- views с `mappings` между блоками аспектов и функций;
- optional `diagramId`.

План развития:

- оставить текущие invariant views как формульное представление признака;
- добавить отдельную membership-модель типов по полюсам;
- не смешивать formula mappings и type membership в одной структуре без явного adapter.

## Новые сущности

### SocionicType

Предлагаемая форма:

```ts
export type SocionicTypeId =
  | 'ILE' | 'SEI' | 'ESE' | 'LII'
  | 'EIE' | 'LSI' | 'SLE' | 'IEI'
  | 'LIE' | 'ESI' | 'SEE' | 'ILI'
  | 'IEE' | 'SLI' | 'LSE' | 'EII';

export interface SocionicType {
  id: SocionicTypeId;
  quadraId: 'alpha' | 'beta' | 'gamma' | 'delta';
  names: LocalizedText;
  aliases: {
    socionics?: string[];
    mbtiLike?: string[];
  };
  modelA: ModelAAssignment[];
}

export interface ModelAAssignment {
  functionId: number;
  aspectId: AspectId;
}
```

Domain validations:

- ровно 16 типов;
- каждый `SocionicTypeId` уникален;
- в каждом типе ровно 8 assignments;
- в каждом типе все функции 1-8 встречаются ровно один раз;
- в каждом типе все 8 аспектов встречаются ровно один раз;
- все `aspectId` и `functionId` зарегистрированы.

### TraitTypeMembership

Признак Рейнина как разбиение 16 типов на два полюса:

```ts
export interface TraitTypeMembership {
  traitId: ReininTraitId;
  poles: [
    { poleIndex: 0; typeIds: SocionicTypeId[] },
    { poleIndex: 1; typeIds: SocionicTypeId[] },
  ];
}
```

Domain validations:

- membership есть для каждого `ReininTrait`;
- каждый признак содержит два полюса по 8 типов;
- типы внутри признака не повторяются;
- объединение двух полюсов равно множеству всех 16 типов;
- `poleIndex` соответствует порядку `trait.poles`.

### Partition

Общее представление для дихотомии, тетрахотомии и октохотомии:

```ts
export interface PartitionRequest {
  traitIds: ReininTraitId[];
}

export interface PartitionClass {
  key: string;
  poles: Array<{ traitId: ReininTraitId; poleIndex: 0 | 1 }>;
  typeIds: SocionicTypeId[];
}

export interface PartitionResult {
  traitIds: ReininTraitId[];
  rank: number;
  classes: PartitionClass[];
  kind: 'dichotomy' | 'tetrachotomy' | 'octochotomy';
}
```

Rules:

- 1 признак: 2 класса по 8 типов.
- 2 разных признака: 4 класса по 4 типа.
- 3 признака: октохотомия только если rank равен 3; тогда 8 классов по 2 типа.
- Если rank меньше количества выбранных признаков, комбинация dependent и должна возвращать diagnostic, а не фальшивую октохотомию.

### Trait Vector

Для проверки независимости каждому признаку нужен бинарный вектор длиной 16 по типам. Значение 0 или 1 указывает полюс. Над этими векторами используется ранг над GF(2).

Минимальные helpers:

- `getTraitVector(traitId): readonly 0 | 1[]`;
- `rankTraitVectors(traitIds): number`;
- `buildPartition(traitIds): PartitionResult | PartitionDiagnostic`;
- `isValidTetrachotomy(traitIds): boolean`;
- `isValidOctochotomy(traitIds): boolean`.

### SemanticInterpretation

Интерпретации должны быть отдельным контентом:

```ts
export interface SemanticInterpretation {
  target:
    | { kind: 'trait'; traitId: ReininTraitId }
    | { kind: 'traitPole'; traitId: ReininTraitId; poleIndex: 0 | 1 }
    | { kind: 'partitionClass'; traitIds: ReininTraitId[]; key: string }
    | { kind: 'type'; typeId: SocionicTypeId };
  locale: 'ru' | 'en';
  title: string;
  body: string;
  status: 'draft' | 'reviewed' | 'canonical';
  sourceNote?: string;
}
```

Rules:

- интерпретация не определяет membership и не влияет на вычисления;
- отсутствие интерпретации не должно ломать partition или type view;
- английские и русские интерпретации могут иметь разные статусы готовности.

## Локализация доменных имен

Доменная логика должна ссылаться только на IDs. Тексты нужно читать через locale adapter:

```ts
export type Locale = 'ru' | 'en';

export interface LocalizedText {
  ru: string;
  en?: string;
}
```

На первом этапе допустимо оставить русские строки в текущих структурах и добавить adapter, который возвращает Russian fallback. Полная миграция строк в catalogs должна идти отдельными задачами.

## Связь домена и UI

Selectors должны отдавать UI готовые данные:

- `selectTraitViewModel(traitId, poleIndex, viewIndex, locale)`;
- `selectTypeModelView(typeId, locale)`;
- `selectTypeTraitExample(typeId, traitId, locale)`;
- `selectTetrachotomyView(traitIds, locale)`;
- `selectOctochotomyView(traitIds, locale)`;
- `selectInterpretations(target, locale)`.

React-компоненты не должны напрямую собирать membership классы, считать rank или вычислять пересечения типов.
