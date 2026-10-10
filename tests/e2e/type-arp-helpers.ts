import { expect, type Page } from '@playwright/test';
import type { TypeArpExampleViewModel } from '../../src/data/typeArp';
import type { ReininTraitId, SocionicTypeId } from '../../src/data/socionics';

export const analysis = (page: Page) => page.locator('#type-arp-analysis');
export const model = (page: Page) => page.locator('section[aria-labelledby="type-model-title"]');
export const traitSelect = (page: Page) => page.locator('[data-type-arp-trait-select]');
export const invariant = (page: Page) => analysis(page).getByRole('tablist', { name: 'Выбор инварианта' });

import 'tsx/cjs';
import { createRequire } from 'node:module';
const { selectTypeArpExample } = createRequire(import.meta.url)('../../src/data/typeArp.ts') as typeof import('../../src/data/typeArp');

// Use the installed TS/CJS loader for the selector's transitive JSON import.
// Unlike fetching /src modules from Vite, this also supports the preview runner.
export async function exampleFor(_page: Page, typeId: SocionicTypeId, traitId: ReininTraitId, viewIndex = 0): Promise<TypeArpExampleViewModel> {
  return selectTypeArpExample(typeId, traitId, viewIndex);
}

export async function verifyExample(page: Page, typeId: SocionicTypeId, traitId: ReininTraitId, viewIndex = 0) {
  const example = await exampleFor(page, typeId, traitId, viewIndex);
  await expect(traitSelect(page)).toHaveValue(traitId);
  await expect(analysis(page)).toHaveAttribute('data-type-arp-pole-index', String(example.pole.poleIndex));
  await expect(page.locator('#type-model-title')).toHaveCount(1);
  await expect(model(page).locator('[data-type-model-function-id]')).toHaveCount(8);
  await expect(page.locator('[data-type-arp-explanation]')).toContainText(`Как это устроено у ${example.type.aliases.find(alias => /[А-ЯЁа-яё]/.test(alias))}`);
  await expect(page.locator('[data-arp-structural-status]')).toHaveAttribute('data-arp-structural-status', 'passed');
  const gallery = page.locator('[data-model-preview-type-id]');
  expect(await gallery.evaluateAll(cards => cards.map(card => card.getAttribute('data-model-preview-type-id')))).toEqual(example.typesPanel.types.map(type => type.id));
  await expect(page.locator('[data-model-preview-grid] button[aria-pressed="true"]')).toHaveCount(1);
  const selected = page.locator(`[data-model-preview-type-id="${typeId}"]`);
  await expect(selected).toHaveAttribute('data-model-preview-selected', 'true');
  for (const assignment of example.assignments) {
    const cell = model(page).locator(`[data-type-model-function-id="${assignment.functionId}"]`);
    await expect(cell).toHaveAttribute('data-type-model-aspect-id', assignment.aspectId);
    await expect(cell).toHaveAttribute('data-arp-group-index', String(assignment.highlightGroupIndex ?? ''));
    const mini = selected.locator(`[data-model-preview-function-id="${assignment.functionId}"]`);
    await expect(mini).toHaveAttribute('data-model-preview-aspect-id', assignment.aspectId);
    await expect(mini).toHaveAttribute('data-model-preview-highlight-group', String(assignment.highlightGroupIndex ?? ''));
    if (assignment.highlightGroupIndex !== null) {
      expect(await cell.evaluate(el => getComputedStyle(el).backgroundColor)).toBe(await mini.evaluate(el => getComputedStyle(el).backgroundColor));
    }
  }
  for (const group of example.groups) {
    await expect(page.locator(`[data-type-arp-explanation] button[data-arp-group-index="${group.groupIndex}"]`)).toContainText(group.explanation);
  }
  await expect.poll(() => new URL(page.url()).searchParams.get('type')).toBe(typeId);
  await expect.poll(() => new URL(page.url()).searchParams.get('arp')).toBe(traitId);
  await expect.poll(() => Number(new URL(page.url()).searchParams.get('arpView') ?? '0')).toBe(example.viewIndex);
  return example;
}

export async function selectType(page: Page, typeId: SocionicTypeId, isMobile: boolean) {
  if (isMobile) await page.locator('[data-compact-selection="type"]').selectOption(typeId);
  else await page.locator(`[data-type-choice="${typeId}"]`).click();
}
