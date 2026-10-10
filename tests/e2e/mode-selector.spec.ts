import { expect, test } from '@playwright/test';

for (const theme of ['dark', 'light']) {
  test(`mode selector order, icons and switching in ${theme}`, async ({ page }, testInfo) => {
    await page.goto(`/?trait=talness&theme=${theme}`);
    const modes = page.getByRole('tablist', { name: 'Режим просмотра' });
    await expect(modes.getByRole('tab')).toHaveText(['Признак', 'Тетрахотомия', 'Октохотомия', 'Тип']);
    const octochotomy = modes.getByRole('tab', { name: 'Октохотомия', exact: true });
    const type = modes.getByRole('tab', { name: 'Тип', exact: true });
    await expect(octochotomy.locator('svg.lucide-box')).toBeVisible();
    await expect(type.locator('svg.lucide-user-round')).toBeVisible();
    const octochotomyBounds = (await octochotomy.boundingBox())!;
    const typeBounds = (await type.boundingBox())!;
    expect(typeBounds.x).toBeGreaterThan(octochotomyBounds.x);
    expect(Math.abs(typeBounds.y - octochotomyBounds.y)).toBeLessThanOrEqual(1);
    await modes.screenshot({ path: testInfo.outputPath(`mode-selector-${theme}.png`), animations: 'disabled' });

    for (const [label, mode] of [
      ['Тетрахотомия', 'tetrachotomy'],
      ['Октохотомия', 'octochotomy'],
      ['Тип', 'type'],
      ['Признак', 'trait'],
    ]) {
      const tab = modes.getByRole('tab', { name: label, exact: true });
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      await expect(modes.locator('[aria-selected="true"]')).toHaveCount(1);
      await expect.poll(() => new URL(page.url()).searchParams.get('mode') ?? 'trait').toBe(mode);
    }
  });
}
