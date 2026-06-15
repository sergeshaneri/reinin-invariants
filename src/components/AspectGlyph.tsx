import React from 'react';
import type { AspectId } from '../data/socionics';

export type AspectDisplayMode = 'icon' | 'abbrev';

const ASPECT_SHAPES: Record<AspectId, 'triangle' | 'circle' | 'square' | 'angle'> = {
  Ne: 'triangle',
  Ni: 'triangle',
  Se: 'circle',
  Si: 'circle',
  Te: 'square',
  Ti: 'square',
  Fe: 'angle',
  Fi: 'angle',
};

const FILLED_ASPECTS = new Set<AspectId>(['Ne', 'Se', 'Te', 'Fe']);

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
  if (mode === 'abbrev') {
    return (
      <span
        className={`font-bold leading-none tracking-normal ${TEXT_SIZE_CLASSES[size]}`}
        data-aspect-glyph-mode="abbrev"
      >
        {label}
      </span>
    );
  }

  const shape = ASPECT_SHAPES[aspectId];
  const isFilled = FILLED_ASPECTS.has(aspectId);
  const fill = isFilled ? 'currentColor' : 'none';
  const stroke = 'currentColor';
  const strokeWidth = size === 'sm' ? 2.1 : 1.9;

  return (
    <svg
      viewBox="0 0 24 24"
      className={SIZE_CLASSES[size]}
      aria-hidden="true"
      focusable="false"
      data-aspect-glyph-mode="icon"
    >
      {shape === 'triangle' ? (
        <path d="M12 3.5 21 20H3L12 3.5Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      ) : null}
      {shape === 'circle' ? (
        <circle cx="12" cy="12" r="8.2" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      ) : null}
      {shape === 'square' ? (
        <rect x="5" y="5" width="14" height="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      ) : null}
      {shape === 'angle' ? (
        <path d="M5 4.5H11.5V12.5H19V19H5V4.5Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="miter" />
      ) : null}
    </svg>
  );
};
