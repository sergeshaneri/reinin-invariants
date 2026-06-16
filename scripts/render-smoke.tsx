import { renderToString } from 'react-dom/server';
import App from '../src/App';
import {
  ASPECTS,
  FUNCTIONS,
  REININ_TRAITS,
} from '../src/data/socionics';

const defaultTrait = REININ_TRAITS[0];
const defaultPole = defaultTrait.poles[0];
const expectedRussianText = [
  'Экстраверсия / Интроверсия',
  'Режим',
  'Тетрахотомия',
  'Интуиция возможностей',
  'Базовая',
  'Процесс / Результат',
];

const assert = (condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(`Render smoke failed: ${message}`);
  }
};

const countOccurrences = (html: string, needle: string): number => (
  html.split(needle).length - 1
);

const renderWithSearch = (search: string): string => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      addEventListener: () => undefined,
      location: { search },
      removeEventListener: () => undefined,
    },
  });

  try {
    return renderToString(<App />);
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, 'window', previousWindow);
    } else {
      Reflect.deleteProperty(globalThis, 'window');
    }
  }
};

const assertCommonRender = (name: string, html: string) => {
  assert(html.length > 1_000, `${name}: rendered HTML is unexpectedly small`);
  assert(!html.includes('\uFFFD'), `${name}: rendered HTML contains replacement characters`);
};

const defaultHtml = renderWithSearch('');

assertCommonRender('default trait', defaultHtml);
assert(defaultHtml.includes(defaultTrait.name), `default trait "${defaultTrait.id}" is missing`);
assert(defaultHtml.includes(defaultPole.name), `default pole for "${defaultTrait.id}" is missing`);
assert(
  defaultHtml.includes(`data-dichotomy-detail="${defaultTrait.id}"`),
  'default dichotomy detail attribute is missing',
);
assert(
  defaultHtml.includes('data-selected-pole-index="0"'),
  'default pole attribute is missing',
);
assert(
  countOccurrences(defaultHtml, 'data-model-preview-type-id=') === 8,
  'default dichotomy should render 8 Model A previews',
);

for (const text of expectedRussianText) {
  assert(defaultHtml.includes(text), `canonical Russian text "${text}" is missing or corrupted`);
}

for (const trait of REININ_TRAITS) {
  assert(defaultHtml.includes(trait.name), `trait "${trait.id}" is missing from navigation`);
}

for (const aspect of ASPECTS) {
  assert(defaultHtml.includes(`>${aspect.name}<`), `aspect "${aspect.id}" tile is missing`);
}

for (const fn of FUNCTIONS) {
  assert(defaultHtml.includes(`>${fn.id}<`), `function "${fn.id}" tile is missing`);
}

const tetrachotomyHtml = renderWithSearch('?mode=tetrachotomy&traits=vertness,nalness');

assertCommonRender('valid tetrachotomy', tetrachotomyHtml);
assert(tetrachotomyHtml.includes('data-tetrachotomy-detail'), 'tetrachotomy detail attribute is missing');
assert(
  tetrachotomyHtml.includes('data-partition-composition="tetrachotomy"'),
  'tetrachotomy composition attribute is missing',
);
assert(
  tetrachotomyHtml.includes('data-partition-types-panel="tetrachotomy"'),
  'tetrachotomy types panel attribute is missing',
);
assert(
  tetrachotomyHtml.includes('Экстраверсия / Интроверсия + Иррациональность / Рациональность'),
  'tetrachotomy trait heading is missing or corrupted',
);
assert(tetrachotomyHtml.includes('Классы тетрахотомии'), 'tetrachotomy class heading is missing');
assert(
  countOccurrences(tetrachotomyHtml, 'data-composition-component-index=') === 2,
  'tetrachotomy should render 2 component dichotomies',
);
assert(
  countOccurrences(tetrachotomyHtml, 'data-tetrachotomy-class=') === 4,
  'tetrachotomy should render 4 class buttons',
);
assert(
  countOccurrences(tetrachotomyHtml, 'data-type-id=') === 16,
  'tetrachotomy should render one 16-type final pattern',
);
assert(
  countOccurrences(tetrachotomyHtml, 'data-model-preview-type-id=') === 4,
  'tetrachotomy should render 4 Model A previews',
);
assert(
  !tetrachotomyHtml.includes('data-partition-diagnostic='),
  'valid tetrachotomy should not render diagnostics',
);

const octochotomyHtml = renderWithSearch('?mode=octochotomy&traits=vertness,nalness,carefree');

assertCommonRender('valid octochotomy', octochotomyHtml);
assert(octochotomyHtml.includes('data-octochotomy-detail'), 'octochotomy detail attribute is missing');
assert(
  octochotomyHtml.includes('data-partition-composition="octochotomy"'),
  'octochotomy composition attribute is missing',
);
assert(
  octochotomyHtml.includes('data-partition-types-panel="octochotomy"'),
  'octochotomy types panel attribute is missing',
);
assert(
  octochotomyHtml.includes('Экстраверсия / Интроверсия + Иррациональность / Рациональность + Беспечность / Предусмотрительность'),
  'octochotomy trait heading is missing or corrupted',
);
assert(octochotomyHtml.includes('Классы октохотомии'), 'octochotomy class heading is missing');
assert(
  countOccurrences(octochotomyHtml, 'data-composition-component-index=') === 3,
  'octochotomy should render 3 component dichotomies',
);
assert(
  countOccurrences(octochotomyHtml, 'data-octochotomy-class=') === 8,
  'octochotomy should render 8 class buttons',
);
assert(
  countOccurrences(octochotomyHtml, 'data-type-id=') === 16,
  'octochotomy should render one 16-type final pattern',
);
assert(
  countOccurrences(octochotomyHtml, 'data-model-preview-type-id=') === 2,
  'octochotomy should render 2 Model A previews',
);
assert(
  !octochotomyHtml.includes('data-partition-diagnostic='),
  'valid octochotomy should not render diagnostics',
);

const dependentOctochotomyHtml = renderWithSearch('?mode=octochotomy&traits=vertness,nalness,talness');

assertCommonRender('dependent octochotomy', dependentOctochotomyHtml);
assert(
  dependentOctochotomyHtml.includes('data-partition-diagnostic="octochotomy"'),
  'dependent octochotomy diagnostic attribute is missing',
);
assert(
  dependentOctochotomyHtml.includes('data-partition-diagnostic-reason="dependent-traits"'),
  'dependent octochotomy diagnostic reason is missing',
);
assert(
  dependentOctochotomyHtml.includes('Selected traits are dependent and cannot form a full partition.')
    || dependentOctochotomyHtml.includes('Selected traits do not form equally sized partition classes.'),
  'dependent octochotomy diagnostic message is missing',
);
assert(
  dependentOctochotomyHtml.includes('Экстраверсия / Интроверсия + Иррациональность / Рациональность + Статика / Динамика'),
  'dependent octochotomy trait summary is missing or corrupted',
);
assert(
  !dependentOctochotomyHtml.includes('data-octochotomy-detail'),
  'dependent octochotomy should not render detail view',
);
assert(
  countOccurrences(dependentOctochotomyHtml, 'data-octochotomy-class=') === 0,
  'dependent octochotomy should not render class buttons',
);

console.log(
  `Render smoke passed: default trait, tetrachotomy, octochotomy, dependent diagnostic; ${REININ_TRAITS.length} traits, ${ASPECTS.length} aspects, ${FUNCTIONS.length} functions.`,
);
