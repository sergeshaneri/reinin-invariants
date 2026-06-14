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

test('loads the built app from the production base path', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/reinin-invariants/');

  await expect(page.locator('#root')).not.toBeEmpty();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Инварианты');
  await expect(page.getByRole('heading', { name: 'Признаки' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Аспектон' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Функцион' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Экстраверсия \/ Интроверсия/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Интуиция возможностей/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /1 Базовая/ })).toBeVisible();

  expect(errors).toEqual([]);
});
