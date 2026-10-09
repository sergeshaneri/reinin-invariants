import { useState } from 'react';
import type { HadamardMatrix } from '../data/hadamard';

const titles = { aspecton: 'Паттерны Аспектона', functionon: 'Паттерны Функциона', socion: 'Паттерны Социона' };
const references = {
  aspecton: [{ file: 'aspecton-functionon-patterns.png', label: 'Рукописные паттерны Аспектона и Функциона' }],
  functionon: [{ file: 'function-dichotomies.png', label: 'Function dichotomies' }, { file: 'aspecton-functionon-patterns.png', label: 'Рукописные паттерны Аспектона и Функциона' }],
  socion: [{ file: 'socion-patterns.png', label: 'Шестнадцать паттернов Социона' }],
};
const quadras = [
  { name: 'Альфа', color: '#56cce7' },
  { name: 'Бета', color: '#ef6b73' },
  { name: 'Гамма', color: '#f4df51' },
  { name: 'Дельта', color: '#65cf77' },
];

const functionDichotomies = [
  { column: 7, positive: 'Ментальные', negative: 'Витальные', color: '#f06b78' },
  { column: 6, positive: 'Акцептные', negative: 'Продуктивные', color: '#f3a453' },
  { column: 3, positive: 'Сильные', negative: 'Слабые', color: '#edcc42', reference: 'Kinetic / Potential' },
  { column: 4, positive: 'Вербальные', negative: 'Лаборные', color: '#75bc55', reference: 'Verbal / Nonverbal' },
  { column: 2, positive: 'Оценочные', negative: 'Ситуативные', color: '#6da7e9' },
  { column: 5, positive: 'Инертные', negative: 'Контактные', color: '#ac8bea' },
  { column: 1, positive: 'Экстравертные', negative: 'Интровертные', color: '#d58cb2', reference: 'Bold / Cautious*' },
];

const FunctionDichotomies = ({ matrix }: { matrix: HadamardMatrix }) => (
  <section className="space-y-4" data-function-dichotomies>
    <h4 className="text-lg font-medium">Признаки функций на модели А</h4>
    <p className="max-w-4xl text-sm leading-relaxed text-[var(--color-shell-muted)]">Здесь клетки обозначают позиции функций: 1–2, 4–3, 6–5, 7–8. Цветная четвёрка — положительный полюс столбца H₃. Названия из англоязычного референса приведены отдельно от названий исходной таблицы Функциона.</p>
    <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4 xl:grid-cols-7">
      {functionDichotomies.map(item => <figure key={item.column} className="min-w-0 space-y-3" data-function-dichotomy={matrix.columns[item.column].short}>
        <figcaption className="text-sm"><span className="block font-medium">{item.positive}</span><span className="block text-[var(--color-shell-muted)]">{item.negative}</span></figcaption>
        <svg viewBox="0 0 80 160" width="80" height="160" className="block h-auto w-full max-w-24" role="img" aria-label={`${item.positive} / ${item.negative}: функции модели А`}>
          <title>{`${item.positive} / ${item.negative}`}</title>
          {[1, 2, 4, 3, 6, 5, 7, 8].map((position, index) => {
            const positive = matrix.values[matrix.rows.findIndex(row => row.id === String(position))][item.column] === 1;
            const x = (index % 2) * 40;
            const y = Math.floor(index / 2) * 40;
            return <g key={position}>
              <rect x={x + 1} y={y + 1} width="38" height="38" fill={positive ? item.color : 'var(--color-shell-surface-muted)'} stroke="var(--color-shell-border)" strokeWidth="1" data-function-position={position} data-function-positive={positive}><title>{`${position}: ${positive ? item.positive : item.negative}`}</title></rect>
              <text x={x + 20} y={y + 22} textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="500" fill={positive ? '#181522' : 'var(--color-app-fg)'} aria-hidden="true">{position}</text>
            </g>;
          })}
        </svg>
        {item.reference && <p className="text-xs leading-relaxed text-[var(--color-shell-muted)]">Референс: {item.reference}</p>}
      </figure>)}
    </div>
    <p className="max-w-4xl text-xs leading-relaxed text-[var(--color-shell-muted)]">В референсе подпись Bold отмечена звёздочкой с авторским комментарием об отсутствии этого обозначения в работах Аугусты. Здесь сохранена положительная группа Верт из таблицы Функциона.</p>
  </section>
);

export const HadamardPatterns = ({ matrix, binary }: { matrix: HadamardMatrix; binary: boolean }) => {
  const [showIndices, setShowIndices] = useState(false);
  const socion = matrix.id === 'socion';
  return <section id={`patterns-${matrix.id}`} className="min-w-0 space-y-4 scroll-mt-6" data-hadamard-pattern-atlas={matrix.id}>
    <h4 className="text-lg font-medium">{titles[matrix.id]}</h4>
    <p className="max-w-4xl text-sm leading-relaxed text-[var(--color-shell-muted)]">{socion
      ? 'Каждый паттерн — строка H₄, развёрнутая в квадрат 4 × 4. Цвет различает квадры, заливка обозначает положительный полюс. Порядок типов совпадает с исходным изображением.'
      : 'Каждый паттерн — строка H₃, развёрнутая в две строки по четыре клетки. Клетки читаются слева направо: столбцы 1–4 сверху, 5–8 снизу. Подпись признака указывает столбец с тем же порядковым номером, что и строка паттерна.'}</p>
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <span>Цветная клетка: {binary ? '1' : '+1'} · незакрашенная: {binary ? '0' : '−1'}</span>
      <label className="flex items-center gap-2"><input type="checkbox" checked={showIndices} onChange={event => setShowIndices(event.target.checked)} aria-label={`${titles[matrix.id]}: номера столбцов`} />Номера столбцов</label>
    </div>
    {socion && <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">{quadras.map(quadra => <span key={quadra.name} className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: quadra.color }} />{quadra.name}</span>)}</div>}
    <div className="grid max-w-3xl grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4" data-pattern-gallery>
      {matrix.rows.map((row, rowIndex) => {
        const quadra = socion ? quadras[Math.floor(rowIndex / 4)] : undefined;
        const color = quadra?.color ?? '#aa92ea';
        return <figure key={row.id} className="min-w-0 space-y-2" data-pattern-card={`${matrix.id}:${row.id}`} data-pattern-quadra={quadra?.name}>
          <svg viewBox={`0 0 160 ${socion ? 160 : 80}`} width="160" height={socion ? 160 : 80} className="block h-auto w-full max-w-40" role="img" aria-label={`${row.label}: паттерн строки ${rowIndex + 1}`}>
            <title>{`${row.label}: ${matrix.values[rowIndex].map(value => binary ? (value === 1 ? '1' : '0') : (value === 1 ? '+' : '−')).join(' ')}`}</title>
            {matrix.values[rowIndex].map((value, columnIndex) => {
              const x = (columnIndex % 4) * 40;
              const y = Math.floor(columnIndex / 4) * 40;
              const column = matrix.columns[columnIndex];
              return <g key={columnIndex}>
                <rect x={x + 1} y={y + 1} width="38" height="38" fill={value === 1 ? color : 'var(--color-shell-surface-muted)'} stroke="var(--color-shell-border)" strokeWidth="1" data-pattern-cell={columnIndex + 1} data-pattern-value={value}>
                  <title>{`${columnIndex + 1}. ${column.short}: ${value === 1 ? column.positive : column.negative}`}</title>
                </rect>
                {showIndices && <text x={x + 20} y={y + 21} textAnchor="middle" dominantBaseline="middle" fontSize="15" fill={value === 1 ? '#181522' : 'var(--color-app-fg)'} aria-hidden="true" data-pattern-index>{columnIndex + 1}</text>}
              </g>;
            })}
          </svg>
          <figcaption className="space-y-1"><span className="block text-sm font-medium">{row.label}</span><span className="block text-xs text-[var(--color-shell-muted)]">{matrix.columns[rowIndex].short}</span></figcaption>
        </figure>;
      })}
    </div>
    {matrix.id === 'functionon' && <FunctionDichotomies matrix={matrix} />}
    <details className="rounded-xl border border-[var(--color-shell-border)] p-3" data-pattern-references>
      <summary className="cursor-pointer font-medium">Исходные изображения · {matrix.title}</summary>
      <div className="mt-3 space-y-5">{references[matrix.id].map(reference => {
        const src = `${import.meta.env.BASE_URL}reference/patterns/${reference.file}`;
        return <figure key={reference.file} className="space-y-2"><a href={src} target="_blank" rel="noreferrer"><img src={src} alt={reference.label} loading="lazy" className="block h-auto w-full max-w-4xl rounded-lg" /></a><figcaption className="text-sm text-[var(--color-shell-muted)]">{reference.label} · оригинал без изменений</figcaption></figure>;
      })}</div>
    </details>
  </section>;
};
