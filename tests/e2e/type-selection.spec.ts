import { expect, test } from '@playwright/test';
import { SOCIONIC_TYPES } from '../../src/data/socionics';

for (const theme of ['dark', 'light']) {
  test(`selected type is explicit and synchronized in ${theme}`, async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/?mode=type&type=ILE&theme=${theme}`);
    const selector = page.locator('[data-type-selector]');
    const verifySelected = async (id: string) => {
      const type = SOCIONIC_TYPES.find(candidate => candidate.id === id)!;
      const code = type.aliases.socionics![0];
      const selected = selector.locator(`[data-type-choice="${id}"]`);
      await expect(selected).toHaveAttribute('aria-current', 'true');
      await expect(selector.locator('[aria-current="true"]')).toHaveCount(1);
      await expect(selector.locator('[data-selected-type-marker]')).toHaveCount(1);
      await expect(selected.locator('[data-selected-type-marker]')).toBeVisible();
      await expect(selector.locator('[data-selected-type-summary]')).toHaveText(`Выбран: ${code}`);
      await expect(page.getByRole('heading', { name: code, exact: true })).toBeVisible();
      await expect.poll(() => new URL(page.url()).searchParams.get('type')).toBe(id);
      await expect.poll(() => selector.evaluate(element => {
        const active = getComputedStyle(element.querySelector('[aria-current="true"]')!);
        const inactive = getComputedStyle(element.querySelector('button:not([aria-current])')!);
        return active.backgroundColor !== inactive.backgroundColor && active.boxShadow !== 'none';
      })).toBe(true);
    };

    await expect(selector.locator('button')).toHaveCount(SOCIONIC_TYPES.length);
    for (const type of SOCIONIC_TYPES) {
      await selector.locator(`[data-type-choice="${type.id}"]`).click();
      await verifySelected(type.id);
    }
    const focused = selector.locator('[data-type-choice="SEI"]');
    await focused.focus();
    await expect(focused).toBeFocused();
    await expect(selector.locator('[data-type-choice="EII"]')).toHaveAttribute('aria-current', 'true');
    await page.keyboard.press('Enter');
    await verifySelected('SEI');
    await page.reload();
    await verifySelected('SEI');

    for (const width of [320, 740, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await selector.locator('button').evaluateAll(cards => cards.every(card => {
        const bounds = card.getBoundingClientRect();
        const marker = card.querySelector('[data-selected-type-marker]')?.getBoundingClientRect();
        return card.scrollWidth <= card.clientWidth + 1
          && (!marker || (marker.left >= bounds.left && marker.right <= bounds.right && marker.top >= bounds.top && marker.bottom <= bounds.bottom));
      }))).toBe(true);
    }
    await page.setViewportSize(testInfo.project.use.viewport!);
    const compact = page.locator('[data-compact-selection="type"]');
    if (testInfo.project.name === 'chromium-mobile') {
      await expect(compact).toBeVisible();
      await compact.selectOption('SLE');
      await verifySelected('SLE');
    } else {
      await expect(compact).not.toBeVisible();
    }
    await selector.locator('[data-type-choice="ILE"]').click();
    await verifySelected('ILE');
    await page.mouse.move(0, 0);
    await selector.screenshot({ path: testInfo.outputPath(`selected-type-${theme}.png`), animations: 'disabled' });
    expect(errors).toEqual([]);
  });
}
