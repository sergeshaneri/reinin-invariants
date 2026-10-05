import type { ReininTraitId } from './socionics';

export interface OrderDependentTetrachotomy {
  formulaId: string;
  orderTraitId: Extract<ReininTraitId, 'process' | 'positivism' | 'asking'>;
  notation: string;
  featureProducts: readonly [string, string];
  name?: string;
}

// Author-defined structural family. An equation may put the order trait on either side.
// Registration identifies the class; it does not certify literal DOCX transfer.
export const ORDER_DEPENDENT_TETRACHOTOMIES: readonly OrderDependentTetrachotomy[] = [
  { formulaId: 'tetra-10', orderTraitId: 'process', notation: 'Пц/Рз · Сб/Об · Бс/Пр', featureProducts: ['ин/кт × сл/сб', 'вб/лб × оц/ст'] },
  { formulaId: 'tetra-17', orderTraitId: 'process', notation: 'Пц/Рз · Ит/Сн · Кн/Эм', featureProducts: ['ин/кт × сл/сб', 'вб/лб × оц/ст'], name: 'Стили принятия решений' },
  { formulaId: 'tetra-30', orderTraitId: 'process', notation: 'Пц/Рз · Ус/Уп · Рс/Рш', featureProducts: ['ин/кт × сл/сб', 'вб/лб × оц/ст'], name: 'Реализации' },
  { formulaId: 'tetra-34', orderTraitId: 'process', notation: 'Пц/Рз · Тк/Ст · Лг/Эт', featureProducts: ['ин/кт × сл/сб', 'вб/лб × оц/ст'], name: 'Группы внедрения' },
  { formulaId: 'tetra-09', orderTraitId: 'positivism', notation: '+/− · Бс/Пр · Лг/Эт', featureProducts: ['оц/ст × сл/сб', 'вб/лб × ин/кт'], name: 'Социализации' },
  { formulaId: 'tetra-15', orderTraitId: 'positivism', notation: '+/− · Ит/Сн · Ус/Уп', featureProducts: ['оц/ст × сл/сб', 'вб/лб × ин/кт'] },
  { formulaId: 'tetra-24', orderTraitId: 'positivism', notation: '+/− · Сб/Об · Тк/Ст', featureProducts: ['оц/ст × сл/сб', 'вб/лб × ин/кт'] },
  { formulaId: 'tetra-25', orderTraitId: 'positivism', notation: '+/− · Кн/Эм · Рс/Рш', featureProducts: ['оц/ст × сл/сб', 'вб/лб × ин/кт'] },
  { formulaId: 'tetra-11', orderTraitId: 'asking', notation: '?/! · Бс/Пр · Кн/Эм', featureProducts: ['оц/ст × ин/кт', 'вб/лб × сл/сб'] },
  { formulaId: 'tetra-16', orderTraitId: 'asking', notation: '?/! · Ит/Сн · Сб/Об', featureProducts: ['оц/ст × ин/кт', 'вб/лб × сл/сб'] },
  { formulaId: 'tetra-31', orderTraitId: 'asking', notation: '?/! · Ус/Уп · Тк/Ст', featureProducts: ['оц/ст × ин/кт', 'вб/лб × сл/сб'] },
  { formulaId: 'tetra-35', orderTraitId: 'asking', notation: '?/! · Лг/Эт · Рс/Рш', featureProducts: ['оц/ст × ин/кт', 'вб/лб × сл/сб'], name: 'Способы общения' },
];

export const getOrderDependentTetrachotomy = (formulaId: string | undefined): OrderDependentTetrachotomy | undefined => (
  ORDER_DEPENDENT_TETRACHOTOMIES.find(entry => entry.formulaId === formulaId)
);
