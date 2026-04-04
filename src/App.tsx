
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, ChevronRight, Layers, Grid, RefreshCw, Hexagon, Sparkles, Zap, Activity, ArrowRight, X } from 'lucide-react';
import { ASPECTS, FUNCTIONS, REININ_TRAITS, AspectId } from './data/socionics';

const App: React.FC = () => {
  const [selectedTraitIndex, setSelectedTraitIndex] = useState(0);
  const [selectedPoleIndex, setSelectedPoleIndex] = useState(0);
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const [hoveredAspect, setHoveredAspect] = useState<AspectId | null>(null);
  const [hoveredFunction, setHoveredFunction] = useState<number | null>(null);
  const [showHelpModal, setShowHelpModal] = useState<number | null>(null);

  const currentTrait = REININ_TRAITS[selectedTraitIndex];
  const currentPole = currentTrait.poles[selectedPoleIndex];

  // Reset view index when trait changes
  React.useEffect(() => {
    setActiveViewIndex(0);
  }, [selectedTraitIndex]);

  const activeMappings = useMemo(() => {
    if (currentPole.views) {
      const view = currentPole.views[activeViewIndex] || currentPole.views[0];
      return view.mappings;
    }
    return currentPole.mapping || [];
  }, [currentPole, activeViewIndex]);

  const isAspectActive = (aspectId: AspectId) => {
    if (hoveredFunction !== null) {
      const mapping = activeMappings.find(m => m.functions.includes(hoveredFunction));
      return mapping?.aspects.includes(aspectId);
    }
    return activeMappings.some(m => m.aspects.includes(aspectId));
  };

  const isFunctionActive = (funcId: number) => {
    if (hoveredAspect !== null) {
      const mapping = activeMappings.find(m => m.aspects.includes(hoveredAspect));
      return mapping?.functions.includes(funcId);
    }
    return activeMappings.some(m => m.functions.includes(funcId));
  };

  const getMappingColor = (id: string | number, type: 'aspect' | 'function') => {
    const mappingIndex = activeMappings.findIndex(m => 
      type === 'aspect' ? m.aspects.includes(id as AspectId) : m.functions.includes(id as number)
    );
    if (mappingIndex === -1) return 'bg-slate-50 text-slate-300 border-slate-100';
    
    const colors = [
      'bg-blue-600 text-white border-blue-700 shadow-blue-200',
      'bg-green-600 text-white border-green-700 shadow-green-200',
      'bg-red-600 text-white border-red-700 shadow-red-200',
      'bg-amber-600 text-white border-amber-700 shadow-amber-200',
    ];
    return `${colors[mappingIndex % colors.length]} shadow-lg`;
  };

  const traitGroups = [
    { 
      id: 1, 
      title: '1 Класс (4→4)', 
      description: 'Инварианты, сохраняющие 4 свойства аспектов в 4 свойствах функций.',
      help: 'В этом классе каждый полюс дихотомии определяет жесткое соответствие между набором из 4 аспектов и набором из 4 функций. Например, Экстраверсия требует, чтобы экстравертные аспекты попадали в экстравертные функции.',
      traits: REININ_TRAITS.filter(t => t.class === 1) 
    },
    { 
      id: 2, 
      title: '2 Класс (2→4)', 
      description: 'Инварианты, сохраняющие пары аспектов в четверках функций.',
      help: 'Здесь инвариантом является пара аспектов (например, ЧИ+БС), которая должна попадать в определенную четверку функций (например, Оценочные). Это более структурные инварианты.',
      traits: REININ_TRAITS.filter(t => t.class === 2) 
    },
    { 
      id: 3, 
      title: '3 Класс (Порядкозависимые)', 
      description: 'Инварианты, основанные на эквивалентностях и циклах.',
      help: 'Самый сложный класс. Здесь важны не просто группы, а отношения между ними. Для Демократии/Аристократии это эквивалентность характеристик. Для Процесса/Результата — это циклический порядок обхода функций информацией.',
      traits: REININ_TRAITS.filter(t => t.class === 3) 
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      {/* Help Modals */}
      <AnimatePresence>
        {showHelpModal !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">{traitGroups.find(g => g.id === showHelpModal)?.title}</h3>
                <button 
                  onClick={() => setShowHelpModal(null)}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <RefreshCw className="w-5 h-5 text-slate-400 rotate-45" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  {traitGroups.find(g => g.id === showHelpModal)?.help}
                </p>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Принцип</h4>
                  <p className="text-xs text-blue-900/60 font-medium">
                    {traitGroups.find(g => g.id === showHelpModal)?.description}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setShowHelpModal(null)}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-slate-200"
                >
                  Понятно
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute top-[60%] -right-[10%] w-[35%] h-[35%] bg-emerald-50 rounded-full blur-[100px] opacity-50" />
      </div>

      <header className="relative max-w-7xl mx-auto pt-12 pb-8 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 mb-6"
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Соционика & Алгебра</span>
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-4">
          Инварианты <span className="text-blue-600">АРП</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Интерактивная визуализация дихотомических инвариантов признаков Рейнина 
          в структуре модели А по теории Чурюмова.
        </p>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Navigation */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                Признаки
              </h2>
            </div>
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {traitGroups.map((group) => (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{group.title}</h3>
                    <button 
                      onClick={() => setShowHelpModal(group.id)}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Info className="w-3 h-3 text-slate-300" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {group.traits.map((trait) => {
                      const globalIndex = REININ_TRAITS.findIndex(t => t.id === trait.id);
                      const isActive = selectedTraitIndex === globalIndex;
                      return (
                        <button
                          key={trait.id}
                          onClick={() => {
                            setSelectedTraitIndex(globalIndex);
                            setSelectedPoleIndex(0);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                            isActive 
                              ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                              : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <div className="relative z-10 flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-400' : 'bg-slate-200'}`} />
                            <span className="text-xs font-bold truncate">{trait.name}</span>
                          </div>
                          <ChevronRight className={`w-3 h-3 relative z-10 transition-transform ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Panel: Visualization */}
        <div className="lg:col-span-8 space-y-8">
          {/* Pole Selector (Moved here) */}
          <section className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-xl shadow-slate-200/50 border border-white p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-full md:w-1/3">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 text-emerald-500" />
                  Выберите Полюс
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {currentTrait.poles.map((pole, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPoleIndex(idx)}
                      className={`px-4 py-3 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest border-2 ${
                        selectedPoleIndex === idx
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                          : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                      }`}
                    >
                      {pole.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <motion.div 
                  key={`${selectedTraitIndex}-${selectedPoleIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                    "{currentPole.description}"
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
          {/* View Selector for Class 3 */}
          {currentTrait.class === 3 && currentPole.views && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-[32px] border border-white"
            >
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Выберите тетрахотомию (вид)</h4>
              <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                {currentPole.views.map((view, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveViewIndex(idx)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                      activeViewIndex === idx 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {view.title}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-white p-10 relative">
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-16">
              {/* Aspecton */}
              <div className="w-full md:w-1/2">
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="h-px flex-1 bg-slate-100" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Аспектон</h3>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {ASPECTS.map((aspect) => (
                    <motion.div
                      key={aspect.id}
                      onMouseEnter={() => setHoveredAspect(aspect.id)}
                      onMouseLeave={() => setHoveredAspect(null)}
                      className={`
                        relative h-20 rounded-xl border-2 flex items-center justify-center cursor-default transition-all duration-500
                        ${getMappingColor(aspect.id, 'aspect')}
                        ${hoveredFunction !== null && !isAspectActive(aspect.id) ? 'opacity-10 grayscale scale-90' : 'opacity-100 scale-100'}
                        ${hoveredAspect === aspect.id ? 'ring-8 ring-blue-50 z-10' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-black">{aspect.name}</span>
                      </div>
                      <div className="absolute top-1 right-1">
                         <div className={`w-2 h-2 rounded-full border ${aspect.isExtra ? 'bg-white border-white' : 'bg-transparent border-white/40'}`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Connection */}
              <div className="flex flex-row md:flex-col items-center justify-center gap-6">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Functionon */}
              <div className="w-full md:w-1/3">
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="h-px flex-1 bg-slate-100" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Функцион</h3>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-3 relative">
                  {[1, 2, 4, 3, 6, 5, 7, 8].map((fId) => {
                    const func = FUNCTIONS.find(f => f.id === fId)!;
                    return (
                      <motion.div
                        key={func.id}
                        onMouseEnter={() => setHoveredFunction(func.id)}
                        onMouseLeave={() => setHoveredFunction(null)}
                        className={`
                          relative h-16 rounded-xl border-2 flex flex-col items-center justify-center cursor-default transition-all duration-500
                          ${getMappingColor(func.id, 'function')}
                          ${hoveredAspect !== null && !isFunctionActive(func.id) ? 'opacity-10 grayscale scale-90' : 'opacity-100 scale-100'}
                          ${hoveredFunction === func.id ? 'ring-8 ring-blue-50 z-10' : ''}
                        `}
                      >
                        <span className="text-2xl font-black leading-none">{func.id}</span>
                        <span className="text-[8px] uppercase font-black mt-1 opacity-70 tracking-widest">{func.name}</span>
                      </motion.div>
                    );
                  })}

                  {/* Process/Result Arrows Overlay */}
                  {currentTrait.id === 'process' && (
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
                          </marker>
                        </defs>
                        
                        <g filter="url(#glow)">
                          {/* Mental Ring: 1 -> 2 -> 3 -> 4 -> 1 */}
                          <motion.path 
                            d="M 80 40 L 120 40" 
                            stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                          />
                          <motion.path 
                            d="M 150 70 L 150 110" 
                            stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 1 }}
                          />
                          <motion.path 
                            d="M 120 140 L 80 140" 
                            stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 1, repeat: Infinity, repeatDelay: 1 }}
                          />
                          <motion.path 
                            d="M 50 110 L 50 70" 
                            stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatDelay: 1 }}
                          />

                          {/* Vital Ring: 5 -> 6 -> 7 -> 8 -> 5 */}
                          <motion.path 
                            d="M 120 240 L 80 240" 
                            stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                          />
                          <motion.path 
                            d="M 50 270 L 50 310" 
                            stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 1 }}
                          />
                          <motion.path 
                            d="M 80 340 L 120 340" 
                            stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 1, repeat: Infinity, repeatDelay: 1 }}
                          />
                          <motion.path 
                            d="M 150 310 L 150 270" 
                            stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatDelay: 1 }}
                          />
                        </g>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="group p-6 bg-slate-50 rounded-[32px] border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-100">
                     <Info className="w-5 h-5" />
                   </div>
                   <h4 className="font-bold text-slate-800">Инвариант</h4>
                 </div>
                 <p className="text-sm text-slate-500 leading-relaxed">
                   Признак Рейнина — это не просто ярлык, а <strong>алгебраический инвариант</strong>. 
                   Он определяет неизменные свойства отображения аспектов в функции для половины социона.
                 </p>
               </div>
               <div className="group p-6 bg-slate-50 rounded-[32px] border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100">
                     <Grid className="w-5 h-5" />
                   </div>
                   <h4 className="font-bold text-slate-800">Структура</h4>
                 </div>
                 <p className="text-sm text-slate-500 leading-relaxed">
                   Этот признак относится к <strong>классу {currentTrait.class}</strong>. 
                   {currentTrait.class === 1 && " Он распределяет тетрады аспектов по кольцам функций 4х4."}
                   {currentTrait.class === 2 && " Он распределяет диады апектов по кольцам функций 2х4."}
                   {currentTrait.class === 3 && " Это сложный инвариант, требующий учета эквивалентностей и циклического порядка."}
                 </p>
               </div>
            </div>
          </div>

          {/* Formula Display */}
          <motion.section 
            key={`${currentTrait.id}-${activeViewIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            
            <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
              <div className="w-3 h-10 bg-blue-500 rounded-full" />
              {currentTrait.class === 3 ? 'Алгебраические эквивалентности' : 'Алгебраическая формула'}
            </h3>
            
            <div className="grid gap-4">
              {activeMappings.map((m, idx) => (
                <div key={idx} className="group flex flex-wrap items-center gap-6 bg-white/5 hover:bg-white/10 p-6 rounded-[28px] border border-white/5 transition-all">
                  <div className="flex flex-col gap-2">
                    {m.label && (
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                        {m.label}
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-black text-blue-400 border border-blue-500/30">
                        {idx + 1}
                      </div>
                      <div className="flex gap-2">
                        {m.aspects.map(aId => {
                          const a = ASPECTS.find(asp => asp.id === aId);
                          return (
                            <span key={aId} className="px-4 py-2 bg-slate-800 rounded-xl font-mono text-blue-400 font-black text-sm border border-slate-700 group-hover:border-blue-500/30 transition-colors">
                              {a?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="w-8 h-px bg-current" />
                    <ChevronRight className="w-5 h-5" />
                    <div className="w-8 h-px bg-current" />
                  </div>

                  <div className="flex gap-2 items-center">
                    {m.functions.map((fId, fIdx) => (
                      <React.Fragment key={fId}>
                        <span className="px-4 py-2 bg-slate-800 rounded-xl font-mono text-emerald-400 font-black text-sm border border-slate-700 group-hover:border-emerald-500/30 transition-colors">
                          {fId}
                        </span>
                        {currentTrait.id === 'process' && fIdx < m.functions.length - 1 && (
                          <span className="text-slate-700 font-bold">~</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {currentTrait.id === 'process' && (
              <div className="mt-8 p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  * Для признака Процесс/Результат инвариант задает циклический порядок обхода полутактов (1-7, 2-8, 3-5, 4-6) относительно макроаспектов.
                </p>
              </div>
            )}
          </motion.section>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Hexagon className="w-4 h-4 text-blue-500" />
          <span>Socionics Invariants Engine v1.0</span>
        </div>
        <p>© 2026 Теория Чурюмова • Матрицы Адамара • Модель А</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
};

export default App;
