import React, { useState, useEffect, useRef } from 'react';
import { REININ_TRAITS, AspectId, TraitClass } from './data/socionics';
import { DIAGRAMS, DEFAULT_DIAGRAM_ID } from './diagrams/registry';
import { HelpModal } from './components/HelpModal';
import { Header } from './components/Header';
import { TraitNav } from './components/TraitNav';
import { PoleSelector } from './components/PoleSelector';
import { ViewSelector } from './components/ViewSelector';
import { FormulaPanel } from './components/FormulaPanel';
import { Footer } from './components/Footer';

// Чтение начального стейта из URL: ?trait=democracy&pole=1&view=2
const readInitialState = () => {
  if (typeof window === 'undefined') return { traitIdx: 0, poleIdx: 0, viewIdx: 0 };
  const params = new URLSearchParams(window.location.search);
  const traitId = params.get('trait');
  const traitIdx = traitId ? Math.max(0, REININ_TRAITS.findIndex(t => t.id === traitId)) : 0;
  const trait = REININ_TRAITS[traitIdx] ?? REININ_TRAITS[0];
  const poleIdx = clamp(parseInt(params.get('pole') ?? '0', 10) || 0, 0, trait.poles.length - 1);
  const viewIdx = clamp(parseInt(params.get('view') ?? '0', 10) || 0, 0, trait.poles[poleIdx].views.length - 1);
  return { traitIdx, poleIdx, viewIdx };
};

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

const App: React.FC = () => {
  const initial = useRef(readInitialState()).current;
  const [selectedTraitIndex, setSelectedTraitIndex] = useState(initial.traitIdx);
  const [selectedPoleIndex, setSelectedPoleIndex] = useState(initial.poleIdx);
  const [activeViewIndex, setActiveViewIndex] = useState(initial.viewIdx);
  const [hoveredAspect, setHoveredAspect] = useState<AspectId | null>(null);
  const [hoveredFunction, setHoveredFunction] = useState<number | null>(null);
  const [helpClassId, setHelpClassId] = useState<TraitClass | null>(null);

  const currentTrait = REININ_TRAITS[selectedTraitIndex];
  const currentPole = currentTrait.poles[selectedPoleIndex];
  const currentView = currentPole.views[activeViewIndex] ?? currentPole.views[0];

  // При смене признака — сбрасываем view (но не на самой первой загрузке).
  // При смене полюса того же признака — индекс сохраняем, чтобы удобно сравнивать одну и ту же view на разных полюсах.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setActiveViewIndex(0);
  }, [selectedTraitIndex]);

  // Защита: если у нового полюса views меньше, чем текущий activeViewIndex — clamp.
  useEffect(() => {
    const maxIdx = currentPole.views.length - 1;
    if (activeViewIndex > maxIdx) setActiveViewIndex(Math.max(0, maxIdx));
  }, [currentPole, activeViewIndex]);

  // Синхронизация состояния → URL (replace, без захламления истории).
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('trait', currentTrait.id);
    if (selectedPoleIndex !== 0) params.set('pole', String(selectedPoleIndex));
    if (activeViewIndex !== 0) params.set('view', String(activeViewIndex));
    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${newSearch ? '?' + newSearch : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [currentTrait.id, selectedPoleIndex, activeViewIndex]);

  // При смене признака/полюса — сбрасываем "пин" клеток.
  useEffect(() => {
    setHoveredAspect(null);
    setHoveredFunction(null);
  }, [selectedTraitIndex, selectedPoleIndex, activeViewIndex]);

  const Diagram = DIAGRAMS[currentTrait.diagramId ?? DEFAULT_DIAGRAM_ID];

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <HelpModal classId={helpClassId} onClose={() => setHelpClassId(null)} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden motion-reduce:hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
        <div className="absolute top-[55%] -right-[10%] w-[35%] h-[35%] bg-emerald-100/40 rounded-full blur-[100px]" />
      </div>

      <Header />

      <main className="relative max-w-7xl mx-auto px-4 md:px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-4">
          <TraitNav
            selectedTraitIndex={selectedTraitIndex}
            onSelectTrait={(idx) => { setSelectedTraitIndex(idx); setSelectedPoleIndex(0); }}
            onShowHelp={setHelpClassId}
          />
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
            hoveredAspect={hoveredAspect}
            setHoveredAspect={setHoveredAspect}
            hoveredFunction={hoveredFunction}
            setHoveredFunction={setHoveredFunction}
          />

          <FormulaPanel trait={currentTrait} view={currentView} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
