import type { ReininTraitId } from './socionics';
import type { SocionicTypeId } from './types';

export type OctochotomySourceStatus = 'draft' | 'incomplete' | 'verified';

export interface OctochotomyFormulaSource {
  document: 'harness/theory/Октохотомии.md';
  sectionNumber: number;
  heading: string;
}

export interface OctochotomyFormulaClass {
  typeIds: readonly [SocionicTypeId, SocionicTypeId];
  sourceLine?: number;
}

export type VerifiedOctochotomyClasses = readonly [
  OctochotomyFormulaClass,
  OctochotomyFormulaClass,
  OctochotomyFormulaClass,
  OctochotomyFormulaClass,
  OctochotomyFormulaClass,
  OctochotomyFormulaClass,
  OctochotomyFormulaClass,
  OctochotomyFormulaClass,
];

export interface BaseOctochotomyFormulaRecord {
  id: string;
  source: OctochotomyFormulaSource;
  basisTraitIds?: readonly [ReininTraitId, ReininTraitId, ReininTraitId];
  note?: string;
}

export interface DraftOctochotomyFormulaRecord extends BaseOctochotomyFormulaRecord {
  status: 'draft';
  classes?: readonly OctochotomyFormulaClass[];
}

export interface IncompleteOctochotomyFormulaRecord extends BaseOctochotomyFormulaRecord {
  status: 'incomplete';
  classes: readonly OctochotomyFormulaClass[];
}

export interface VerifiedOctochotomyFormulaRecord extends BaseOctochotomyFormulaRecord {
  status: 'verified';
  basisTraitIds: readonly [ReininTraitId, ReininTraitId, ReininTraitId];
  classes: VerifiedOctochotomyClasses;
}

export type OctochotomyFormulaRecord =
  | DraftOctochotomyFormulaRecord
  | IncompleteOctochotomyFormulaRecord
  | VerifiedOctochotomyFormulaRecord;

const SOURCE_DOCUMENT = 'harness/theory/Октохотомии.md' as const;

const source = (
  sectionNumber: number,
  heading: string,
): OctochotomyFormulaSource => ({
  document: SOURCE_DOCUMENT,
  sectionNumber,
  heading,
});

const pair = (
  firstTypeId: SocionicTypeId,
  secondTypeId: SocionicTypeId,
  sourceLine?: number,
): OctochotomyFormulaClass => ({
  typeIds: [firstTypeId, secondTypeId],
  sourceLine,
});

export const OCTOCHOTOMY_FORMULAS: readonly OctochotomyFormulaRecord[] = [
  {
    id: 'octo-01-duality',
    source: source(1, 'дуальность'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'SEI', 28),
      pair('ESE', 'LII', 43),
      pair('EIE', 'LSI', 58),
      pair('SLE', 'IEI', 73),
      pair('LIE', 'ESI', 88),
      pair('SEE', 'ILI', 103),
      pair('IEE', 'SLI', 118),
      pair('LSE', 'EII', 133),
    ],
    note: 'Source lists eight type pairs, but no three-trait basis is verified yet.',
  },
  {
    id: 'octo-02-activation',
    source: source(2, 'активация'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'ESE', 156),
      pair('SEI', 'LII', 172),
      pair('EIE', 'SLE', 188),
      pair('LSI', 'IEI', 205),
      pair('LIE', 'SEE', 223),
      pair('ESI', 'ILI', 241),
      pair('IEE', 'LSE', 258),
      pair('SLI', 'EII', 276),
    ],
    note: 'Source contains duplicate later pair headings; this record keeps the first visible set.',
  },
  {
    id: 'octo-03-mirror',
    source: source(3, 'зеркало'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'LII', 381),
      pair('SEI', 'ESE', 399),
      pair('EIE', 'IEI', 419),
      pair('LSI', 'SLE', 439),
      pair('LIE', 'ILI', 459),
      pair('ESI', 'SEE', 479),
      pair('IEE', 'EII', 499),
      pair('SLI', 'LSE', 519),
    ],
  },
  {
    id: 'octo-04-request',
    source: source(4, 'иррац Заказчик рац Подзаказный'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'EIE', 559),
      pair('SEI', 'LSI', 578),
      pair('ESE', 'SLE', 599),
      pair('LII', 'IEI', 620),
      pair('LIE', 'IEE', 641),
      pair('ESI', 'SLI', 662),
      pair('SEE', 'LSE', 683),
      pair('ILI', 'EII', 704),
    ],
  },
  {
    id: 'octo-05-revision',
    source: source(5, 'иррац Ревизор рац Подревизный'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'LSI', 734),
      pair('SEI', 'EIE', 759),
      pair('ESE', 'IEI', 782),
      pair('LII', 'SLE', 805),
      pair('LIE', 'SLI', 828),
      pair('ESI', 'IEE', 851),
      pair('SEE', 'EII', 874),
      pair('ILI', 'LSE', 897),
    ],
  },
  {
    id: 'octo-06-zhukov',
    source: source(6, 'жуков'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'SLE', 928),
      pair('SEI', 'IEI', 938),
      pair('ESE', 'EIE', 950),
      pair('LII', 'LSI', 962),
      pair('LIE', 'LSE', 974),
      pair('ESI', 'EII', 986),
      pair('SEE', 'IEE', 998),
      pair('ILI', 'SLI', 1010),
    ],
  },
  {
    id: 'octo-07-esenin',
    source: source(7, 'есенин'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'IEI', 1033),
      pair('SEI', 'SLE', 1051),
      pair('ESE', 'LSI', 1069),
      pair('LII', 'EIE', 1087),
      pair('LIE', 'EII', 1105),
      pair('ESI', 'LSE', 1123),
      pair('SEE', 'SLI', 1141),
      pair('ILI', 'IEE', 1159),
    ],
  },
  {
    id: 'octo-08-quasi-identity',
    source: source(8, 'квазитождество'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'LIE', 1195),
      pair('SEI', 'ESI', 1214),
      pair('ESE', 'SEE', 1233),
      pair('LII', 'ILI', 1252),
      pair('EIE', 'IEE', 1271),
      pair('LSI', 'SLI', 1290),
      pair('SLE', 'LSE', 1309),
      pair('IEI', 'EII', 1328),
    ],
  },
  {
    id: 'octo-09-conflict',
    source: source(9, 'конфликт'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'ESI', 1352),
      pair('SEI', 'LIE', 1371),
      pair('ESE', 'ILI', 1390),
      pair('LII', 'SEE', 1409),
      pair('EIE', 'SLI', 1428),
      pair('LSI', 'IEE', 1445),
      pair('SLE', 'EII', 1465),
      pair('IEI', 'LSE', 1484),
    ],
  },
  {
    id: 'octo-10-superego',
    source: source(10, 'суперэго'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'SEE', 1519),
      pair('SEI', 'ILI', 1545),
      pair('ESE', 'LIE', 1571),
      pair('LII', 'ESI', 1597),
      pair('EIE', 'LSE', 1623),
      pair('LSI', 'EII', 1649),
      pair('SLE', 'IEE', 1675),
      pair('IEI', 'SLI', 1701),
    ],
  },
  {
    id: 'octo-11-extinguishment',
    source: source(11, 'погашение'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'ILI', 1741),
      pair('SEI', 'SEE', 1770),
      pair('ESE', 'ESI', 1789),
      pair('LII', 'LIE', 1808),
      pair('EIE', 'EII', 1827),
      pair('LSI', 'LSE', 1846),
      pair('SLE', 'SLI', 1865),
      pair('IEI', 'IEE', 1884),
    ],
  },
  {
    id: 'octo-12-reverse-request',
    source: source(12, 'ир подзаказ ра заказ'),
    status: 'incomplete',
    classes: [
      pair('ILE', 'LSE', 1928),
      pair('SEI', 'EII', 1949),
      pair('ESE', 'IEE', 1970),
      pair('LII', 'SLI', 1991),
      pair('EIE', 'SEE', 2012),
      pair('LSI', 'ILI', 2033),
      pair('SLE', 'LIE', 2054),
      pair('IEI', 'ESI', 2075),
    ],
  },
  {
    id: 'octo-13-control-draft',
    source: source(13, 'ир подконтроль ра контроль'),
    status: 'draft',
    classes: [
      pair('ILE', 'EII', 2096),
      pair('SEI', 'LSE', 2119),
    ],
    note: 'Only first visible source pairs are registered in this draft record.',
  },
];

export function getOctochotomyFormulaById(
  formulaId: string,
): OctochotomyFormulaRecord | undefined {
  return OCTOCHOTOMY_FORMULAS.find(formula => formula.id === formulaId);
}

export function getVerifiedOctochotomyFormulas(): readonly VerifiedOctochotomyFormulaRecord[] {
  return OCTOCHOTOMY_FORMULAS.filter(
    (formula): formula is VerifiedOctochotomyFormulaRecord => formula.status === 'verified',
  );
}
