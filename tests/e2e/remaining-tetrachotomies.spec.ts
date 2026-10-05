import { expect, test } from '@playwright/test';

const cases = [
  { id: 'tetra-05', basis: 'process,asking', traits: ['vertness', 'process', 'asking'], views: [1, 1, 2] },
  { id: 'tetra-26', basis: 'process,talness', traits: ['positivism', 'process', 'talness'], views: [2, 1, 1] },
  { id: 'tetra-27', basis: 'asking,nalness', traits: ['positivism', 'asking', 'nalness'], views: [2, 2, 1] },
];

for (const configuration of cases) {
  test(`shows consecutive dichotomy formulas for ${configuration.id}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const theme of ['dark', 'light']) {
      await page.goto(`/?mode=tetrachotomy&traits=${configuration.basis}&theme=${theme}`);
      const panel = page.locator(`[data-tetrachotomy-dichotomy-panel="${configuration.id}"]`);
      await expect(panel).toBeVisible();
      await expect(page.locator('[data-tetrachotomy-source-block-fallback]')).toHaveCount(0);
      await expect(page.locator('[data-tetrachotomy-aspect-function-panel]')).toHaveCount(0);
      const select = page.locator('[data-tetrachotomy-class-select]');
      const classes = await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
      expect(classes).toHaveLength(4);
      const poles = configuration.traits.map(() => new Set<string>());
      for (const classKey of classes) {
        await select.selectOption(classKey);
        const dichotomies = panel.locator('[data-tetrachotomy-dichotomy]');
        await expect(dichotomies).toHaveCount(3);
        expect(await dichotomies.evaluateAll(elements => elements.map(element => element.getAttribute('data-tetrachotomy-dichotomy')))).toEqual(configuration.traits);
        for (let index = 0; index < configuration.traits.length; index += 1) {
          const dichotomy = dichotomies.nth(index);
          await expect(dichotomy).toBeVisible();
          await expect(dichotomy.locator('[data-dichotomy-view]')).toHaveCount(configuration.views[index]);
          poles[index].add((await dichotomy.getAttribute('data-dichotomy-pole'))!);
          if (configuration.traits[index] === 'process') {
            await expect(dichotomy).toContainText('Циклический порядок макроаспектов');
          }
          if (['positivism', 'asking'].includes(configuration.traits[index])) {
            await expect(dichotomy).toContainText('Эквивалентность 1');
            await expect(dichotomy).toContainText('Эквивалентность 2');
          }
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
      }
      poles.forEach(seen => expect([...seen].sort()).toEqual(['0', '1']));
    }
    expect(errors).toEqual([]);
  });
}
