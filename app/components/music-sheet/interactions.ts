import { Stave } from 'vexflow';
import { Clef, StaveClickPayload, NoteClickPayload } from '@/types/music-sheet';
import { CLEF_NOTE_MAPS, CLEF_TOP_LINE_OFFSET } from '@/components/music-sheet/config';

export function attachInteractions(
  svgEl: SVGSVGElement,
  allStaveMeta: {
    vfStave: Stave;
    clef: Clef;
    staveIndex: number;
    measureIndex: number;
  }[],
  callbacks: {
    onNoteClick?: (_payload: NoteClickPayload) => void;
    onStaveClick?: (_payload: StaveClickPayload) => void;
  },
) {
  const { onNoteClick, onStaveClick } = callbacks;

  svgEl.style.pointerEvents = 'auto';
  svgEl.style.cursor = 'pointer';

  const highlight = createHighlight(svgEl);

  const handleClick = (e: MouseEvent) => {
    const notePayload = getNotePayload(e.target as Element);

    if (notePayload) {
      e.stopPropagation();
      onNoteClick?.(notePayload);
      return;
    }

    const stavePayload = getStaveClickPayload(e, svgEl, allStaveMeta);
    if (stavePayload) {
      onStaveClick?.(stavePayload);
    }
  };

  const handleHover = (e: MouseEvent) => {
    const noteEl = (e.target as Element).closest('.vf-stavenote') as SVGElement | null;
    if (!noteEl) return;

    noteEl.style.filter =
      'drop-shadow(0 0 4px rgba(99,102,241,0.9)) brightness(0.4) sepia(1) saturate(5) hue-rotate(200deg)';
  };

  const handleHoverOut = (e: MouseEvent) => {
    const noteEl = (e.target as Element).closest('.vf-stavenote') as SVGElement | null;
    if (!noteEl) return;

    noteEl.style.filter = '';
  };

  const moveHandler = (e: MouseEvent) => handleMouseMove(e, svgEl, allStaveMeta, highlight);

  const leaveHandler = () => highlight.hide();

  svgEl.addEventListener('click', handleClick);
  svgEl.addEventListener('mousemove', moveHandler);
  svgEl.addEventListener('mouseleave', leaveHandler);
  svgEl.addEventListener('mouseover', handleHover);
  svgEl.addEventListener('mouseout', handleHoverOut);

  return () => {
    svgEl.removeEventListener('click', handleClick);
    svgEl.removeEventListener('mousemove', moveHandler);
    svgEl.removeEventListener('mouseleave', leaveHandler);
    svgEl.removeEventListener('mouseover', handleHover);
    svgEl.removeEventListener('mouseout', handleHoverOut);
  };
}

function getNotePayload(el: Element | null): NoteClickPayload | null {
  const noteEl = el?.closest('.vf-stavenote') as SVGElement | null;
  if (!noteEl?.dataset.noteKey) return null;

  return {
    noteKey: noteEl.dataset.noteKey!,
    measureIndex: Number(noteEl.dataset.measureIndex),
    staveIndex: Number(noteEl.dataset.staveIndex),
    voiceIndex: Number(noteEl.dataset.voiceIndex),
    noteIndex: Number(noteEl.dataset.noteIndex),
  };
}

function getStaveYBounds(vfStave: Stave, clef: Clef) {
  const step = vfStave.getSpacingBetweenLines() / 2;
  const top = vfStave.getYForLine(0);
  const noteCount = CLEF_NOTE_MAPS[clef].length;
  return {
    minY: top - CLEF_TOP_LINE_OFFSET * step,
    maxY: top + (noteCount - CLEF_TOP_LINE_OFFSET - 1) * step,
  };
}

function getStaveClickPayload(
  e: MouseEvent,
  svgEl: SVGSVGElement,
  staves: {
    vfStave: Stave;
    clef: Clef;
    staveIndex: number;
    measureIndex: number;
  }[],
): StaveClickPayload | null {
  const rect = svgEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (const { vfStave, measureIndex, staveIndex, clef } of staves) {
    if (x < vfStave.getX() || x > vfStave.getX() + vfStave.getWidth()) continue;

    const top = vfStave.getYForLine(0);
    const step = vfStave.getSpacingBetweenLines() / 2;
    const { minY, maxY } = getStaveYBounds(vfStave, clef);

    if (y < minY || y > maxY) continue;

    const index = Math.round((y - top) / step);
    const noteKey = CLEF_NOTE_MAPS[clef]?.[index + CLEF_TOP_LINE_OFFSET];

    if (!noteKey) return null;

    return { noteKey, measureIndex, staveIndex };
  }

  return null;
}

function createHighlight(svgEl: SVGSVGElement) {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  rect.setAttribute('fill', 'rgba(99, 102, 241, 0.12)');
  rect.setAttribute('stroke', 'rgba(99, 102, 241, 0.35)');
  rect.setAttribute('stroke-width', '4');
  rect.setAttribute('rx', '2');
  rect.setAttribute('pointer-events', 'none');
  rect.style.display = 'none';

  svgEl.appendChild(rect);

  return {
    show(x: number, y: number, width: number, height: number) {
      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(y));
      rect.setAttribute('width', String(width));
      rect.setAttribute('height', String(height));
      rect.style.display = 'block';
    },
    hide() {
      rect.style.display = 'none';
    },
  };
}

function handleMouseMove(
  e: MouseEvent,
  svgEl: SVGSVGElement,
  staves: {
    vfStave: Stave;
    clef: Clef;
    staveIndex: number;
    measureIndex: number;
  }[],
  highlight: ReturnType<typeof createHighlight>,
) {
  if ((e.target as Element).closest('.vf-stavenote')) {
    highlight.hide();
    return;
  }

  const rect = svgEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (const { vfStave, clef } of staves) {
    const step = vfStave.getSpacingBetweenLines() / 2;
    const top = vfStave.getYForLine(0);
    const { minY, maxY } = getStaveYBounds(vfStave, clef);

    if (x < vfStave.getX() || x > vfStave.getX() + vfStave.getWidth()) continue;
    if (y < minY || y > maxY) continue;

    const index = Math.round((y - top) / step);
    const snappedY = top + index * step;

    highlight.show(vfStave.getX(), snappedY - step / 2 + 0.5, vfStave.getWidth(), step);
    return;
  }

  highlight.hide();
}
