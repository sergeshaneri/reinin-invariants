import type { AspectId } from './socionics';

export const SOCIONIC_TYPE_ORDER = [
  'ILE',
  'SEI',
  'ESE',
  'LII',
  'EIE',
  'LSI',
  'SLE',
  'IEI',
  'LIE',
  'ESI',
  'SEE',
  'ILI',
  'IEE',
  'SLI',
  'LSE',
  'EII',
] as const;

export type SocionicTypeId = typeof SOCIONIC_TYPE_ORDER[number];

export type QuadraId = 'alpha' | 'beta' | 'gamma' | 'delta';

export interface LocalizedText {
  ru: string;
  en?: string;
}

export interface SocionicTypeAliases {
  socionics?: readonly string[];
  mbtiLike?: readonly string[];
}

export type ModelAFunctionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ModelAAssignment {
  functionId: ModelAFunctionId;
  aspectId: AspectId;
}

export interface SocionicType {
  id: SocionicTypeId;
  quadraId: QuadraId;
  names: LocalizedText;
  aliases: SocionicTypeAliases;
  modelA: readonly ModelAAssignment[];
}

export const SOCIONIC_TYPES: readonly SocionicType[] = [
  {
    id: 'ILE',
    quadraId: 'alpha',
    names: { ru: 'Интуитивно-логический экстраверт', en: 'Intuitive Logical Extravert' },
    aliases: { socionics: ['ИЛЭ', 'Дон Кихот'], mbtiLike: ['ENTp'] },
    modelA: [
      { functionId: 1, aspectId: 'Ne' },
      { functionId: 2, aspectId: 'Ti' },
      { functionId: 3, aspectId: 'Se' },
      { functionId: 4, aspectId: 'Fi' },
      { functionId: 5, aspectId: 'Si' },
      { functionId: 6, aspectId: 'Fe' },
      { functionId: 7, aspectId: 'Ni' },
      { functionId: 8, aspectId: 'Te' },
    ],
  },
  {
    id: 'SEI',
    quadraId: 'alpha',
    names: { ru: 'Сенсорно-этический интроверт', en: 'Sensory Ethical Introvert' },
    aliases: { socionics: ['СЭИ', 'Дюма'], mbtiLike: ['ISFp'] },
    modelA: [
      { functionId: 1, aspectId: 'Si' },
      { functionId: 2, aspectId: 'Fe' },
      { functionId: 3, aspectId: 'Ni' },
      { functionId: 4, aspectId: 'Te' },
      { functionId: 5, aspectId: 'Ne' },
      { functionId: 6, aspectId: 'Ti' },
      { functionId: 7, aspectId: 'Se' },
      { functionId: 8, aspectId: 'Fi' },
    ],
  },
  {
    id: 'ESE',
    quadraId: 'alpha',
    names: { ru: 'Этико-сенсорный экстраверт', en: 'Ethical Sensory Extravert' },
    aliases: { socionics: ['ЭСЭ', 'Гюго'], mbtiLike: ['ESFj'] },
    modelA: [
      { functionId: 1, aspectId: 'Fe' },
      { functionId: 2, aspectId: 'Si' },
      { functionId: 3, aspectId: 'Te' },
      { functionId: 4, aspectId: 'Ni' },
      { functionId: 5, aspectId: 'Ti' },
      { functionId: 6, aspectId: 'Ne' },
      { functionId: 7, aspectId: 'Fi' },
      { functionId: 8, aspectId: 'Se' },
    ],
  },
  {
    id: 'LII',
    quadraId: 'alpha',
    names: { ru: 'Логико-интуитивный интроверт', en: 'Logical Intuitive Introvert' },
    aliases: { socionics: ['ЛИИ', 'Робеспьер'], mbtiLike: ['INTj'] },
    modelA: [
      { functionId: 1, aspectId: 'Ti' },
      { functionId: 2, aspectId: 'Ne' },
      { functionId: 3, aspectId: 'Fi' },
      { functionId: 4, aspectId: 'Se' },
      { functionId: 5, aspectId: 'Fe' },
      { functionId: 6, aspectId: 'Si' },
      { functionId: 7, aspectId: 'Te' },
      { functionId: 8, aspectId: 'Ni' },
    ],
  },
  {
    id: 'EIE',
    quadraId: 'beta',
    names: { ru: 'Этико-интуитивный экстраверт', en: 'Ethical Intuitive Extravert' },
    aliases: { socionics: ['ЭИЭ', 'Гамлет'], mbtiLike: ['ENFj'] },
    modelA: [
      { functionId: 1, aspectId: 'Fe' },
      { functionId: 2, aspectId: 'Ni' },
      { functionId: 3, aspectId: 'Te' },
      { functionId: 4, aspectId: 'Si' },
      { functionId: 5, aspectId: 'Ti' },
      { functionId: 6, aspectId: 'Se' },
      { functionId: 7, aspectId: 'Fi' },
      { functionId: 8, aspectId: 'Ne' },
    ],
  },
  {
    id: 'LSI',
    quadraId: 'beta',
    names: { ru: 'Логико-сенсорный интроверт', en: 'Logical Sensory Introvert' },
    aliases: { socionics: ['ЛСИ', 'Максим Горький'], mbtiLike: ['ISTj'] },
    modelA: [
      { functionId: 1, aspectId: 'Ti' },
      { functionId: 2, aspectId: 'Se' },
      { functionId: 3, aspectId: 'Fi' },
      { functionId: 4, aspectId: 'Ne' },
      { functionId: 5, aspectId: 'Fe' },
      { functionId: 6, aspectId: 'Ni' },
      { functionId: 7, aspectId: 'Te' },
      { functionId: 8, aspectId: 'Si' },
    ],
  },
  {
    id: 'SLE',
    quadraId: 'beta',
    names: { ru: 'Сенсорно-логический экстраверт', en: 'Sensory Logical Extravert' },
    aliases: { socionics: ['СЛЭ', 'Жуков'], mbtiLike: ['ESTp'] },
    modelA: [
      { functionId: 1, aspectId: 'Se' },
      { functionId: 2, aspectId: 'Ti' },
      { functionId: 3, aspectId: 'Ne' },
      { functionId: 4, aspectId: 'Fi' },
      { functionId: 5, aspectId: 'Ni' },
      { functionId: 6, aspectId: 'Fe' },
      { functionId: 7, aspectId: 'Si' },
      { functionId: 8, aspectId: 'Te' },
    ],
  },
  {
    id: 'IEI',
    quadraId: 'beta',
    names: { ru: 'Интуитивно-этический интроверт', en: 'Intuitive Ethical Introvert' },
    aliases: { socionics: ['ИЭИ', 'Есенин'], mbtiLike: ['INFp'] },
    modelA: [
      { functionId: 1, aspectId: 'Ni' },
      { functionId: 2, aspectId: 'Fe' },
      { functionId: 3, aspectId: 'Si' },
      { functionId: 4, aspectId: 'Te' },
      { functionId: 5, aspectId: 'Se' },
      { functionId: 6, aspectId: 'Ti' },
      { functionId: 7, aspectId: 'Ne' },
      { functionId: 8, aspectId: 'Fi' },
    ],
  },
  {
    id: 'LIE',
    quadraId: 'gamma',
    names: { ru: 'Логико-интуитивный экстраверт', en: 'Logical Intuitive Extravert' },
    aliases: { socionics: ['ЛИЭ', 'Джек Лондон'], mbtiLike: ['ENTj'] },
    modelA: [
      { functionId: 1, aspectId: 'Te' },
      { functionId: 2, aspectId: 'Ni' },
      { functionId: 3, aspectId: 'Fe' },
      { functionId: 4, aspectId: 'Si' },
      { functionId: 5, aspectId: 'Fi' },
      { functionId: 6, aspectId: 'Se' },
      { functionId: 7, aspectId: 'Ti' },
      { functionId: 8, aspectId: 'Ne' },
    ],
  },
  {
    id: 'ESI',
    quadraId: 'gamma',
    names: { ru: 'Этико-сенсорный интроверт', en: 'Ethical Sensory Introvert' },
    aliases: { socionics: ['ЭСИ', 'Драйзер'], mbtiLike: ['ISFj'] },
    modelA: [
      { functionId: 1, aspectId: 'Fi' },
      { functionId: 2, aspectId: 'Se' },
      { functionId: 3, aspectId: 'Ti' },
      { functionId: 4, aspectId: 'Ne' },
      { functionId: 5, aspectId: 'Te' },
      { functionId: 6, aspectId: 'Ni' },
      { functionId: 7, aspectId: 'Fe' },
      { functionId: 8, aspectId: 'Si' },
    ],
  },
  {
    id: 'SEE',
    quadraId: 'gamma',
    names: { ru: 'Сенсорно-этический экстраверт', en: 'Sensory Ethical Extravert' },
    aliases: { socionics: ['СЭЭ', 'Наполеон'], mbtiLike: ['ESFp'] },
    modelA: [
      { functionId: 1, aspectId: 'Se' },
      { functionId: 2, aspectId: 'Fi' },
      { functionId: 3, aspectId: 'Ne' },
      { functionId: 4, aspectId: 'Ti' },
      { functionId: 5, aspectId: 'Ni' },
      { functionId: 6, aspectId: 'Te' },
      { functionId: 7, aspectId: 'Si' },
      { functionId: 8, aspectId: 'Fe' },
    ],
  },
  {
    id: 'ILI',
    quadraId: 'gamma',
    names: { ru: 'Интуитивно-логический интроверт', en: 'Intuitive Logical Introvert' },
    aliases: { socionics: ['ИЛИ', 'Бальзак'], mbtiLike: ['INTp'] },
    modelA: [
      { functionId: 1, aspectId: 'Ni' },
      { functionId: 2, aspectId: 'Te' },
      { functionId: 3, aspectId: 'Si' },
      { functionId: 4, aspectId: 'Fe' },
      { functionId: 5, aspectId: 'Se' },
      { functionId: 6, aspectId: 'Fi' },
      { functionId: 7, aspectId: 'Ne' },
      { functionId: 8, aspectId: 'Ti' },
    ],
  },
  {
    id: 'IEE',
    quadraId: 'delta',
    names: { ru: 'Интуитивно-этический экстраверт', en: 'Intuitive Ethical Extravert' },
    aliases: { socionics: ['ИЭЭ', 'Гексли'], mbtiLike: ['ENFp'] },
    modelA: [
      { functionId: 1, aspectId: 'Ne' },
      { functionId: 2, aspectId: 'Fi' },
      { functionId: 3, aspectId: 'Se' },
      { functionId: 4, aspectId: 'Ti' },
      { functionId: 5, aspectId: 'Si' },
      { functionId: 6, aspectId: 'Te' },
      { functionId: 7, aspectId: 'Ni' },
      { functionId: 8, aspectId: 'Fe' },
    ],
  },
  {
    id: 'SLI',
    quadraId: 'delta',
    names: { ru: 'Сенсорно-логический интроверт', en: 'Sensory Logical Introvert' },
    aliases: { socionics: ['СЛИ', 'Габен'], mbtiLike: ['ISTp'] },
    modelA: [
      { functionId: 1, aspectId: 'Si' },
      { functionId: 2, aspectId: 'Te' },
      { functionId: 3, aspectId: 'Ni' },
      { functionId: 4, aspectId: 'Fe' },
      { functionId: 5, aspectId: 'Ne' },
      { functionId: 6, aspectId: 'Fi' },
      { functionId: 7, aspectId: 'Se' },
      { functionId: 8, aspectId: 'Ti' },
    ],
  },
  {
    id: 'LSE',
    quadraId: 'delta',
    names: { ru: 'Логико-сенсорный экстраверт', en: 'Logical Sensory Extravert' },
    aliases: { socionics: ['ЛСЭ', 'Штирлиц'], mbtiLike: ['ESTj'] },
    modelA: [
      { functionId: 1, aspectId: 'Te' },
      { functionId: 2, aspectId: 'Si' },
      { functionId: 3, aspectId: 'Fe' },
      { functionId: 4, aspectId: 'Ni' },
      { functionId: 5, aspectId: 'Fi' },
      { functionId: 6, aspectId: 'Ne' },
      { functionId: 7, aspectId: 'Ti' },
      { functionId: 8, aspectId: 'Se' },
    ],
  },
  {
    id: 'EII',
    quadraId: 'delta',
    names: { ru: 'Этико-интуитивный интроверт', en: 'Ethical Intuitive Introvert' },
    aliases: { socionics: ['ЭИИ', 'Достоевский'], mbtiLike: ['INFj'] },
    modelA: [
      { functionId: 1, aspectId: 'Fi' },
      { functionId: 2, aspectId: 'Ne' },
      { functionId: 3, aspectId: 'Ti' },
      { functionId: 4, aspectId: 'Se' },
      { functionId: 5, aspectId: 'Te' },
      { functionId: 6, aspectId: 'Si' },
      { functionId: 7, aspectId: 'Fe' },
      { functionId: 8, aspectId: 'Ni' },
    ],
  },
];

export const SOCIONIC_TYPES_BY_ID = Object.fromEntries(
  SOCIONIC_TYPES.map(type => [type.id, type]),
) as Readonly<Record<SocionicTypeId, SocionicType>>;
