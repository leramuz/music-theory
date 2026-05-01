import { useEffect, useRef } from 'react';
import { Renderer } from 'vexflow';
import {
  KeySignature,
  MeasureConfig,
  NoteClickPayload,
  StaveClickPayload,
  TimeSignature,
} from '@/types/music-sheet';
import { SHEET_DEFAULT_CONFIG } from '@/components/music-sheet/config';
import { attachInteractions } from '@/components/music-sheet/interactions';
import { renderSheet } from '@/components/music-sheet/render';
import { layoutSheet } from '@/components/music-sheet/sheet-layout';

interface MusicSheetProps {
  timeSignature?: TimeSignature;
  keySignature?: KeySignature;
  measures?: MeasureConfig[];
  measureWidth?: number;
  disableNoteHighlight?: boolean;
  disableInteractions?: boolean;
  onNoteClick?: (_payload: NoteClickPayload) => void;
  onStaveClick?: (_payload: StaveClickPayload) => void;
  isValidStavePosition?: (_noteKey: string) => boolean;
}

export function MusicSheet({
  timeSignature = SHEET_DEFAULT_CONFIG.timeSignature,
  keySignature = SHEET_DEFAULT_CONFIG.keySignature,
  measures = SHEET_DEFAULT_CONFIG.measures,
  measureWidth = SHEET_DEFAULT_CONFIG.measureWidth,
  onNoteClick,
  onStaveClick,
  isValidStavePosition,
  disableNoteHighlight = false,
  disableInteractions = false,
}: MusicSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = containerRef.current!;
    div.innerHTML = '';

    const layout = layoutSheet(measures, measureWidth);

    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(layout.width, layout.height);

    const context = renderer.getContext();

    const { allStaveMeta } = renderSheet(context, layout, measures, timeSignature, keySignature);

    const svgEl = div.querySelector('svg')!;
    if (!svgEl) return;

    if (disableInteractions) return;

    const cleanup = attachInteractions(svgEl, allStaveMeta, disableNoteHighlight, {
      onNoteClick,
      onStaveClick,
      isValidStavePosition,
    });

    return cleanup;
  }, [
    measures,
    measureWidth,
    timeSignature,
    keySignature,
    onNoteClick,
    onStaveClick,
    isValidStavePosition,
    disableNoteHighlight,
    disableInteractions,
  ]);

  return <div ref={containerRef} />;
}
