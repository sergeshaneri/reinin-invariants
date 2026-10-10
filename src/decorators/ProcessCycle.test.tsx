import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CyclePointers } from './ProcessCycle';

describe('process cycle direction pointers', () => {
  for (const direction of ['cw', 'ccw'] as const) {
    it(`places one correctly oriented pointer at each side for ${direction}`, () => {
      const html = renderToStaticMarkup(<CyclePointers direction={direction} />);
      const arrows = html.match(/<svg\b[^>]*>/g) ?? [];
      expect(arrows).toHaveLength(4);
      const positions = [
        ['top', '50%', '0%', 0],
        ['right', '100%', '50%', 90],
        ['bottom', '50%', '100%', 180],
        ['left', '0%', '50%', 270],
      ] as const;
      positions.forEach(([side, left, top, angle], index) => {
        expect(arrows[index]).toContain(`data-cycle-pointer-side="${side}"`);
        expect(arrows[index]).toContain(`data-cycle-pointer-direction="${direction}"`);
        expect(arrows[index]).toContain(`left:${left};top:${top};`);
        expect(arrows[index]).toContain(`rotate(${angle + (direction === 'ccw' ? 180 : 0)}deg)`);
      });
    });
  }
});
