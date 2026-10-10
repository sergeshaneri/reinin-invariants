import { expect, test } from '@playwright/test';
import { analysis, model, verifyExample } from './type-arp-helpers';

for (const theme of ['dark', 'light'] as const) {
  for (const glyph of ['icon', 'symbol', 'icon-symbol'] as const) {
    test(`fixed/block/process/result geometry ${theme} ${glyph} reduced-motion`, async ({ page }, testInfo) => {
      test.setTimeout(90_000);
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      for (const [typeId, traitId] of [['ILE', 'logic'], ['SEI', 'democracy'], ['SEI', 'process'], ['LII', 'process']] as const) {
        await page.goto(`/?mode=type&type=${typeId}&arp=${traitId}&theme=${theme}`);
        await page.locator('summary').filter({ hasText: 'Оформление и обозначения' }).click();
        await page.getByRole('tablist', { name: 'Отображение аспектов' }).getByRole('tab', { name: { icon: 'Пикто', symbol: 'Аббр.', 'icon-symbol': 'Оба' }[glyph], exact: true }).click();
        await page.locator('summary').filter({ hasText: 'Оформление и обозначения' }).click();
        const example = await verifyExample(page, typeId, traitId);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(model(page).locator(`[data-aspect-glyph-mode="${glyph}"]`)).toHaveCount(8);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(await analysis(page).locator('button, select, [data-type-model-function-id], [data-model-preview-type-id]').evaluateAll(elements => elements.every(element => {
          const r = element.getBoundingClientRect();
          // Miniature cycle arrows deliberately extend beyond their article;
          // their enclosing panel and viewport must still contain them.
          return r.left >= -1 && r.right <= innerWidth + 1
            && (element.hasAttribute('data-model-preview-type-id') || element.scrollWidth <= element.clientWidth + 1);
        }))).toBe(true);
        if (traitId === 'democracy') {
          expect(example.groups[0].actualFunctionIds).toEqual([5, 6]);
          expect(example.groups[0].matchedFunctionBlock!.blockIndex).toBe(2);
          await expect(page.locator('[data-type-arp-explanation]')).toContainText('Сохранение блоков: подтверждено');
          if (glyph === 'icon') await page.screenshot({ path: testInfo.outputPath(`permutation-${theme}.png`), fullPage: true, animations: 'disabled' });
        }
        if (traitId === 'process') {
          await expect(page.locator('[data-type-arp-explanation]')).toContainText('1-й такт: функции {3, 5}');
          await expect(page.locator('[data-type-arp-explanation]')).toContainText('Циклический порядок: подтверждено');
          const rings = model(page).locator('[data-type-model-cycle-ring]');
          await expect(rings).toHaveCount(2);
          for (const ring of await rings.all()) await expect(ring.locator('[data-cycle-pointer-side]')).toHaveCount(4);
          const geometry = await model(page).evaluate(section => {
            const box = section.getBoundingClientRect();
            const contained = (r: DOMRect) => r.left >= box.left && r.right <= box.right && r.top >= box.top && r.bottom <= box.bottom;
            const rings = [...section.querySelectorAll('[data-type-model-cycle-ring]')].map(ring => {
              const outline = ring.querySelector('rect')!.getBoundingClientRect();
              const arrows = [...ring.querySelectorAll('[data-cycle-pointer-side]')].map(arrow => {
                const r = arrow.getBoundingClientRect();
                const side = arrow.getAttribute('data-cycle-pointer-side');
                const x = r.left + r.width / 2, y = r.top + r.height / 2;
                const ex = side === 'left' ? outline.left : side === 'right' ? outline.right : (outline.left + outline.right) / 2;
                const ey = side === 'top' ? outline.top : side === 'bottom' ? outline.bottom : (outline.top + outline.bottom) / 2;
                return { side, contained: contained(r), centerError: Math.hypot(x - ex, y - ey), transform: getComputedStyle(arrow).transform };
              });
              return { direction: ring.getAttribute('data-type-model-cycle-ring'), top: outline.top, bottom: outline.bottom, contained: contained(outline), arrows };
            });
            return { rings, animations: [...section.querySelectorAll('*')].filter(el => getComputedStyle(el).animationName !== 'none').map(el => getComputedStyle(el).animationPlayState) };
          });
          expect(geometry.rings[0].bottom).toBeLessThan(geometry.rings[1].top);
          expect(geometry.rings.map(ring => ring.direction)).toEqual(['cw', 'ccw']);
          for (const ring of geometry.rings) {
            expect(ring.contained).toBe(true);
            for (const arrow of ring.arrows) {
              expect(arrow.contained).toBe(true);
              expect(arrow.centerError).toBeLessThan(1);
              expect(arrow.transform).not.toBe('none');
            }
          }
          expect(geometry.animations.every(state => state === 'paused')).toBe(true);
          if (typeId === 'LII') {
            await testInfo.attach('ring-geometry', { body: JSON.stringify(geometry, null, 2), contentType: 'application/json' });
            await page.mouse.move(0, 0);
            await model(page).screenshot({ path: testInfo.outputPath(`result-model-${theme}-${glyph}.png`), animations: 'disabled' });
          }
        }
      }
      expect(errors).toEqual([]);
    });
  }
}
