import { expect, test, type Page } from '@playwright/test';

const collectPageErrors = (page: Page) => {
  const errors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
};

test('prioritizes diagrams and keeps supporting views optional', async ({ page, isMobile }) => {
  const errors = collectPageErrors(page);
  await page.goto('/?theme=dark');

  const diagram = page.locator('[data-primary-diagram="dichotomy"]');
  const extra = page.locator('[data-dichotomy-extra-materials]');
  await expect(diagram).toBeInViewport();
  await expect(extra).not.toHaveAttribute('open', '');
  await expect(page.locator('[data-partition-types-panel="dichotomy"]')).toBeVisible();
  await expect(diagram.locator('+ [data-partition-types-panel="dichotomy"]')).toHaveCount(1);
  await expect(page.locator('[data-partition-pattern="dichotomy"]')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Дополнительные материалы' })).toHaveAttribute('aria-expanded', 'false');

  if (isMobile) {
    await page.locator('[data-compact-selection="trait"]').selectOption('talness');
    await expect(page).toHaveURL(/trait=talness/);
    await expect(page.locator('[data-trait-nav="talness"]')).toHaveAttribute('aria-current', 'true');
    const positions = await page.evaluate(() => ({
      diagram: document.querySelector('[data-primary-diagram]')!.getBoundingClientRect().top,
      catalog: document.querySelector('[data-full-catalog]')!.getBoundingClientRect().top,
    }));
    expect(positions.diagram).toBeLessThan(positions.catalog);
  }

  await extra.locator('summary').click();
  await expect(page.locator('[data-partition-pattern="dichotomy"]')).toBeVisible();
  await expect(page.locator('[data-model-preview-type-id]')).toHaveCount(8);
  await extra.locator('summary').click();

  await page.goto('/?mode=tetrachotomy&traits=carefree,intuition&theme=dark');
  const tetraDiagram = page.locator('[data-tetrachotomy-model-a-slot]');
  await expect(tetraDiagram).toBeInViewport();
  await expect(page.locator('[data-partition-types-panel="tetrachotomy"]')).toBeVisible();
  await expect(tetraDiagram.locator('+ [data-partition-types-panel="tetrachotomy"]')).toHaveCount(1);
  await expect(page.locator('[data-tetrachotomy-class-select] option')).toHaveCount(4);
  await page.locator('[data-tetrachotomy-class-select]').selectOption('carefree:0|intuition:1');
  await expect(tetraDiagram).toContainText('Благосостояние');
  await expect(page).toHaveURL(/class=carefree%3A0%7Cintuition%3A1/);

  if (isMobile) {
    await page.locator('[data-compact-selection="tetrachotomy"]').selectOption('tetra-03');
    await expect(page).toHaveURL(/traits=yielding%2Clogic/);
    await expect(page.locator('[data-partition-catalog-entry="tetra-03"]')).toHaveAttribute('aria-current', 'true');
    await page.locator('[data-compact-selection="tetrachotomy"]').selectOption('tetra-01');
  }

  await expect(page).toHaveScreenshot('reinin-invariants-diagram-first-tetrachotomy.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.03,
    timeout: 15000,
  });
  expect(errors).toEqual([]);
});

test('keeps formula selectors theme-aware and unused source cells colored', async ({ page }) => {
  const errors = collectPageErrors(page);
  for (const theme of ['dark', 'light']) {
    await page.goto(`/?mode=tetrachotomy&traits=judicious,nalness&theme=${theme}`);
    const background = theme === 'dark' ? 'rgb(17, 19, 22)' : 'rgb(237, 234, 224)';
    const foreground = theme === 'dark' ? 'rgb(237, 234, 227)' : 'rgb(15, 13, 9)';
    for (const selector of ['[data-compact-selection="tetrachotomy"]', '[data-tetrachotomy-class-select]']) {
      const control = page.locator(selector);
      await expect(control).toHaveCSS('background-color', background);
      await expect(control).toHaveCSS('color', foreground);
      await expect(control.locator('option').first()).toHaveCSS('background-color', background);
      await expect(control.locator('option').first()).toHaveCSS('color', foreground);
    }
    const diagram = page.locator('[data-tetrachotomy-model-a-slot]');
    const unused = diagram.locator('button[data-source-row-index=""]');
    await expect(unused).toHaveCount(8);
    for (const cell of await unused.all()) {
      await expect(cell).toHaveClass(/\bmap-tone-[0-7]\b/);
      await expect(cell).toHaveCSS('opacity', '0.45');
    }
    const active = diagram.locator('[data-tetrachotomy-source-aspect="ЧИ"]');
    await active.hover();
    const dimmed = diagram.locator('[data-tetrachotomy-source-aspect="ЧС"]');
    await expect(dimmed).toHaveCSS('opacity', '0.25');
    await expect(unused.first()).toHaveCSS('opacity', '0.45');
    await unused.first().focus();
    await expect(dimmed).toHaveCSS('opacity', '1');
  }
  expect(errors).toEqual([]);
});

test('clarifies source row correspondences without changing aspect feature terminology', async ({ page }) => {
  const errors = collectPageErrors(page);
  for (const theme of ['dark', 'light']) {
    await page.goto(`/?mode=tetrachotomy&traits=judicious,nalness&theme=${theme}`);
    const row = page.locator('[data-tetrachotomy-aspect-function-row]').first();
    await expect(row).toHaveAttribute('data-tetrachotomy-aspect-function-row', 'ЧИ БС');
    await expect(row.getByRole('heading', { name: 'Аспекты', exact: true })).toBeVisible();
    await expect(row.getByRole('heading', { name: 'Функции модели А', exact: true })).toBeVisible();
    expect(await row.evaluate(element => {
      const headings = element.querySelectorAll('h3');
      return Math.abs(headings[0].getBoundingClientRect().top - headings[1].getBoundingClientRect().top) <= 1;
    })).toBe(true);
    const glyphs = row.locator('[data-aspect-glyph-mode="icon-symbol"]');
    await expect(glyphs).toHaveCount(2);
    for (const [index, label] of ['ЧИ', 'БС'].entries()) {
      const glyph = glyphs.nth(index);
      await expect(glyph).toHaveText(label);
      expect(await glyph.evaluate(element => (
        element.querySelector('span')!.getBoundingClientRect().top >= element.querySelector('svg')!.getBoundingClientRect().bottom
      ))).toBe(true);
    }
    await expect(row.locator('[data-source-row-direction]')).toBeVisible();
    await expect(row.locator('[data-source-row-direction] svg')).toHaveCSS('rotate', '0deg');
    await expect(row.locator('[data-source-feature="aspect"]')).toHaveText(['дельта', 'альфа', 'иррациональные']);
    await expect(row.locator('[data-source-feature="function"]')).toHaveText(['оценочные', 'вербальные', 'акцептные']);
    await expect(row.locator('[data-source-function-chip]')).toHaveText(['1', '5']);
    await expect(row.locator('[data-source-function-chip]').first()).toHaveClass(/map-tone-0/);
    await expect(page.locator('[data-tetrachotomy-invariant-explanation]')).toContainText('у всех типов выбранной тетрады');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(row).toHaveScreenshot(`tetrachotomy-source-row-${theme}.png`);
  }

  await page.locator('[data-display-settings] > summary').click();
  await page.getByRole('tablist', { name: 'Отображение аспектов' }).getByRole('tab', { name: 'Аббр.', exact: true }).click();
  const row = page.locator('[data-tetrachotomy-aspect-function-row]').first();
  await expect(row.locator('[data-aspect-glyph-mode="symbol"]')).toHaveText(['ЧИ', 'БС']);
  await expect(row.locator('[data-aspect-glyph-mode="icon-symbol"]')).toHaveCount(0);

  await page.goto('/?trait=democracy&theme=dark');
  await expect(page.locator('[data-block-invariant-explanation]')).toContainText('состав каждого блока сохраняется');
  await expect(page.locator('[data-tetrachotomy-invariant-explanation]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('renders all author-confirmed tetra-07 and tetra-13 groups as source rows', async ({ page }) => {
  const errors = collectPageErrors(page);
  for (const { id, traits, groups, functionIds } of [
    {
      id: 'tetra-07', traits: 'nalness,talness',
      groups: [
        { typeIds: ['ILE', 'SLE', 'SEE', 'IEE'], aspectTexts: ['ЧИ ЧС', 'БС БИ', 'ЧЭ ЧЛ', 'БЛ БЭ'] },
        { typeIds: ['SEI', 'IEI', 'ILI', 'SLI'], aspectTexts: ['БС БИ', 'ЧИ ЧС', 'БЛ БЭ', 'ЧЭ ЧЛ'] },
        { typeIds: ['ESE', 'EIE', 'LIE', 'LSE'], aspectTexts: ['ЧЭ ЧЛ', 'БЛ БЭ', 'ЧИ ЧС', 'БС БИ'] },
        { typeIds: ['LII', 'LSI', 'ESI', 'EII'], aspectTexts: ['БЛ БЭ', 'ЧЭ ЧЛ', 'БС БИ', 'ЧИ ЧС'] },
      ],
      functionIds: [[1, 3], [5, 7], [6, 8], [2, 4]],
    },
    {
      id: 'tetra-13', traits: 'tactical,talness',
      groups: [
        { typeIds: ['ILE', 'LSI', 'ESI', 'IEE'], aspectTexts: ['ЧИ', 'БС', 'ЧС', 'БИ'] },
        { typeIds: ['SEI', 'EIE', 'LIE', 'SLI'], aspectTexts: ['БС', 'ЧИ', 'БИ', 'ЧС'] },
        { typeIds: ['ESE', 'IEI', 'ILI', 'LSE'], aspectTexts: ['БИ', 'ЧС', 'БС', 'ЧИ'] },
        { typeIds: ['LII', 'SLE', 'SEE', 'EII'], aspectTexts: ['ЧС', 'БИ', 'ЧИ', 'БС'] },
      ],
      functionIds: [[1, 4], [5, 8], [3, 2], [6, 7]],
    },
  ]) {
    for (const theme of ['dark', 'light']) {
      await page.goto(`/?mode=tetrachotomy&traits=${traits}&theme=${theme}`);
      const selector = page.locator('[data-tetrachotomy-class-select]');
      await expect(selector).toBeVisible();
      await expect(selector.locator('option')).toHaveCount(4);
      const options = await selector.locator('option').evaluateAll(elements => elements.map(element => (
        (element as HTMLOptionElement).value
      )));
      expect(options).toHaveLength(4);
      for (const option of options) {
        await selector.selectOption(option);
        await expect(page.locator('[data-tetrachotomy-detail]')).toHaveAttribute('data-selected-class-key', option);
        const previewTypeIds = await page.locator('[data-model-preview-type-id]').evaluateAll(elements => (
          elements.map(element => element.getAttribute('data-model-preview-type-id')).sort()
        ));
        const group = groups.find(candidate => JSON.stringify([...candidate.typeIds].sort()) === JSON.stringify(previewTypeIds));
        expect(group, `${id}:${previewTypeIds.join(',')}`).toBeDefined();
        const rows = page.locator('[data-tetrachotomy-aspect-function-row]');
        await expect(rows).toHaveCount(4);
        for (const [index, aspectText] of group!.aspectTexts.entries()) {
          await expect(rows.nth(index)).toHaveAttribute('data-tetrachotomy-aspect-function-row', aspectText);
          await expect(rows.nth(index).locator('[data-source-function-chip]')).toHaveText(functionIds[index].map(String));
          await expect(rows.nth(index).locator('[data-source-row-direction]')).toBeVisible();
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      }
    }
  }
  expect(errors).toEqual([]);
});

test('renders the approved tetra-28 correction for every tetrad', async ({ page }) => {
  const errors = collectPageErrors(page);
  const groups = [
    { typeIds: ['ILE', 'SEI', 'SLE', 'IEI'], aspectTexts: ['ЧЛ БЭ', 'БЛ ЧЭ', 'ЧИ БС ЧС БИ'], functionIds: [[4, 8], [2, 6], [1, 3, 5, 7]] },
    { typeIds: ['ESE', 'LII', 'EIE', 'LSI'], aspectTexts: ['БЛ ЧЭ', 'ЧЛ БЭ', 'ЧИ БС ЧС БИ'], functionIds: [[1, 5], [3, 7], [2, 4, 6, 8]] },
    { typeIds: ['LIE', 'ESI', 'LSE', 'EII'], aspectTexts: ['ЧЛ БЭ', 'БЛ ЧЭ', 'ЧИ БС ЧС БИ'], functionIds: [[1, 5], [3, 7], [2, 4, 6, 8]] },
    { typeIds: ['SEE', 'ILI', 'IEE', 'SLI'], aspectTexts: ['БЛ ЧЭ', 'ЧЛ БЭ', 'ЧИ БС ЧС БИ'], functionIds: [[4, 8], [2, 6], [1, 3, 5, 7]] },
  ];
  for (const theme of ['dark', 'light']) {
    await page.goto(`/?mode=tetrachotomy&traits=subjectivism,nalness&theme=${theme}`);
    const selector = page.locator('[data-tetrachotomy-class-select]');
    await expect(selector).toBeVisible();
    await expect(selector.locator('option')).toHaveCount(4);
    const options = await selector.locator('option').evaluateAll(elements => elements.map(element => (element as HTMLOptionElement).value));
    for (const option of options) {
      await selector.selectOption(option);
      await expect(page.locator('[data-tetrachotomy-detail]')).toHaveAttribute('data-selected-class-key', option);
      const typeIds = await page.locator('[data-model-preview-type-id]').evaluateAll(elements => elements.map(element => element.getAttribute('data-model-preview-type-id')).sort());
      const group = groups.find(candidate => JSON.stringify([...candidate.typeIds].sort()) === JSON.stringify(typeIds));
      expect(group).toBeDefined();
      const rows = page.locator('[data-tetrachotomy-aspect-function-row]');
      await expect(rows).toHaveCount(3);
      for (const [index, aspectText] of group!.aspectTexts.entries()) {
        await expect(rows.nth(index)).toHaveAttribute('data-tetrachotomy-aspect-function-row', aspectText);
        await expect(rows.nth(index).locator('[data-source-function-chip]')).toHaveText(group!.functionIds[index].map(String));
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test('adapts the invariant to its own width with compact tiles and grouped row arrows', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/?mode=tetrachotomy&traits=judicious,nalness&theme=dark');
  const panel = page.locator('[data-tetrachotomy-model-a-slot]');
  for (const width of [640, 480, 360, 320, 260]) {
    await panel.evaluate((element, targetWidth) => { element.style.width = `${targetWidth}px`; }, width);
    await expect.poll(() => panel.evaluate(element => {
      const aspects = element.querySelector('[data-tetrachotomy-source-aspect]')!.parentElement!;
      const functions = element.querySelector('[data-tetrachotomy-source-function]')!.parentElement!;
      const a = aspects.getBoundingClientRect();
      const f = functions.getBoundingClientRect();
      const contentWidth = element.clientWidth - parseFloat(getComputedStyle(element).paddingLeft) - parseFloat(getComputedStyle(element).paddingRight);
      return contentWidth >= 560 ? f.left > a.right : f.top > a.bottom;
    })).toBe(true);
    await expect.poll(() => panel.evaluate(element => {
      const row = element.querySelector('[data-tetrachotomy-aspect-function-row]')!;
      const headings = row.querySelectorAll('h3');
      const contentWidth = element.clientWidth - parseFloat(getComputedStyle(element).paddingLeft) - parseFloat(getComputedStyle(element).paddingRight);
      return contentWidth >= 260
        ? Math.abs(headings[0].getBoundingClientRect().top - headings[1].getBoundingClientRect().top) <= 1
        : headings[1].getBoundingClientRect().top > headings[0].getBoundingClientRect().bottom;
    })).toBe(true);
    const metrics = await panel.evaluate(element => ({
      aspectWidths: [...element.querySelectorAll('[data-tetrachotomy-source-aspect]')].map(cell => cell.getBoundingClientRect().width),
      aspectHeights: [...element.querySelectorAll('[data-tetrachotomy-source-aspect]')].map(cell => cell.getBoundingClientRect().height),
      functionHeights: [...element.querySelectorAll('[data-tetrachotomy-source-function]')].map(cell => cell.getBoundingClientRect().height),
      functionOrder: [...element.querySelectorAll('[data-tetrachotomy-source-function]')].map(cell => cell.getAttribute('data-tetrachotomy-source-function')),
      noOverflow: element.scrollWidth <= element.clientWidth,
    }));
    expect(metrics.aspectWidths.every(value => value >= 44 && value <= 96)).toBe(true);
    expect(metrics.aspectHeights.every(value => value >= 44 && value <= 64)).toBe(true);
    expect(metrics.functionHeights.every(value => value >= 44 && value <= 52)).toBe(true);
    expect(metrics.functionOrder).toEqual(['1', '2', '4', '3', '6', '5', '7', '8']);
    expect(metrics.noOverflow).toBe(true);
    if (width === 640 || width === 320) {
      await expect(panel).toHaveScreenshot(`tetrachotomy-container-${width}.png`);
    }
  }
});

test('keeps compact headings full-width and aspect feature words intact', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  for (const traits of ['judicious,nalness', 'yielding,logic', 'judicious,talness']) {
    await page.goto(`/?mode=tetrachotomy&traits=${traits}&theme=dark`);
    const panel = page.locator('[data-tetrachotomy-model-a-slot]');
    await panel.evaluate(element => { element.style.width = '320px'; });
    expect(await panel.evaluate(element => {
      const style = getComputedStyle(element);
      const contentWidth = element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      return element.querySelector('h2')!.getBoundingClientRect().width >= contentWidth - 1;
    })).toBe(true);
    const intactWords = await panel.locator('[data-source-feature]').evaluateAll(features => features.every(feature => {
      const range = document.createRange();
      range.selectNodeContents(feature);
      return range.getClientRects().length === 1;
    }));
    expect(intactWords).toBe(true);
    expect(await panel.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.locator('[data-display-settings] > summary').click();
    await page.getByRole('tablist', { name: 'Отображение аспектов' }).getByRole('tab', { name: 'Оба', exact: true }).click();
    await expect(panel).toHaveAttribute('data-source-aspect-display', 'icon-symbol');
    expect(await panel.locator('[data-tetrachotomy-source-aspect]').evaluateAll(cells => cells.every(cell => {
      const bounds = cell.getBoundingClientRect();
      const glyph = cell.querySelector('[data-aspect-glyph-mode="icon-symbol"]')!.getBoundingClientRect();
      return glyph.left >= bounds.left && glyph.right <= bounds.right && glyph.top >= bounds.top && glyph.bottom <= bounds.bottom;
    }))).toBe(true);
  }
});

test('bounds dichotomy grids independently of viewport width', async ({ page }) => {
  for (const { viewportWidth, trait } of [
    { viewportWidth: 744, trait: 'vertness' },
    { viewportWidth: 1280, trait: 'vertness' },
    { viewportWidth: 1280, trait: 'process' },
  ]) {
    await page.setViewportSize({ width: viewportWidth, height: 1000 });
    await page.goto(`/?trait=${trait}&pole=1&theme=light`);
    const panel = page.locator('[data-dichotomy-detail] .glass-panel').filter({
      has: page.getByRole('heading', { name: 'Аспектон', exact: true }),
    });
    await expect(panel).toHaveCount(1);
    for (const width of [740, 540, 320]) {
      await panel.evaluate((element, value) => { element.style.width = `${value}px`; element.style.maxWidth = '100%'; }, width);
      const metrics = await panel.evaluate(element => {
        const aspects = element.querySelector('.grid-cols-4')!;
        const functions = element.querySelector('.grid-cols-2')!;
        const a = aspects.getBoundingClientRect();
        const f = functions.getBoundingClientRect();
        const style = getComputedStyle(element);
        const available = element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        return {
          aspectWidth: a.width,
          functionWidth: f.width,
          horizontal: f.left > a.right,
          expectedHorizontal: available >= 560,
          arrowRotation: getComputedStyle(element.querySelector('.aspect-function-arrow')!).rotate,
          noOverflow: element.scrollWidth <= element.clientWidth,
          functions: [...functions.querySelectorAll('button')].map(button => button.querySelector('span')!.textContent),
        };
      });
      expect(metrics.aspectWidth).toBeLessThanOrEqual(384);
      expect(metrics.functionWidth).toBeLessThanOrEqual(320);
      expect(metrics.horizontal).toBe(metrics.expectedHorizontal);
      expect(metrics.arrowRotation).toBe(metrics.expectedHorizontal ? '0deg' : '90deg');
      expect(metrics.noOverflow).toBe(true);
      expect(metrics.functions).toEqual(['1', '2', '4', '3', '6', '5', '7', '8']);
      if (viewportWidth === 744 && width !== 320) {
        await expect(panel).toHaveScreenshot(`dichotomy-container-${width}.png`);
      }
    }
  }
});

test('renders the app and key diagram controls', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Инварианты');
  await expect(page.getByRole('tab', { name: 'Признак' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-aspect-display-mode]')).toHaveAttribute('data-aspect-display-mode', 'icon');
  await expect(page.getByRole('tab', { name: 'Тип' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Признаки' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Аспектон' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Функцион' })).toBeVisible();
  await expect(page.locator('[data-trait-nav="vertness"]')).toBeVisible();
  await expect(page.getByRole('button', { name: /Интуиция возможностей/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /1 Базовая/ })).toBeVisible();

  await page.getByRole('button', { name: /Интуиция возможностей/ }).click();
  await page.getByRole('button', { name: /1 Базовая/ }).click();

  await expect(page).toHaveScreenshot('reinin-invariants-app.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.03,
    timeout: 15000,
  });

  expect(errors).toEqual([]);
});

test('syncs selected trait, pole, and view with the URL', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?trait=democracy');
  await expect(page.locator('[data-dichotomy-detail="democracy"]')).toHaveAttribute('data-selected-pole-index', '0');
  await expect(page).not.toHaveURL(/pole=/);

  await page.goto('/?trait=democracy&pole=1&view=2');

  await expect(page.locator('[data-trait-nav="democracy"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('tab', { name: 'Аристократы' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Мерности (4Б)' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/trait=democracy/);
  await expect(page).toHaveURL(/pole=1/);
  await expect(page).toHaveURL(/view=2/);

  await page.locator('[data-trait-nav="positivism"]').click();
  await expect(page.locator('[data-trait-nav="positivism"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('tab', { name: 'Позитивисты' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Эквивалентность 1' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/trait=positivism/);
  await expect(page).not.toHaveURL(/pole=/);
  await expect(page).not.toHaveURL(/view=/);

  await page.getByRole('tab', { name: 'Негативисты' }).click();
  await page.getByRole('tab', { name: 'Эквивалентность 2' }).click();

  await expect(page.getByRole('tab', { name: 'Негативисты' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Эквивалентность 2' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/trait=positivism/);
  await expect(page).toHaveURL(/pole=1/);
  await expect(page).toHaveURL(/view=1/);

  expect(errors).toEqual([]);
});

test('keeps dichotomy gallery and sidebar selection in sync', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?trait=vertness&pole=1&view=1');
  await page.locator('[data-dichotomy-extra-materials] > summary').click();

  await page.locator('[data-dichotomy-card="democracy"]').click();
  await expect(page.locator('[data-dichotomy-card="democracy"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-trait-nav="democracy"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/trait=democracy/);
  await expect(page).not.toHaveURL(/pole=/);
  await expect(page).not.toHaveURL(/view=/);

  await page.locator('[data-trait-nav="positivism"]').click();
  await expect(page.locator('[data-trait-nav="positivism"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-dichotomy-card="positivism"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/trait=positivism/);

  expect(errors).toEqual([]);
});

test('selects the dichotomy pole from the 16-type pattern', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?trait=vertness');
  await page.locator('[data-dichotomy-extra-materials] > summary').click();

  await expect(page.locator('[data-partition-pattern="dichotomy"]')).toBeVisible();
  await expect(page.locator('[data-partition-pattern="dichotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(page.locator('[data-type-id="ILE"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-partition-types-panel="dichotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:0');
  await expect(page.locator('[data-model-preview-type-id]')).toHaveCount(8);
  await expect(page.locator('[data-model-preview-type-id="ILE"]')).toBeVisible();
  await expect(page.locator('[data-model-preview-type-id="SEI"]')).toHaveCount(0);
  await expect(page.locator('[data-model-preview-highlighted="true"]')).toHaveCount(64);

  await page.locator('[data-type-id="SEI"]').click();

  await expect(page.getByRole('tab', { name: 'Интроверты' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-type-id="SEI"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-partition-types-panel="dichotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:1');
  await expect(page.locator('[data-model-preview-type-id="SEI"]')).toBeVisible();
  await expect(page.locator('[data-model-preview-type-id="ILE"]')).toHaveCount(0);
  await expect(page).toHaveURL(/trait=vertness/);
  await expect(page).toHaveURL(/pole=1/);

  expect(errors).toEqual([]);
});

test('switches app modes through the URL state', async ({ page, isMobile }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?trait=democracy');

  await expect(page.getByRole('tab', { name: 'Признак' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).not.toHaveURL(/mode=/);

  await page.getByRole('tab', { name: 'Тип' }).click();
  await expect(page.getByRole('tab', { name: 'Тип' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'ТИМ' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^ИЛЭ/ })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('heading', { name: 'ИЛЭ' })).toBeVisible();
  await expect(page.getByText('Модель А')).toBeVisible();
  await expect(page.getByText('Эго', { exact: true })).toHaveCount(2);
  await expect(page.getByText('Суперид', { exact: true })).toHaveCount(2);
  await expect(page.getByText('Альфа')).toBeVisible();
  await expect(page.getByText('ENTp')).toHaveCount(0);
  await expect(page.getByText('ILE')).toHaveCount(0);
  await expect(page.getByText('SEI')).toHaveCount(0);
  await expect(page.getByText('alpha')).toHaveCount(0);
  await expect(page.locator('[data-invariant-highlight]')).toHaveCount(0);
  await expect(page.locator('[data-aspect-display-mode="icon"]')).toBeVisible();
  await expect(page.locator('[data-aspect-glyph-mode="icon"]')).toHaveCount(8);
  await expect(page).toHaveURL(/mode=type/);
  await expect(page).toHaveURL(/type=ILE/);
  await expect(page).not.toHaveURL(/trait=/);
  await expect(page).not.toHaveURL(/pole=/);
  await expect(page).not.toHaveURL(/view=/);

  if (isMobile) {
    await page.locator('[data-compact-selection="type"]').selectOption('SEI');
    await expect(page.getByRole('heading', { name: 'СЭИ' })).toBeVisible();
    await expect(page).toHaveURL(/type=SEI/);
    await page.locator('[data-compact-selection="type"]').selectOption('ILE');
  }

  await page.getByRole('button', { name: /^ЛСИ/ }).click();
  await expect(page.getByRole('button', { name: /^ЛСИ/ })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('heading', { name: 'ЛСИ' })).toBeVisible();
  await expect(page).toHaveURL(/type=LSI/);

  await page.locator('[data-display-settings] > summary').click();
  await page.getByRole('tab', { name: 'Аббр.' }).click();
  await expect(page.getByRole('tab', { name: 'Аббр.' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-aspect-display-mode="symbol"]')).toBeVisible();
  await expect(page.locator('[data-aspect-glyph-mode="symbol"]')).toHaveCount(8);

  await page.getByRole('tab', { name: 'Оба' }).click();
  await expect(page.getByRole('tab', { name: 'Оба' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-aspect-display-mode="icon-symbol"]')).toBeVisible();
  await expect(page.locator('[data-aspect-glyph-mode="icon-symbol"]')).toHaveCount(8);

  await page.getByRole('tab', { name: 'Тетрахотомия' }).click();
  await expect(page.getByRole('tab', { name: 'Тетрахотомия' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-tetrachotomy-model-a-slot]')).toBeVisible();
  await expect(page.locator('[data-tetrachotomy-extra-materials]')).toBeVisible();
  await expect(page).toHaveURL(/mode=tetrachotomy/);
  await expect(page).not.toHaveURL(/type=/);

  await page.getByRole('tab', { name: 'Октохотомия' }).click();
  await expect(page.getByRole('tab', { name: 'Октохотомия' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-partition-pattern="octochotomy"]')).toBeVisible();
  await expect(page.locator('[data-partition-pattern="octochotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(page).toHaveURL(/mode=octochotomy/);

  if (isMobile) {
    await page.locator('[data-compact-selection="octochotomy"]').selectOption('vertness+nalness+yielding');
    await expect(page).toHaveURL(/traits=vertness%2Cnalness%2Cyielding/);
    await expect(page.locator('[data-partition-catalog-entry="vertness+nalness+yielding"]')).toHaveAttribute('aria-current', 'true');
  }

  await page.getByRole('tab', { name: 'Признак' }).click();
  await expect(page.getByRole('tab', { name: 'Признак' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).not.toHaveURL(/mode=/);
  await expect(page).not.toHaveURL(/type=/);
  await expect(page).toHaveURL(/trait=democracy/);

  expect(errors).toEqual([]);
});

test('syncs theme toggle with URL and local storage', async ({ page }) => {
  await page.goto('/?theme=dark');
  await page.locator('[data-display-settings] > summary').click();

  await expect(page.locator('#root > [data-theme="dark"]')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('tab', { name: 'Темная' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/theme=dark/);

  await page.getByRole('tab', { name: 'Светлая' }).click();

  await expect(page.locator('#root > [data-theme="light"]')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page).not.toHaveURL(/theme=dark/);
  expect(await page.evaluate(() => localStorage.getItem('reinin-invariants-theme'))).toBe('light');

  await page.getByRole('tab', { name: 'Темная' }).click();

  await expect(page.locator('#root > [data-theme="dark"]')).toBeVisible();
  await expect(page).toHaveURL(/theme=dark/);
  expect(await page.evaluate(() => localStorage.getItem('reinin-invariants-theme'))).toBe('dark');
});

test('chooses tetra and octo partitions through sequential trait selection', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=tetrachotomy');
  await expect(page.locator('[data-partition-chooser="tetrachotomy"]')).toBeVisible();
  await expect(page.locator('[data-partition-catalog-count="tetrachotomy"]')).toHaveText('35');
  await expect(page.locator('[data-partition-entry-mode="structural"]')).toHaveCount(0);
  await expect(page.locator('[data-partition-entry-mode="catalog"]')).toBeVisible();
  await expect(page.locator('[data-partition-entry-mode="sequential"]')).not.toBeVisible();
  await expect(page.locator('[data-partition-entry-mode="gallery"]')).not.toBeVisible();
  await page.locator('[data-partition-catalog-entry="tetra-01"]').click();
  const sourceBlock = page.locator('[data-tetrachotomy-source-block]');
  await expect(sourceBlock).toBeVisible();
  await expect(page.locator('[data-tetrachotomy-extra-materials] > div > [data-partition-pattern="tetrachotomy"]')).toContainText('Экстраверсия / Интроверсия');
  await expect(page.locator('[data-tetrachotomy-extra-materials] > div > [data-partition-pattern="tetrachotomy"] [data-type-id="ILE"]')).toContainText('Экс / Бес / Инт');
  await expect(page.locator('[data-tetrachotomy-extra-materials] > div > [data-partition-pattern="tetrachotomy"]')).toContainText('Выбранный класс');
  await expect(page.locator('[data-tetrachotomy-extra-materials] > div > [data-partition-pattern="tetrachotomy"]')).toContainText('Экстраверты');
  await expect(page.locator('[data-partition-types-panel="tetrachotomy"]')).toContainText('Экстраверты');
  await expect(page.locator('[data-tetrachotomy-model-a-slot]')).toContainText('Рыцари');
  await expect(sourceBlock.locator('[data-tetrachotomy-source-aspect]')).toHaveCount(8);
  await expect(sourceBlock.locator('[data-tetrachotomy-source-function]')).toHaveCount(8);
  await expect(sourceBlock.locator('[data-tetrachotomy-source-aspect="ЧИ"]')).toHaveAttribute('data-source-row-index', '0');
  await expect(sourceBlock.locator('[data-tetrachotomy-source-aspect="ЧИ"] [data-aspect-icon-layer="shape"]')).toHaveAttribute('fill', '#050505');
  await expect(sourceBlock.locator('[data-tetrachotomy-source-aspect="ЧИ"] [data-aspect-icon-layer="contrast"]')).toHaveCount(1);
  await expect(sourceBlock.locator('[data-tetrachotomy-source-aspect="БИ"] [data-aspect-icon-layer="shape"]')).toHaveAttribute('fill', '#ffffff');
  await expect(sourceBlock.locator('[data-tetrachotomy-source-aspect="ЧИ"] [data-aspect-icon-size="xl"]')).toHaveCount(1);
  await expect(sourceBlock.locator('[data-tetrachotomy-source-aspect="ЧИ"] [data-aspect-glyph-mode="icon"]')).toHaveCount(1);
  await expect(sourceBlock.locator('[data-tetrachotomy-source-function="1"]')).toHaveAttribute('data-source-row-index', '0');
  await expect(sourceBlock.locator('[data-tetrachotomy-source-function="8"]')).toHaveAttribute('data-source-row-index', '0');
  await expect(sourceBlock.locator('[data-tetrachotomy-aspect-function-row="ЧИ"]')).toContainText('мерность 4');
  await expect(sourceBlock.locator('[data-tetrachotomy-aspect-function-row="БИ"]')).toContainText('мерность 3');
  await expect(sourceBlock.locator('[data-tetrachotomy-aspect-function-row="ЧС"]')).toContainText('мерность 2');
  await expect(sourceBlock.locator('[data-tetrachotomy-aspect-function-row="БС"]')).toContainText('мерность 1');
  await page.getByText('Доп материалы').click();
  const ilePreview = page.locator('[data-model-preview-type-id="ILE"]');
  await expect(ilePreview.locator('[data-model-preview-function-id="1"] [data-aspect-icon-size="xl"]')).toHaveCount(1);
  await expect(ilePreview.locator('[data-model-preview-function-id="1"]')).toHaveAttribute('data-model-preview-highlight-group', '0');
  await expect(ilePreview.locator('[data-model-preview-function-id="1"]')).toHaveAttribute('data-model-preview-highlight-intensity', 'primary');
  await expect(ilePreview.locator('[data-model-preview-function-id="8"]')).toHaveAttribute('data-model-preview-highlight-group', '0');
  await expect(ilePreview.locator('[data-model-preview-function-id="8"]')).toHaveAttribute('data-model-preview-highlight-intensity', 'secondary');
  await page.locator('[data-tetrachotomy-formula-cell="carefree:0|intuition:1"]').click();
  await expect(page.locator('[data-tetrachotomy-model-a-slot]')).toContainText('Благосостояние');
  await expect(page.locator('[data-tetrachotomy-source-block]')).toHaveAttribute('data-tetrachotomy-source-block', 'ESI|LSI|SEI|SLI');
  await page.locator('[data-tetrachotomy-formula-cell="carefree:1|intuition:1"]').click();
  await expect(page.locator('[data-tetrachotomy-model-a-slot]')).toContainText('Статус');
  await expect(page.locator('[data-tetrachotomy-source-block]')).toHaveAttribute('data-tetrachotomy-source-block', 'ESE|LSE|SEE|SLE');
  await page.locator('[data-tetrachotomy-formula-cell="carefree:1|intuition:0"]').click();
  await expect(page.locator('[data-tetrachotomy-model-a-slot]')).toContainText('Целостность опыта');
  await expect(page.locator('[data-tetrachotomy-source-block]')).toHaveAttribute('data-tetrachotomy-source-block', 'EII|IEI|ILI|LII');

  await page.goto('/?mode=tetrachotomy');
  await page.getByText('По шагам и паттерны').click();
  await page.locator('[data-partition-sequential-slot="0"][data-partition-sequential-trait="talness"]').click();
  await expect(page.locator('[data-tetrachotomy-model-a-slot]')).toBeVisible();
  await expect(page.locator('[data-partition-catalog-entry="tetra-07"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/mode=tetrachotomy/);
  await expect(page).toHaveURL(/traits=nalness%2Ctalness/);

  await page.getByRole('tab', { name: 'Октохотомия' }).click();
  await expect(page.locator('[data-partition-chooser="octochotomy"]')).toBeVisible();
  await page.locator('[data-partition-sequential-slot="2"][data-partition-sequential-trait="yielding"]').click();
  await expect(page.locator('[data-partition-pattern="octochotomy"]')).toBeVisible();
  await expect(page.locator('[data-partition-catalog-entry="vertness+nalness+yielding"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/mode=octochotomy/);
  await expect(page).toHaveURL(/traits=vertness%2Cnalness%2Cyielding/);

  expect(errors).toEqual([]);
});

test('chooses tetra and octo partitions through catalog entries', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=tetrachotomy');
  await page.locator('[data-partition-catalog-entry="tetra-35"]').click();
  await expect(page.locator('[data-partition-catalog-entry="tetra-35"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-tetrachotomy-extra-materials] > div > [data-partition-pattern="tetrachotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(page.locator('[data-partition-types-panel="tetrachotomy"]')).toBeVisible();
  await expect(page.locator('[data-tetrachotomy-formula-panel="tetra-35"]')).not.toBeVisible();
  await page.getByText('Доп материалы').click();
  const formulaPanel = page.locator('[data-tetrachotomy-formula-panel="tetra-35"]');
  await expect(formulaPanel).toContainText('Лг/Эт = ?/! Х Рс/Рш');
  await expect(formulaPanel.locator('[data-tetrachotomy-formula-target="logic"]')).toContainText('Логика / Этика');
  await expect(formulaPanel.locator('[data-tetrachotomy-formula-basis="asking"]')).toContainText('Квестимность / Деклатимность');
  await expect(formulaPanel.locator('[data-tetrachotomy-formula-basis="judicious"]')).toContainText('Рассудительность / Решительность');
  await expect(formulaPanel.locator('[data-tetrachotomy-formula-cell]')).toHaveCount(4);
  await expect(formulaPanel.locator('[data-tetrachotomy-formula-cell][data-target-pole-index="0"]')).toHaveCount(2);
  await expect(formulaPanel.locator('[data-tetrachotomy-formula-cell][data-target-pole-index="1"]')).toHaveCount(2);
  await expect(page.locator('[data-tetrachotomy-source-block-fallback]')).toContainText('source-разбор');
  await expect(page).toHaveURL(/traits=asking%2Cjudicious/);

  await formulaPanel.locator('[data-tetrachotomy-formula-cell="asking:1|judicious:0"]').click();
  await expect(page.locator('[data-tetrachotomy-class="asking:1|judicious:0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-tetrachotomy-model-a-slot]')).toBeVisible();
  await expect(page).toHaveURL(/class=asking%3A1%7Cjudicious%3A0/);

  await page.getByRole('tab', { name: 'Октохотомия' }).click();
  await page.locator('[data-partition-catalog-entry="vertness+nalness+asking"]').click();
  await expect(page.locator('[data-partition-catalog-entry="vertness+nalness+asking"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-partition-pattern="octochotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(page).toHaveURL(/traits=vertness%2Cnalness%2Casking/);

  expect(errors).toEqual([]);
});

test('chooses tetra and octo partitions through visual pattern gallery', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=tetrachotomy');
  await page.getByText('По шагам и паттерны').click();
  await page.locator('[data-partition-gallery-entry="tetra-07"]').click();
  await expect(page.locator('[data-partition-gallery-entry="tetra-07"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-partition-catalog-entry="tetra-07"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/traits=nalness%2Ctalness/);

  await page.getByRole('tab', { name: 'Октохотомия' }).click();
  await page.locator('[data-partition-gallery-entry="vertness+talness+carefree"]').click();
  await expect(page.locator('[data-partition-gallery-entry="vertness+talness+carefree"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-partition-catalog-entry="vertness+talness+carefree"]')).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/traits=vertness%2Ctalness%2Ccarefree/);

  expect(errors).toEqual([]);
});

test('shows tetrachotomy composition and toggles component poles', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=tetrachotomy&traits=vertness,nalness');

  await page.getByText('Доп материалы').click();
  const composition = page.locator('[data-partition-composition="tetrachotomy"]');
  const finalPattern = composition.locator('[data-composition-final="true"]');
  const detail = page.locator('[data-tetrachotomy-detail]');

  await expect(detail).toHaveAttribute('data-selected-class-key', 'vertness:0|nalness:0');
  await expect(page.locator('[data-tetrachotomy-model-a-slot]')).toBeVisible();
  await expect(composition).toBeVisible();
  await expect(detail.locator('[data-tetrachotomy-class]')).toHaveCount(4);
  await expect(detail.locator('[data-tetrachotomy-class="vertness:0|nalness:0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-partition-types-panel="tetrachotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:0|nalness:0');
  await expect(detail.locator('[data-partition-types-panel="tetrachotomy"] [data-model-preview-type-id]')).toHaveCount(4);
  await expect(detail.locator('[data-partition-types-panel="tetrachotomy"] [data-model-preview-type-id="ILE"]')).toBeVisible();
  await expect(composition.locator('[data-composition-component-index]')).toHaveCount(2);
  await expect(composition.locator('[data-composition-component-index="0"]')).toHaveAttribute('data-composition-component-trait', 'vertness');
  await expect(composition.locator('[data-composition-component-index="1"]')).toHaveAttribute('data-composition-component-trait', 'nalness');
  await expect(finalPattern.locator('[data-partition-pattern="tetrachotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(finalPattern.locator('[data-partition-pattern="tetrachotomy"] [aria-pressed="true"]')).toHaveCount(4);

  await composition.locator('[data-composition-pole="vertness"][data-composition-pole-index="1"]').click();

  await expect(composition.locator('[data-composition-pole="vertness"][data-composition-pole-index="1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(composition.locator('[data-composition-pole="nalness"][data-composition-pole-index="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-tetrachotomy-class="vertness:1|nalness:0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-partition-types-panel="tetrachotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:1|nalness:0');
  await expect(finalPattern.locator('[data-partition-pattern="tetrachotomy"] [aria-pressed="true"]')).toHaveCount(4);
  await expect(page).toHaveURL(/class=vertness%3A1%7Cnalness%3A0/);

  await finalPattern.locator('[data-type-id="ILE"]').click();

  await expect(composition.locator('[data-composition-pole="vertness"][data-composition-pole-index="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(composition.locator('[data-composition-pole="nalness"][data-composition-pole-index="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-tetrachotomy-class="vertness:0|nalness:0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/class=vertness%3A0%7Cnalness%3A0/);

  expect(errors).toEqual([]);
});

test('shows octochotomy composition and toggles component poles', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=octochotomy&traits=vertness,nalness,carefree');

  const composition = page.locator('[data-partition-composition="octochotomy"]');
  const finalPattern = composition.locator('[data-composition-final="true"]');
  const detail = page.locator('[data-octochotomy-detail]');

  await expect(detail).toHaveAttribute('data-selected-class-key', 'vertness:0|nalness:0|carefree:0');
  await expect(composition).toBeVisible();
  await expect(detail.locator('[data-octochotomy-class]')).toHaveCount(8);
  await expect(detail.locator('[data-octochotomy-class="vertness:0|nalness:0|carefree:0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-partition-types-panel="octochotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:0|nalness:0|carefree:0');
  await expect(detail.locator('[data-partition-types-panel="octochotomy"] [data-model-preview-type-id]')).toHaveCount(2);
  await expect(detail.locator('[data-partition-types-panel="octochotomy"] [data-model-preview-type-id="ILE"]')).toBeVisible();
  await expect(composition.locator('[data-composition-component-index]')).toHaveCount(3);
  await expect(composition.locator('[data-composition-component-index="0"]')).toHaveAttribute('data-composition-component-trait', 'vertness');
  await expect(composition.locator('[data-composition-component-index="1"]')).toHaveAttribute('data-composition-component-trait', 'nalness');
  await expect(composition.locator('[data-composition-component-index="2"]')).toHaveAttribute('data-composition-component-trait', 'carefree');
  await expect(finalPattern.locator('[data-partition-pattern="octochotomy"] [role="gridcell"]')).toHaveCount(16);
  await expect(finalPattern.locator('[data-partition-pattern="octochotomy"] [aria-pressed="true"]')).toHaveCount(2);

  await composition.locator('[data-composition-pole="carefree"][data-composition-pole-index="1"]').click();

  await expect(composition.locator('[data-composition-pole="vertness"][data-composition-pole-index="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(composition.locator('[data-composition-pole="nalness"][data-composition-pole-index="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(composition.locator('[data-composition-pole="carefree"][data-composition-pole-index="1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-octochotomy-class="vertness:0|nalness:0|carefree:1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('[data-partition-types-panel="octochotomy"]')).toHaveAttribute('data-selected-class-key', 'vertness:0|nalness:0|carefree:1');
  await expect(finalPattern.locator('[data-partition-pattern="octochotomy"] [aria-pressed="true"]')).toHaveCount(2);
  await expect(page).toHaveURL(/class=vertness%3A0%7Cnalness%3A0%7Ccarefree%3A1/);

  expect(errors).toEqual([]);
});

test('shows octochotomy diagnostics for dependent URL triples', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=octochotomy&traits=vertness,nalness,talness');

  await expect(page.locator('[data-partition-chooser="octochotomy"]')).toBeVisible();
  await expect(page.locator('[data-octochotomy-detail]')).toHaveCount(0);
  await expect(page.locator('[data-partition-pattern="octochotomy"]')).toHaveCount(0);
  await expect(page.locator('[data-partition-diagnostic="octochotomy"]')).toHaveAttribute('data-partition-diagnostic-reason', 'dependent-traits');
  await expect(page.locator('[data-partition-diagnostic="octochotomy"]')).toContainText('Selected traits');
  await expect(page.locator('[data-compact-selection="octochotomy"]')).toHaveValue('custom');
  await expect(page).toHaveURL(/mode=octochotomy/);
  await expect(page).toHaveURL(/traits=vertness%2Cnalness%2Ctalness/);
  await expect(page).not.toHaveURL(/class=/);

  expect(errors).toEqual([]);
});

test('renders type mode Model A without English abbreviations', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/?mode=type&type=SEI');

  await expect(page.getByRole('tab', { name: 'Тип' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'ТИМ' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^СЭИ/ })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('heading', { name: 'СЭИ' })).toBeVisible();
  await expect(page.getByText('Модель А')).toBeVisible();
  await expect(page.getByText('Альфа')).toBeVisible();
  await expect(page.getByText('SEI')).toHaveCount(0);
  await expect(page.getByText('ILE')).toHaveCount(0);
  await expect(page.getByText('ISFp')).toHaveCount(0);
  await expect(page.getByText('alpha')).toHaveCount(0);
  await expect(page.locator('[data-invariant-highlight]')).toHaveCount(0);

  await expect(page).toHaveScreenshot('reinin-invariants-type-mode.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.03,
    timeout: 15000,
  });

  expect(errors).toEqual([]);
});
