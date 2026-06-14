import type { ReininTraitId } from './socionics';
import type { SocionicTypeId } from './types';

export type PoleIndex = 0 | 1;

export interface TraitTypeMembershipPole {
  poleIndex: PoleIndex;
  typeIds: readonly SocionicTypeId[];
}

export interface TraitTypeMembership {
  traitId: ReininTraitId;
  poles: readonly [TraitTypeMembershipPole, TraitTypeMembershipPole];
}

export const TRAIT_TYPE_MEMBERSHIPS: readonly TraitTypeMembership[] = [
  {
    traitId: 'vertness',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'ESE', 'EIE', 'SLE', 'LIE', 'SEE', 'IEE', 'LSE'] },
      { poleIndex: 1, typeIds: ['SEI', 'LII', 'LSI', 'IEI', 'ESI', 'ILI', 'SLI', 'EII'] },
    ],
  },
  {
    traitId: 'nalness',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'SEI', 'SLE', 'IEI', 'SEE', 'ILI', 'IEE', 'SLI'] },
      { poleIndex: 1, typeIds: ['ESE', 'LII', 'EIE', 'LSI', 'LIE', 'ESI', 'LSE', 'EII'] },
    ],
  },
  {
    traitId: 'talness',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'LII', 'LSI', 'SLE', 'ESI', 'SEE', 'IEE', 'EII'] },
      { poleIndex: 1, typeIds: ['SEI', 'ESE', 'EIE', 'IEI', 'LIE', 'ILI', 'SLI', 'LSE'] },
    ],
  },
  {
    traitId: 'carefree',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'SEI', 'EIE', 'LSI', 'LIE', 'ESI', 'IEE', 'SLI'] },
      { poleIndex: 1, typeIds: ['ESE', 'LII', 'SLE', 'IEI', 'SEE', 'ILI', 'LSE', 'EII'] },
    ],
  },
  {
    traitId: 'yielding',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'SEI', 'SLE', 'IEI', 'LIE', 'ESI', 'LSE', 'EII'] },
      { poleIndex: 1, typeIds: ['ESE', 'LII', 'EIE', 'LSI', 'SEE', 'ILI', 'IEE', 'SLI'] },
    ],
  },
  {
    traitId: 'intuition',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'LII', 'EIE', 'IEI', 'LIE', 'ILI', 'IEE', 'EII'] },
      { poleIndex: 1, typeIds: ['SEI', 'ESE', 'LSI', 'SLE', 'ESI', 'SEE', 'SLI', 'LSE'] },
    ],
  },
  {
    traitId: 'logic',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'LII', 'LSI', 'SLE', 'LIE', 'ILI', 'SLI', 'LSE'] },
      { poleIndex: 1, typeIds: ['SEI', 'ESE', 'EIE', 'IEI', 'ESI', 'SEE', 'IEE', 'EII'] },
    ],
  },
  {
    traitId: 'subjectivism',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'SEI', 'ESE', 'LII', 'EIE', 'LSI', 'SLE', 'IEI'] },
      { poleIndex: 1, typeIds: ['LIE', 'ESI', 'SEE', 'ILI', 'IEE', 'SLI', 'LSE', 'EII'] },
    ],
  },
  {
    traitId: 'judicious',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'SEI', 'ESE', 'LII', 'IEE', 'SLI', 'LSE', 'EII'] },
      { poleIndex: 1, typeIds: ['EIE', 'LSI', 'SLE', 'IEI', 'LIE', 'ESI', 'SEE', 'ILI'] },
    ],
  },
  {
    traitId: 'constructivism',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'ESE', 'EIE', 'SLE', 'ESI', 'ILI', 'SLI', 'EII'] },
      { poleIndex: 1, typeIds: ['SEI', 'LII', 'LSI', 'IEI', 'LIE', 'SEE', 'IEE', 'LSE'] },
    ],
  },
  {
    traitId: 'tactical',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'ESE', 'LSI', 'IEI', 'ESI', 'ILI', 'IEE', 'LSE'] },
      { poleIndex: 1, typeIds: ['SEI', 'LII', 'EIE', 'SLE', 'LIE', 'SEE', 'SLI', 'EII'] },
    ],
  },
  {
    traitId: 'democracy',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'SEI', 'ESE', 'LII', 'LIE', 'ESI', 'SEE', 'ILI'] },
      { poleIndex: 1, typeIds: ['EIE', 'LSI', 'SLE', 'IEI', 'IEE', 'SLI', 'LSE', 'EII'] },
    ],
  },
  {
    traitId: 'positivism',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'ESE', 'LSI', 'IEI', 'LIE', 'SEE', 'SLI', 'EII'] },
      { poleIndex: 1, typeIds: ['SEI', 'LII', 'EIE', 'SLE', 'ESI', 'ILI', 'IEE', 'LSE'] },
    ],
  },
  {
    traitId: 'asking',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'LII', 'EIE', 'IEI', 'ESI', 'SEE', 'SLI', 'LSE'] },
      { poleIndex: 1, typeIds: ['SEI', 'ESE', 'LSI', 'SLE', 'LIE', 'ILI', 'IEE', 'EII'] },
    ],
  },
  {
    traitId: 'process',
    poles: [
      { poleIndex: 0, typeIds: ['ILE', 'SEI', 'EIE', 'LSI', 'SEE', 'ILI', 'LSE', 'EII'] },
      { poleIndex: 1, typeIds: ['ESE', 'LII', 'SLE', 'IEI', 'LIE', 'ESI', 'IEE', 'SLI'] },
    ],
  },
];

export const TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID = Object.fromEntries(
  TRAIT_TYPE_MEMBERSHIPS.map(membership => [membership.traitId, membership]),
) as Readonly<Record<ReininTraitId, TraitTypeMembership>>;
