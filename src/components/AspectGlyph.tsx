import React from 'react';
import type { AspectId } from '../data/socionics';
import { AspectIcon } from './AspectIcon';

export type AspectDisplayMode = 'icon' | 'symbol' | 'icon-symbol';

interface Props {
  aspectId: AspectId;
  label: string;
  mode: AspectDisplayMode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-7 w-7',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
} as const;

const TEXT_SIZE_CLASSES = {
  sm: 'text-sm',
  md: 'text-[11px]',
  lg: 'text-sm',
} as const;

export const AspectGlyph: React.FC<Props> = ({
  aspectId,
  label,
  mode,
  size = 'md',
}) => {
  if (mode === 'symbol') {
    return (
      <span
        className={`font-bold leading-none tracking-normal ${TEXT_SIZE_CLASSES[size]}`}
        data-aspect-glyph-mode="symbol"
      >
        {label}
      </span>
    );
  }

  if (mode === 'icon-symbol') {
    return (
      <span
        className="flex flex-col items-center gap-1"
        data-aspect-glyph-mode="icon-symbol"
      >
        <AspectIcon aspectId={aspectId} size={size} />
        <span className={`font-bold leading-none tracking-normal ${TEXT_SIZE_CLASSES[size]}`}>
          {label}
        </span>
      </span>
    );
  }

  return <AspectIcon aspectId={aspectId} size={size} glyphMode="icon" />;
};
