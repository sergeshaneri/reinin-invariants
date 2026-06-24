import { expect, test, type Page } from '@playwright/test';

const collectPageErrors = (page: Page) => {
  const errors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
};

test('renders the app and key diagram controls', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Инварианты');
  await expect(page.getByRole('tab', { name: 'Признак' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Пикто' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Тип' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Признаки' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Аспектон' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Функцион' })).toBeVisible();
  await expect(page.locator('[data-trait-nav="vertness"]')).toBeVisible();
  await expect(page.getByRole('button', { name: /Интуиция возможностей/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /1 Базовая/ })).toBeVisible();

  await page.getByRole('button', { name: /Интуиция возможностей/ }).click();
  await page.getByRole('button', { name: /1 Базовая/ }).click();

  await expect(page).toHaveScreenshot('reinin-invariants-app.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.03,
  });

  expect(errors).toEqual([]);
});

test('syncs selected trait, pole, and view with the URL', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?trait=democracy');
  await expect(page.locator('[data-dichotomy-detail="democracy"]')).toHaveAttribute('data-selected-pole-index', '0');
  await expect(page).not.toHaveURL(/pole=/);

  await page.goto('/?trait=democracy&pole=1&view=2');

  await expect(page.locator('[data-trait-nav="democracy"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('tab', { name: 'Аристократы' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Мерности (4Б)' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/trait=democracy/);
  await expect(page).toHaveURL(/pole=1/);
  await expect(page).toHaveURL(/view=2/);

  await page.locator('[data-trait-nav="positivism"]').click();
  await expect(page.locator('[data-trait-nav="positivism"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('tab', { name: 'Позитивисты' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Эквивалентность 1' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/trait=positivism/);
  await expect(page).not.toHaveURL(/pole=/);
  await expect(page).not.toHaveURL(/view=/);

  await page.getByRole('tab', { name: 'Негативисты' }).click();
  await page.getByRole('tab', { name: 'Эквивалентность 2' }).click();

  await expect(page.getByRole('tab', { name: 'Негативисты' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Эквивалентность 2' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/trait=positivism/);
  await expect(page).toHaveURL(/pole=1/);
  await expect(page).toHaveURL(/view=1/);

  expect(errors).toEqual([]);
});

test('keeps dichotomy gallery and sidebar selection in sync', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?trait=vertness&pole=1&view=1');

  await page.locator('[data-dichotomy-card="democracy"]').click();
  await expect(page.locator('[data-dichotomy-card="democracy"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-trait-nav="democracy"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/trait=democracy/);
  await expect(page).not.toHaveURL(/pole=/);
  await expect(page).not.toHaveURL(/view=/);

  await page.locator('[data-trait-nav="positivism"]').click();
  await expect(page.locator('[data-trait-nav="positivism"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-dichotomy-card="positivism"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/trait=positivism/);

  expect(errors).toEqual([]);
});

test('selects the dichotomy pole from the 16-type pattern', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?trait=vertness');

  await expect(page.locator('[data-partition-pattern="dichotomy"]')).toBeVisible();
  await expect(page.locator('[data-partition-pattern="dichotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(page.locator('[data-type-id="ILE"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-partition-types-panel="dichotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:0');
  await expect(page.locator('[data-model-preview-type-id]')).toHaveCount(8);
  await expect(page.locator('[data-model-preview-type-id="ILE"]')).toBeVisible();
  await expect(page.locator('[data-model-preview-type-id="SEI"]')).toHaveCount(0);
  await expect(page.locator('[data-model-preview-highlighted="true"]')).toHaveCount(64);

  await page.locator('[data-type-id="SEI"]').click();

  await expect(page.getByRole('tab', { name: 'Интроверты' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-type-id="SEI"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-partition-types-panel="dichotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:1');
  await expect(page.locator('[data-model-preview-type-id="SEI"]')).toBeVisible();
  await expect(page.locator('[data-model-preview-type-id="ILE"]')).toHaveCount(0);
  await expect(page).toHaveURL(/trait=vertness/);
  await expect(page).toHaveURL(/pole=1/);

  expect(errors).toEqual([]);
});

test('switches app modes through the URL state', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?trait=democracy');

  await expect(page.getByRole('tab', { name: 'Признак' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).not.toHaveURL(/mode=/);

  await page.getByRole('tab', { name: 'Тип' }).click();
  await expect(page.getByRole('tab', { name: 'Тип' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'ТИМ' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^ИЛЭ/ })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('heading', { name: 'ИЛЭ' })).toBeVisible();
  await expect(page.getByText('Модель А')).toBeVisible();
  await expect(page.getByText('Эго', { exact: true })).toHaveCount(2);
  await expect(page.getByText('Суперид', { exact: true })).toHaveCount(2);
  await expect(page.getByText('Альфа')).toBeVisible();
  await expect(page.getByText('ENTp')).toHaveCount(0);
  await expect(page.getByText('ILE')).toHaveCount(0);
  await expect(page.getByText('SEI')).toHaveCount(0);
  await expect(page.getByText('alpha')).toHaveCount(0);
  await expect(page.locator('[data-invariant-highlight]')).toHaveCount(0);
  await expect(page.locator('[data-aspect-display-mode="icon"]')).toBeVisible();
  await expect(page.locator('[data-aspect-glyph-mode="icon"]')).toHaveCount(8);
  await expect(page).toHaveURL(/mode=type/);
  await expect(page).toHaveURL(/type=ILE/);
  await expect(page).not.toHaveURL(/trait=/);
  await expect(page).not.toHaveURL(/pole=/);
  await expect(page).not.toHaveURL(/view=/);

  await page.getByRole('button', { name: /^ЛСИ/ }).click();
  await expect(page.getByRole('button', { name: /^ЛСИ/ })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('heading', { name: 'ЛСИ' })).toBeVisible();
  await expect(page).toHaveURL(/type=LSI/);

  await page.getByRole('tab', { name: 'Аббр.' }).click();
  await expect(page.getByRole('tab', { name: 'Аббр.' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-aspect-display-mode="symbol"]')).toBeVisible();
  await expect(page.locator('[data-aspect-glyph-mode="symbol"]')).toHaveCount(8);

  await page.getByRole('tab', { name: 'Оба' }).click();
  await expect(page.getByRole('tab', { name: 'Оба' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-aspect-display-mode="icon-symbol"]')).toBeVisible();
  await expect(page.locator('[data-aspect-glyph-mode="icon-symbol"]')).toHaveCount(8);

  await page.getByRole('tab', { name: 'Тетрахотомия' }).click();
  await expect(page.getByRole('tab', { name: 'Тетрахотомия' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-partition-pattern="tetrachotomy"]')).toBeVisible();
  await expect(page.locator('[data-partition-pattern="tetrachotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(page.locator('[data-type-id="ILE"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-type-id="SEI"]').click();
  await expect(page.locator('[data-type-id="SEI"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/mode=tetrachotomy/);
  await expect(page).toHaveURL(/class=/);
  await expect(page).not.toHaveURL(/type=/);

  await page.getByRole('tab', { name: 'Октохотомия' }).click();
  await expect(page.getByRole('tab', { name: 'Октохотомия' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-partition-pattern="octochotomy"]')).toBeVisible();
  await expect(page.locator('[data-partition-pattern="octochotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(page).toHaveURL(/mode=octochotomy/);

  await page.getByRole('tab', { name: 'Признак' }).click();
  await expect(page.getByRole('tab', { name: 'Признак' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).not.toHaveURL(/mode=/);
  await expect(page).not.toHaveURL(/type=/);
  await expect(page).toHaveURL(/trait=democracy/);

  expect(errors).toEqual([]);
});

test('syncs theme toggle with URL and local storage', async ({ page }) => {
  await page.goto('/?theme=dark');

  await expect(page.locator('#root > [data-theme="dark"]')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('tab', { name: 'Темная' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/theme=dark/);

  await page.getByRole('tab', { name: 'Светлая' }).click();

  await expect(page.locator('#root > [data-theme="light"]')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page).not.toHaveURL(/theme=dark/);
  expect(await page.evaluate(() => localStorage.getItem('reinin-invariants-theme'))).toBe('light');

  await page.getByRole('tab', { name: 'Темная' }).click();

  await expect(page.locator('#root > [data-theme="dark"]')).toBeVisible();
  await expect(page).toHaveURL(/theme=dark/);
  expect(await page.evaluate(() => localStorage.getItem('reinin-invariants-theme'))).toBe('dark');
});

test('chooses tetra and octo partitions through sequential trait selection', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=tetrachotomy');
  await expect(page.locator('[data-partition-chooser="tetrachotomy"]')).toBeVisible();
  await expect(page.locator('[data-partition-catalog-count="tetrachotomy"]')).toHaveText('35');
  await expect(page.locator('[data-partition-structural-count="tetrachotomy"]')).toHaveText('105');

  await page.locator('[data-partition-sequential-slot="1"][data-partition-sequential-trait="talness"]').click();
  await expect(page.locator('[data-partition-pattern="tetrachotomy"]')).toBeVisible();
  await expect(page.locator('[data-partition-structural-entry="vertness+talness"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/mode=tetrachotomy/);
  await expect(page).toHaveURL(/traits=vertness%2Ctalness/);

  await page.getByRole('tab', { name: 'Октохотомия' }).click();
  await expect(page.locator('[data-partition-chooser="octochotomy"]')).toBeVisible();
  await page.locator('[data-partition-sequential-slot="2"][data-partition-sequential-trait="yielding"]').click();
  await expect(page.locator('[data-partition-pattern="octochotomy"]')).toBeVisible();
  await expect(page.locator('[data-partition-catalog-entry="vertness+nalness+yielding"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/mode=octochotomy/);
  await expect(page).toHaveURL(/traits=vertness%2Cnalness%2Cyielding/);

  expect(errors).toEqual([]);
});

test('chooses tetra and octo partitions through catalog entries', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=tetrachotomy');
  await page.locator('[data-partition-catalog-entry="tetra-35"]').click();
  await expect(page.locator('[data-partition-catalog-entry="tetra-35"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-partition-pattern="tetrachotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(page).toHaveURL(/traits=asking%2Cjudicious/);

  await page.locator('[data-partition-structural-entry="asking+process"]').click();
  await expect(page.locator('[data-partition-structural-entry="asking+process"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/traits=asking%2Cprocess/);

  await page.getByRole('tab', { name: 'Октохотомия' }).click();
  await page.locator('[data-partition-catalog-entry="vertness+nalness+asking"]').click();
  await expect(page.locator('[data-partition-catalog-entry="vertness+nalness+asking"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-partition-pattern="octochotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(page).toHaveURL(/traits=vertness%2Cnalness%2Casking/);

  expect(errors).toEqual([]);
});

test('chooses tetra and octo partitions through visual pattern gallery', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=tetrachotomy');
  await page.locator('[data-partition-gallery-entry="tetra-07"]').click();
  await expect(page.locator('[data-partition-gallery-entry="tetra-07"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-partition-catalog-entry="tetra-07"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/traits=nalness%2Ctalness/);

  await page.getByRole('tab', { name: 'Октохотомия' }).click();
  await page.locator('[data-partition-gallery-entry="vertness+talness+carefree"]').click();
  await expect(page.locator('[data-partition-gallery-entry="vertness+talness+carefree"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-partition-catalog-entry="vertness+talness+carefree"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/traits=vertness%2Ctalness%2Ccarefree/);

  expect(errors).toEqual([]);
});

test('shows tetrachotomy composition and toggles component poles', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=tetrachotomy&traits=vertness,nalness');

  const composition = page.locator('[data-partition-composition="tetrachotomy"]');
  const finalPattern = composition.locator('[data-composition-final="true"]');
  const detail = page.locator('[data-tetrachotomy-detail]');

  await expect(detail).toHaveAttribute('data-selected-class-key', 'vertness:0|nalness:0');
  await expect(composition).toBeVisible();
  await expect(detail.locator('[data-tetrachotomy-class]')).toHaveCount(4);
  await expect(detail.locator('[data-tetrachotomy-class="vertness:0|nalness:0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-partition-types-panel="tetrachotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:0|nalness:0');
  await expect(detail.locator('[data-partition-types-panel="tetrachotomy"] [data-model-preview-type-id]')).toHaveCount(4);
  await expect(detail.locator('[data-partition-types-panel="tetrachotomy"] [data-model-preview-type-id="ILE"]')).toBeVisible();
  await expect(composition.locator('[data-composition-component-index]')).toHaveCount(2);
  await expect(composition.locator('[data-composition-component-index="0"]')).toHaveAttribute('data-composition-component-trait', 'vertness');
  await expect(composition.locator('[data-composition-component-index="1"]')).toHaveAttribute('data-composition-component-trait', 'nalness');
  await expect(finalPattern.locator('[data-partition-pattern="tetrachotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(finalPattern.locator('[data-partition-pattern="tetrachotomy"] [aria-pressed="true"]')).toHaveCount(4);

  await composition.locator('[data-composition-pole="vertness"][data-composition-pole-index="1"]').click();

  await expect(composition.locator('[data-composition-pole="vertness"][data-composition-pole-index="1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(composition.locator('[data-composition-pole="nalness"][data-composition-pole-index="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-tetrachotomy-class="vertness:1|nalness:0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-partition-types-panel="tetrachotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:1|nalness:0');
  await expect(finalPattern.locator('[data-partition-pattern="tetrachotomy"] [aria-pressed="true"]')).toHaveCount(4);
  await expect(page).toHaveURL(/class=vertness%3A1%7Cnalness%3A0/);

  await finalPattern.locator('[data-type-id="ILE"]').click();

  await expect(composition.locator('[data-composition-pole="vertness"][data-composition-pole-index="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(composition.locator('[data-composition-pole="nalness"][data-composition-pole-index="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-tetrachotomy-class="vertness:0|nalness:0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/class=vertness%3A0%7Cnalness%3A0/);

  expect(errors).toEqual([]);
});

test('shows octochotomy composition and toggles component poles', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=octochotomy&traits=vertness,nalness,carefree');

  const composition = page.locator('[data-partition-composition="octochotomy"]');
  const finalPattern = composition.locator('[data-composition-final="true"]');
  const detail = page.locator('[data-octochotomy-detail]');

  await expect(detail).toHaveAttribute('data-selected-class-key', 'vertness:0|nalness:0|carefree:0');
  await expect(composition).toBeVisible();
  await expect(detail.locator('[data-octochotomy-class]')).toHaveCount(8);
  await expect(detail.locator('[data-octochotomy-class="vertness:0|nalness:0|carefree:0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-partition-types-panel="octochotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:0|nalness:0|carefree:0');
  await expect(detail.locator('[data-partition-types-panel="octochotomy"] [data-model-preview-type-id]')).toHaveCount(2);
  await expect(detail.locator('[data-partition-types-panel="octochotomy"] [data-model-preview-type-id="ILE"]')).toBeVisible();
  await expect(composition.locator('[data-composition-component-index]')).toHaveCount(3);
  await expect(composition.locator('[data-composition-component-index="0"]')).toHaveAttribute('data-composition-component-trait', 'vertness');
  await expect(composition.locator('[data-composition-component-index="1"]')).toHaveAttribute('data-composition-component-trait', 'nalness');
  await expect(composition.locator('[data-composition-component-index="2"]')).toHaveAttribute('data-composition-component-trait', 'carefree');
  await expect(finalPattern.locator('[data-partition-pattern="octochotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(finalPattern.locator('[data-partition-pattern="octochotomy"] [aria-pressed="true"]')).toHaveCount(2);

  await composition.locator('[data-composition-pole="carefree"][data-composition-pole-index="1"]').click();

  await expect(composition.locator('[data-composition-pole="vertness"][data-composition-pole-index="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(composition.locator('[data-composition-pole="nalness"][data-composition-pole-index="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(composition.locator('[data-composition-pole="carefree"][data-composition-pole-index="1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-octochotomy-class="vertness:0|nalness:0|carefree:1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-partition-types-panel="octochotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:0|nalness:0|carefree:1');
  await expect(finalPattern.locator('[data-partition-pattern="octochotomy"] [aria-pressed="true"]')).toHaveCount(2);
  await expect(page).toHaveURL(/class=vertness%3A0%7Cnalness%3A0%7Ccarefree%3A1/);

  expect(errors).toEqual([]);
});

test('shows octochotomy diagnostics for dependent URL triples', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=octochotomy&traits=vertness,nalness,talness');

  await expect(page.locator('[data-partition-chooser="octochotomy"]')).toBeVisible();
  await expect(page.locator('[data-octochotomy-detail]')).toHaveCount(0);
  await expect(page.locator('[data-partition-pattern="octochotomy"]')).toHaveCount(0);
  await expect(page.locator('[data-partition-diagnostic="octochotomy"]')).toHaveAttribute('data-partition-diagnostic-reason', 'dependent-traits');
  await expect(page.locator('[data-partition-diagnostic="octochotomy"]')).toContainText('Selected traits');
  await expect(page).toHaveURL(/mode=octochotomy/);
  await expect(page).toHaveURL(/traits=vertness%2Cnalness%2Ctalness/);
  await expect(page).not.toHaveURL(/class=/);

  expect(errors).toEqual([]);
});

test('renders type mode Model A without English abbreviations', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=type&type=SEI');

  await expect(page.getByRole('tab', { name: 'Тип' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'ТИМ' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^СЭИ/ })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('heading', { name: 'СЭИ' })).toBeVisible();
  await expect(page.getByText('Модель А')).toBeVisible();
  await expect(page.getByText('Альфа')).toBeVisible();
  await expect(page.getByText('SEI')).toHaveCount(0);
  await expect(page.getByText('ILE')).toHaveCount(0);
  await expect(page.getByText('ISFp')).toHaveCount(0);
  await expect(page.getByText('alpha')).toHaveCount(0);
  await expect(page.locator('[data-invariant-highlight]')).toHaveCount(0);

  await expect(page).toHaveScreenshot('reinin-invariants-type-mode.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.03,
  });

  expect(errors).toEqual([]);
});
