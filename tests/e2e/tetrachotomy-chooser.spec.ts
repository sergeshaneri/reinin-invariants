import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  test(`tetrachotomy formulas and transferred diagram marks in ${theme} theme`, async ({ page, isMobile }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/?mode=tetrachotomy&traits=carefree,intuition&theme=${theme}`);
    const chooser = page.locator('[data-partition-chooser="tetrachotomy"]');
    const entries = chooser.locator('[data-partition-catalog-entry]');
    await expect(entries).toHaveCount(35);
    await expect(entries.first()).toContainText('1. Верт ⊙ Бс/Пр ⊙ Ит/Сн = 1');

    await expect(chooser.locator('[data-partition-catalog-entry="tetra-02"] [data-tetrachotomy-diagrams-ready]')).toHaveCount(0);
    await expect(chooser.locator('[data-partition-catalog-entry="tetra-01"] [title="Диаграммы перенесены"]')).toHaveCount(1);
    const compact = page.locator('[data-compact-selection="tetrachotomy"]');
    const transferredCount = await compact.locator('option').evaluateAll(options => (
      options.filter(option => option.textContent?.endsWith(' ✓')).length
    ));
    expect(transferredCount).toBeGreaterThan(0);
    await expect(chooser.locator('[data-tetrachotomy-diagrams-ready]')).toHaveCount(transferredCount);
    await expect(compact.locator('option[value="tetra-01"]')).toHaveText('1. Верт ⊙ Бс/Пр ⊙ Ит/Сн = 1 ✓');
    await expect(compact.locator('option[value="tetra-02"]')).toHaveText('2. Верт ⊙ Дм/Ар ⊙ +/- = 1');
    await chooser.scrollIntoViewIfNeeded();
    const overflow = await entries.evaluateAll(buttons => buttons.filter(button => {
      const label = button.firstElementChild!;
      return label.scrollWidth > label.clientWidth + 1 || button.scrollWidth > button.clientWidth + 1;
    }).length);
    expect(overflow).toBe(0);
    if (isMobile) {
      await compact.selectOption('tetra-03');
    } else {
      await chooser.locator('[data-partition-catalog-entry="tetra-03"]').click();
    }
    await expect(page).toHaveURL(/traits=yielding%2Clogic/);
    await expect(chooser.locator('[data-partition-catalog-entry="tetra-03"]')).toHaveAttribute('aria-current', 'true');
    expect(errors).toEqual([]);
  });
}
