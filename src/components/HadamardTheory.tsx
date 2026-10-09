import { useState } from 'react';
import { HADAMARD_MATRICES, HADAMARD_SOURCES, type HadamardMatrix } from '../data/hadamard';
import { HadamardPatterns } from './HadamardPatterns';

const annotations: Record<HadamardMatrix['id'], string[]> = {
  aspecton: [
    'Строки — восемь информационных аспектов; столбцы — постоянный признак «Сущ» и семь дихотомий аспектов. Чтение строки даёт полный код аспекта, чтение столбца — разбиение аспектов на два полюса по четыре элемента.',
    'Пример: БС имеет код + − + − + − + −. Это интровертный, Дельта, вовлечённый, Альфа, явный, иррациональный и динамичный аспект. «Дельта / Бета» и «Альфа / Гамма» здесь обозначают признаки аспектов, определённые через ценности квадр.',
    'В авторском описании поколений признаков аспектов Верт относится к первому поколению, Наль и Таль — ко второму, остальные четыре дихотомии — к третьему. Поколение признака и структурный класс его инварианта — разные классификации.',
  ],
  functionon: [
    'Строки — восемь функций модели А в порядке 1, 5, 6, 2, 8, 4, 3, 7. Это порядок строк матрицы, а не последовательная нумерация функций и не расположение клеток на диаграмме. На диаграмме сохраняется порядок 1–2, 4–3, 6–5, 7–8.',
    'Столбцы определены на функциях. Наль здесь разделяет акцептные и продуктивные позиции, Таль — ментальные и витальные. Таль аспектов разделяет статичные и динамичные аспекты; названия полюсов читаются с учётом носителя.',
    'Числовая форма двух H₃ совпадает при указанном порядке строк. Построчное сопоставление аспектов и функций соответствует базовой модели ИЛЭ: ЧИ → 1, БС → 5, ЧЭ → 6, БЛ → 2, ЧЛ → 8, БЭ → 4, ЧС → 3, БИ → 7. Остальные модели задают другие размещения аспектов по функциям.',
  ],
  socion: [
    'Строки — шестнадцать типов в порядке ИЛЭ, СЭИ, ЭСЭ, ЛИИ / ЭИЭ, ЛСИ, СЛЭ, ИЭИ / ЛИЭ, ЭСИ, СЭЭ, ИЛИ / ИЭЭ, СЛИ, ЛСЭ, ЭИИ. Столбцы — «Существование» и пятнадцать признаков типов. В сводном документе эта таблица записана в кодировке 1/0; здесь доступно также её знаковое представление.',
    'Номера столбцов сохраняют исходный порядок. Базис Верт, Наль, Ит/Сн, Лг/Эт занимает столбцы 2, 15, 4, 8. Остальные столбцы выражаются через поэлементное сочетание базисных кодов. Постоянный первый столбец соответствует нейтральному элементу.',
    'Коды типов замкнуты относительно поэлементного XNOR и образуют коммутативную группу C₂⁴. Композиция размещений аспектов по функциям — отдельная операция. Таблица бинарных кодов сама по себе не задаёт таблицу композиции моделей или направленных интертипных отношений.',
  ],
};

const MatrixTable = ({ matrix, binary }: { matrix: HadamardMatrix; binary: boolean }) => (
  <div className="max-w-full overflow-x-auto rounded-xl border border-[var(--color-shell-border)]" role="region" tabIndex={0} aria-label={`${matrix.title}: таблица`} data-hadamard-scroll>
    <table className="w-full border-collapse text-center text-sm" data-hadamard-matrix={matrix.id}>
      <caption className="sr-only">{matrix.title}, {matrix.rows.length} × {matrix.columns.length}</caption>
      <thead className="shell-panel-muted"><tr>
        <th scope="col" className="p-3 text-left font-medium">{matrix.id === 'aspecton' ? 'Аспект' : matrix.id === 'functionon' ? 'Функция' : 'Тип'}</th>
        {matrix.columns.map((column, index) => <th key={column.short} scope="col" className="min-w-14 px-2 py-3 font-medium" title={`${column.positive} / ${column.negative}`}><span className="block text-xs text-[var(--color-shell-muted)]">{index + 1}</span>{column.short}</th>)}
      </tr></thead>
      <tbody>{matrix.rows.map((row, rowIndex) => <tr key={row.id} className="border-t border-[var(--color-shell-border)]" data-hadamard-row={row.id}>
        <th scope="row" className="px-3 py-2 text-left font-medium whitespace-nowrap">{row.label}</th>
        {matrix.values[rowIndex].map((value, columnIndex) => <td key={columnIndex}
          data-hadamard-cell={`${row.id}:${columnIndex + 1}`} data-hadamard-value={value}
          title={`${row.label} · ${matrix.columns[columnIndex].short}: ${value === 1 ? matrix.columns[columnIndex].positive : matrix.columns[columnIndex].negative}`}
          className={`px-2 py-2 text-base tabular-nums ${value === 1 ? 'bg-[var(--color-shell-control)] text-[var(--color-shell-accent)]' : 'text-[var(--color-app-fg)]'}`}>
          {binary ? (value === 1 ? '1' : '0') : (value === 1 ? '+' : '−')}
        </td>)}
      </tr>)}</tbody>
    </table>
  </div>
);

export const HadamardTheory = () => {
  const [binary, setBinary] = useState(false);
  const aspecton = HADAMARD_MATRICES[0];
  const relationNames = ['ТЖ', 'ДУ', 'АК', 'ОР', 'РЛ', 'БЛ', 'СТ', 'ПП'];
  return <div className="min-w-0 space-y-8" data-hadamard-theory>
    <div className="max-w-4xl space-y-3 leading-relaxed">
      <p>Матрица Адамара — квадратная матрица из +1 и −1 с взаимно ортогональными строками. В принятой нотации H₃ имеет размер 8 × 8, H₄ — 16 × 16; индекс указывает число удвоений размера. Порядок матриц составляет соответственно 8 и 16.</p>
      <p className="font-mono text-base" data-hadamard-orthogonality>HₙHₙᵀ = 2ⁿI</p>
      <p>I здесь — единичная матрица. Скалярное произведение разных строк равно нулю, строки с самой собой — числу её элементов. Разные нетривиальные столбцы дают все четыре сочетания полюсов в равных количествах.</p>
      <p>Первый столбец «Сущ» состоит из +1. Он фиксирует принадлежность элемента рассматриваемому множеству и не разделяет его на противоположные группы. Остальные столбцы задают дихотомии. Для модели его структурная формула — t(I)=F: все восемь аспектов отображаются на все восемь функций. Здесь I — множество аспектов, F — множество функций; при уже заданной биекции это условие выполняется автоматически.</p>
      <p>В бинарной записи положительный полюс обозначен 1, отрицательный — 0. Для проверки ортогональности используется преобразование <span className="whitespace-nowrap font-mono">1 ↦ +1, 0 ↦ −1</span>. Поэлементное умножение знаков соответствует XNOR бинарных значений: совпавшие полюса дают 1, разные — 0.</p>
      <details className="rounded-xl border border-[var(--color-shell-border)] p-3">
        <summary className="cursor-pointer font-medium">Построение Сильвестра</summary>
        <div className="mt-3 space-y-2"><p>Начальная матрица H₀ = [1]. Каждое удвоение заменяет её блочной матрицей:</p><pre className="overflow-x-auto text-sm">{'Hₙ₊₁ = [ Hₙ   Hₙ ]\n        [ Hₙ  −Hₙ ]'}</pre><p>Так получаются размеры 2, 4, 8, 16. Подписи строк и столбцов определяют, какой смысл этот числовой массив имеет на аспектах, функциях и типах.</p></div>
      </details>
    </div>
    <label className="flex flex-wrap items-center gap-3 text-sm">
      <span>Кодирование матриц</span>
      <select aria-label="Кодирование матриц" className="shell-control rounded-lg border border-[var(--color-shell-border)] px-3 py-2" value={binary ? 'binary' : 'signs'} onChange={event => setBinary(event.target.value === 'binary')}>
        <option value="signs">Знаки + / −</option><option value="binary">Биты 1 / 0</option>
      </select>
    </label>
    <nav aria-label="Паттерны носителей" className="flex flex-wrap gap-2">
      {HADAMARD_MATRICES.map(matrix => <a key={matrix.id} href={`#patterns-${matrix.id}`} className="shell-control rounded-lg border border-[var(--color-shell-border)] px-3 py-2 text-sm">{matrix.title.split(' · ')[0]}</a>)}
    </nav>
    {HADAMARD_MATRICES.map(matrix => <article key={matrix.id} id={`hadamard-${matrix.id}`} className="min-w-0 space-y-4 scroll-mt-6">
      <h3 className="text-lg font-medium">{matrix.title} · {matrix.rows.length} × {matrix.columns.length}</h3>
      <HadamardPatterns matrix={matrix} binary={binary} />
      <div className="max-w-4xl space-y-3 leading-relaxed" data-hadamard-annotation={matrix.id}>{annotations[matrix.id].map(text => <p key={text}>{text}</p>)}</div>
      <MatrixTable matrix={matrix} binary={binary} />
      <details className="rounded-xl border border-[var(--color-shell-border)] p-3">
        <summary className="cursor-pointer font-medium">Полюса столбцов · {matrix.title}</summary>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">{matrix.columns.map((column, index) => <div key={column.short}><dt className="font-medium">{index + 1}. {column.short}</dt><dd className="mt-1 text-sm text-[var(--color-shell-muted)]">+ / 1: {column.positive}<br />− / 0: {column.negative}</dd></div>)}</dl>
      </details>
      <p className="text-sm text-[var(--color-shell-muted)]">Источники: {matrix.sourceIds.map((id, index) => <span key={id}>{index > 0 ? ' · ' : ''}<a className="underline underline-offset-4" href={`https://docs.google.com/document/d/${id}/edit?tab=t.0`} target="_blank" rel="noreferrer">{HADAMARD_SOURCES.find(source => source.id === id)!.title}</a></span>)}</p>
    </article>)}
    <div className="max-w-4xl space-y-3 leading-relaxed">
      <h3 className="text-lg font-medium">От столбцов к диадам и тетрадам</h3>
      <p>Две независимые дихотомии аспектов или функций разбивают восемь элементов на четыре диады. Две независимые дихотомии типов разбивают шестнадцать типов на четыре тетрады. Их поэлементное сочетание задаёт зависимый третий признак. Выбор двух независимых столбцов и произведения описывает одно разбиение тремя эквивалентными способами.</p>
      <p>Например, на функциях Сл/слаб ⊙ Вб/Лб = Таль. Совместные полюса сильных/слабых и вербальных/лаборных выделяют пары 1–2, 3–4, 5–6, 7–8: ЭГО, СУПЕРЭГО, СУПЕРИД, ИД. Здесь ⊙ означает поэлементный XNOR.</p>
      <p>Матрицы кодируют принадлежность полюсам. Полный инвариант модели t(i) дополнительно задаёт размещение аспектов в функциях: соответствия блоков, эквивалентности или циклический порядок. Зависимость трёх столбцов сама по себе не заменяет эти условия.</p>
    </div>
    <div className="min-w-0 space-y-3" data-hadamard-relations>
      <h3 className="text-lg font-medium">Таблицы отношений</h3>
      <p className="max-w-4xl leading-relaxed">В таблице интераспектных отношений строка и столбец обозначают аспекты, ячейка — код совпадений их признаков. Он получается поэлементным XNOR двух строк Аспектона. Названия отношений взяты из авторской таблицы. Это таблица отношений с буквенными значениями; равенство H₃H₃ᵀ = 8I относится к знаковой матрице выше.</p>
      <details className="rounded-xl border border-[var(--color-shell-border)] p-3">
        <summary className="cursor-pointer font-medium">Интераспектные отношения · 8 × 8</summary>
        <div className="mt-3 max-w-full overflow-x-auto" role="region" tabIndex={0} aria-label="Интераспектные отношения">
          <table className="w-full border-collapse text-center text-sm"><caption className="sr-only">Интераспектные отношения по кодам совпадений</caption>
            <thead><tr><th scope="col" className="p-2 font-medium">Аспект</th>{aspecton.rows.map(row => <th key={row.id} scope="col" className="min-w-12 p-2 font-medium">{row.label}</th>)}</tr></thead>
            <tbody>{aspecton.rows.map((row, i) => <tr key={row.id}><th scope="row" className="p-2 font-medium">{row.label}</th>{aspecton.rows.map((other, j) => {
              const code = aspecton.values[i].map((value, k) => value * aspecton.values[j][k]);
              const relation = aspecton.values.findIndex(candidate => candidate.every((value, k) => value === code[k]));
              return <td key={other.id} className="border-t border-[var(--color-shell-border)] p-2" data-aspect-relation={`${row.id}:${other.id}`}>{relationNames[relation]}</td>;
            })}</tr>)}</tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-[var(--color-shell-muted)]">ТЖ — тождественные; ДУ — дуальные; АК — активационные; ОР — ориентирующие; РЛ — реализационные; БЛ — близкие; СТ — стимулирующие; ПП — противоположности. «БЛ» в ячейке обозначает отношение, «БЛ» в заголовке — аспект Белой Логики.</p>
      </details>
      <p className="max-w-4xl leading-relaxed">Таблица моделей А и таблица перестановок интертипных отношений имеют другой смысл: ячейки содержат аспекты или номера функций. В таблице перестановок из сводного документа аргументы перечислены в порядке 1, 5, 6, 2, 8, 4, 3, 7; для сравнения с моделью в порядке 1–8 нужно сначала переставить столбцы. Приём и передача заказа, приём и передача контроля сохраняют направление.</p>
      <details className="rounded-xl border border-[var(--color-shell-border)] p-3" data-hadamard-source-note>
        <summary className="cursor-pointer font-medium">Статус семантических аннотаций источников</summary>
        <div className="mt-3 max-w-4xl space-y-3 leading-relaxed">
          <p>В «Аспектоне» соответствие «ЧЭ — активирующие отношения — Дельта/Бета» сопровождается авторской пометой (?!). Ортогональность устанавливает свойство числовых кодов; содержательное соответствие аспектов, признаков и названий отношений относится к авторской семантической интерпретации.</p>
          <p>В «Функционе» принцип двойственности функций и признаков, а также возможные межфункциональные отношения сформулированы как гипотезы. Проверки таблиц подтверждают знаки, ортогональность и совпадение назначений с реестрами приложения. Статус этих гипотез сохраняется отдельно от результатов проверки.</p>
        </div>
      </details>
    </div>
  </div>;
};
