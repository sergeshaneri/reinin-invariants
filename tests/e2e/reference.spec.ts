import { expect, test } from '@playwright/test';

for (const theme of ['dark', 'light']) {
  test(`reference navigation, tables and layout in ${theme}`, async ({ page, isMobile }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/?mode=type&type=ILE&theme=${theme}`);
    if (isMobile) await page.locator('[data-compact-selection="type"]').selectOption('EII');
    else await page.getByRole('button', { name: /^ЭИИ -/ }).click();
    await page.getByRole('link', { name: 'Справка', exact: true }).click();
    await expect(page.locator('[data-reference-page]')).toBeVisible();
    await expect(page).toHaveURL(/page=reference/);
    await expect(page.locator('[data-reference-aspect]')).toHaveCount(8);
    await expect(page.locator('[data-reference-function]')).toHaveCount(8);
    await expect(page.locator('#functions')).toContainText('Ментальная / Витальная');
    await expect(page.locator('#functions')).not.toContainText(/статич|динамич|иррациональ|рациональ/i);
    await expect(page.locator('#functions')).toContainText('Акцептная / Продуктивная');
    await expect(page.locator('[data-reference-function-feature="isAcceptant"]')).toHaveText([
      'Акцептная', 'Продуктивная', 'Акцептная', 'Продуктивная',
      'Акцептная', 'Продуктивная', 'Акцептная', 'Продуктивная',
    ]);
    const functionMatrix = page.locator('[data-hadamard-matrix="functionon"]');
    await expect(functionMatrix.locator('th[title="Акцептная / Продуктивная"]')).toHaveText('7Наль');
    for (const title of await functionMatrix.locator('[title]').evaluateAll(elements => elements.map(element => element.getAttribute('title')!))) {
      expect(title).not.toMatch(/статич|динамич|иррациональ|рациональ/i);
    }
    await expect(page.locator('[data-reference-function-feature="isMental"]')).toHaveText([
      'Ментальная', 'Ментальная', 'Ментальная', 'Ментальная',
      'Витальная', 'Витальная', 'Витальная', 'Витальная',
    ]);
    await expect(page.locator('#aspects')).toContainText('Статичный / Динамичный');
    await expect(page.locator('[data-reference-type]')).toHaveCount(16);
    await expect(page.locator('[data-reference-quadra]')).toHaveCount(4);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await page.reload();
    await expect(page.locator('[data-reference-page]')).toBeVisible();
    await page.getByRole('link', { name: 'Модели А', exact: true }).click();
    await expect(page).toHaveURL(/#models$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.getByRole('link', { name: 'К диаграммам', exact: true }).click();
    await expect(page.locator('[data-reference-page]')).toHaveCount(0);
    await expect(page).toHaveURL(/mode=type/);
    await expect(page).toHaveURL(/type=EII/);
    expect(errors).toEqual([]);
  });

  test(`mental/vital function labels in the ordinary diagram in ${theme}`, async ({ page }) => {
    await page.goto(`/?trait=talness&theme=${theme}`);
    const diagram = page.locator('[data-primary-diagram="dichotomy"]');
    await expect(diagram.getByText('Ментальные', { exact: true })).toBeVisible();
    await expect(diagram.getByText('Витальные', { exact: true })).toBeVisible();
    await expect(diagram.getByRole('button', { name: /^1 Базовая\./ })).toHaveAttribute('title', /Ментальная/);
    await expect(diagram.getByRole('button', { name: /^5 Суггестивная\./ })).toHaveAttribute('title', /Витальная/);
    await expect(diagram.getByText('Статичные', { exact: true })).toBeVisible();
    await expect(diagram.getByText('Динамичные', { exact: true })).toBeVisible();
  });

  test(`accepting/producing labels and all function tooltips use functional terms in ${theme}`, async ({ page }) => {
    await page.goto(`/?trait=nalness&theme=${theme}`);
    const diagram = page.locator('[data-primary-diagram="dichotomy"]');
    await expect(diagram.getByText('Акцептные', { exact: true })).toBeVisible();
    await expect(diagram.getByText('Продуктивные', { exact: true })).toBeVisible();
    await expect(diagram.getByText('Иррациональные', { exact: true })).toBeVisible();
    await expect(diagram.getByText('Рациональные', { exact: true })).toBeVisible();
    for (const [index, name] of ['Базовая', 'Творческая', 'Ролевая', 'Болевая', 'Суггестивная', 'Активационная', 'Ограничительная', 'Фоновая'].entries()) {
      const id = index + 1;
      const button = diagram.getByRole('button', { name: new RegExp(`^${id} ${name}\\.`) });
      for (const attribute of ['title', 'aria-label']) {
        await expect(button).toHaveAttribute(attribute, id % 2 ? /Акцептная/ : /Продуктивная/);
        await expect(button).toHaveAttribute(attribute, id <= 4 ? /Ментальная/ : /Витальная/);
        expect(await button.getAttribute(attribute)).not.toMatch(/статич|динамич|иррациональ|рациональ/i);
      }
    }
  });
}
