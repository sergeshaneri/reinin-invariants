import { expect, test } from '@playwright/test';

for (const theme of ['dark', 'light']) {
  test(`block surfaces fit both cracy presentations in ${theme}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/?trait=democracy&theme=${theme}`);
    const formula = page.locator('[data-block-formula]');
    await expect(formula).toBeVisible();
    await expect(formula.locator('[data-formula-aspect-block]')).toHaveCount(4);
    await expect(formula.locator('[data-formula-function-block]')).toHaveCount(4);
    await expect(formula.locator('.block-number')).toHaveCount(8);
    await expect(formula.locator('.block-permutation-note')).toContainText('Перестановка целых блоков');
    for (const width of [280, 380, 680]) {
      await formula.evaluate((element, size) => { element.style.width = `${size}px`; element.style.maxWidth = '100%'; }, width);
      expect(await formula.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    }
    await formula.evaluate(element => { element.style.width = ''; element.style.maxWidth = ''; });
    const typography = await formula.locator('.block-label').first().evaluate(element => {
      const style = getComputedStyle(element);
      return { transform: style.textTransform, weight: style.fontWeight };
    });
    expect(typography).toEqual({ transform: 'none', weight: '400' });
    await formula.screenshot({ path: testInfo.outputPath(`formula-${theme}.png`), animations: 'disabled' });

    await page.goto(`/?mode=tetrachotomy&traits=democracy,yielding&theme=${theme}`);
    const cracy = page.locator('[data-tetrachotomy-cracy-panel="tetra-08"]');
    await expect(cracy).toBeVisible();
    await expect(cracy.locator('[data-cracy-block-condition]')).toHaveCount(4);
    await expect(cracy.locator('.block-number')).toHaveCount(32);
    const condition = cracy.locator('[data-cracy-block-condition]').first();
    const colors = await condition.locator('.block-tile').first().evaluate(element => {
      const tile = getComputedStyle(element).backgroundColor;
      const panel = getComputedStyle(element.closest('.block-surface')!).backgroundColor;
      return { tile, panel };
    });
    expect(colors.tile).not.toBe(colors.panel);
    for (const width of [280, 380, 680]) {
      await cracy.evaluate((element, size) => { element.style.width = `${size}px`; element.style.maxWidth = '100%'; }, width);
      expect(await cracy.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    }
    await cracy.evaluate(element => { element.style.width = ''; element.style.maxWidth = ''; });
    await condition.screenshot({ path: testInfo.outputPath(`condition-${theme}.png`), animations: 'disabled' });
    await cracy.locator('[data-cracy-view-select="1"]').click();
    await expect(cracy.locator('[data-cracy-ordinary-diagram]')).toHaveAttribute('data-cracy-ordinary-diagram', '1');
    await expect(cracy.locator('[data-cracy-ordinary-diagram] button')).toHaveCount(16);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
