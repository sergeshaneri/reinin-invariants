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
  await expect(page.getByRole('tab', { name: 'Пиктограммы' })).toHaveAttribute('aria-selected', 'true');
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
  await expect(page.locator('[data-aspect-display-mode="abbrev"]')).toBeVisible();
  await expect(page.locator('[data-aspect-glyph-mode="abbrev"]')).toHaveCount(8);

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
