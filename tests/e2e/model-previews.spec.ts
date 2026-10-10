import { expect, test } from '@playwright/test';
import { ORDER_DEPENDENT_TETRACHOTOMIES } from '../../src/data/orderDependentTetrachotomies';
import { ASPECTS } from '../../src/data/socionics';
const basisByFormula: Record<string, string> = {
  'tetra-10': 'subjectivism,process', 'tetra-17': 'constructivism,process',
  'tetra-30': 'process,judicious', 'tetra-34': 'process,tactical',
  'tetra-09': 'positivism,logic', 'tetra-15': 'positivism,yielding',
  'tetra-24': 'subjectivism,tactical', 'tetra-25': 'constructivism,judicious',
  'tetra-11': 'constructivism,asking', 'tetra-16': 'subjectivism,asking',
  'tetra-31': 'asking,tactical', 'tetra-35': 'asking,judicious',
};

for (const theme of ['dark', 'light']) {
  test(`lower Model A previews preserve overlapping source colors in ${theme}`, async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    let checkedModels = 0;
    for (const configuration of ORDER_DEPENDENT_TETRACHOTOMIES) {
      const formulaId = configuration.formulaId;
      const basis = basisByFormula[formulaId];
      expect(basis).toBeDefined();
      await page.goto(`/?mode=tetrachotomy&traits=${basis}&theme=${theme}`);
      const source = page.locator(`[data-tetrachotomy-aspect-function-panel="${formulaId}"]`);
      await expect(source).toHaveCount(1);
      const select = page.locator('[data-tetrachotomy-class-select]');
      const classKeys = await select.locator('option').evaluateAll(options => (
        options.map(option => (option as HTMLOptionElement).value)
      ));
      expect(classKeys).toHaveLength(4);
      const seenBlocks = new Set<string>();
      for (const classKey of classKeys) {
        await select.selectOption(classKey);
        const grid = page.locator('[data-model-preview-grid]');
        await expect(grid.locator('[data-model-preview-type-id]')).toHaveCount(4);
        await grid.scrollIntoViewIfNeeded();
        const cycleCount = configuration.orderTraitId === 'process' ? 4 : 0;
        await expect(grid.locator('.marching-ants-cw')).toHaveCount(cycleCount);
        await expect(grid.locator('.marching-ants-ccw')).toHaveCount(cycleCount);
        const models = await grid.locator('[data-model-preview-type-id]').evaluateAll(elements => (
          elements.map(model => ({
            typeId: model.getAttribute('data-model-preview-type-id')!,
            cells: [...model.querySelectorAll<HTMLElement>('[data-model-preview-function-id]')].map(cell => ({
              functionId: Number(cell.dataset.modelPreviewFunctionId),
              aspectId: cell.dataset.modelPreviewAspectId,
              groupIndex: Number(cell.dataset.modelPreviewHighlightGroup),
              intensity: cell.dataset.modelPreviewHighlightIntensity,
              highlighted: cell.dataset.modelPreviewHighlighted,
              opacity: getComputedStyle(cell).opacity,
              color: getComputedStyle(cell).backgroundColor,
            })),
          }))
        ));
        const memberships = await source.evaluate(panel => ({
          aspects: [...panel.querySelectorAll<HTMLElement>('[data-tetrachotomy-source-aspect]')].map(cell => ({
            aspectName: cell.dataset.tetrachotomySourceAspect,
            rowIndex: Number(cell.dataset.sourceRowIndex),
            color: getComputedStyle(cell).backgroundColor,
          })),
          functions: [...panel.querySelectorAll<HTMLElement>('[data-tetrachotomy-source-function]')].map(cell => ({
            functionId: Number(cell.dataset.tetrachotomySourceFunction),
            rowIndices: cell.dataset.sourceRowIndices!.split(',').map(Number),
          })),
        }));
        expect(memberships.aspects).toHaveLength(8);
        expect(memberships.functions).toHaveLength(8);
        seenBlocks.add(models.map(model => model.typeId).sort().join(','));
        for (const model of models) {
          checkedModels += 1;
          expect(model.cells).toHaveLength(8);
          for (const cell of model.cells) {
            const aspectName = ASPECTS.find(item => item.id === cell.aspectId)!.name;
            const aspect = memberships.aspects.find(item => item.aspectName === aspectName)!;
            const fn = memberships.functions.find(item => item.functionId === cell.functionId)!;
            expect(aspect).toBeDefined();
            expect(fn.rowIndices).toContain(aspect.rowIndex);
            expect(cell, `${formulaId}/${model.typeId}/${cell.functionId}`).toMatchObject({
              groupIndex: aspect.rowIndex,
              intensity: 'primary',
              highlighted: 'true',
              opacity: '1',
              color: aspect.color,
            });
          }
          expect(new Set(model.cells.map(cell => cell.groupIndex)).size).toBe(4);
          expect(new Set(model.cells.map(cell => cell.color)).size).toBe(4);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
      }
      expect(seenBlocks.size).toBe(4);
      if (formulaId === 'tetra-10') {
        await page.locator('[data-partition-types-panel="tetrachotomy"]').screenshot({
          path: testInfo.outputPath(`lower-models-${theme}.png`),
          animations: 'disabled',
        });
      }
    }
    expect(checkedModels).toBe(192);

    // Disjoint source blocks intentionally keep secondary partners dimmed.
    await page.goto(`/?mode=tetrachotomy&traits=carefree,intuition&theme=${theme}`);
    const grid = page.locator('[data-model-preview-grid]');
    await expect(grid.locator('[data-model-preview-type-id]')).toHaveCount(4);
    await expect(grid.locator('[data-model-preview-highlight-intensity="primary"].opacity-100')).toHaveCount(16);
    await expect(grid.locator('[data-model-preview-highlight-intensity="secondary"].opacity-45')).toHaveCount(16);
    expect(errors).toEqual([]);
  });
}
