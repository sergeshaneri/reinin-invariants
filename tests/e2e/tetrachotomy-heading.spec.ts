import { expect, test } from '@playwright/test';

for (const theme of ['dark', 'light']) {
  test(`selected tetrachotomy notation is the main heading in ${theme}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/?mode=tetrachotomy&traits=subjectivism,process&theme=${theme}`);
    const panel = page.locator('[data-tetrachotomy-aspect-function-panel="tetra-10"]');
    const heading = panel.getByRole('heading', { level: 2, name: 'Пц/Рз · Сб/Об · Бс/Пр', exact: true });
    await expect(heading).toBeInViewport();
    await expect(panel.locator('[data-order-dependent-class] p').first()).toHaveText('Порядкозависимые (2×4)×4');
    const select = page.locator('[data-tetrachotomy-class-select]');
    const classes = await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
    expect(classes).toHaveLength(4);
    for (const classKey of classes) {
      await select.selectOption(classKey);
      await expect(heading).toHaveText('Пц/Рз · Сб/Об · Бс/Пр');
      await expect(panel.locator('[data-order-dependent-class] p').first()).toHaveText('Порядкозависимые (2×4)×4');
    }
    await panel.locator('.tetra-panel-header').screenshot({ path: testInfo.outputPath(`tetrachotomy-heading-${theme}.png`), animations: 'disabled' });
    await page.goto(`/?mode=tetrachotomy&traits=process,tactical&theme=${theme}`);
    await expect(page.locator('[data-tetrachotomy-aspect-function-panel="tetra-34"]').getByRole('heading', { level: 2 })).toHaveText('Пц/Рз · Тк/Ст · Лг/Эт — Группы внедрения');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    expect(errors).toEqual([]);
  });
}
