import { describe, expect, it } from 'vitest';
import { buildPartition } from './partitions';
import { REININ_TRAITS } from './socionics';
import {
  OCTOCHOTOMY_FORMULAS,
  getOctochotomyFormulaById,
  getVerifiedOctochotomyFormulas,
  type OctochotomyFormulaRecord,
  type VerifiedOctochotomyClasses,
} from './octochotomies';
import { SOCIONIC_TYPE_ORDER } from './types';

const STATUS_VALUES = ['draft', 'incomplete', 'verified'] as const;

const sortedSetKey = (typeIds: readonly string[]): string => (
  [...typeIds].sort().join('|')
);

describe('octochotomy source draft formulas', () => {
  it('uses explicit draft/incomplete/verified status on every record', () => {
    OCTOCHOTOMY_FORMULAS.forEach(formula => {
      expect(STATUS_VALUES).toContain(formula.status);
    });

    expect(OCTOCHOTOMY_FORMULAS.some(formula => formula.status === 'draft')).toBe(true);
    expect(OCTOCHOTOMY_FORMULAS.some(formula => formula.status === 'incomplete')).toBe(true);
  });

  it('registers stable source-derived octochotomy records', () => {
    expect(OCTOCHOTOMY_FORMULAS.map(formula => formula.id)).toEqual([
      'octo-01-duality',
      'octo-02-activation',
      'octo-03-mirror',
      'octo-04-request',
      'octo-05-revision',
      'octo-06-zhukov',
      'octo-07-esenin',
      'octo-08-quasi-identity',
      'octo-09-conflict',
      'octo-10-superego',
      'octo-11-extinguishment',
      'octo-12-reverse-request',
      'octo-13-control-draft',
    ]);

    expect(getOctochotomyFormulaById('octo-01-duality')).toMatchObject({
      source: {
        document: 'harness/theory/Октохотомии.md',
        sectionNumber: 1,
        heading: 'дуальность',
      },
      status: 'incomplete',
    });
  });

  it('references only registered traits and types when IDs are present', () => {
    const traitIds = new Set(REININ_TRAITS.map(trait => trait.id));
    const typeIds = new Set(SOCIONIC_TYPE_ORDER);

    OCTOCHOTOMY_FORMULAS.forEach(formula => {
      formula.basisTraitIds?.forEach(traitId => {
        expect(traitIds.has(traitId)).toBe(true);
      });

      formula.classes?.forEach(sourceClass => {
        expect(sourceClass.typeIds).toHaveLength(2);
        sourceClass.typeIds.forEach(typeId => {
          expect(typeIds.has(typeId)).toBe(true);
        });
      });
    });
  });

  it('does not mark source records verified before full formula checks exist', () => {
    expect(getVerifiedOctochotomyFormulas()).toHaveLength(0);
    expect(OCTOCHOTOMY_FORMULAS.every(formula => formula.status !== 'verified')).toBe(true);
  });

  it('lets incomplete records omit some of the eight classes', () => {
    const draft = getOctochotomyFormulaById('octo-13-control-draft');

    expect(draft?.status).toBe('draft');
    expect(draft?.classes).toHaveLength(2);
  });

  it('keeps source pair classes unique within each record', () => {
    OCTOCHOTOMY_FORMULAS.forEach(formula => {
      const classes = formula.classes ?? [];
      const classKeys = classes.map(sourceClass => sortedSetKey(sourceClass.typeIds));

      expect(new Set(classKeys).size).toBe(classKeys.length);
    });
  });

  it('supports a verified schema shape with 8 classes x 2 types', () => {
    const verifiedClasses: VerifiedOctochotomyClasses = [
      { typeIds: ['ILE', 'SEI'] },
      { typeIds: ['ESE', 'LII'] },
      { typeIds: ['EIE', 'LSI'] },
      { typeIds: ['SLE', 'IEI'] },
      { typeIds: ['LIE', 'ESI'] },
      { typeIds: ['SEE', 'ILI'] },
      { typeIds: ['IEE', 'SLI'] },
      { typeIds: ['LSE', 'EII'] },
    ];
    const verifiedRecord: OctochotomyFormulaRecord = {
      id: 'schema-fixture',
      source: {
        document: 'harness/theory/Октохотомии.md',
        sectionNumber: 0,
        heading: 'schema fixture',
      },
      basisTraitIds: ['vertness', 'carefree', 'intuition'],
      status: 'verified',
      classes: verifiedClasses,
    };

    expect(verifiedRecord.classes).toHaveLength(8);
    verifiedRecord.classes.forEach(sourceClass => {
      expect(sourceClass.typeIds).toHaveLength(2);
    });
  });

  it('keeps verified matching logic separate until source basis traits are confirmed', () => {
    getVerifiedOctochotomyFormulas().forEach(formula => {
      const partition = buildPartition(formula.basisTraitIds);
      expect(partition.ok).toBe(true);
      expect(partition.ok ? partition.kind : null).toBe('octochotomy');
      expect(partition.ok ? partition.classes : []).toHaveLength(8);
    });
  });
});
