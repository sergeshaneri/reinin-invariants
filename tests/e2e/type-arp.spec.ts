import { expect, test, type Page } from '@playwright/test';
import { analysis, exampleFor, invariant, model, selectType, traitSelect, verifyExample } from './type-arp-helpers';

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  (page as Page & { arpErrors?: string[] }).arpErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { arpErrors?: string[] }).arpErrors).toEqual([]);
});

test('group pressed state means pin, not transient hover or keyboard focus', async ({ page }) => {
  await page.goto('/?mode=type&type=ILE&arp=logic');
  const row = page.locator('[data-type-arp-explanation] button[data-arp-group-index="0"]');
  const cells = page.locator('[data-type-model-function-id][data-arp-group-index="0"]');
  await row.hover();
  await expect(row).toHaveAttribute('data-arp-active', 'true');
  await expect(row).toHaveAttribute('aria-pressed', 'false');
  await expect(cells.first().locator('button')).toHaveAttribute('aria-pressed', 'false');
  await row.focus();
  await expect(row).toBeFocused();
  await expect(row).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Enter');
  await expect(row).toHaveAttribute('aria-pressed', 'true');
  for (const cell of await cells.all()) await expect(cell.locator('button')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Enter');
  await expect(row).toHaveAttribute('aria-pressed', 'false');
  await expect(row).toHaveAttribute('data-arp-active', 'true');
  await page.mouse.move(0, 0);
  await traitSelect(page).focus();
  await expect(row).not.toHaveAttribute('data-arp-active', 'true');
  await cells.first().locator('button').focus();
  await page.keyboard.press('Space');
  await expect(row).toHaveAttribute('aria-pressed', 'true');
  await traitSelect(page).focus();
  await expect(row).toHaveAttribute('data-arp-active', 'true');
  await traitSelect(page).selectOption('democracy');
  await expect(model(page).locator('button[aria-pressed="true"]')).toHaveCount(0);
  await expect(page.locator('[data-type-arp-explanation] button[aria-pressed="true"]')).toHaveCount(0);
});

test('keyboard focus survives pointer leaving the focused group', async ({ page }) => {
  await page.goto('/?mode=type&type=ILE&arp=logic');
  const row = page.locator('[data-type-arp-explanation] button[data-arp-group-index="0"]');
  await row.hover();
  await row.focus();
  await page.mouse.move(0, 0);
  await expect(row).toBeFocused();
  await expect(row).toHaveAttribute('data-arp-active', 'true');
  await expect(row).toHaveAttribute('aria-pressed', 'false');
  await traitSelect(page).focus();
  await expect(row).not.toHaveAttribute('data-arp-active', 'true');
  const cell = model(page).locator('[data-arp-group-index="0"] button').first();
  await cell.hover();
  await cell.focus();
  await page.mouse.move(0, 0);
  await expect(cell).toBeFocused();
  await expect(row).toHaveAttribute('data-arp-active', 'true');
});

test('general condition uses the selected nondefault equivalence description', async ({ page }) => {
  await page.goto('/?mode=type&type=ILE&arp=positivism&arpView=1');
  const example = await exampleFor(page, 'ILE', 'positivism', 1);
  expect(example.view.description).toBeTruthy();
  expect(example.view.description).not.toBe(example.pole.description);
  const details = analysis(page).locator('[data-type-arp-general-condition]');
  await details.locator('summary').click();
  await expect(details.locator('p').last()).toHaveText(example.view.description!);
});

test('neutral disclosure, pole changes, gallery focus, session, copied URL and navigation', async ({ page, isMobile }, testInfo) => {
  test.setTimeout(90_000);
  await page.goto('/?mode=type&type=ILE&trait=logic&theme=light');
  const disclosure = page.locator('[data-type-arp-explorer] > button');
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  await expect(model(page).locator('button')).toHaveCount(0);
  await expect(page.locator('[data-type-arp-explanation]')).toHaveCount(0);
  await disclosure.click();
  await verifyExample(page, 'ILE', 'logic');
  await selectType(page, 'LII', isMobile);
  await verifyExample(page, 'LII', 'logic');
  await selectType(page, 'SEI', isMobile);
  await verifyExample(page, 'SEI', 'logic');
  await traitSelect(page).selectOption('democracy');
  await invariant(page).getByRole('tab').nth(2).click();
  await verifyExample(page, 'SEI', 'democracy', 2);
  await page.locator('[data-type-arp-explanation] button').first().click();
  await expect(page.locator('[data-type-arp-explanation] button[aria-pressed="true"]')).toHaveCount(1);
  const mini = page.locator('[data-model-preview-type-id="ILE"] > button');
  await mini.focus();
  await page.keyboard.press('Enter');
  await verifyExample(page, 'ILE', 'democracy', 2);
  await expect(mini).toBeFocused();
  await expect(model(page).locator('button[aria-pressed="true"]')).toHaveCount(0);
  await expect(page.locator('[data-type-arp-explanation] button[aria-pressed="true"]')).toHaveCount(0);
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-model-preview-type-id="SEI"] > button')).toBeFocused();
  await page.keyboard.press('Enter');
  await verifyExample(page, 'SEI', 'democracy', 2);
  await selectType(page, 'EIE', isMobile);
  await verifyExample(page, 'EIE', 'democracy', 2);
  await disclosure.click();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('[data-type-arp-explanation]')).toHaveCount(0);
  await expect.poll(() => new URL(page.url()).searchParams.has('arp')).toBe(false);
  await disclosure.click();
  await verifyExample(page, 'EIE', 'democracy', 2);
  const modes = page.getByRole('tablist', { name: 'Режим просмотра' });
  await modes.getByRole('tab', { name: 'Признак', exact: true }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get('trait')).toBe('logic');
  await modes.getByRole('tab', { name: 'Тип', exact: true }).click();
  await verifyExample(page, 'EIE', 'democracy', 2);
  const copied = page.url();
  await page.reload();
  await verifyExample(page, 'EIE', 'democracy', 2);
  await page.goto(copied);
  await verifyExample(page, 'EIE', 'democracy', 2);
  await page.getByRole('link', { name: 'Справка', exact: true }).click();
  await expect(page.locator('[data-reference-page]')).toBeVisible();
  await page.reload();
  await page.getByRole('link', { name: 'К диаграммам', exact: true }).click();
  await verifyExample(page, 'EIE', 'democracy', 2);
  await page.getByRole('button', { name: 'Открыть общее представление АРП', exact: true }).click();
  for (const [key, value] of Object.entries({ trait: 'democracy', pole: '1', view: '2' })) {
    await expect.poll(() => new URL(page.url()).searchParams.get(key)).toBe(value);
  }
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.getByRole('tablist', { name: 'Выбор инварианта' }).getByRole('tab').nth(2)).toHaveAttribute('aria-selected', 'true');
  await modes.getByRole('tab', { name: 'Тип', exact: true }).click();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  await disclosure.click();
  await traitSelect(page).selectOption('logic');
  await verifyExample(page, 'ILE', 'logic');
  await disclosure.click();
  await page.reload();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  await expect(model(page).locator('button')).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('neutral-after-reload.png'), fullPage: true, animations: 'disabled' });
});

test('unknown trait and malformed view URLs normalize safely; trait changes reset view', async ({ page }) => {
  for (const arp of ['unknown', '']) {
    await page.goto(`/?mode=type&type=SEI&arp=${arp}&arpView=3`);
    await expect(page.locator('[data-type-arp-explorer] > button')).toHaveAttribute('aria-expanded', 'false');
    await expect(model(page).locator('button')).toHaveCount(0);
    await expect.poll(() => new URL(page.url()).searchParams.has('arp')).toBe(false);
  }
  for (const index of ['-1', '999', 'NaN', '1.5']) {
    await page.goto(`/?mode=type&type=SEI&arp=democracy&arpView=${index}`);
    await verifyExample(page, 'SEI', 'democracy', 0);
  }
  await page.locator('[data-type-arp-explanation] button').first().click();
  await expect(page.locator('[data-type-arp-explanation] button[aria-pressed="true"]')).toHaveCount(1);
  await invariant(page).getByRole('tab').nth(3).click();
  await verifyExample(page, 'SEI', 'democracy', 3);
  await expect(invariant(page).getByRole('tab').nth(3)).toBeFocused();
  await expect(model(page).locator('button[aria-pressed="true"]')).toHaveCount(0);
  await traitSelect(page).selectOption('logic');
  await verifyExample(page, 'SEI', 'logic', 0);
  await expect(invariant(page)).toHaveCount(0);
});

test('dark reference return and general navigation retain a nonzero equivalence', async ({ page }) => {
  await page.goto('/?mode=type&type=SEI&arp=positivism&arpView=1&theme=dark');
  await page.getByRole('link', { name: 'Справка', exact: true }).click();
  await page.reload();
  await page.getByRole('link', { name: 'К диаграммам', exact: true }).click();
  await verifyExample(page, 'SEI', 'positivism', 1);
  await page.getByRole('button', { name: 'Открыть общее представление АРП', exact: true }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get('trait')).toBe('positivism');
  await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('1');
  await expect.poll(() => new URL(page.url()).searchParams.get('theme')).toBe('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('tablist', { name: 'Режим просмотра' }).getByRole('tab', { name: 'Тип', exact: true }).click();
  await verifyExample(page, 'SEI', 'positivism', 1);
});

for (const theme of ['dark', 'light']) {
  test(`ARP group text has readable contrast in ${theme}`, async ({ page }) => {
    await page.goto(`/?mode=type&type=SEI&arp=process&theme=${theme}`);
    await expect(page.locator('[data-type-arp-explanation]')).toBeVisible();
    const contrasts = await page.locator('[data-type-arp-explanation] button, [data-type-model-function-id]:not([data-arp-group-index=""])').evaluateAll(elements => {
      const rgb = (value: string) => value.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      const luminance = (color: number[]) => color.map(value => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      return elements.map(element => {
        const text = element.querySelector('p') ?? element;
        const fg = luminance(rgb(getComputedStyle(text).color));
        const bg = luminance(rgb(getComputedStyle(element).backgroundColor));
        return { group: element.getAttribute('data-arp-group-index'), contrast: (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05) };
      });
    });
    expect(contrasts).toHaveLength(12);
    for (const sample of contrasts) expect(sample.contrast, `Group ${sample.group}`).toBeGreaterThanOrEqual(4.5);
  });
}
