import React from 'react';
import { ASPECTS, ASPECT_FEATURES, FUNCTIONS, FUNCTION_FEATURES, SOCIONIC_TYPES } from '../data/socionics';
import { AspectGlyph } from './AspectGlyph';
import { HadamardTheory } from './HadamardTheory';

const sections = [
  ['terminology', 'Терминология'],
  ['hadamard', 'Матрицы Адамара'],
  ['quadras', 'Аспекты и квадры'],
  ['aspects', 'Аспекты и их признаки'],
  ['functions', 'Функции и их признаки'],
  ['models', 'Модели А'],
] as const;
const quadras = [
  { id: 'alpha', name: 'Альфа', key: 'isAlphaValued', value: true },
  { id: 'beta', name: 'Бета', key: 'isDeltaValued', value: false },
  { id: 'gamma', name: 'Гамма', key: 'isAlphaValued', value: false },
  { id: 'delta', name: 'Дельта', key: 'isDeltaValued', value: true },
] as const;

const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} className="shell-panel min-w-0 scroll-mt-6 rounded-2xl border p-4 md:p-6 space-y-4">
    <h2 className="text-xl font-medium">{title}</h2>
    {children}
  </section>
);
const Table: React.FC<{ label: string; headers: string[]; children: React.ReactNode }> = ({ label, headers, children }) => (
  <div className="overflow-x-auto rounded-xl border border-[var(--color-shell-border)]" tabIndex={0} role="region" aria-label={label}>
    <table className="w-full text-sm text-left border-collapse">
      <caption className="sr-only">{label}</caption>
      <thead className="shell-panel-muted"><tr>{headers.map(header => <th key={header} scope="col" className="px-4 py-3 font-medium min-w-28">{header}</th>)}</tr></thead>
      <tbody className="divide-y divide-[var(--color-shell-border)]">{children}</tbody>
    </table>
  </div>
);
const Cell: React.FC<{ children: React.ReactNode }> = ({ children }) => <td className="px-4 py-3">{children}</td>;

export const ReferencePage: React.FC = () => (
  <main data-reference-page className="relative max-w-7xl mx-auto px-4 md:px-6 pb-16 space-y-6">
    <div className="space-y-3">
      <h1 className="text-2xl md:text-3xl font-medium">Справка: обозначения и базовые таблицы</h1>
      <p className="text-[var(--color-shell-muted)] leading-relaxed">Признаки аспектов, признаки функций и модели типов, используемые в приложении.</p>
      <nav aria-label="Разделы справки" className="flex flex-wrap gap-2">
        {sections.map(([id, title]) => <a key={id} href={`#${id}`} className="shell-control rounded-lg border border-[var(--color-shell-border)] px-3 py-2 text-sm hover:underline">{title}</a>)}
      </nav>
    </div>

    <Section id="terminology" title="Терминология">
      <div className="max-w-4xl space-y-3 leading-relaxed">
        <p>Аспекты — элементы информационного содержания модели А. Функции — позиции модели, в которых размещаются аспекты. Признаки аспектов и признаки функций задают бинарные разбиения соответствующих множеств.</p>
        <p>«Альфа / Гамма» и «Дельта / Бета» — две дихотомии информационных аспектов. Их полюса названы по квадрам, для которых соответствующие аспекты являются ценностными. В легендах и подписях используются короткие названия «Альфа», «Бета», «Гамма», «Дельта».</p>
        <p>Квадры — тетрады соционических типов с общим набором ценностных аспектов. Названия полюсов признаков аспектов обозначают группы аспектов; названия квадр обозначают группы типов. Это разные множества и разные разбиения.</p>
        <p>Один аспект входит в ценностные наборы двух квадр. Например, ЧИ имеет признаки «Альфа» и «Дельта». Совместное задание этих двух дихотомий разбивает восемь аспектов на четыре пары: Альфа и Дельта — ЧИ, БС; Альфа и Бета — ЧЭ, БЛ; Гамма и Дельта — ЧЛ, БЭ; Гамма и Бета — ЧС, БИ. Квадры как тетрахотомия типов состоят из четырёх групп по четыре типа.</p>
        <p>Вербальные функции 1, 2, 5, 6 в принятой здесь таблице соответствуют ценностным аспектам типа. Лаборные функции 3, 4, 7, 8 соответствуют остальным аспектам. Название группы аспектов фиксирует её состав; размещение этой группы в вербальных или лаборных функциях зависит от типа.</p>
        <p className="text-[var(--color-shell-muted)]">Пример: аспекты Альфы занимают вербальные функции у типов Альфы и лаборные функции у типов Гаммы.</p>
        <p>Цвета на диаграммах различают группы внутри выбранного отображения. Состав группы указан в легенде. В прямом соответствии общий цвет связывает группу аспектов с заданной группой функций. В блочном инварианте группы сохраняют состав, а соответствие между блоками может различаться у разных типов.</p>
      </div>
    </Section>

    <Section id="hadamard" title="Матрицы Адамара">
      <HadamardTheory />
    </Section>

    <Section id="quadras" title="Аспекты и квадры">
      <p className="text-[var(--color-shell-muted)]">В одной строке сопоставлены группа аспектов и тетрада типов, для которой эти аспекты ценностны.</p>
      <Table label="Ценностные аспекты и типы квадр" headers={['Название', 'Аспекты', 'Типы квадры']}>
        {quadras.map(quadra => <tr key={quadra.id} data-reference-quadra={quadra.id}>
          <th scope="row" className="px-4 py-3 font-medium">{quadra.name}</th>
          <Cell><span className="whitespace-nowrap">{ASPECTS.filter(aspect => aspect[quadra.key] === quadra.value).map(aspect => aspect.name).join(', ')}</span></Cell>
          <Cell><span className="whitespace-nowrap">{SOCIONIC_TYPES.filter(type => type.quadraId === quadra.id).map(type => type.aliases.socionics?.[0] ?? type.id).join(', ')}</span></Cell>
        </tr>)}
      </Table>
    </Section>

    <Section id="aspects" title="Аспекты и их признаки">
      <p className="leading-relaxed text-[var(--color-shell-muted)]">Пиктограммы: треугольник — интуиция, круг — сенсорика, квадрат — логика, угол — этика. Ч-аспекты обозначены чёрными фигурами с контрастной обводкой; Б-аспекты — белыми фигурами. Буквенные сокращения сохраняют значение независимо от темы оформления.</p>
      <p className="text-[var(--color-shell-muted)]">В ячейках указаны названия полюсов. Столбцы следуют порядку признаков в данных приложения; постоянный признак «Сущ» опущен.</p>
      <Table label="Восемь аспектов и семь бинарных признаков" headers={['Аспект', 'Название', ...ASPECT_FEATURES.map(feature => feature.title)]}>
        {ASPECTS.map(aspect => <tr key={aspect.id} data-reference-aspect={aspect.id}>
          <th scope="row" className="px-4 py-3 font-medium"><AspectGlyph aspectId={aspect.id} label={aspect.name} mode="icon-symbol" size="lg" /></th>
          <Cell>{aspect.fullName}</Cell>
          {ASPECT_FEATURES.map(feature => <td key={feature.key} data-reference-aspect-feature={feature.key} className="px-4 py-3">{aspect[feature.key] ? feature.posSingular : feature.negSingular}</td>)}
        </tr>)}
      </Table>
    </Section>

    <Section id="functions" title="Функции и их признаки">
      <p className="leading-relaxed text-[var(--color-shell-muted)]">Номера 1–8 обозначают позиции модели А. Ментальные функции — позиции 1, 2, 3, 4; витальные — 5, 6, 7, 8. Акцептные функции — позиции 1, 3, 5, 7; продуктивные — 2, 4, 6, 8. Признаки функций и признаки аспектов определены на разных множествах и читаются по соответствующим таблицам.</p>
      <Table label="Восемь функций и семь бинарных признаков" headers={['Функция', 'Название', ...FUNCTION_FEATURES.map(feature => feature.title)]}>
        {FUNCTIONS.map(fn => <tr key={fn.id} data-reference-function={fn.id}>
          <th scope="row" className="px-4 py-3 font-medium">{fn.id}</th>
          <Cell>{fn.name}</Cell>
          {FUNCTION_FEATURES.map(feature => <td key={feature.key} data-reference-function-feature={feature.key} className="px-4 py-3">{fn[feature.key] ? feature.posSingular : feature.negSingular}</td>)}
        </tr>)}
      </Table>
    </Section>

    <Section id="models" title="Модели А">
      <p className="text-[var(--color-shell-muted)]">Каждая строка задаёт размещение восьми аспектов по функциям одного типа. Номера столбцов — номера функций. На диаграммах приложения порядок позиций: слева 1, 4, 6, 7; справа 2, 3, 5, 8.</p>
      <Table label="Модели А шестнадцати типов" headers={['Тип', 'Квадра', ...FUNCTIONS.map(fn => `${fn.id}. ${fn.name}`)]}>
        {SOCIONIC_TYPES.map(type => <tr key={type.id} data-reference-type={type.id}>
          <th scope="row" className="px-4 py-3 font-medium whitespace-nowrap">{type.aliases.socionics?.[0] ?? type.id}</th>
          <Cell>{quadras.find(quadra => quadra.id === type.quadraId)!.name}</Cell>
          {FUNCTIONS.map(fn => {
            const assignment = type.modelA.find(item => item.functionId === fn.id)!;
            const aspect = ASPECTS.find(item => item.id === assignment.aspectId)!;
            return <td key={fn.id} data-reference-model-assignment={fn.id} className="px-4 py-3"><AspectGlyph aspectId={aspect.id} label={aspect.name} mode="icon-symbol" size="lg" /></td>;
          })}
        </tr>)}
      </Table>
    </Section>
    <p className="text-sm text-[var(--color-shell-muted)]">Широкие таблицы прокручиваются горизонтально внутри своего блока. Их содержимое сформировано из тех же данных, что и диаграммы приложения.</p>
  </main>
);
