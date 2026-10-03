import { expect, test } from '@playwright/test';

const newTetrachotomies: { id: string; traits: string; functions: Record<string, string[]> }[] = [
  { id: 'tetra-08', traits: 'democracy,yielding', functions: { 'оценочные': ['1', '4', '5', '8'], 'ситуативные': ['2', '3', '6', '7'] } },
  { id: 'tetra-14', traits: 'democracy,logic', functions: { 'сильные': ['1', '2', '7', '8'], 'слабые': ['3', '4', '5', '6'] } },
  { id: 'tetra-21', traits: 'constructivism,tactical', functions: { 'инертные': ['1', '4', '6', '7'], 'контактные': ['2', '3', '5', '8'] } },
  { id: 'tetra-22', traits: 'process,nalness', functions: { 'акцептные': ['1', '3', '5', '7'], 'продуктивные': ['2', '4', '6', '8'] } },
  { id: 'tetra-23', traits: 'asking,talness', functions: { 'ментальные': ['1', '2', '3', '4'], 'витальные': ['5', '6', '7', '8'] } },
];

for (const configuration of newTetrachotomies) {
  test(`shows 4-to-4 mappings and ordinary cracy for ${configuration.id}`, async ({ page }) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const theme of ['dark', 'light']) {
      await page.goto(`/?mode=tetrachotomy&traits=${configuration.traits}&theme=${theme}`);
      const source = page.locator(`[data-tetrachotomy-aspect-function-panel="${configuration.id}"]`);
      const cracy = page.locator(`[data-tetrachotomy-cracy-panel="${configuration.id}"]`);
      await expect(source).toHaveAttribute('data-source-block-status', 'extracted');
      await expect(source.locator('+ [data-tetrachotomy-cracy-panel]')).toHaveCount(1);
      const select = page.locator('[data-tetrachotomy-class-select]');
      const classes = await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
      expect(classes).toHaveLength(4);
      const distinctTetrads = new Set<string>();
      const cracyPoles = new Set<string>();
      for (const classKey of classes) {
        await select.selectOption(classKey);
        distinctTetrads.add(await select.inputValue());
        cracyPoles.add((await cracy.getAttribute('data-cracy-pole'))!);
        const rows = source.locator('[data-tetrachotomy-aspect-function-row]');
        await expect(rows).toHaveCount(2);
        const featuresSeen = new Set<string>();
        for (const rowIndex of [0, 1]) {
          const row = rows.nth(rowIndex);
          await expect(row.locator('[data-aspect-glyph-mode]')).toHaveCount(4);
          await expect(row.locator('[data-source-function-chip]')).toHaveCount(4);
          const features = await row.locator('[data-source-feature="function"]').allTextContents();
          expect(features).toHaveLength(1);
          featuresSeen.add(features[0]);
          const expectedFunctions = configuration.functions[features[0]];
          expect(expectedFunctions).toBeDefined();
          expect(await row.locator('[data-source-function-chip]').allTextContents()).toEqual(expectedFunctions);
        }
        expect([...featuresSeen].sort()).toEqual(Object.keys(configuration.functions).sort());
        await expect(cracy.locator('[data-cracy-block-condition]')).toHaveCount(4);
        for (const index of [0, 1, 2, 3]) {
          await cracy.locator(`[data-cracy-view-select="${index}"]`).click();
          const diagram = cracy.locator('[data-cracy-ordinary-diagram]');
          await expect(diagram).toHaveAttribute('data-cracy-ordinary-diagram', String(index));
          await expect(diagram.locator('button')).toHaveCount(16);
          await diagram.locator('button').first().click();
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
      }
      expect(distinctTetrads.size).toBe(4);
      expect([...cracyPoles].sort()).toEqual(['0', '1']);
    }
    expect(errors).toEqual([]);
  });
}

test('shows verbal/labor tetrads followed by the ordinary cracy diagram', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const theme of ['dark', 'light']) {
    await page.goto(`/?mode=tetrachotomy&traits=subjectivism,judicious&theme=${theme}`);
    const source = page.locator('[data-tetrachotomy-aspect-function-panel="tetra-20"]');
    const cracy = page.locator('[data-tetrachotomy-cracy-panel="tetra-20"]');
    await expect(source).toHaveAttribute('data-source-block-status', 'extracted');
    await expect(source.locator('+ [data-tetrachotomy-cracy-panel]')).toHaveCount(1);
    const select = page.locator('[data-tetrachotomy-class-select]');
    const classes = await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
    expect(classes).toHaveLength(4);
    const expectedAspectRows = [
      ['ЧИ БС ЧЭ БЛ', 'ЧЛ БЭ ЧС БИ'],
      ['ЧЭ БЛ ЧС БИ', 'ЧИ БС ЧЛ БЭ'],
      ['ЧИ БС ЧЛ БЭ', 'ЧЭ БЛ ЧС БИ'],
      ['ЧЛ БЭ ЧС БИ', 'ЧИ БС ЧЭ БЛ'],
    ];
    for (const [classIndex, classKey] of classes.entries()) {
      await select.selectOption(classKey);
      const rows = source.locator('[data-tetrachotomy-aspect-function-row]');
      await expect(rows).toHaveCount(2);
      for (const rowIndex of [0, 1]) {
        const row = rows.nth(rowIndex);
        await expect(row).toHaveAttribute('data-tetrachotomy-aspect-function-row', expectedAspectRows[classIndex][rowIndex]);
        await expect(row.locator('[data-aspect-glyph-mode]')).toHaveCount(4);
        await expect(row.locator('[data-source-function-chip]')).toHaveCount(4);
        expect(await row.locator('[data-source-function-chip]').allTextContents()).toEqual(rowIndex === 0 ? ['1', '2', '5', '6'] : ['3', '4', '7', '8']);
        await expect(row).toContainText(rowIndex === 0 ? 'вербальные' : 'лаборные');
      }
      await expect(cracy).toHaveAttribute('data-cracy-pole', classIndex === 0 || classIndex === 3 ? '0' : '1');
      await expect(cracy.locator('[data-cracy-block-condition]')).toHaveCount(4);
      for (const index of [0, 1, 2, 3]) {
        await cracy.locator(`[data-cracy-view-select="${index}"]`).click();
        const diagram = cracy.locator('[data-cracy-ordinary-diagram]');
        await expect(diagram).toHaveAttribute('data-cracy-ordinary-diagram', String(index));
        await expect(diagram.locator('button')).toHaveCount(16);
        await diagram.locator('button').first().click();
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);
    }
  }
  expect(errors).toEqual([]);
});
