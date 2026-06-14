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
  await expect(page.getByRole('tab', { name: 'Тип' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Признаки' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Аспектон' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Функцион' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Экстраверсия \/ Интроверсия/ })).toBeVisible();
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

  await page.goto('/?trait=democracy&pole=1&view=2');

  await expect(page.getByRole('button', { name: /Демократия \/ Аристократия/ })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('tab', { name: 'Аристократы' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Мерности (4Б)' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/trait=democracy/);
  await expect(page).toHaveURL(/pole=1/);
  await expect(page).toHaveURL(/view=2/);

  await page.getByRole('button', { name: /Позитивизм \/ Негативизм/ }).click();
  await expect(page.getByRole('button', { name: /Позитивизм \/ Негативизм/ })).toHaveAttribute('aria-current', 'true');
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

test('switches app modes through the URL state', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?trait=democracy');

  await expect(page.getByRole('tab', { name: 'Признак' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).not.toHaveURL(/mode=/);

  await page.getByRole('tab', { name: 'Тип' }).click();
  await expect(page.getByRole('tab', { name: 'Тип' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'TIM' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^ILE/ })).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/mode=type/);
  await expect(page).toHaveURL(/type=ILE/);
  await expect(page).toHaveURL(/trait=democracy/);

  await page.getByRole('button', { name: /^LSI/ }).click();
  await expect(page.getByRole('button', { name: /^LSI/ })).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/type=LSI/);

  await page.getByRole('tab', { name: 'Тетрахотомия' }).click();
  await expect(page.getByRole('tab', { name: 'Тетрахотомия' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/mode=tetrachotomy/);
  await expect(page).not.toHaveURL(/type=/);

  await page.getByRole('tab', { name: 'Октохотомия' }).click();
  await expect(page.getByRole('tab', { name: 'Октохотомия' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/mode=octochotomy/);

  await page.getByRole('tab', { name: 'Признак' }).click();
  await expect(page.getByRole('tab', { name: 'Признак' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).not.toHaveURL(/mode=/);
  await expect(page).not.toHaveURL(/type=/);
  await expect(page).toHaveURL(/trait=democracy/);

  expect(errors).toEqual([]);
});
