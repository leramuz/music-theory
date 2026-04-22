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
  onNoteClick?: (_payload: NoteClickPayload) => void;
  onStaveClick?: (_payload: StaveClickPayload) => void;
}

export function MusicSheet({
  timeSignature = SHEET_DEFAULT_CONFIG.timeSignature,
  keySignature = SHEET_DEFAULT_CONFIG.keySignature,
  measures = SHEET_DEFAULT_CONFIG.measures,
  onNoteClick,
  onStaveClick,
}: MusicSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = containerRef.current!;
    div.innerHTML = '';

    const layout = layoutSheet(measures);

    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(layout.width, layout.height);

    const context = renderer.getContext();

    const { allStaveMeta } = renderSheet(context, layout, measures, timeSignature, keySignature);

    const svgEl = div.querySelector('svg')!;
    if (!svgEl) return;

    const cleanup = attachInteractions(svgEl, allStaveMeta, {
      onNoteClick,
      onStaveClick,
    });

    return cleanup;
  }, [measures, timeSignature, keySignature, onNoteClick, onStaveClick]);

  return <div ref={containerRef} />;
}
