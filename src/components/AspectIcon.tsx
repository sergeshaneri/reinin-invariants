import React from 'react';
import { getAspectVisual, type AspectIconKey } from '../data/aspectVisuals';
import type { AspectId } from '../data/socionics';

type AspectIconShape = React.FC<{
  fill: string;
  stroke: string;
  strokeWidth: number;
  layer: 'contrast' | 'shape';
}>;

const TriangleIcon: AspectIconShape = ({ fill, stroke, strokeWidth, layer }) => (
  <path d="M12 3.5 21 20H3L12 3.5Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" data-aspect-icon-layer={layer} />
);

const CircleIcon: AspectIconShape = ({ fill, stroke, strokeWidth, layer }) => (
  <circle cx="12" cy="12" r="8.2" fill={fill} stroke={stroke} strokeWidth={strokeWidth} data-aspect-icon-layer={layer} />
);

const SquareIcon: AspectIconShape = ({ fill, stroke, strokeWidth, layer }) => (
  <rect x="5" y="5" width="14" height="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} data-aspect-icon-layer={layer} />
);

const AngleIcon: AspectIconShape = ({ fill, stroke, strokeWidth, layer }) => (
  <path d="M5 4.5H11.5V12.5H19V19H5V4.5Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="miter" data-aspect-icon-layer={layer} />
);

export const ASPECT_ICON_REGISTRY: Record<AspectIconKey, AspectIconShape> = {
  triangle: TriangleIcon,
  circle: CircleIcon,
  square: SquareIcon,
  angle: AngleIcon,
};

interface Props {
  aspectId: AspectId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glyphMode?: 'icon' | 'icon-symbol';
}

const SIZE_CLASSES = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-7 w-7',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
  xl: 'h-10 w-10',
} as const;

const BLACK_ASPECT_CONTRAST_STROKE = '#f7f4ec';

export const AspectIcon: React.FC<Props> = ({
  aspectId,
  size = 'md',
  className = '',
  glyphMode,
}) => {
  const { iconKey, isFilled } = getAspectVisual(aspectId);
  const Icon = ASPECT_ICON_REGISTRY[iconKey];
  const fill = isFilled ? '#050505' : '#ffffff';
  const stroke = '#050505';
  const strokeWidth = size === 'sm' || size === 'xs' ? 2.1 : 1.9;

  return (
    <svg
      viewBox="0 0 24 24"
      className={`${SIZE_CLASSES[size]} ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
      data-aspect-glyph-mode={glyphMode}
      data-aspect-icon-size={size}
      data-aspect-icon-key={iconKey}
      data-aspect-icon-filled={isFilled ? 'true' : 'false'}
    >
      {isFilled ? (
        <Icon
          fill="none"
          stroke={BLACK_ASPECT_CONTRAST_STROKE}
          strokeWidth={strokeWidth + 1.9}
          layer="contrast"
        />
      ) : null}
      <Icon fill={fill} stroke={stroke} strokeWidth={strokeWidth} layer="shape" />
    </svg>
  );
};
