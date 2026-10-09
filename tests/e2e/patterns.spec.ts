import { expect, test } from '@playwright/test';
import { HADAMARD_MATRICES } from '../../src/data/hadamard';

const names = { aspecton: 'Аспектон', functionon: 'Функцион', socion: 'Социон' };
const titles = { aspecton: 'Паттерны Аспектона', functionon: 'Паттерны Функциона', socion: 'Паттерны Социона' };

for (const theme of ['dark', 'light']) {
  test(`source pattern atlases and original images in ${theme}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/?page=reference&theme=${theme}`);
    for (const matrix of HADAMARD_MATRICES) {
      await page.getByRole('navigation', { name: 'Паттерны носителей' }).getByRole('link', { name: names[matrix.id], exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#patterns-${matrix.id}$`));
      const atlas = page.locator(`[data-hadamard-pattern-atlas="${matrix.id}"]`);
      await expect(atlas.locator('[data-pattern-card]')).toHaveCount(matrix.rows.length);
      await expect(atlas.locator('[data-pattern-index]')).toHaveCount(0);
      for (const [rowIndex, row] of matrix.rows.entries()) {
        const card = atlas.locator(`[data-pattern-card="${matrix.id}:${row.id}"]`);
        const values = await card.locator('[data-pattern-cell]').evaluateAll(cells => cells.map(cell => ({ value: Number(cell.getAttribute('data-pattern-value')), index: Number(cell.getAttribute('data-pattern-cell')), x: Number(cell.getAttribute('x')), y: Number(cell.getAttribute('y')) })));
        expect(values).toEqual(matrix.values[rowIndex].map((value, index) => ({ value, index: index + 1, x: index % 4 * 40 + 1, y: Math.floor(index / 4) * 40 + 1 })));
        expect(await card.locator('svg').getAttribute('viewBox')).toBe(matrix.id === 'socion' ? '0 0 160 160' : '0 0 160 80');
        const bounds = await card.locator('svg').evaluate(element => ({ left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right, width: innerWidth }));
        expect(bounds.left).toBeGreaterThanOrEqual(0);
        expect(bounds.right).toBeLessThanOrEqual(bounds.width);
        if (matrix.id === 'socion') await expect(card).toHaveAttribute('data-pattern-quadra', ['Альфа', 'Бета', 'Гамма', 'Дельта'][Math.floor(rowIndex / 4)]);
      }
      if (theme === 'dark') await expect(atlas.locator('[data-pattern-gallery]')).toHaveScreenshot(`patterns-${matrix.id}.png`, { timeout: 15000, maxDiffPixelRatio: 0.003 });
      await page.getByRole('checkbox', { name: `${titles[matrix.id]}: номера столбцов`, exact: true }).check();
      await expect(atlas.locator('[data-pattern-index]')).toHaveCount(matrix.rows.length * matrix.columns.length);
      const references = atlas.locator('[data-pattern-references]');
      await references.locator('summary').click();
      const images = references.locator('img');
      await expect(images).toHaveCount(matrix.id === 'functionon' ? 2 : 1);
      for (const image of await images.all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)).toBe(true);
        expect((await image.getAttribute('src'))!).toContain('/reference/patterns/');
      }
      await references.locator('summary').click();
    }
    const functions = page.locator('[data-function-dichotomy]');
    await expect(functions).toHaveCount(7);
    if (theme === 'dark') await expect(page.locator('[data-function-dichotomies]')).toHaveScreenshot('patterns-function-dichotomies.png', { timeout: 15000, maxDiffPixelRatio: 0.003 });
    const positives = [[1, 2, 3, 4], [1, 3, 5, 7], [1, 2, 7, 8], [1, 2, 5, 6], [1, 4, 5, 8], [1, 4, 6, 7], [1, 3, 6, 8]];
    for (const [index, figure] of (await functions.all()).entries()) {
      expect(await figure.locator('[data-function-position]').evaluateAll(cells => cells.map(cell => Number(cell.getAttribute('data-function-position'))))).toEqual([1, 2, 4, 3, 6, 5, 7, 8]);
      expect(await figure.locator('[data-function-positive="true"]').evaluateAll(cells => cells.map(cell => Number(cell.getAttribute('data-function-position'))).sort((a, b) => a - b))).toEqual(positives[index]);
    }
    const before = await page.locator('[data-pattern-cell]').evaluateAll(cells => cells.map(cell => cell.getAttribute('fill')));
    await page.getByLabel('Кодирование матриц', { exact: true }).selectOption('binary');
    expect(await page.locator('[data-pattern-cell]').evaluateAll(cells => cells.map(cell => cell.getAttribute('fill')))).toEqual(before);
    await expect(page.locator('[data-pattern-card="aspecton:Ne"] svg > title')).toHaveText('ЧИ: 1 1 1 1 1 1 1 1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    expect(errors).toEqual([]);
  });
}
