import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { selectPartitionExplorerView } from '../data/selectors';
import { TETRACHOTOMY_FORMULAS } from '../data/tetrachotomies';
import { TetrachotomyAspectFunctionPanel } from './TetrachotomyAspectFunctionPanel';
import { TetrachotomyFormulaPanel } from './TetrachotomyFormulaPanel';

describe('tetrachotomy source metadata visibility', () => {
  it('keeps source table numbers internal for every formula and tetrad', () => {
    const violations: string[] = [];
    for (const formula of TETRACHOTOMY_FORMULAS) {
      const initial = selectPartitionExplorerView(formula.basisTraitIds);
      if (!initial.partition.ok) throw new Error('Expected valid tetrachotomy');
      for (const group of initial.partition.classes) {
        const view = selectPartitionExplorerView(formula.basisTraitIds, group.key);
        expect(view.sourceFormula?.sourceTableNumber).toBe(formula.source.tableNumber);
        const diagram = renderToString(<TetrachotomyAspectFunctionPanel view={view} aspectDisplayMode="icon" baseView={null} />);
        const details = renderToString(<TetrachotomyFormulaPanel view={view} onSelectClass={() => {}} />);
        if (diagram.includes('tetra-panel-source') || />\s*Источник\s*</u.test(diagram)
          || new RegExp(`Таблица(?:<!-- -->|\\s)*${formula.source.tableNumber}\\b`, 'u').test(details)) {
          violations.push(`${formula.id}:${group.key}`);
        }
        expect(diagram).toContain('data-tetrachotomy-model-a-slot');
        expect(details).toContain(formula.source.formulaText.replace(/&/g, '&amp;'));
      }
    }
    expect(violations).toEqual([]);
  });
});
