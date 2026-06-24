import type { AspectId } from './socionics';

export type AspectIconKey = 'triangle' | 'circle' | 'square' | 'angle';

export interface AspectVisualMetadata {
  aspectId: AspectId;
  iconKey: AspectIconKey;
  isFilled: boolean;
}

export const ASPECT_VISUALS = [
  { aspectId: 'Ne', iconKey: 'triangle', isFilled: true },
  { aspectId: 'Si', iconKey: 'circle', isFilled: false },
  { aspectId: 'Fe', iconKey: 'angle', isFilled: true },
  { aspectId: 'Ti', iconKey: 'square', isFilled: false },
  { aspectId: 'Te', iconKey: 'square', isFilled: true },
  { aspectId: 'Fi', iconKey: 'angle', isFilled: false },
  { aspectId: 'Se', iconKey: 'circle', isFilled: true },
  { aspectId: 'Ni', iconKey: 'triangle', isFilled: false },
] as const satisfies readonly AspectVisualMetadata[];

export const ASPECT_VISUAL_BY_ID = Object.freeze(
  Object.fromEntries(
    ASPECT_VISUALS.map(visual => [visual.aspectId, visual]),
  ) as Record<AspectId, AspectVisualMetadata>,
);

export function getAspectVisual(aspectId: AspectId): AspectVisualMetadata {
  return ASPECT_VISUAL_BY_ID[aspectId];
}
