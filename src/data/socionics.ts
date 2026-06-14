export type AspectId = 'Ne' | 'Si' | 'Fe' | 'Ti' | 'Te' | 'Fi' | 'Se' | 'Ni';

export * from './types';
export * from './memberships';
export * from './partitions';

// Признаки Аспектов — 7 бинарных дихотомий, образующих нетривиальные столбцы матрицы Адамара H₃.
// Тривиальный столбец «Сущ» (все +) опущен — он не различает группы.
export type AspectFeatureKey =
  | 'isExtra'        // Верт         : + = Экстравертный   / − = Интровертный
  | 'isDeltaValued'  // дт/бт        : + = Дельта-ценный   / − = Бета-ценный
  | 'isAbstract'     // отвл/вовл    : + = Отвлечённый     / − = Вовлечённый
  | 'isAlphaValued'  // аф/гм        : + = Альфа-ценный    / − = Гамма-ценный
  | 'isImplicit'     // -яв/яв       : + = Неявный         / − = Явный
  | 'isIrrational'   // Наль         : + = Иррациональный  / − = Рациональный
  | 'isStatic';      // Таль         : + = Статичный       / − = Динамичный

export type Aspect = {
  id: AspectId;
  name: string;
  fullName: string;
} & Record<AspectFeatureKey, boolean>;

// Биты из матрицы H₃ (8×8), без тривиального столбца «Сущ».
// Строки ↓ — аспекты; столбцы → — Признаки Аспектов в порядке матрицы.
export const ASPECTS: Aspect[] = [
  // id    name  fullName                       extra  δ-цен  отвл   α-цен  неявн  иррац  стат
  { id: 'Ne', name: 'ЧИ', fullName: 'Интуиция возможностей', isExtra: true,  isDeltaValued: true,  isAbstract: true,  isAlphaValued: true,  isImplicit: true,  isIrrational: true,  isStatic: true  },
  { id: 'Si', name: 'БС', fullName: 'Сенсорика ощущений',    isExtra: false, isDeltaValued: true,  isAbstract: false, isAlphaValued: true,  isImplicit: false, isIrrational: true,  isStatic: false },
  { id: 'Fe', name: 'ЧЭ', fullName: 'Этика эмоций',           isExtra: true,  isDeltaValued: false, isAbstract: false, isAlphaValued: true,  isImplicit: true,  isIrrational: false, isStatic: false },
  { id: 'Ti', name: 'БЛ', fullName: 'Логика отношений',       isExtra: false, isDeltaValued: false, isAbstract: true,  isAlphaValued: true,  isImplicit: false, isIrrational: false, isStatic: true  },
  { id: 'Te', name: 'ЧЛ', fullName: 'Деловая логика',         isExtra: true,  isDeltaValued: true,  isAbstract: true,  isAlphaValued: false, isImplicit: false, isIrrational: false, isStatic: false },
  { id: 'Fi', name: 'БЭ', fullName: 'Этика отношений',        isExtra: false, isDeltaValued: true,  isAbstract: false, isAlphaValued: false, isImplicit: true,  isIrrational: false, isStatic: true  },
  { id: 'Se', name: 'ЧС', fullName: 'Волевая сенсорика',      isExtra: true,  isDeltaValued: false, isAbstract: false, isAlphaValued: false, isImplicit: false, isIrrational: true,  isStatic: true  },
  { id: 'Ni', name: 'БИ', fullName: 'Интуиция времени',       isExtra: false, isDeltaValued: false, isAbstract: true,  isAlphaValued: false, isImplicit: true,  isIrrational: true,  isStatic: false },
];

// Реестр Признаков Аспектов: имена полюсов и порядок отображения.
// Порядок — в порядке столбцов матрицы H₃.
export interface AspectFeature {
  key: AspectFeatureKey;
  /** Заголовок признака — пара полюсов. */
  title: string;
  /** Имя полюса при значении true (единственное число). */
  posSingular: string;
  /** Имя полюса при значении false (единственное число). */
  negSingular: string;
  /** Имя группы при значении true (множественное число — для легенды). */
  posPlural: string;
  /** Имя группы при значении false (множественное число — для легенды). */
  negPlural: string;
  /** Имя признака в дательном падеже («по X»), для фраз эквивалентности. */
  categoryDative: string;
}

export const ASPECT_FEATURES: AspectFeature[] = [
  { key: 'isExtra',       title: 'Экстравертный / Интровертный',  posSingular: 'Экстравертный',   negSingular: 'Интровертный',  posPlural: 'Экстравертные',   negPlural: 'Интровертные',   categoryDative: 'экстраверсии/интроверсии' },
  { key: 'isDeltaValued', title: 'Дельта-ценный / Бета-ценный',    posSingular: 'Дельта-ценный',   negSingular: 'Бета-ценный',   posPlural: 'Дельта-ценные',   negPlural: 'Бета-ценные',    categoryDative: 'дельта/бета-ценности' },
  { key: 'isAbstract',    title: 'Отвлечённый / Вовлечённый',      posSingular: 'Отвлечённый',     negSingular: 'Вовлечённый',   posPlural: 'Отвлечённые',     negPlural: 'Вовлечённые',    categoryDative: 'отвлечённости/вовлечённости' },
  { key: 'isAlphaValued', title: 'Альфа-ценный / Гамма-ценный',    posSingular: 'Альфа-ценный',    negSingular: 'Гамма-ценный',  posPlural: 'Альфа-ценные',    negPlural: 'Гамма-ценные',   categoryDative: 'альфа/гамма-ценности' },
  { key: 'isImplicit',    title: 'Неявный / Явный',                posSingular: 'Неявный',         negSingular: 'Явный',         posPlural: 'Неявные',         negPlural: 'Явные',          categoryDative: 'неявности/явности' },
  { key: 'isIrrational',  title: 'Иррациональный / Рациональный',  posSingular: 'Иррациональный',  negSingular: 'Рациональный',  posPlural: 'Иррациональные',  negPlural: 'Рациональные',   categoryDative: 'иррациональности/рациональности' },
  { key: 'isStatic',      title: 'Статичный / Динамичный',         posSingular: 'Статичный',       negSingular: 'Динамичный',    posPlural: 'Статичные',       negPlural: 'Динамичные',     categoryDative: 'статике/динамике' },
];

export interface DerivedFeature {
  feature: AspectFeature;
  value: boolean;
}

/**
 * Возвращает Признаки Аспектов, по которым все аспекты группы имеют одинаковое значение.
 * Для группы из 4 аспектов в среднем даёт 1 признак, для группы из 2 — 3 признака.
 */
export function deriveGroupFeatures(aspects: Aspect[]): DerivedFeature[] {
  if (aspects.length === 0) return [];
  return ASPECT_FEATURES.reduce<DerivedFeature[]>((acc, feature) => {
    const firstValue = aspects[0][feature.key];
    const allSame = aspects.every(a => a[feature.key] === firstValue);
    if (allSame) acc.push({ feature, value: firstValue });
    return acc;
  }, []);
}

/** Хелпер: вернуть подпись группы (единственное число для одного признака, через '·' для пары). */
export function formatGroupLabel(derived: DerivedFeature[]): string {
  return derived
    .map(({ feature, value }) => (value ? feature.posPlural : feature.negPlural))
    .join(' · ');
}

/** Хелпер: вернуть полный список признаков аспекта в единственном числе. */
export function formatAspectFeatures(aspect: Aspect): string {
  return ASPECT_FEATURES
    .map(f => (aspect[f.key] ? f.posSingular : f.negSingular))
    .join(' · ');
}

/**
 * Возвращает Признаки Аспектов, по которым каждая группа маппинга внутренне эквивалентна.
 * Иными словами — те feature-keys, для которых внутри каждого блока (а не между блоками!)
 * все аспекты делят одно значение. Это и есть «оси эквивалентности» блочной структуры.
 *
 * Для Класса 1 (4-аспектные блоки) обычно даёт 1 признак, для Класса 2 (2-аспектные) — 3.
 * Возвращает [], если ни одного признака не нашлось или передан пустой массив.
 */
export function findCommonGroupFeatureKeys(mappings: Mapping[]): AspectFeatureKey[] {
  if (mappings.length === 0) return [];
  const perBlock = mappings.map(m => {
    const aspects = m.aspects
      .map(id => ASPECTS.find(a => a.id === id))
      .filter((a): a is Aspect => Boolean(a));
    return new Set(deriveGroupFeatures(aspects).map(d => d.feature.key));
  });
  return ASPECT_FEATURES
    .map(f => f.key)
    .filter(key => perBlock.every(s => s.has(key)));
}

/** Аналог findCommonGroupFeatureKeys, но для блоков функций. */
export function findCommonFunctionGroupFeatureKeys(mappings: Mapping[]): FunctionFeatureKey[] {
  if (mappings.length === 0) return [];
  const perBlock = mappings.map(m => {
    const functions = m.functions
      .map(id => FUNCTIONS.find(f => f.id === id))
      .filter((f): f is SocionicFunction => Boolean(f));
    return new Set(deriveGroupFunctionFeatures(functions).map(d => d.feature.key));
  });
  return FUNCTION_FEATURES
    .map(f => f.key)
    .filter(key => perBlock.every(s => s.has(key)));
}

const joinDative = (names: string[]): string =>
  names.length <= 1
    ? names[0] ?? ''
    : `${names.slice(0, -1).join(', ')} и ${names[names.length - 1]}`;

/**
 * Автогенерация description для блочного вида:
 *   «Пары аспектов, эквивалентные по X, Y и Z, в блоках функций, эквивалентных по A, B и C.»
 * Если найдены общие признаки только с одной стороны — берётся только она.
 * Возвращает null, если общих признаков нет вовсе.
 */
export function formatBlockEquivalenceDescription(mappings: Mapping[]): string | null {
  const aspectKeys = findCommonGroupFeatureKeys(mappings);
  const functionKeys = findCommonFunctionGroupFeatureKeys(mappings);

  const aspectList = joinDative(
    aspectKeys.map(k => ASPECT_FEATURES.find(f => f.key === k)!.categoryDative),
  );
  const functionList = joinDative(
    functionKeys.map(k => FUNCTION_FEATURES.find(f => f.key === k)!.categoryDative),
  );

  if (aspectList && functionList) {
    return `Пары аспектов, эквивалентные по ${aspectList}, в блоках функций, эквивалентных по ${functionList}.`;
  }
  if (aspectList) return `Пары аспектов, эквивалентные по ${aspectList}.`;
  if (functionList) return `Блоки функций, эквивалентные по ${functionList}.`;
  return null;
}

// Признаки Функций — 7 бинарных столбцов матрицы H₃ (без тривиального «Сущ»):
// Верт, Оц/Сит, Сл/слаб, Вб/Лб, Ин/Кт, Наль, Таль.
// Имена полей сохранены прежние (isAcceptant ≡ Наль, isMental ≡ Таль) — это синонимы.
export interface SocionicFunction {
  id: number;
  name: string;
  isExtra: boolean;       // Верт:    + = экстравертная   / − = интровертная
  isEvaluatory: boolean;  // Оц/Сит:  + = оценочная       / − = ситуативная
  isStrong: boolean;      // Сл/слаб: + = сильная         / − = слабая
  isVerbal: boolean;      // Вб/Лб:   + = вербальная      / − = лаборная
  isInert: boolean;       // Ин/Кт:   + = инертная        / − = контактная
  isAcceptant: boolean;   // Наль:    + = иррациональная  / − = рациональная
  isMental: boolean;      // Таль:    + = статичная       / − = динамичная
}

export const FUNCTIONS: SocionicFunction[] = [
  // id  name                  Верт   Оц/Сит  Сл/слаб  Вб/Лб   Ин/Кт   Наль    Таль
  { id: 1, name: 'Базовая',         isExtra: true,  isEvaluatory: true,  isStrong: true,  isVerbal: true,  isInert: true,  isAcceptant: true,  isMental: true  },
  { id: 2, name: 'Творческая',      isExtra: false, isEvaluatory: false, isStrong: true,  isVerbal: true,  isInert: false, isAcceptant: false, isMental: true  },
  { id: 3, name: 'Ролевая',          isExtra: true,  isEvaluatory: false, isStrong: false, isVerbal: false, isInert: false, isAcceptant: true,  isMental: true  },
  { id: 4, name: 'Болевая',          isExtra: false, isEvaluatory: true,  isStrong: false, isVerbal: false, isInert: true,  isAcceptant: false, isMental: true  },
  { id: 5, name: 'Суггестивная',    isExtra: false, isEvaluatory: true,  isStrong: false, isVerbal: true,  isInert: false, isAcceptant: true,  isMental: false },
  { id: 6, name: 'Активационная',   isExtra: true,  isEvaluatory: false, isStrong: false, isVerbal: true,  isInert: true,  isAcceptant: false, isMental: false },
  { id: 7, name: 'Ограничительная', isExtra: false, isEvaluatory: false, isStrong: true,  isVerbal: false, isInert: true,  isAcceptant: true,  isMental: false },
  { id: 8, name: 'Фоновая',          isExtra: true,  isEvaluatory: true,  isStrong: true,  isVerbal: false, isInert: false, isAcceptant: false, isMental: false },
];

// --- Признаки Функций ---------------------------------------------------------
// Аналог ASPECT_FEATURES для Функций. Порядок — в порядке столбцов матрицы H₃.
export type FunctionFeatureKey =
  | 'isExtra'
  | 'isEvaluatory'
  | 'isStrong'
  | 'isVerbal'
  | 'isInert'
  | 'isAcceptant'
  | 'isMental';

export interface FunctionFeature {
  key: FunctionFeatureKey;
  title: string;
  posSingular: string;
  negSingular: string;
  posPlural: string;
  negPlural: string;
  /** Имя признака в дательном падеже («по X»), для фраз эквивалентности. */
  categoryDative: string;
}

export const FUNCTION_FEATURES: FunctionFeature[] = [
  { key: 'isExtra',      title: 'Экстравертная / Интровертная',   posSingular: 'Экстравертная',   negSingular: 'Интровертная',  posPlural: 'Экстравертные',   negPlural: 'Интровертные',   categoryDative: 'экстраверсии/интроверсии' },
  { key: 'isEvaluatory', title: 'Оценочная / Ситуативная',         posSingular: 'Оценочная',       negSingular: 'Ситуативная',   posPlural: 'Оценочные',       negPlural: 'Ситуативные',    categoryDative: 'оценочности/ситуативности' },
  { key: 'isStrong',     title: 'Сильная / Слабая',                posSingular: 'Сильная',         negSingular: 'Слабая',        posPlural: 'Сильные',         negPlural: 'Слабые',         categoryDative: 'силе/слабости' },
  { key: 'isVerbal',     title: 'Вербальная / Лаборная',           posSingular: 'Вербальная',      negSingular: 'Лаборная',      posPlural: 'Вербальные',      negPlural: 'Лаборные',       categoryDative: 'вербальности/лаборности' },
  { key: 'isInert',      title: 'Инертная / Контактная',           posSingular: 'Инертная',        negSingular: 'Контактная',    posPlural: 'Инертные',        negPlural: 'Контактные',     categoryDative: 'инертности/контактности' },
  { key: 'isAcceptant',  title: 'Иррациональная / Рациональная',   posSingular: 'Иррациональная',  negSingular: 'Рациональная',  posPlural: 'Иррациональные',  negPlural: 'Рациональные',   categoryDative: 'иррациональности/рациональности' },
  { key: 'isMental',     title: 'Статичная / Динамичная',           posSingular: 'Статичная',       negSingular: 'Динамичная',    posPlural: 'Статичные',       negPlural: 'Динамичные',     categoryDative: 'статике/динамике' },
];

export interface DerivedFunctionFeature {
  feature: FunctionFeature;
  value: boolean;
}

/** Аналог deriveGroupFeatures, но для функций. */
export function deriveGroupFunctionFeatures(
  functions: SocionicFunction[],
): DerivedFunctionFeature[] {
  if (functions.length === 0 || FUNCTION_FEATURES.length === 0) return [];
  return FUNCTION_FEATURES.reduce<DerivedFunctionFeature[]>((acc, feature) => {
    const firstValue = functions[0][feature.key];
    const allSame = functions.every(f => f[feature.key] === firstValue);
    if (allSame) acc.push({ feature, value: firstValue });
    return acc;
  }, []);
}

export function formatFunctionGroupLabel(derived: DerivedFunctionFeature[]): string {
  return derived
    .map(({ feature, value }) => (value ? feature.posPlural : feature.negPlural))
    .join(' · ');
}

/** Полный список признаков функции в единственном числе — для tooltip. */
export function formatFunctionFeatures(fn: SocionicFunction): string {
  return FUNCTION_FEATURES
    .map(f => (fn[f.key] ? f.posSingular : f.negSingular))
    .join(' · ');
}

// Порядок отображения функций в сетке 2×4 Модели А.
export const MODEL_A_LAYOUT: readonly number[] = [1, 2, 4, 3, 6, 5, 7, 8];

export interface Mapping {
  aspects: AspectId[];
  functions: number[];
  /** Лейбл на блоке аспектов (например, макроаспект «Интуиция»). */
  aspectLabel?: string;
  /** Лейбл на блоке функций (например, «3 полутакт»). */
  functionLabel?: string;
}

// Одна "точка зрения" на инвариант: набор маппингов + опциональные модификаторы.
// decoratorIds         — какие SVG-оверлеи рисовать поверх диаграммы (см. src/decorators).
// connector            — символ между функциями в формуле ('→' по умолчанию, '~' для циклов).
// footnote             — пояснительная сноска под формулой.
// description          — пояснение, переопределяющее pole.description (для per-view контента).
// isBlockPermutation   — если true: индекс маппинга НЕ задаёт соответствие "эти аспекты → эти функции".
//                        Инвариант — лишь биекция между 4 блоками аспектов и 4 блоками функций;
//                        конкретный порядок не часть инварианта (блоки импримитивности).
export interface View {
  title: string;
  mappings: Mapping[];
  decoratorIds?: string[];
  connector?: string;
  footnote?: string;
  description?: string;
  isBlockPermutation?: boolean;
}

export interface TraitPole {
  name: string;
  description: string;
  views: View[];
}

export type TraitClass = 1 | 2 | 3;

export type ReininTraitId =
  | 'vertness'
  | 'nalness'
  | 'talness'
  | 'carefree'
  | 'yielding'
  | 'intuition'
  | 'logic'
  | 'subjectivism'
  | 'judicious'
  | 'constructivism'
  | 'tactical'
  | 'democracy'
  | 'positivism'
  | 'asking'
  | 'process';

export interface ReininTrait {
  id: ReininTraitId;
  name: string;
  class: TraitClass;
  diagramId?: string; // ключ в реестре диаграмм; по умолчанию — 'aspect-function'.
  poles: [TraitPole, TraitPole];
}

// Метаданные классов признаков (для боковой панели и модалок).
export interface TraitGroupMeta {
  id: TraitClass;
  title: string;
  description: string;
  help: string;
}

export const TRAIT_GROUPS: TraitGroupMeta[] = [
  {
    id: 1,
    title: '1 Класс (4→4)',
    description: 'Инварианты, сохраняющие 4 свойства аспектов в 4 свойствах функций.',
    help: 'В этом классе каждый полюс дихотомии определяет жесткое соответствие между набором из 4 аспектов и набором из 4 функций. Например, Экстраверсия требует, чтобы экстравертные аспекты попадали в экстравертные функции.',
  },
  {
    id: 2,
    title: '2 Класс (2→4)',
    description: 'Инварианты, сохраняющие пары аспектов в четверках функций.',
    help: 'Здесь инвариантом является пара аспектов (например, ЧИ+БС), которая должна попадать в определенную четверку функций (например, Оценочные). Это более структурные инварианты.',
  },
  {
    id: 3,
    title: '3 Класс (Порядкозависимые)',
    description: 'Инварианты, основанные на эквивалентностях и циклах.',
    help: 'Самый сложный класс. Здесь важны не просто группы, а отношения между ними. Для Демократии/Аристократии это эквивалентность характеристик. Для Процесса/Результата — это циклический порядок обхода функций информацией.',
  },
];

// Хелпер: всегда возвращает массив views (упрощает потребителей).
const single = (mappings: Mapping[]): View[] => [{ title: '', mappings }];

export const REININ_TRAITS: ReininTrait[] = [
  {
    id: 'vertness',
    name: 'Экстраверсия / Интроверсия',
    class: 1,
    poles: [
      {
        name: 'Экстраверты',
        description: 'Экстравертные аспекты в экстравертных функциях, интровертные в интровертных.',
        views: single([
          { aspects: ['Ne', 'Fe', 'Te', 'Se'], functions: [1, 3, 6, 8] },
          { aspects: ['Si', 'Ti', 'Fi', 'Ni'], functions: [2, 4, 5, 7] },
        ]),
      },
      {
        name: 'Интроверты',
        description: 'Интровертные аспекты в экстравертных функциях, экстравертные в интровертных.',
        views: single([
          { aspects: ['Si', 'Ti', 'Fi', 'Ni'], functions: [1, 3, 6, 8] },
          { aspects: ['Ne', 'Fe', 'Te', 'Se'], functions: [2, 4, 5, 7] },
        ]),
      },
    ],
  },
  {
    id: 'nalness',
    name: 'Рациональность / Иррациональность',
    class: 1,
    poles: [
      {
        name: 'Иррационалы',
        description: 'Иррациональные аспекты в акцептных функциях, рациональные в продуктивных.',
        views: single([
          { aspects: ['Ne', 'Si', 'Se', 'Ni'], functions: [1, 3, 5, 7] },
          { aspects: ['Fe', 'Ti', 'Te', 'Fi'], functions: [2, 4, 6, 8] },
        ]),
      },
      {
        name: 'Рационалы',
        description: 'Рациональные аспекты в акцептных функциях, иррациональные в продуктивных.',
        views: single([
          { aspects: ['Fe', 'Ti', 'Te', 'Fi'], functions: [1, 3, 5, 7] },
          { aspects: ['Ne', 'Si', 'Se', 'Ni'], functions: [2, 4, 6, 8] },
        ]),
      },
    ],
  },
  {
    id: 'talness',
    name: 'Статика / Динамика',
    class: 1,
    poles: [
      {
        name: 'Статики',
        description: 'Статичные аспекты в ментальных функциях, динамичные в витальных.',
        views: single([
          { aspects: ['Ne', 'Ti', 'Fi', 'Se'], functions: [1, 2, 3, 4] },
          { aspects: ['Si', 'Fe', 'Te', 'Ni'], functions: [5, 6, 7, 8] },
        ]),
      },
      {
        name: 'Динамики',
        description: 'Динамичные аспекты в ментальных функциях, статичные в витальных.',
        views: single([
          { aspects: ['Si', 'Fe', 'Te', 'Ni'], functions: [1, 2, 3, 4] },
          { aspects: ['Ne', 'Ti', 'Fi', 'Se'], functions: [5, 6, 7, 8] },
        ]),
      },
    ],
  },
  {
    id: 'carefree',
    name: 'Беспечность / Предусмотрительность',
    class: 2,
    poles: [
      {
        name: 'Беспечные',
        description: 'ЧИ+БС в оценочных, ЧС+БИ в ситуативных.',
        views: single([
          { aspects: ['Ne', 'Si'], functions: [1, 4, 5, 8] },
          { aspects: ['Se', 'Ni'], functions: [2, 3, 6, 7] },
        ]),
      },
      {
        name: 'Предусмотрительные',
        description: 'ЧС+БИ в оценочных, ЧИ+БС в ситуативных.',
        views: single([
          { aspects: ['Se', 'Ni'], functions: [1, 4, 5, 8] },
          { aspects: ['Ne', 'Si'], functions: [2, 3, 6, 7] },
        ]),
      },
    ],
  },
  {
    id: 'yielding',
    name: 'Уступчивость / Упрямство',
    class: 2,
    poles: [
      {
        name: 'Уступчивые',
        description: 'ЧЛ+БЭ в оценочных, ЧЭ+БЛ в ситуативных.',
        views: single([
          { aspects: ['Te', 'Fi'], functions: [1, 4, 5, 8] },
          { aspects: ['Fe', 'Ti'], functions: [2, 3, 6, 7] },
        ]),
      },
      {
        name: 'Упрямые',
        description: 'ЧЭ+БЛ в оценочных, ЧЛ+БЭ в ситуативных.',
        views: single([
          { aspects: ['Fe', 'Ti'], functions: [1, 4, 5, 8] },
          { aspects: ['Te', 'Fi'], functions: [2, 3, 6, 7] },
        ]),
      },
    ],
  },
  {
    id: 'intuition',
    name: 'Интуиция / Сенсорика',
    class: 2,
    poles: [
      {
        name: 'Интуиты',
        description: 'ЧИ+БИ в сильных, ЧС+БС в слабых.',
        views: single([
          { aspects: ['Ne', 'Ni'], functions: [1, 2, 7, 8] },
          { aspects: ['Se', 'Si'], functions: [3, 4, 5, 6] },
        ]),
      },
      {
        name: 'Сенсорики',
        description: 'ЧС+БС в сильных, ЧИ+БИ в слабых.',
        views: single([
          { aspects: ['Se', 'Si'], functions: [1, 2, 7, 8] },
          { aspects: ['Ne', 'Ni'], functions: [3, 4, 5, 6] },
        ]),
      },
    ],
  },
  {
    id: 'logic',
    name: 'Логика / Этика',
    class: 2,
    poles: [
      {
        name: 'Логики',
        description: 'ЧЛ+БЛ в сильных, ЧЭ+БЭ в слабых.',
        views: single([
          { aspects: ['Te', 'Ti'], functions: [1, 2, 7, 8] },
          { aspects: ['Fe', 'Fi'], functions: [3, 4, 5, 6] },
        ]),
      },
      {
        name: 'Этики',
        description: 'ЧЭ+БЭ в сильных, ЧЛ+БЛ в слабых.',
        views: single([
          { aspects: ['Fe', 'Fi'], functions: [1, 2, 7, 8] },
          { aspects: ['Te', 'Ti'], functions: [3, 4, 5, 6] },
        ]),
      },
    ],
  },
  {
    id: 'subjectivism',
    name: 'Субъективизм / Объективизм',
    class: 2,
    poles: [
      {
        name: 'Субъективисты',
        description: 'ЧЭ+БЛ в вербальных, ЧЛ+БЭ в лаборных.',
        views: single([
          { aspects: ['Fe', 'Ti'], functions: [1, 2, 5, 6] },
          { aspects: ['Te', 'Fi'], functions: [3, 4, 7, 8] },
        ]),
      },
      {
        name: 'Объективисты',
        description: 'ЧЛ+БЭ в вербальных, ЧЭ+БЛ в лаборных.',
        views: single([
          { aspects: ['Te', 'Fi'], functions: [1, 2, 5, 6] },
          { aspects: ['Fe', 'Ti'], functions: [3, 4, 7, 8] },
        ]),
      },
    ],
  },
  {
    id: 'judicious',
    name: 'Рассудительность / Решительность',
    class: 2,
    poles: [
      {
        name: 'Рассудительные',
        description: 'ЧИ+БС в вербальных, ЧС+БИ в лаборных.',
        views: single([
          { aspects: ['Ne', 'Si'], functions: [1, 2, 5, 6] },
          { aspects: ['Se', 'Ni'], functions: [3, 4, 7, 8] },
        ]),
      },
      {
        name: 'Решительные',
        description: 'ЧС+БИ в вербальных, ЧИ+БС в лаборных.',
        views: single([
          { aspects: ['Se', 'Ni'], functions: [1, 2, 5, 6] },
          { aspects: ['Ne', 'Si'], functions: [3, 4, 7, 8] },
        ]),
      },
    ],
  },
  {
    id: 'constructivism',
    name: 'Конструктивизм / Эмотивизм',
    class: 2,
    poles: [
      {
        name: 'Конструктивисты',
        description: 'ЧЭ+БЭ в инертных, ЧЛ+БЛ в контактных.',
        views: single([
          { aspects: ['Fe', 'Fi'], functions: [1, 4, 6, 7] },
          { aspects: ['Te', 'Ti'], functions: [2, 3, 5, 8] },
        ]),
      },
      {
        name: 'Эмотивисты',
        description: 'ЧЛ+БЛ в инертных, ЧЭ+БЭ в контактных.',
        views: single([
          { aspects: ['Te', 'Ti'], functions: [1, 4, 6, 7] },
          { aspects: ['Fe', 'Fi'], functions: [2, 3, 5, 8] },
        ]),
      },
    ],
  },
  {
    id: 'tactical',
    name: 'Тактика / Стратегия',
    class: 2,
    poles: [
      {
        name: 'Тактики',
        description: 'ЧИ+БИ в инертных, ЧС+БС в контактных.',
        views: single([
          { aspects: ['Ne', 'Ni'], functions: [1, 4, 6, 7] },
          { aspects: ['Se', 'Si'], functions: [2, 3, 5, 8] },
        ]),
      },
      {
        name: 'Стратеги',
        description: 'ЧС+БС в инертных, ЧИ+БИ в контактных.',
        views: single([
          { aspects: ['Se', 'Si'], functions: [1, 4, 6, 7] },
          { aspects: ['Ne', 'Ni'], functions: [2, 3, 5, 8] },
        ]),
      },
    ],
  },
  {
    id: 'democracy',
    name: 'Демократия / Аристократия',
    class: 3,
    poles: [
      {
        name: 'Демократы',
        description: 'Пары аспектов, эквивалентные по отвлеченности/вовлеченности, в горизонтальных блоках.',
        views: [
          {
            title: 'Горизонтальные блоки',
            isBlockPermutation: true,
            mappings: [
              { aspects: ['Ne', 'Ti'], functions: [1, 2] },
              { aspects: ['Se', 'Fi'], functions: [3, 4] },
              { aspects: ['Si', 'Fe'], functions: [5, 6] },
              { aspects: ['Ni', 'Te'], functions: [7, 8] },
            ],
          },
          {
            title: 'Длинные вертикальные',
            isBlockPermutation: true,
            mappings: [
              { aspects: ['Ne', 'Fe'], functions: [1, 6] },
              { aspects: ['Si', 'Ti'], functions: [2, 5] },
              { aspects: ['Se', 'Te'], functions: [3, 8] },
              { aspects: ['Ni', 'Fi'], functions: [4, 7] },
            ],
          },
          {
            title: 'Мерности (4Б)',
            isBlockPermutation: true,
            mappings: [
              { aspects: ['Ne', 'Te'], functions: [1, 8] },
              { aspects: ['Ti', 'Ni'], functions: [2, 7] },
              { aspects: ['Se', 'Fe'], functions: [3, 6] },
              { aspects: ['Si', 'Fi'], functions: [4, 5] },
            ],
          },
          {
            title: 'Вертикальные блоки',
            isBlockPermutation: true,
            mappings: [
              { aspects: ['Ne', 'Fi'], functions: [1, 4] },
              { aspects: ['Se', 'Ti'], functions: [2, 3] },
              { aspects: ['Si', 'Te'], functions: [5, 8] },
              { aspects: ['Ni', 'Fe'], functions: [6, 7] },
            ],
          },
        ],
      },
      {
        name: 'Аристократы',
        description: 'Пары аспектов, эквивалентные по отвлеченности/вовлеченности, в вертикальных блоках.',
        views: [
          {
            title: 'Горизонтальные блоки',
            isBlockPermutation: true,
            mappings: [
              { aspects: ['Ne', 'Fi'], functions: [1, 2] },
              { aspects: ['Se', 'Ti'], functions: [3, 4] },
              { aspects: ['Si', 'Te'], functions: [5, 6] },
              { aspects: ['Ni', 'Fe'], functions: [7, 8] },
            ],
          },
          {
            title: 'Длинные вертикальные',
            isBlockPermutation: true,
            mappings: [
              { aspects: ['Ne', 'Te'], functions: [1, 6] },
              { aspects: ['Si', 'Fi'], functions: [2, 5] },
              { aspects: ['Fe', 'Se'], functions: [3, 8] },
              { aspects: ['Ti', 'Ni'], functions: [4, 7] },
            ],
          },
          {
            title: 'Мерности (4Б)',
            isBlockPermutation: true,
            mappings: [
              { aspects: ['Ne', 'Fe'], functions: [1, 8] },
              { aspects: ['Ti', 'Si'], functions: [2, 7] },
              { aspects: ['Se', 'Te'], functions: [3, 6] },
              { aspects: ['Fi', 'Ni'], functions: [4, 5] },
            ],
          },
          {
            title: 'Вертикальные блоки',
            isBlockPermutation: true,
            mappings: [
              { aspects: ['Ne', 'Ti'], functions: [1, 4] },
              { aspects: ['Se', 'Fi'], functions: [2, 3] },
              { aspects: ['Si', 'Fe'], functions: [5, 8] },
              { aspects: ['Ni', 'Te'], functions: [6, 7] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'positivism',
    name: 'Позитивизм / Негативизм',
    class: 3,
    poles: [
      {
        name: 'Позитивисты',
        description: 'Тетрахотомия аспектов [ЧИ ЧЛ ~ ЧЭ ЧС ~ БС БЛ ~ БЭ БИ] в функции (1 8 ~ 2 5 ~ 3 6 ~ 4 7).',
        views: [
          {
            title: 'Эквивалентность 1',
            isBlockPermutation: true,
            description: '[ЧИ ЧЛ ~ ЧЭ ЧС ~ БС БЛ ~ БЭ БИ] → (1 8 ~ 2 5 ~ 3 6 ~ 4 7)',
            mappings: [
              { aspects: ['Ne', 'Te'], functions: [1, 8] },
              { aspects: ['Fe', 'Se'], functions: [2, 5] },
              { aspects: ['Si', 'Ti'], functions: [3, 6] },
              { aspects: ['Fi', 'Ni'], functions: [4, 7] },
            ],
          },
          {
            title: 'Эквивалентность 2',
            isBlockPermutation: true,
            description: '[ЧИ ЧЭ ~ ЧЛ ЧС ~ БС БЭ ~ БЛ БИ] → (1 6 ~ 2 7 ~ 3 8 ~ 4 5)',
            mappings: [
              { aspects: ['Ne', 'Fe'], functions: [1, 6] },
              { aspects: ['Te', 'Se'], functions: [2, 7] },
              { aspects: ['Si', 'Fi'], functions: [3, 8] },
              { aspects: ['Ti', 'Ni'], functions: [4, 5] },
            ],
          },
        ],
      },
      {
        name: 'Негативисты',
        description: 'Тетрахотомия аспектов [ЧИ ЧЭ ~ ЧЛ ЧС ~ БС БЭ ~ БЛ БИ] в функции (1 8 ~ 2 5 ~ 3 6 ~ 4 7).',
        views: [
          {
            title: 'Эквивалентность 1',
            isBlockPermutation: true,
            description: '[ЧИ ЧЭ ~ ЧЛ ЧС ~ БС БЭ ~ БЛ БИ] → (1 8 ~ 2 5 ~ 3 6 ~ 4 7)',
            mappings: [
              { aspects: ['Ne', 'Fe'], functions: [1, 8] },
              { aspects: ['Te', 'Se'], functions: [2, 5] },
              { aspects: ['Si', 'Fi'], functions: [3, 6] },
              { aspects: ['Ti', 'Ni'], functions: [4, 7] },
            ],
          },
          {
            title: 'Эквивалентность 2',
            isBlockPermutation: true,
            description: '[ЧИ ЧЛ ~ ЧЭ ЧС ~ БС БЛ ~ БЭ БИ] → (1 6 ~ 2 7 ~ 3 8 ~ 4 5)',
            mappings: [
              { aspects: ['Ne', 'Te'], functions: [1, 6] },
              { aspects: ['Fe', 'Se'], functions: [2, 7] },
              { aspects: ['Si', 'Ti'], functions: [3, 8] },
              { aspects: ['Fi', 'Ni'], functions: [4, 5] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'asking',
    name: 'Квестимность / Деклатимность',
    class: 3,
    poles: [
      {
        name: 'Квестимы',
        description: '[ЧИ БЛ ~ БС ЧЛ ~ ЧЭ БИ ~ БЭ ЧС] → (1 2 ~ 3 4 ~ 5 8 ~ 6 7)',
        views: [
          {
            title: 'Эквивалентность 1',
            isBlockPermutation: true,
            description: '[ЧИ БЛ ~ БС ЧЛ ~ ЧЭ БИ ~ БЭ ЧС] → (1 2 ~ 3 4 ~ 5 8 ~ 6 7)',
            mappings: [
              { aspects: ['Ne', 'Ti'], functions: [1, 2] },
              { aspects: ['Si', 'Te'], functions: [3, 4] },
              { aspects: ['Fe', 'Ni'], functions: [5, 8] },
              { aspects: ['Fi', 'Se'], functions: [6, 7] },
            ],
          },
          {
            title: 'Эквивалентность 2',
            isBlockPermutation: true,
            description: '[ЧИ БЭ ~ БС ЧЭ ~ БЛ ЧС ~ ЧЛ БИ] → (1 4 ~ 2 3 ~ 5 6 ~ 7 8)',
            mappings: [
              { aspects: ['Ne', 'Fi'], functions: [1, 4] },
              { aspects: ['Si', 'Fe'], functions: [2, 3] },
              { aspects: ['Ti', 'Se'], functions: [5, 6] },
              { aspects: ['Te', 'Ni'], functions: [7, 8] },
            ],
          },
        ],
      },
      {
        name: 'Деклатимы',
        description: '[ЧИ БЭ ~ БС ЧЭ ~ БЛ ЧС ~ ЧЛ БИ] → (1 2 ~ 3 4 ~ 5 8 ~ 6 7)',
        views: [
          {
            title: 'Эквивалентность 1',
            isBlockPermutation: true,
            description: '[ЧИ БЭ ~ БС ЧЭ ~ БЛ ЧС ~ ЧЛ БИ] → (1 2 ~ 3 4 ~ 5 8 ~ 6 7)',
            mappings: [
              { aspects: ['Ne', 'Fi'], functions: [1, 2] },
              { aspects: ['Si', 'Fe'], functions: [3, 4] },
              { aspects: ['Ti', 'Se'], functions: [5, 8] },
              { aspects: ['Te', 'Ni'], functions: [6, 7] },
            ],
          },
          {
            title: 'Эквивалентность 2',
            isBlockPermutation: true,
            description: '[ЧИ БЛ ~ БС ЧЛ ~ ЧЭ БИ ~ БЭ ЧС] → (1 4 ~ 2 3 ~ 5 6 ~ 7 8)',
            mappings: [
              { aspects: ['Ne', 'Ti'], functions: [1, 4] },
              { aspects: ['Si', 'Te'], functions: [2, 3] },
              { aspects: ['Fe', 'Ni'], functions: [5, 6] },
              { aspects: ['Fi', 'Se'], functions: [7, 8] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'process',
    name: 'Процесс / Результат',
    class: 3,
    poles: [
      {
        name: 'Процесс',
        description: 'Циклический порядок макроаспектов: Интуиция → Логика → Сенсорика → Этика → ⟲.',
        views: [
          {
            title: '',
            isBlockPermutation: true,
            description: 'Циклический порядок макроаспектов: Интуиция → Логика → Сенсорика → Этика → ⟲.',
            decoratorIds: ['process-cycle'],
            connector: '~',
            footnote: 'Циклический порядок обхода полутактов задан стрелками на функциях. Блоки переставляются как у любого блочного инварианта, но индуцированный цикл на макроаспектах различает полюса: Процесс — Интуиция→Логика→Сенсорика→Этика, Результат — Интуиция→Этика→Сенсорика→Логика.',
            mappings: [
              { aspects: ['Ne', 'Ni'], aspectLabel: 'Интуиция',  functions: [1, 7], functionLabel: '3 полутакт' },
              { aspects: ['Te', 'Ti'], aspectLabel: 'Логика',    functions: [2, 8], functionLabel: '4 полутакт' },
              { aspects: ['Se', 'Si'], aspectLabel: 'Сенсорика', functions: [3, 5], functionLabel: '1 полутакт' },
              { aspects: ['Fe', 'Fi'], aspectLabel: 'Этика',     functions: [4, 6], functionLabel: '2 полутакт' },
            ],
          },
        ],
      },
      {
        name: 'Результат',
        description: 'Циклический порядок макроаспектов: Интуиция → Этика → Сенсорика → Логика → ⟲.',
        views: [
          {
            title: '',
            isBlockPermutation: true,
            description: 'Циклический порядок макроаспектов: Интуиция → Этика → Сенсорика → Логика → ⟲.',
            decoratorIds: ['process-cycle'],
            connector: '~',
            footnote: 'Циклический порядок обхода полутактов задан стрелками на функциях. Блоки переставляются как у любого блочного инварианта, но индуцированный цикл на макроаспектах различает полюса: Процесс — Интуиция→Логика→Сенсорика→Этика, Результат — Интуиция→Этика→Сенсорика→Логика.',
            mappings: [
              { aspects: ['Ne', 'Ni'], aspectLabel: 'Интуиция',  functions: [1, 7], functionLabel: '3 полутакт' },
              { aspects: ['Fe', 'Fi'], aspectLabel: 'Этика',     functions: [2, 8], functionLabel: '4 полутакт' },
              { aspects: ['Se', 'Si'], aspectLabel: 'Сенсорика', functions: [3, 5], functionLabel: '1 полутакт' },
              { aspects: ['Te', 'Ti'], aspectLabel: 'Логика',    functions: [4, 6], functionLabel: '2 полутакт' },
            ],
          },
        ],
      },
    ],
  },
];
