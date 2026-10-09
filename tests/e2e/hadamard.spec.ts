import { expect, test } from '@playwright/test';

for (const theme of ['dark', 'light']) {
  test(`Hadamard theory, source axes and binary encoding in ${theme}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/?page=reference&theme=${theme}`);
    await page.getByRole('link', { name: 'Матрицы Адамара', exact: true }).click();
    await expect(page).toHaveURL(/#hadamard$/);
    await expect(page.locator('[data-hadamard-matrix]')).toHaveCount(3);
    await expect(page.locator('[data-hadamard-cell]')).toHaveCount(384);
    await expect(page.locator('[data-hadamard-annotation]')).toHaveCount(3);
    for (const [id, size] of [['aspecton', 8], ['functionon', 8], ['socion', 16]] as const) {
      const matrix = page.locator(`[data-hadamard-matrix="${id}"]`);
      await expect(matrix.locator('[data-hadamard-row]')).toHaveCount(size);
      await expect(matrix.locator('[data-hadamard-cell]')).toHaveCount(size * size);
      expect(await matrix.locator('[data-hadamard-row]').first().locator('td').allTextContents()).toEqual(Array(size).fill('+'));
      const scroller = matrix.locator('..');
      const dimensions = await scroller.evaluate(element => ({ left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right, overflow: getComputedStyle(element).overflowX, width: innerWidth }));
      expect(dimensions.left).toBeGreaterThanOrEqual(0);
      expect(dimensions.right).toBeLessThanOrEqual(dimensions.width);
      expect(dimensions.overflow).toBe('auto');
    }
    expect(await page.locator('[data-hadamard-matrix="functionon"] [data-hadamard-row]').evaluateAll(rows => rows.map(row => row.getAttribute('data-hadamard-row')))).toEqual(['1', '5', '6', '2', '8', '4', '3', '7']);
    const signs = await page.locator('[data-hadamard-cell]').allTextContents();
    const values = await page.locator('[data-hadamard-cell]').evaluateAll(cells => cells.map(cell => Number(cell.getAttribute('data-hadamard-value'))));
    await page.getByLabel('Кодирование матриц', { exact: true }).selectOption('binary');
    expect(await page.locator('[data-hadamard-cell]').allTextContents()).toEqual(values.map(value => value === 1 ? '1' : '0'));
    expect(await page.locator('[data-hadamard-cell]').evaluateAll(cells => cells.map(cell => Number(cell.getAttribute('data-hadamard-value'))))).toEqual(values);
    await page.getByLabel('Кодирование матриц', { exact: true }).selectOption('signs');
    expect(await page.locator('[data-hadamard-cell]').allTextContents()).toEqual(signs);
    const relationships = page.locator('[data-hadamard-relations]');
    await relationships.getByText('Интераспектные отношения · 8 × 8', { exact: true }).click();
    await expect(relationships.locator('[data-aspect-relation]')).toHaveCount(64);
    await expect(relationships.locator('[data-aspect-relation="Ne:Si"]')).toHaveText('ДУ');
    await expect(relationships.locator('[data-aspect-relation="Ni:Ni"]')).toHaveText('ТЖ');
    await page.getByText('Полюса столбцов · Функцион · H₃', { exact: true }).click();
    await expect(page.locator('#hadamard-functionon')).toContainText('Ментальная');
    await expect(page.locator('#hadamard-functionon')).toContainText('Витальная');
    const sourceNote = page.locator('[data-hadamard-source-note]');
    await sourceNote.locator('summary').click();
    await expect(sourceNote).toContainText('(?!)');
    await expect(sourceNote).toContainText('межфункциональные отношения');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    expect(errors).toEqual([]);
  });
}
