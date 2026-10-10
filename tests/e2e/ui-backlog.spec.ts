import { expect, test } from '@playwright/test';
import { ASPECTS, REININ_TRAITS } from '../../src/data/socionics';

for (const theme of ['dark', 'light']) {
  test(`display controls keep labels and icons inside their buttons in ${theme}`, async ({ page }, testInfo) => {
    await page.goto(`/?trait=talness&theme=${theme}`);
    const settings = page.locator('[data-display-settings]');
    await settings.locator('summary').click();
    const controls = settings.locator(':scope > div');
    const aspectTabs = settings.getByRole('tablist', { name: 'Отображение аспектов' });
    const themeTabs = settings.getByRole('tablist', { name: 'Тема интерфейса' });
    await expect(aspectTabs.getByRole('tab')).toHaveCount(3);
    await expect(themeTabs.getByRole('tab')).toHaveCount(2);
    for (const viewportWidth of [320, 360, 640, 768, 1280]) {
      await page.setViewportSize({ width: viewportWidth, height: 900 });
      for (const containerWidth of [260, 320, 480, 640]) {
        await controls.evaluate((element, width) => { element.style.width = `${width}px`; element.style.maxWidth = '100%'; }, containerWidth);
        const failures = await controls.getByRole('tab').evaluateAll(buttons => buttons.flatMap(button => {
          const rect = button.getBoundingClientRect();
          const group = button.closest('section')!.getBoundingClientRect();
          const icon = button.querySelector('svg')!.getBoundingClientRect();
          const label = button.querySelector('span')!.getBoundingClientRect();
          return rect.left < group.left - 1 || rect.right > group.right + 1
            || icon.left < rect.left || label.right > rect.right + 1 || icon.right > label.left + 1
            || button.scrollWidth > button.clientWidth + 1
            ? [button.textContent] : [];
        }));
        expect(failures, `viewport ${viewportWidth}, controls ${containerWidth}`).toEqual([]);
      }
    }
    await controls.evaluate(element => { element.style.width = ''; element.style.maxWidth = ''; });
    for (const label of ['Пикто', 'Аббр.', 'Оба']) {
      await aspectTabs.getByRole('tab', { name: label, exact: true }).click();
      await expect(aspectTabs.getByRole('tab', { name: label, exact: true })).toHaveAttribute('aria-selected', 'true');
    }
    for (const label of ['Светлая', 'Темная']) {
      await themeTabs.getByRole('tab', { name: label, exact: true }).click();
      await expect(themeTabs.getByRole('tab', { name: label, exact: true })).toHaveAttribute('aria-selected', 'true');
    }
    await themeTabs.getByRole('tab', { name: theme === 'dark' ? 'Темная' : 'Светлая', exact: true }).click();
    await page.setViewportSize(testInfo.project.use.viewport!);
    await settings.screenshot({ path: testInfo.outputPath(`controls-${theme}.png`), animations: 'disabled' });
  });

  test(`selected pole has a non-color marker matching state and URL in ${theme}`, async ({ page }, testInfo) => {
    await page.goto(`/?trait=talness&theme=${theme}`);
    await expect(page.getByRole('heading', { name: 'Полюс', exact: true }).locator('svg')).toHaveCount(0);
    const poles = page.getByRole('tablist', { name: 'Полюса дихотомии' });
    const detail = page.locator('[data-dichotomy-detail="talness"]');
    for (const [index, name] of ['Статики', 'Динамики'].entries()) {
      const selected = poles.getByRole('tab', { name, exact: true });
      await selected.click();
      await expect(selected).toHaveAttribute('aria-selected', 'true');
      await expect(selected.locator('[data-selected-pole-marker]')).toBeVisible();
      await expect(poles.locator('[data-selected-pole-marker]')).toHaveCount(1);
      await expect(poles.getByRole('tab').nth(1 - index)).toHaveAttribute('aria-selected', 'false');
      await expect(detail).toHaveAttribute('data-selected-pole-index', String(index));
      await expect.poll(() => new URL(page.url()).searchParams.get('pole') ?? '0').toBe(String(index));
    }
    await poles.screenshot({ path: testInfo.outputPath(`poles-${theme}.png`), animations: 'disabled' });
  });

  test(`aspecton display modes propagate to ordinary and embedded diagrams in ${theme}`, async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const cases = [
      { query: 'trait=talness', selector: '[data-primary-diagram="dichotomy"] .aspect-function-panel' },
      { query: 'mode=tetrachotomy&traits=democracy,yielding', selector: '[data-cracy-ordinary-diagram] .aspect-function-panel' },
      { query: 'mode=tetrachotomy&traits=subjectivism,process', selector: '[data-order-ordinary-diagram] .aspect-function-panel' },
    ];
    for (const [caseIndex, entry] of cases.entries()) {
      await page.goto(`/?${entry.query}&theme=${theme}`);
      const diagram = page.locator(entry.selector);
      await expect(diagram).toBeVisible();
      await page.locator('[data-display-settings] > summary').click();
      const tabs = page.getByRole('tablist', { name: 'Отображение аспектов' });
      for (const [mode, label] of [['icon', 'Пикто'], ['symbol', 'Аббр.'], ['icon-symbol', 'Оба']]) {
        await tabs.getByRole('tab', { name: label, exact: true }).click();
        const cells = diagram.locator('button:has([data-aspect-glyph-mode])');
        await expect(cells).toHaveCount(8);
        await expect(cells.locator(`[data-aspect-glyph-mode="${mode}"]`)).toHaveCount(8);
        await expect(cells.locator('[data-aspect-icon-size]')).toHaveCount(mode === 'symbol' ? 0 : 8);
        expect(await cells.allTextContents()).toEqual(mode === 'icon' ? Array(8).fill('') : ASPECTS.map(aspect => aspect.name));
        for (const width of [320, 740]) {
          await diagram.evaluate((element, size) => { element.style.width = `${size}px`; element.style.maxWidth = '100%'; }, width);
          expect(await diagram.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
          const clipped = await cells.evaluateAll(buttons => buttons.filter(button => {
            const tile = button.getBoundingClientRect();
            const glyph = button.querySelector('[data-aspect-glyph-mode]')!.getBoundingClientRect();
            return glyph.left < tile.left || glyph.right > tile.right || glyph.top < tile.top || glyph.bottom > tile.bottom;
          }).length);
          expect(clipped).toBe(0);
        }
        await diagram.evaluate(element => { element.style.width = ''; element.style.maxWidth = ''; });
        if (caseIndex === 0) await diagram.screenshot({ path: testInfo.outputPath(`aspecton-${mode}-${theme}.png`), animations: 'disabled' });
      }
    }
    expect(errors).toEqual([]);
  });

  test(`fixed-pair formulas follow display mode without block indices in ${theme}`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const traitId of ['talness', 'vertness']) {
      await page.goto(`/?trait=${traitId}&theme=${theme}`);
      await page.locator('[data-display-settings] > summary').click();
      const tabs = page.getByRole('tablist', { name: 'Отображение аспектов' });
      const formula = page.getByRole('heading', { name: 'Алгебраическая формула', exact: true }).locator('..');
      const poles = page.getByRole('tablist', { name: 'Полюса дихотомии' });
      const views = page.getByRole('tablist', { name: 'Выбор инварианта' });
      for (const [mode, label] of [['icon', 'Пикто'], ['symbol', 'Аббр.'], ['icon-symbol', 'Оба']]) {
        await tabs.getByRole('tab', { name: label, exact: true }).click();
        for (const poleIndex of [0, 1]) {
          await poles.getByRole('tab').nth(poleIndex).click();
          const viewCount = REININ_TRAITS.find(trait => trait.id === traitId)!.poles[poleIndex].views.length;
          expect(viewCount).toBeGreaterThan(0);
          await expect(views.getByRole('tab')).toHaveCount(viewCount > 1 ? viewCount : 0);
          for (let viewIndex = 0; viewIndex < viewCount; viewIndex += 1) {
            if (viewCount > 1) await views.getByRole('tab').nth(viewIndex).click();
            await expect(formula).toBeVisible();
            expect(await formula.locator('span.rounded-full').allTextContents()).toEqual(['']);
            await expect(formula.locator(`[data-aspect-glyph-mode="${mode}"]`)).toHaveCount(8);
            await expect(formula.locator('[data-aspect-icon-size]')).toHaveCount(mode === 'symbol' ? 0 : 8);
            const glyphs = await formula.locator('[data-aspect-glyph-mode]').allTextContents();
            expect(glyphs.sort()).toEqual(mode === 'icon' ? Array(8).fill('') : ASPECTS.map(aspect => aspect.name).sort());
            const numbers = (await formula.locator('span').allTextContents()).filter(text => /^\d+$/.test(text));
            expect(numbers.sort()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
            expect(await formula.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
          }
        }
        if (traitId === 'talness') await formula.screenshot({ path: testInfo.outputPath(`fixed-pair-${mode}-${theme}.png`), animations: 'disabled' });
      }
    }
    expect(errors).toEqual([]);
  });

  test(`block invariants follow display mode and retain only function numbers in ${theme}`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.goto(`/?trait=democracy&theme=${theme}`);
    await page.locator('[data-display-settings] > summary').click();
    const tabs = page.getByRole('tablist', { name: 'Отображение аспектов' });
    const poles = page.getByRole('tablist', { name: 'Полюса дихотомии' });
    const views = page.getByRole('tablist', { name: 'Выбор инварианта' });
    const formula = page.locator('[data-block-formula]');
    for (const [mode, label] of [['icon', 'Пикто'], ['symbol', 'Аббр.'], ['icon-symbol', 'Оба']]) {
      await tabs.getByRole('tab', { name: label, exact: true }).click();
      for (const poleIndex of [0, 1]) {
        await poles.getByRole('tab').nth(poleIndex).click();
        await expect(views.getByRole('tab')).toHaveCount(4);
        for (const viewIndex of [0, 1, 2, 3]) {
          await views.getByRole('tab').nth(viewIndex).click();
          await expect(formula.locator('[data-formula-aspect-block]')).toHaveCount(4);
          await expect(formula.locator('[data-formula-function-block]')).toHaveCount(4);
          await expect(formula.locator(`[data-aspect-glyph-mode="${mode}"]`)).toHaveCount(8);
          await expect(formula.locator('[data-aspect-icon-size]')).toHaveCount(mode === 'symbol' ? 0 : 8);
          expect((await formula.locator('.block-number').allTextContents()).sort()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
          expect(await formula.locator('[class*="rounded-full"]').count()).toBe(0);
          for (const width of [280, 380, 680]) {
            await formula.evaluate((element, size) => { element.style.width = `${size}px`; element.style.maxWidth = '100%'; }, width);
            expect(await formula.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
          }
          await formula.evaluate(element => { element.style.width = ''; element.style.maxWidth = ''; });
        }
      }
      await formula.screenshot({ path: testInfo.outputPath(`blocks-${mode}-${theme}.png`), animations: 'disabled' });
    }
  });
}
