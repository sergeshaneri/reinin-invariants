import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, Play, FileText, Youtube } from 'lucide-react';

export const Header: React.FC = () => {
  const [showMaterials, setShowMaterials] = useState(true);

  return (
    <header className="relative max-w-7xl mx-auto pt-16 pb-10 px-6">
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-200/80 mb-5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Соционика &nbsp;·&nbsp; Алгебра</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter leading-[1.05] text-slate-900">
            Инварианты <span className="text-indigo-600">Признаков Рейнина</span>
          </h1>
          <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed max-w-[60ch]">
            Визуализация связи Признаков Рейнина и Модели А. У каждого Признака Рейнина есть что-то неизменное — <em className="not-italic text-slate-900 font-medium">инвариант</em>. Это приложение показывает инварианты Признаков Рейнина в модели А через Признаки Аспектов и Признаки Функций (какие аспекты должны быть в каких функциях?).
          </p>
        </div>

        <div className="md:col-span-5">
          <button
            onClick={() => setShowMaterials(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-slate-700 text-sm font-semibold"
          >
            <span>Дополнительные материалы</span>
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ${showMaterials ? 'rotate-90' : ''}`}
              strokeWidth={2}
            />
          </button>
          <AnimatePresence initial={false}>
            {showMaterials && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm divide-y divide-slate-100">
                  <MaterialRow label="Короткое видео">
                    <PlatformLink href="https://youtu.be/dXDux60OmZA" tone="youtube" icon={<Youtube className="w-3.5 h-3.5" strokeWidth={2} />}>YouTube</PlatformLink>
                    <PlatformLink href="https://vkvideo.ru/video-113543027_456239035" tone="vk" icon={<Play className="w-3.5 h-3.5 fill-current" strokeWidth={0} />}>VK Видео</PlatformLink>
                  </MaterialRow>
                  <MaterialRow label="Видео доклад">
                    <PlatformLink href="https://youtu.be/oNWFrTR41I8" tone="youtube" icon={<Youtube className="w-3.5 h-3.5" strokeWidth={2} />}>YouTube</PlatformLink>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg cursor-default">
                      VK — скоро
                    </span>
                  </MaterialRow>
                  <MaterialRow label="Подробная статья">
                    <PlatformLink href="https://docs.google.com/document/d/1CC0iXXkO6AgrfVJJ3F8R9J50OInLMnpntEvCC-czMrs/edit?tab=t.0" tone="dark" icon={<FileText className="w-3.5 h-3.5" strokeWidth={2} />}>Google Docs</PlatformLink>
                  </MaterialRow>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const MaterialRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between gap-3 p-4">
    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
    <div className="flex flex-wrap items-center gap-2 justify-end">{children}</div>
  </div>
);

const TONE_CLASSES: Record<'youtube' | 'vk' | 'dark', string> = {
  youtube: 'bg-red-600 hover:bg-red-700 text-white',
  vk: 'bg-[#0077FF] hover:bg-[#005FCC] text-white',
  dark: 'bg-slate-900 hover:bg-slate-800 text-white',
};

const PlatformLink: React.FC<{ href: string; tone: keyof typeof TONE_CLASSES; icon: React.ReactNode; children: React.ReactNode }> = ({ href, tone, icon, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${TONE_CLASSES[tone]}`}
  >
    {icon}
    {children}
  </a>
);
