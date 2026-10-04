import { expect, test } from '@playwright/test';

for (const theme of ['dark', 'light']) {
  test(`hides source table metadata in tetra-31 in ${theme}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/?mode=tetrachotomy&traits=asking,tactical&theme=${theme}`);
    const panel = page.locator('[data-tetrachotomy-aspect-function-panel="tetra-31"]');
    await expect(panel).toBeVisible();
    const selector = page.locator('[data-tetrachotomy-class-select]');
    const classes = await selector.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
    expect(classes).toHaveLength(4);
    for (const key of classes) {
      await selector.selectOption(key);
      await expect(panel).toHaveCount(1);
      await expect(panel.locator('.tetra-panel-source')).toHaveCount(0);
      await expect(panel).not.toContainText('Источник');
      await expect(panel.locator('[data-tetrachotomy-aspect-function-row]')).toHaveCount(4);
    }
    await panel.evaluate(element => { element.style.width = '260px'; });
    expect(await panel.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await panel.locator('.tetra-panel-eyebrow').evaluate(element => {
      const rect = element.getBoundingClientRect();
      const parent = element.closest('.tetra-panel-header')!.getBoundingClientRect();
      return rect.right <= parent.right;
    })).toBe(true);
    await panel.evaluate(element => { element.style.width = ''; });
    const additional = page.locator('[data-tetrachotomy-extra-materials]');
    await additional.locator('summary').click();
    const formula = page.locator('[data-tetrachotomy-formula-panel="tetra-31"]');
    await expect(formula).toBeVisible();
    await expect(formula).not.toContainText('Таблица 33');
    expect(errors).toEqual([]);
  });
}
