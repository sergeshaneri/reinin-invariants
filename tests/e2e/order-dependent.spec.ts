import { expect, test } from '@playwright/test';
import { ORDER_DEPENDENT_TETRACHOTOMIES } from '../../src/data/orderDependentTetrachotomies';

const basisByFormula: Record<string, string> = {
  'tetra-10': 'subjectivism,process', 'tetra-17': 'constructivism,process',
  'tetra-30': 'process,judicious', 'tetra-34': 'process,tactical',
  'tetra-09': 'positivism,logic', 'tetra-15': 'positivism,yielding',
  'tetra-24': 'subjectivism,tactical', 'tetra-25': 'constructivism,judicious',
  'tetra-11': 'constructivism,asking', 'tetra-16': 'subjectivism,asking',
  'tetra-31': 'asking,tactical', 'tetra-35': 'asking,judicious',
};

if (ORDER_DEPENDENT_TETRACHOTOMIES.length !== 12) throw new Error('Expected all twelve order-dependent formulas');

for (const configuration of ORDER_DEPENDENT_TETRACHOTOMIES) {
  const basis = basisByFormula[configuration.formulaId];
  if (!basis) throw new Error(`Missing browser case for ${configuration.formulaId}`);
  test(`shows the four 2-to-4 constraints followed by order for ${configuration.formulaId}`, async ({ page }) => {
    test.setTimeout(120_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const conditions = configuration.orderTraitId === 'process' ? 1 : 2;
    for (const theme of ['dark', 'light']) {
      await page.goto(`/?mode=tetrachotomy&traits=${basis}&theme=${theme}`);
      const source = page.locator(`[data-tetrachotomy-aspect-function-panel="${configuration.formulaId}"]`);
      const order = page.locator(`[data-tetrachotomy-order-panel="${configuration.formulaId}"]`);
      await expect(source).toHaveAttribute('data-source-block-status', 'extracted');
      await expect(source).toHaveAttribute('data-order-dependent-family', configuration.orderTraitId);
      await expect(source.locator('+ [data-tetrachotomy-order-panel]')).toHaveCount(1);
      await expect(page.locator('[data-tetrachotomy-cracy-panel]')).toHaveCount(0);
      await expect(order.locator('[data-order-condition]')).toHaveCount(conditions);
      const select = page.locator('[data-tetrachotomy-class-select]');
      const classes = await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
      expect(classes).toHaveLength(4);
      const seen = new Set<string>();
      const poles = new Set<string>();
      for (const classKey of classes) {
        await select.selectOption(classKey);
        seen.add(await select.inputValue());
        poles.add((await order.getAttribute('data-order-pole'))!);
        const rows = source.locator('[data-tetrachotomy-aspect-function-row]');
        await expect(rows).toHaveCount(4);
        for (const index of [0, 1, 2, 3]) {
          await expect(rows.nth(index).locator('[data-aspect-glyph-mode]')).toHaveCount(2);
          await expect(rows.nth(index).locator('[data-source-function-chip]')).toHaveCount(4);
        }
        const aspectTiles = source.locator('[data-tetrachotomy-source-aspect]');
        const functionTiles = source.locator('[data-tetrachotomy-source-function]');
        await expect(aspectTiles).toHaveCount(8);
        await expect(functionTiles).toHaveCount(8);
        await expect(source.locator('[data-source-membership-colors]')).toHaveCount(8);
        for (const index of [0, 1, 2, 3, 4, 5, 6, 7]) {
          expect((await functionTiles.nth(index).getAttribute('data-source-row-indices'))?.split(',')).toHaveLength(2);
        }
        // Every aspect must highlight all four eligible functions, including shared memberships.
        for (const index of [0, 1, 2, 3, 4, 5, 6, 7]) {
          await aspectTiles.nth(index).focus();
          await expect(source.locator('[data-tetrachotomy-source-function].opacity-100')).toHaveCount(4);
          await expect(source.locator('[data-tetrachotomy-source-function].opacity-25')).toHaveCount(4);
        }
        // A function participates in two rows and must reveal both dyads, never only the last row.
        await functionTiles.first().focus();
        await expect(source.locator('[data-tetrachotomy-source-aspect].opacity-100')).toHaveCount(4);
        await expect(source.locator('[data-tetrachotomy-source-aspect].opacity-25')).toHaveCount(4);
        await functionTiles.first().blur();
        for (let index = 0; index < conditions; index += 1) {
          await order.locator(`[data-order-view-select="${index}"]`).click();
          const diagram = order.locator('[data-order-ordinary-diagram]');
          await expect(diagram).toHaveAttribute('data-order-ordinary-diagram', String(index));
          await expect(diagram.locator('button')).toHaveCount(16);
          await diagram.locator('button').first().click();
          await diagram.locator('button').first().click();
          if (configuration.orderTraitId === 'process') {
            await expect(diagram.locator('.marching-ants-cw')).toHaveCount(1);
            await expect(diagram.locator('.marching-ants-ccw')).toHaveCount(1);
          }
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
      }
      expect(seen.size).toBe(4);
      expect([...poles].sort()).toEqual(['0', '1']);
    }
    expect(errors).toEqual([]);
  });
}
