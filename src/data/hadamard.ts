export interface HadamardColumn {
  short: string;
  positive: string;
  negative: string;
}
export interface HadamardMatrix {
  id: 'aspecton' | 'functionon' | 'socion';
  title: string;
  order: number;
  rows: readonly { id: string; label: string }[];
  columns: readonly HadamardColumn[];
  values: readonly (readonly number[])[];
  sourceIds: readonly string[];
}

export const HADAMARD_SOURCES = [
  { id: '1SM3S8J3uU4Uqd5t5WAqc3jKy54w2C98CyeKA_kg2Jwk', title: 'Функцион' },
  { id: '1RotOTDvP-DR-OT9kK3X3MbO84092jWIZuFuxf1yNdPU', title: 'Аспектон' },
  { id: '18f_5bWegApKeBQexZacnCYfoDx_g3dqlgeCNxNlqbwc', title: 'Сводные таблицы моделей А, признаков и отношений' },
] as const;
const existence: HadamardColumn = { short: 'Сущ', positive: 'Существует', negative: 'Отрицательный полюс не задан на этом множестве' };
const column = (short: string, positive: string, negative: string): HadamardColumn => ({ short, positive, negative });
const signs = (rows: readonly string[]) => rows.map(row => [...row].map(value => value === '1' ? 1 : -1));
// Literal signs of the two 8×8 tables in the supplied documents.
const h3 = signs(['11111111', '10101010', '11001100', '10011001', '11110000', '10100101', '11000011', '10010110']);

export const HADAMARD_MATRICES: readonly HadamardMatrix[] = [
  {
    id: 'aspecton', title: 'Аспектон · H₃', order: 3,
    rows: ['Ne', 'Si', 'Fe', 'Ti', 'Te', 'Fi', 'Se', 'Ni'].map((id, index) => ({ id, label: ['ЧИ', 'БС', 'ЧЭ', 'БЛ', 'ЧЛ', 'БЭ', 'ЧС', 'БИ'][index] })),
    columns: [existence, column('Верт', 'Экстравертный', 'Интровертный'), column('дт/бт', 'Дельта', 'Бета'), column('отвл/вовл', 'Отвлечённый', 'Вовлечённый'), column('аф/гм', 'Альфа', 'Гамма'), column('−яв/яв', 'Неявный', 'Явный'), column('Наль', 'Иррациональный', 'Рациональный'), column('Таль', 'Статичный', 'Динамичный')],
    values: h3,
    sourceIds: [HADAMARD_SOURCES[1].id, HADAMARD_SOURCES[2].id],
  },
  {
    id: 'functionon', title: 'Функцион · H₃', order: 3,
    rows: [1, 5, 6, 2, 8, 4, 3, 7].map((id, index) => ({ id: String(id), label: [`1 · Программная`, `5 · Суггестивная`, `6 · Активационная`, `2 · Творческая`, `8 · Фоновая`, `4 · Болевая`, `3 · Ролевая`, `7 · Ограничительная`][index] })),
    columns: [existence, column('Верт', 'Экстравертная', 'Интровертная'), column('Оц/Сит', 'Оценочная', 'Ситуативная'), column('Сл/слаб', 'Сильная', 'Слабая'), column('Вб/Лб', 'Вербальная', 'Лаборная'), column('Ин/Кт', 'Инертная', 'Контактная'), column('Наль', 'Акцептная', 'Продуктивная'), column('Таль', 'Ментальная', 'Витальная')],
    values: h3,
    sourceIds: [HADAMARD_SOURCES[0].id, HADAMARD_SOURCES[2].id],
  },
  {
    id: 'socion', title: 'Социон · H₄', order: 4,
    rows: ['ILE', 'SEI', 'ESE', 'LII', 'EIE', 'LSI', 'SLE', 'IEI', 'LIE', 'ESI', 'SEE', 'ILI', 'IEE', 'SLI', 'LSE', 'EII'].map((id, index) => ({ id, label: ['ИЛЭ', 'СЭИ', 'ЭСЭ', 'ЛИИ', 'ЭИЭ', 'ЛСИ', 'СЛЭ', 'ИЭИ', 'ЛИЭ', 'ЭСИ', 'СЭЭ', 'ИЛИ', 'ИЭЭ', 'СЛИ', 'ЛСЭ', 'ЭИИ'][index] })),
    columns: [existence, column('Верт', 'Экстраверсия', 'Интроверсия'), column('Бс/Пр', 'Беспечность', 'Предусмотрительность'), column('Ит/Сн', 'Интуиция', 'Сенсорика'), column('Дм/Ар', 'Демократизм', 'Аристократизм'), column('+/−', 'Позитивизм', 'Негативизм'), column('Ус/Уп', 'Уступчивость', 'Упрямство'), column('Лг/Эт', 'Логика', 'Этика'), column('Сб/Об', 'Весёлые / субъективизм', 'Серьёзные / объективизм'), column('Кн/Эм', 'Конструктивизм', 'Эмотивизм'), column('Пц/Рз', 'Правые / процесс', 'Левые / результат'), column('?/!', 'Квестимность', 'Деклатимность'), column('Рс/Рш', 'Рассудительность', 'Решительность'), column('Тк/Ст', 'Тактика', 'Стратегия'), column('Наль', 'Иррациональность', 'Рациональность'), column('Таль', 'Статика', 'Динамика')],
    values: signs(['1111111111111111', '1010101010101010', '1100110011001100', '1001100110011001', '1111000011110000', '1010010110100101', '1100001111000011', '1001011010010110', '1111111100000000', '1010101001010101', '1100110000110011', '1001100101100110', '1111000000001111', '1010010101011010', '1100001100111100', '1001011001101001']),
    sourceIds: [HADAMARD_SOURCES[2].id],
  },
];
