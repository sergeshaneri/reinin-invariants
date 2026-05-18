import React from 'react';
import { Hexagon } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="max-w-7xl mx-auto px-6 py-10 mt-8 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-5">
    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium tracking-wide">
      <Hexagon className="w-4 h-4 text-indigo-500" strokeWidth={2} />
      <span>Автор: Сергей Шанэри</span>
    </div>
    <div className="flex items-center gap-3 text-xs">
      <span className="text-slate-400 font-medium">Написать автору:</span>
      <a
        href="https://vk.ru/shaneri"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 bg-[#0077FF] hover:bg-[#005FCC] text-white font-semibold rounded-lg transition-colors"
      >
        VK
      </a>
      <a
        href="https://t.me/SergeyShaneri"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors"
      >
        Telegram
      </a>
    </div>
  </footer>
);
