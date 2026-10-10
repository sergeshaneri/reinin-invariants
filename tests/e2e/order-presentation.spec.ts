import { expect, test } from '@playwright/test';
import { ASPECTS, REININ_TRAITS } from '../../src/data/socionics';

for (const theme of ['dark', 'light']) {
  test(`order-condition cards follow aspect settings and align in ${theme}`, async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const basis of ['subjectivism,process', 'positivism,logic']) {
      await page.goto(`/?mode=tetrachotomy&traits=${basis}&theme=${theme}`);
      const panel = page.locator('[data-tetrachotomy-order-panel]');
      await expect(panel).toHaveCount(1);
      await page.locator('[data-display-settings] > summary').click();
      const tabs = page.getByRole('tablist', { name: 'Отображение аспектов' });
      const select = page.locator('[data-tetrachotomy-class-select]');
      const classes = await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
      expect(classes).toHaveLength(4);
      for (const [mode, label] of [['icon', 'Пикто'], ['symbol', 'Аббр.'], ['icon-symbol', 'Оба']]) {
        await tabs.getByRole('tab', { name: label, exact: true }).click();
        for (const key of classes) {
          await select.selectOption(key);
          const traitId = await panel.getAttribute('data-order-trait');
          const poleIndex = Number(await panel.getAttribute('data-order-pole'));
          const conditions = REININ_TRAITS.find(trait => trait.id === traitId)!.poles[poleIndex].views;
          await expect(panel.locator('[data-order-condition]')).toHaveCount(conditions.length);
          const sourceGlyphs = page.locator('[data-tetrachotomy-aspect-function-row] [data-aspect-glyph-mode]');
          await expect(sourceGlyphs).toHaveCount(8);
          expect(await sourceGlyphs.evaluateAll(elements => elements.map(element => element.getAttribute('data-aspect-glyph-mode')))).toEqual(Array(8).fill(mode));
          for (const [index, condition] of conditions.entries()) {
            const card = panel.locator(`[data-order-condition="${index}"]`);
            const glyphs = card.locator('[data-order-aspect-block] [data-aspect-glyph-mode]');
            await expect(glyphs).toHaveCount(8);
            await expect(card.locator(`[data-aspect-glyph-mode="${mode}"]`)).toHaveCount(8);
            await expect(card.locator('[data-aspect-icon-size]')).toHaveCount(mode === 'symbol' ? 0 : 8);
            expect(await glyphs.allTextContents()).toEqual(mode === 'icon' ? Array(8).fill('') : condition.mappings.flatMap(mapping => mapping.aspects.map(id => ASPECTS.find(aspect => aspect.id === id)!.name)));
            expect(await card.locator('.block-number').allTextContents()).toEqual(condition.mappings.flatMap(mapping => mapping.functions.map(String)));
            if (traitId === 'process') {
              const labels = condition.mappings.map(mapping => mapping.aspectLabel);
              await expect(card.locator('[data-order-cycle]')).toHaveText([...labels, labels[0]].join('→'));
            }
            for (const width of [280, 360, 680, 920]) {
              await panel.evaluate((element, size) => { element.style.width = `${size}px`; element.style.maxWidth = '100%'; }, width);
              const bounds = await card.evaluate(element => {
                const tiles = [...element.querySelectorAll<HTMLElement>('[data-order-aspect-block], [data-order-function-block]')];
                const rect = element.getBoundingClientRect();
                return {
                  heights: tiles.map(tile => tile.getBoundingClientRect().height),
                  clipped: tiles.filter(tile => {
                    const box = tile.getBoundingClientRect();
                    return box.left < rect.left || box.right > rect.right + 1 || tile.scrollWidth > tile.clientWidth + 1;
                  }).length,
                };
              });
              expect(bounds.clipped, `${basis}/${mode}/${key}/${width}`).toBe(0);
              expect(Math.max(...bounds.heights) - Math.min(...bounds.heights), `${basis}/${mode}/${key}/${width}: card heights`).toBeLessThanOrEqual(1);
            }
            await panel.evaluate(element => { element.style.width = ''; element.style.maxWidth = ''; });
          }
        }
        if (basis === 'subjectivism,process') {
          await select.selectOption(classes[0]);
          await panel.locator('[data-order-condition]').screenshot({ path: testInfo.outputPath(`cycle-${mode}-${theme}.png`), animations: 'disabled' });
        }
      }
      if (basis === 'subjectivism,process') {
        await expect(panel.locator('[data-order-condition]')).toContainText('Каждый макроаспект занимает один такт целиком. У разных типов макроаспекты находятся в разных тактах.');
        await expect(panel.locator('[data-order-condition]')).toContainText('Обход тактов в модели А происходит по пунктирной стрелке. Первый такт — функции 3 и 5.');
        await expect(panel.locator('[data-order-function-block="3,5"] .block-tile-label')).toHaveText('1-й такт');
        await expect(panel).not.toContainText(/полу(?:такт)/iu);
        await expect(panel.locator('[data-order-condition]')).not.toContainText('индуцированный');
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    }
    expect(errors).toEqual([]);
  });

  test(`cracy aspect blocks also follow display settings in ${theme}`, async ({ page }) => {
    await page.goto(`/?mode=tetrachotomy&traits=democracy,yielding&theme=${theme}`);
    await page.locator('[data-display-settings] > summary').click();
    const tabs = page.getByRole('tablist', { name: 'Отображение аспектов' });
    const select = page.locator('[data-tetrachotomy-class-select]');
    const classes = await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
    expect(classes).toHaveLength(4);
    for (const [mode, label] of [['icon', 'Пикто'], ['symbol', 'Аббр.'], ['icon-symbol', 'Оба']]) {
      await tabs.getByRole('tab', { name: label, exact: true }).click();
      for (const key of classes) {
        await select.selectOption(key);
        const glyphs = page.locator('[data-cracy-aspect-block] [data-aspect-glyph-mode]');
        await expect(glyphs).toHaveCount(32);
        expect(await glyphs.evaluateAll(elements => elements.map(element => element.getAttribute('data-aspect-glyph-mode')))).toEqual(Array(32).fill(mode));
        await expect(page.locator('[data-cracy-aspect-block] [data-aspect-icon-size]')).toHaveCount(mode === 'symbol' ? 0 : 32);
      }
    }
  });
}
