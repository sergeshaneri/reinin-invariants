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
            className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] px-3 py-1.5 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
            <span className="eyebrow">Соционика &nbsp;·&nbsp; Алгебра</span>
          </motion.div>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-normal text-[var(--color-app-fg)] md:text-5xl">
            Инварианты <span className="text-[var(--color-shell-accent)]">Признаков Рейнина</span>
          </h1>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-[var(--color-shell-muted)] md:text-lg">
            Визуализация связи Признаков Рейнина и Модели А. У каждого Признака Рейнина есть что-то неизменное: <em className="not-italic font-medium text-[var(--color-app-fg)]">инвариант</em>. Это приложение показывает инварианты Признаков Рейнина в модели А через Признаки Аспектов и Признаки Функций (какие аспекты должны быть в каких функциях?).
          </p>
        </div>

        <div className="md:col-span-5">
          <button
            onClick={() => setShowMaterials(v => !v)}
            className="flex w-full items-center justify-between rounded-2xl border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] px-4 py-3 text-sm font-semibold text-[var(--color-shell-muted)] shadow-sm transition-all hover:border-[var(--color-shell-border-strong)] hover:text-[var(--color-shell-hover-fg)]"
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
                <div className="glass-panel mt-2 divide-y divide-[var(--color-shell-border)] rounded-2xl">
                  <MaterialRow label="Короткое видео">
                    <PlatformLink href="https://youtu.be/dXDux60OmZA" tone="youtube" icon={<Youtube className="w-3.5 h-3.5" strokeWidth={2} />}>YouTube</PlatformLink>
                    <PlatformLink href="https://vkvideo.ru/video-113543027_456239035" tone="vk" icon={<Play className="w-3.5 h-3.5 fill-current" strokeWidth={0} />}>VK Видео</PlatformLink>
                  </MaterialRow>
                  <MaterialRow label="Видео доклад">
                    <PlatformLink href="https://youtu.be/oNWFrTR41I8" tone="youtube" icon={<Youtube className="w-3.5 h-3.5" strokeWidth={2} />}>YouTube</PlatformLink>
                    <span className="inline-flex cursor-default items-center gap-1.5 rounded-lg bg-[var(--color-shell-control)] px-3 py-1.5 text-xs font-semibold text-[var(--color-shell-subtle)]">
                      VK: скоро
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
    <span className="eyebrow">{label}</span>
    <div className="flex flex-wrap items-center gap-2 justify-end">{children}</div>
  </div>
);

const TONE_CLASSES: Record<'youtube' | 'vk' | 'dark', string> = {
  youtube: 'bg-red-600 hover:bg-red-700 text-white',
  vk: 'bg-[#0077FF] hover:bg-[#005FCC] text-white',
  dark: 'bg-[var(--color-shell-active-bg)] hover:opacity-90 text-[var(--color-shell-active-fg)]',
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
