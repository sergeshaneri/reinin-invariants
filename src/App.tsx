import React, { useState, useEffect, useRef, useMemo } from 'react';
import { REININ_TRAITS, SOCIONIC_TYPES, TraitClass, type PoleIndex } from './data/socionics';
import {
  getDefaultPartitionState,
  getDefaultTraitPoleIndex,
  getPartitionKindForMode,
  readInitialAppState,
  serializeAppUrlState,
  type AppMode,
  type PartitionExplorerState,
  type ThemeMode,
  getThemeStorageKey,
} from './appState';
import { selectDichotomyTypesPanelView, selectPartitionExplorerView, selectTetrachotomyCatalog, selectOctochotomyCatalog } from './data/selectors';
import { DIAGRAMS, DEFAULT_DIAGRAM_ID } from './diagrams/registry';
import { HelpModal } from './components/HelpModal';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { AspectDisplayToggle } from './components/AspectDisplayToggle';
import { ThemeToggle } from './components/ThemeToggle';
import type { AspectDisplayMode } from './components/AspectGlyph';
import { TraitNav } from './components/TraitNav';
import { TypeSelector } from './components/TypeSelector';
import { DichotomyDistribution } from './components/DichotomyDistribution';
import { DichotomyGallery } from './components/DichotomyGallery';
import { PartitionChooser } from './components/PartitionChooser';
import { PartitionTypesPanel } from './components/PartitionTypesPanel';
import { PartitionCompositionView } from './components/PartitionCompositionView';
import { TetrachotomyView } from './components/TetrachotomyView';
import { OctochotomyView } from './components/OctochotomyView';
import { PoleSelector } from './components/PoleSelector';
import { ViewSelector } from './components/ViewSelector';
import { FormulaPanel } from './components/FormulaPanel';
import { Footer } from './components/Footer';
import { TypeModelDiagram } from './diagrams/TypeModelDiagram';
import {
  clearActiveCell,
  resolveActiveCell,
  togglePinnedCell,
  type ActiveCell,
} from './diagrams/interaction';

// Чтение начального стейта из URL: ?trait=democracy&pole=1&view=2
const App: React.FC = () => {
  const initial = useRef(readInitialAppState()).current;
  const [mode, setMode] = useState(initial.mode);
  const [theme, setTheme] = useState<ThemeMode>(initial.theme);
  const [selectedTraitIndex, setSelectedTraitIndex] = useState(initial.traitIdx);
  const [selectedPoleIndex, setSelectedPoleIndex] = useState(initial.poleIdx);
  const [activeViewIndex, setActiveViewIndex] = useState(initial.viewIdx);
  const [selectedTypeId, setSelectedTypeId] = useState(initial.typeId);
  const [partition, setPartition] = useState<PartitionExplorerState>(initial.partition);
  const [aspectDisplayMode, setAspectDisplayMode] = useState<AspectDisplayMode>('icon');
  const [hoveredCell, setHoveredCell] = useState<ActiveCell>(null);
  const [pinnedCell, setPinnedCell] = useState<ActiveCell>(null);
  const [helpClassId, setHelpClassId] = useState<TraitClass | null>(null);

  const currentTrait = REININ_TRAITS[selectedTraitIndex];
  const currentPole = currentTrait.poles[selectedPoleIndex];
  const currentView = currentPole.views[activeViewIndex] ?? currentPole.views[0];
  const isPartitionMode = mode === 'tetrachotomy' || mode === 'octochotomy';
  const partitionView = selectPartitionExplorerView(partition.traitIds, partition.selectedClassKey);
  const compactCatalog = useMemo(() => (
    mode === 'tetrachotomy' ? selectTetrachotomyCatalog()
      : mode === 'octochotomy' ? selectOctochotomyCatalog() : null
  ), [mode]);
  const compactEntry = compactCatalog?.entries.find(entry => (
    entry.traitIds.length === partition.traitIds.length
    && entry.traitIds.every(traitId => partition.traitIds.includes(traitId))
  ));
  const compactValue = mode === 'type' ? selectedTypeId
    : isPartitionMode ? compactEntry?.key ?? 'custom' : currentTrait.id;
  const compactOptions = mode === 'type'
    ? SOCIONIC_TYPES.map(type => ({ value: type.id, label: type.aliases.socionics?.[0] ?? type.names.ru }))
    : compactCatalog ? compactCatalog.entries.map(entry => ({
      value: entry.key,
      label: `${entry.title}${entry.sourceFormula?.sourceBlocks?.some(block => block.rows.length > 0) ? ' ✓' : ''}`,
    }))
      : REININ_TRAITS.map(trait => ({ value: trait.id, label: trait.name }));

  const handleCompactSelect = (value: string) => {
    if (mode === 'type') {
      const type = SOCIONIC_TYPES.find(candidate => candidate.id === value);
      if (type) setSelectedTypeId(type.id);
    } else if (compactCatalog) {
      const entry = compactCatalog.entries.find(candidate => candidate.key === value);
      if (entry) handleSelectPartitionTraits(entry.traitIds);
    } else {
      const index = REININ_TRAITS.findIndex(trait => trait.id === value);
      if (index >= 0) handleSelectTrait(index);
    }
  };

  const handleSelectMode = (nextMode: AppMode) => {
    const nextKind = getPartitionKindForMode(nextMode);

    setMode(nextMode);
    setPartition(current => (
      current.kind === nextKind ? current : getDefaultPartitionState(nextKind)
    ));
  };

  const handleSelectTrait = (idx: number) => {
    setSelectedTraitIndex(idx);
    setSelectedPoleIndex(getDefaultTraitPoleIndex(REININ_TRAITS[idx]?.id ?? REININ_TRAITS[0].id));
    setActiveViewIndex(0);
  };

  const handleSelectPartitionTraits = (traitIds: PartitionExplorerState['traitIds']) => {
    setPartition(current => ({
      ...current,
      traitIds,
      selectedClassKey: '',
    }));
  };

  // При смене признака — сбрасываем view (но не на самой первой загрузке).
  // При смене полюса того же признака — индекс сохраняем, чтобы удобно сравнивать одну и ту же view на разных полюсах.
  const previousTraitIndex = useRef(selectedTraitIndex);
  useEffect(() => {
    if (previousTraitIndex.current === selectedTraitIndex) {
      return;
    }

    previousTraitIndex.current = selectedTraitIndex;
    setActiveViewIndex(0);
  }, [selectedTraitIndex]);

  // Защита: если у нового полюса views меньше, чем текущий activeViewIndex — clamp.
  useEffect(() => {
    const maxIdx = currentPole.views.length - 1;
    if (activeViewIndex > maxIdx) setActiveViewIndex(Math.max(0, maxIdx));
  }, [currentPole, activeViewIndex]);

  // Синхронизация состояния → URL (replace, без захламления истории).
  useEffect(() => {
    const params = serializeAppUrlState({
      mode,
      theme,
      traitIdx: selectedTraitIndex,
      poleIdx: selectedPoleIndex,
      viewIdx: activeViewIndex,
      typeId: selectedTypeId,
      partition,
    });
    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${newSearch ? '?' + newSearch : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [mode, theme, selectedTraitIndex, selectedPoleIndex, activeViewIndex, selectedTypeId, partition]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      window.localStorage.setItem(getThemeStorageKey(), theme);
    } catch {
      // Ignore unavailable storage; URL state still carries explicit theme.
    }
  }, [theme]);

  // При смене признака/полюса — сбрасываем "пин" клеток.
  useEffect(() => {
    setHoveredCell(clearActiveCell());
    setPinnedCell(clearActiveCell());
  }, [selectedTraitIndex, selectedPoleIndex, activeViewIndex]);

  const Diagram = DIAGRAMS[currentTrait.diagramId ?? DEFAULT_DIAGRAM_ID];
  const activeCell = resolveActiveCell(hoveredCell, pinnedCell);

  return (
    <div
      className="min-h-[100dvh] bg-[var(--color-app-bg)] text-[var(--color-app-fg)] font-sans selection:bg-[var(--color-selection-bg)] selection:text-[var(--color-selection-fg)]"
      data-theme={theme}
      data-aspect-display-mode={aspectDisplayMode}
    >
      <HelpModal classId={helpClassId} onClose={() => setHelpClassId(null)} />

      <div className="ambient-field fixed inset-0 pointer-events-none overflow-hidden motion-reduce:hidden" />
      <div className="grain motion-reduce:hidden" />

      <Header />

      <main className="relative max-w-7xl mx-auto px-4 md:px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <ModeSelector mode={mode} onSelectMode={handleSelectMode} />

        <div className="order-2 lg:order-none lg:col-span-4" data-full-catalog>
          {mode === 'type' ? (
            <TypeSelector
              selectedTypeId={selectedTypeId}
              onSelectType={setSelectedTypeId}
            />
          ) : isPartitionMode ? (
            <PartitionChooser
              kind={partition.kind === 'octochotomy' ? 'octochotomy' : 'tetrachotomy'}
              selectedTraitIds={partition.traitIds}
              onSelectTraitIds={handleSelectPartitionTraits}
            />
          ) : (
            <TraitNav
              selectedTraitIndex={selectedTraitIndex}
              onSelectTrait={handleSelectTrait}
              onShowHelp={setHelpClassId}
            />
          )}
        </div>

        <div className="order-1 lg:order-none lg:col-span-8 space-y-5 md:space-y-6" data-primary-content>
          <label className="shell-panel flex flex-col gap-2 rounded-2xl border p-3 lg:hidden">
            <span className="eyebrow">{mode === 'type' ? 'Тип' : isPartitionMode ? 'Формула' : 'Признак'}</span>
            <select
              className="shell-control min-h-10 w-full rounded-xl border border-[var(--color-shell-border)] px-3 py-2 text-sm text-[var(--color-app-fg)]"
              data-compact-selection={mode}
              value={compactValue}
              onChange={event => handleCompactSelect(event.target.value)}
            >
              {compactValue === 'custom' ? <option value="custom">Выбранная комбинация признаков</option> : null}
              {compactOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          {mode === 'type' ? (
            <TypeModelDiagram
              typeId={selectedTypeId}
              aspectDisplayMode={aspectDisplayMode}
            />
          ) : mode === 'tetrachotomy' ? (
            <TetrachotomyView
              view={partitionView}
              aspectDisplayMode={aspectDisplayMode}
              onSelectClass={(selectedClassKey) => {
                setPartition(current => ({
                  ...current,
                  selectedClassKey,
                }));
              }}
            />
          ) : mode === 'octochotomy' ? (
            <OctochotomyView
              view={partitionView}
              aspectDisplayMode={aspectDisplayMode}
              onSelectClass={(selectedClassKey) => {
                setPartition(current => ({
                  ...current,
                  selectedClassKey,
                }));
              }}
            />
          ) : isPartitionMode ? (
            <PartitionCompositionView
              view={partitionView}
              onSelectClass={(selectedClassKey) => {
                setPartition(current => ({
                  ...current,
                  selectedClassKey,
                }));
              }}
            />
          ) : (
            <section
              className="space-y-5 md:space-y-6"
              data-dichotomy-detail={currentTrait.id}
              data-selected-pole-index={selectedPoleIndex}
            >
              <PoleSelector
                trait={currentTrait}
                selectedPoleIndex={selectedPoleIndex}
                activeView={currentView}
                onSelectPole={setSelectedPoleIndex}
              />

              <ViewSelector
                views={currentPole.views}
                activeViewIndex={activeViewIndex}
                onSelect={setActiveViewIndex}
              />

              <div data-primary-diagram="dichotomy">
                <Diagram
                  trait={currentTrait}
                  pole={currentPole}
                  view={currentView}
                  activeCell={activeCell}
                  onAspectHover={(id) => setHoveredCell(id === null ? null : { kind: 'aspect', id })}
                  onFunctionHover={(id) => setHoveredCell(id === null ? null : { kind: 'function', id })}
                  onAspectClick={(id) => setPinnedCell(current => togglePinnedCell(current, { kind: 'aspect', id }))}
                  onFunctionClick={(id) => setPinnedCell(current => togglePinnedCell(current, { kind: 'function', id }))}
                />
              </div>

              <PartitionTypesPanel
                view={selectDichotomyTypesPanelView(currentTrait.id, selectedPoleIndex as PoleIndex)}
                activeView={currentView}
                aspectDisplayMode={aspectDisplayMode}
              />

              <FormulaPanel trait={currentTrait} view={currentView} />

              <details className="glass-panel rounded-[28px]" data-dichotomy-extra-materials>
                <summary className="cursor-pointer px-5 py-4 text-sm text-[var(--color-app-fg)]">
                  Карта типов и галерея признаков
                </summary>
                <div className="space-y-5 border-t border-[var(--color-shell-border)] p-5">
                  <DichotomyDistribution
                    traitId={currentTrait.id}
                    selectedPoleIndex={selectedPoleIndex as PoleIndex}
                    onSelectPole={setSelectedPoleIndex}
                  />
                  <DichotomyGallery
                    selectedTraitIndex={selectedTraitIndex}
                    onSelectTrait={handleSelectTrait}
                  />
                </div>
              </details>
            </section>
          )}
        </div>

        <details className="glass-panel order-3 rounded-2xl lg:col-span-12" data-display-settings>
          <summary className="cursor-pointer px-5 py-4 text-sm text-[var(--color-app-fg)]">
            Оформление и обозначения
          </summary>
          <div className="grid gap-4 border-t border-[var(--color-shell-border)] p-4 sm:grid-cols-2">
            <AspectDisplayToggle
              mode={aspectDisplayMode}
              onSelectMode={setAspectDisplayMode}
            />
            <ThemeToggle theme={theme} onSelectTheme={setTheme} />
          </div>
        </details>
      </main>

      <Footer />
    </div>
  );
};

export default App;
