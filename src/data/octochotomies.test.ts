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
const VERIFIED_FORMULA_IDS = [
  'octo-08-quasi-identity',
  'octo-11-extinguishment',
] as const;

const sortedSetKey = (typeIds: readonly string[]): string => (
  [...typeIds].sort().join('|')
);

describe('octochotomy source draft formulas', () => {
  it('keeps the expected status matrix stable', () => {
    const formulasByStatus = {
      draft: OCTOCHOTOMY_FORMULAS.filter(formula => formula.status === 'draft'),
      incomplete: OCTOCHOTOMY_FORMULAS.filter(formula => formula.status === 'incomplete'),
      verified: OCTOCHOTOMY_FORMULAS.filter(formula => formula.status === 'verified'),
    };

    expect(formulasByStatus.verified.map(formula => formula.id)).toEqual(VERIFIED_FORMULA_IDS);
    expect(formulasByStatus.incomplete.map(formula => formula.id)).toEqual([
      'octo-01-duality',
      'octo-02-activation',
      'octo-03-mirror',
      'octo-04-request',
      'octo-05-revision',
      'octo-06-zhukov',
      'octo-07-esenin',
      'octo-09-conflict',
      'octo-10-superego',
      'octo-12-reverse-request',
    ]);
    expect(formulasByStatus.draft.map(formula => formula.id)).toEqual([
      'octo-13-control-draft',
    ]);
  });

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

  it('marks only source records with confirmed basis traits and full classes as verified', () => {
    expect(getVerifiedOctochotomyFormulas().map(formula => formula.id)).toEqual(VERIFIED_FORMULA_IDS);

    getVerifiedOctochotomyFormulas().forEach(formula => {
      expect(formula.basisTraitIds).toHaveLength(3);
    });

    expect(getOctochotomyFormulaById('octo-08-quasi-identity')).toMatchObject({
      status: 'verified',
      basisTraitIds: ['positivism', 'yielding', 'logic'],
    });
    expect(getOctochotomyFormulaById('octo-11-extinguishment')).toMatchObject({
      status: 'verified',
      basisTraitIds: ['intuition', 'constructivism', 'tactical'],
    });

    expect(getOctochotomyFormulaById('octo-09-conflict')?.status).toBe('incomplete');
    expect(getOctochotomyFormulaById('octo-10-superego')?.status).toBe('incomplete');
    expect(getOctochotomyFormulaById('octo-12-reverse-request')?.status).toBe('incomplete');
    expect(getOctochotomyFormulaById('octo-13-control-draft')?.status).toBe('draft');
  });

  it('does not return incomplete or draft records from the verified selector', () => {
    const verifiedIds = new Set(getVerifiedOctochotomyFormulas().map(formula => formula.id));

    OCTOCHOTOMY_FORMULAS
      .filter(formula => formula.status !== 'verified')
      .forEach(formula => {
        expect(verifiedIds.has(formula.id)).toBe(false);
      });
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

  it('requires verified records to match computed octochotomy partition classes', () => {
    getVerifiedOctochotomyFormulas().forEach(formula => {
      const partition = buildPartition(formula.basisTraitIds);
      expect(partition.ok).toBe(true);
      expect(partition.ok ? partition.kind : null).toBe('octochotomy');
      expect(partition.ok ? partition.classes : []).toHaveLength(8);
      expect(formula.classes).toHaveLength(8);

      const sourceClassKeys = formula.classes.map(sourceClass => sortedSetKey(sourceClass.typeIds)).sort();
      const partitionClassKeys = partition.ok
        ? partition.classes.map(partitionClass => sortedSetKey(partitionClass.typeIds)).sort()
        : [];

      expect(sourceClassKeys).toEqual(partitionClassKeys);
    });
  });
});
