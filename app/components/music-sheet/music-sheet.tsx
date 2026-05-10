import { useEffect, useRef } from 'react';
import { Renderer } from 'vexflow';
import { TimeSignature } from '@/types/time-signature';
import { Key } from '@/types/key';
import { MeasureConfig, NoteClickPayload, StaveClickPayload } from '@/types/music-sheet';
import { SHEET_DEFAULT_CONFIG } from '@/components/music-sheet/config';
import { attachInteractions } from '@/components/music-sheet/interactions';
import { renderSheet } from '@/components/music-sheet/render';
import { layoutSheet } from '@/components/music-sheet/sheet-layout';

interface MusicSheetProps {
  timeSignature?: TimeSignature;
  musicalKey?: Key | null;
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
  musicalKey = SHEET_DEFAULT_CONFIG.keySignature,
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

    const { allStaveMeta } = renderSheet(context, layout, measures, timeSignature, musicalKey);

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
    musicalKey,
    onNoteClick,
    onStaveClick,
    isValidStavePosition,
    disableNoteHighlight,
    disableInteractions,
  ]);

  return <div ref={containerRef} />;
}
