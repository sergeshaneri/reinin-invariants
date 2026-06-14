import { renderToString } from 'react-dom/server';
import App from '../src/App';
import {
  ASPECTS,
  FUNCTIONS,
  REININ_TRAITS,
} from '../src/data/socionics';

const html = renderToString(<App />);
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

assert(html.length > 1_000, 'rendered HTML is unexpectedly small');
assert(!html.includes('\uFFFD'), 'rendered HTML contains replacement characters');
assert(html.includes(defaultTrait.name), `default trait "${defaultTrait.id}" is missing`);
assert(html.includes(defaultPole.name), `default pole for "${defaultTrait.id}" is missing`);

for (const text of expectedRussianText) {
  assert(html.includes(text), `canonical Russian text "${text}" is missing or corrupted`);
}

for (const trait of REININ_TRAITS) {
  assert(html.includes(trait.name), `trait "${trait.id}" is missing from navigation`);
}

for (const aspect of ASPECTS) {
  assert(html.includes(`>${aspect.name}<`), `aspect "${aspect.id}" tile is missing`);
}

for (const fn of FUNCTIONS) {
  assert(html.includes(`>${fn.id}<`), `function "${fn.id}" tile is missing`);
}

console.log(
  `Render smoke passed: ${REININ_TRAITS.length} traits, ${ASPECTS.length} aspects, ${FUNCTIONS.length} functions.`,
);
