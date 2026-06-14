import React, { useState, useEffect, useRef } from 'react';
import { REININ_TRAITS, AspectId, TraitClass } from './data/socionics';
import { readInitialAppState, serializeAppUrlState } from './appState';
import { DIAGRAMS, DEFAULT_DIAGRAM_ID } from './diagrams/registry';
import { HelpModal } from './components/HelpModal';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { TraitNav } from './components/TraitNav';
import { TypeSelector } from './components/TypeSelector';
import { PoleSelector } from './components/PoleSelector';
import { ViewSelector } from './components/ViewSelector';
import { FormulaPanel } from './components/FormulaPanel';
import { Footer } from './components/Footer';
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
  const [selectedTraitIndex, setSelectedTraitIndex] = useState(initial.traitIdx);
  const [selectedPoleIndex, setSelectedPoleIndex] = useState(initial.poleIdx);
  const [activeViewIndex, setActiveViewIndex] = useState(initial.viewIdx);
  const [selectedTypeId, setSelectedTypeId] = useState(initial.typeId);
  const [hoveredCell, setHoveredCell] = useState<ActiveCell>(null);
  const [pinnedCell, setPinnedCell] = useState<ActiveCell>(null);
  const [helpClassId, setHelpClassId] = useState<TraitClass | null>(null);

  const currentTrait = REININ_TRAITS[selectedTraitIndex];
  const currentPole = currentTrait.poles[selectedPoleIndex];
  const currentView = currentPole.views[activeViewIndex] ?? currentPole.views[0];

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
      traitIdx: selectedTraitIndex,
      poleIdx: selectedPoleIndex,
      viewIdx: activeViewIndex,
      typeId: selectedTypeId,
    });
    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${newSearch ? '?' + newSearch : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [mode, selectedTraitIndex, selectedPoleIndex, activeViewIndex, selectedTypeId]);

  // При смене признака/полюса — сбрасываем "пин" клеток.
  useEffect(() => {
    setHoveredCell(clearActiveCell());
    setPinnedCell(clearActiveCell());
  }, [selectedTraitIndex, selectedPoleIndex, activeViewIndex]);

  const Diagram = DIAGRAMS[currentTrait.diagramId ?? DEFAULT_DIAGRAM_ID];
  const activeCell = resolveActiveCell(hoveredCell, pinnedCell);

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <HelpModal classId={helpClassId} onClose={() => setHelpClassId(null)} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden motion-reduce:hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
        <div className="absolute top-[55%] -right-[10%] w-[35%] h-[35%] bg-emerald-100/40 rounded-full blur-[100px]" />
      </div>

      <Header />

      <main className="relative max-w-7xl mx-auto px-4 md:px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <ModeSelector mode={mode} onSelectMode={setMode} />

        <div className="lg:col-span-4">
          {mode === 'type' ? (
            <TypeSelector
              selectedTypeId={selectedTypeId}
              onSelectType={setSelectedTypeId}
            />
          ) : (
            <TraitNav
              selectedTraitIndex={selectedTraitIndex}
              onSelectTrait={(idx) => { setSelectedTraitIndex(idx); setSelectedPoleIndex(0); setActiveViewIndex(0); }}
              onShowHelp={setHelpClassId}
            />
          )}
        </div>

        <div className="lg:col-span-8 space-y-5 md:space-y-6">
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

          <FormulaPanel trait={currentTrait} view={currentView} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
