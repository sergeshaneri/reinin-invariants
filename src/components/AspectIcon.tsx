import React from 'react';
import { getAspectVisual, type AspectIconKey } from '../data/aspectVisuals';
import type { AspectId } from '../data/socionics';

type AspectIconShape = React.FC<{
  fill: string;
  stroke: string;
  strokeWidth: number;
}>;

const TriangleIcon: AspectIconShape = ({ fill, stroke, strokeWidth }) => (
  <path d="M12 3.5 21 20H3L12 3.5Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
);

const CircleIcon: AspectIconShape = ({ fill, stroke, strokeWidth }) => (
  <circle cx="12" cy="12" r="8.2" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
);

const SquareIcon: AspectIconShape = ({ fill, stroke, strokeWidth }) => (
  <rect x="5" y="5" width="14" height="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
);

const AngleIcon: AspectIconShape = ({ fill, stroke, strokeWidth }) => (
  <path d="M5 4.5H11.5V12.5H19V19H5V4.5Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="miter" />
);

export const ASPECT_ICON_REGISTRY: Record<AspectIconKey, AspectIconShape> = {
  triangle: TriangleIcon,
  circle: CircleIcon,
  square: SquareIcon,
  angle: AngleIcon,
};

interface Props {
  aspectId: AspectId;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  glyphMode?: 'icon' | 'icon-symbol';
}

const SIZE_CLASSES = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-7 w-7',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
} as const;

export const AspectIcon: React.FC<Props> = ({
  aspectId,
  size = 'md',
  className = '',
  glyphMode,
}) => {
  const { iconKey, isFilled } = getAspectVisual(aspectId);
  const Icon = ASPECT_ICON_REGISTRY[iconKey];
  const fill = isFilled ? 'currentColor' : 'none';
  const stroke = 'currentColor';
  const strokeWidth = size === 'sm' || size === 'xs' ? 2.1 : 1.9;

  return (
    <svg
      viewBox="0 0 24 24"
      className={`${SIZE_CLASSES[size]} ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
      data-aspect-glyph-mode={glyphMode}
      data-aspect-icon-key={iconKey}
      data-aspect-icon-filled={isFilled ? 'true' : 'false'}
    >
      <Icon fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
};
