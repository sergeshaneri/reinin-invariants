import { expect, test } from '@playwright/test';
import { getOctochotomyFormulaById } from '../../src/data/octochotomies';

test('quasi-identity maps all eight source pairs into dimensionality blocks', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const formula = getOctochotomyFormulaById('octo-08-quasi-identity')!;
  for (const theme of ['dark', 'light']) {
    await page.goto(`/?mode=octochotomy&traits=positivism,yielding,logic&theme=${theme}`);
    const select = page.locator('[data-octochotomy-class-select]');
    const panel = page.locator('[data-octochotomy-invariant]');
    await expect(panel).toBeVisible();
    expect(await panel.evaluate(element => {
      const box = element.getBoundingClientRect();
      return box.top < window.innerHeight && box.bottom > 0;
    })).toBe(true);
    await page.locator('[data-display-settings] > summary').click();
    const keys = await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
    expect(keys).toHaveLength(8);
    const seen = new Set<string>();
    for (const key of keys) {
      await select.selectOption(key);
      const ids = await page.locator('[data-model-preview-type-id]').evaluateAll(elements => elements.map(element => element.getAttribute('data-model-preview-type-id')!));
      expect(ids).toHaveLength(2);
      seen.add([...ids].sort().join('|'));
      const source = formula.classes!.find(group => group.typeIds.every(id => ids.includes(id)))!;
      expect(source).toBeDefined();
      const rows = panel.locator('[data-tetrachotomy-aspect-function-row]');
      await expect(rows).toHaveCount(4);
      for (const [index, row] of source.sourceBlock!.rows.entries()) {
        await expect(rows.nth(index)).toHaveAttribute('data-tetrachotomy-aspect-function-row', row.aspectText);
        await expect(rows.nth(index)).toContainText(row.functionBlockLabel);
        expect(await rows.nth(index).locator('[data-source-function-chip]').allTextContents()).toEqual(row.functionIds.map(String));
      }
      for (const label of ['Пикто', 'Аббр.', 'Оба']) {
        await page.getByRole('tab', { name: label, exact: true }).click();
        const aspect = panel.locator('[data-tetrachotomy-source-aspect]').first();
        await aspect.focus();
        const rowIndex = await aspect.getAttribute('data-source-row-index');
        await expect(panel.locator(`[data-tetrachotomy-source-aspect][data-source-row-index="${rowIndex}"]`)).toHaveCount(2);
        await expect(panel.locator(`[data-tetrachotomy-source-function][data-source-row-index="${rowIndex}"]`)).toHaveCount(2);
        await expect.poll(() => panel.locator('[data-tetrachotomy-source-function]').evaluateAll(elements => elements.filter(element => getComputedStyle(element).opacity === '1').length)).toBe(2);
        await aspect.evaluate(element => (element as HTMLElement).blur());
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    }
    expect(seen.size).toBe(8);
    await select.selectOption(keys[0]);
    await page.reload();
    await expect(select).toHaveValue(keys[0]);
    await expect(panel.locator('+ [data-partition-types-panel]')).toHaveCount(1);
    if (theme === 'dark') {
      await panel.scrollIntoViewIfNeeded();
      await panel.screenshot({ path: `artifacts/octochotomy-dimensions-${test.info().project.name}.png` });
    }
  }
  expect(errors).toEqual([]);
});
