import {
  Stave,
  StaveNote,
  Voice,
  Formatter,
  StaveConnector,
  Stem,
  Barline,
  Accidental,
  RenderContext,
  Beam,
} from 'vexflow';
import { MeasureConfig } from '@/types/music-sheet';
import { Clef } from '@/types/clef';
import { Key } from '@/types/key';
import { TimeSignature } from '@/types/time-signature';
import { type SheetLayout } from '@/components/music-sheet/sheet-layout';
import { SHEET_DEFAULT_CONFIG } from '@/components/music-sheet/config';
import { adaptKeyToVexflowKey } from '@/helpers/vexflow';

export type StaveMeta = {
  vfStave: Stave;
  clef: Clef;
  staveIndex: number;
  measureIndex: number;
};

export function renderSheet(
  context: RenderContext,
  layout: SheetLayout,
  measures: MeasureConfig[],
  timeSignature: TimeSignature,
  musicalKey: Key | null,
) {
  const [beats, beatValue] = timeSignature.split('/').map(Number);

  const allStaveMeta: StaveMeta[] = [];

  layout.measures.forEach((layoutMeasure, measureIndex) => {
    const isStartOfLine = measureIndex % SHEET_DEFAULT_CONFIG.measuresPerLine === 0;
    const isLastMeasure = measureIndex === measures.length - 1;

    const renderedStaves: Stave[] = [];

    const formatter = new Formatter();
    const allVoicesInMeasure: Voice[] = [];

    const staveVoicePairs: {
      voice: Voice;
      stave: Stave;
      notes: StaveNote[];
      staveIndex: number;
      voiceIndex: number;
      beams: Beam[];
    }[] = [];

    const currentClefs: Record<number, Clef> = {
      0: Clef.TREBLE,
      1: Clef.BASS,
    };

    // ===== STAVES =====
    layoutMeasure.staves.forEach((staveLayout) => {
      const { x, y, width, clef, staveIndex } = staveLayout;

      const stave = new Stave(x, y, width);

      // --- Clef ---
      if (clef) {
        currentClefs[staveIndex] = clef;
        stave.addClef(clef);
      } else if (isStartOfLine && measureIndex !== 0) {
        stave.addClef(currentClefs[staveIndex] || Clef.TREBLE);
      }

      // --- Time + Key ---
      if (measureIndex === 0) {
        stave.addTimeSignature(timeSignature);
        if (musicalKey) {
          stave.addKeySignature(adaptKeyToVexflowKey(musicalKey));
        }
      } else if (isStartOfLine) {
        if (musicalKey) {
          stave.addKeySignature(adaptKeyToVexflowKey(musicalKey));
        }
      }

      // --- End bar ---
      if (measureIndex === measures.length - 1) {
        stave.setEndBarType(Barline.type.END);
      }

      stave.setContext(context).draw();

      renderedStaves.push(stave);

      allStaveMeta.push({
        vfStave: stave,
        clef: clef || currentClefs[staveIndex] || Clef.TREBLE,
        staveIndex,
        measureIndex,
      });

      // ===== VOICES =====
      const staveConfig = measures[measureIndex].staves[staveIndex];

      const staveVoices: Voice[] = staveConfig.voices.map((voiceConfig, voiceIndex) => {
        const stemDirection =
          staveConfig.voices.length > 1 ? (voiceIndex === 0 ? Stem.UP : Stem.DOWN) : undefined;

        const notes =
          voiceConfig.notes?.map((n) => {
            const note = new StaveNote({
              ...n,
              clef: currentClefs[staveIndex],
              stemDirection,
              autoStem: staveConfig.voices.length === 1 ? true : undefined,
            });

            n.accidentals?.forEach((acc, keyIndex) => {
              if (acc) {
                note.addModifier(new Accidental(acc), keyIndex);
              }
            });

            return note;
          }) || [];

        const voice = new Voice({
          numBeats: beats,
          beatValue: beatValue,
        });

        voice.setMode(Voice.Mode.SOFT);
        voice.addTickables(notes);

        const beams = Beam.generateBeams(notes, {
          stemDirection,
        });

        allVoicesInMeasure.push(voice);

        staveVoicePairs.push({
          voice,
          stave,
          notes,
          staveIndex,
          voiceIndex,
          beams,
        });

        return voice;
      });

      const nonEmpty = staveVoices.filter((v) => v.getTickables().length > 0);

      if (nonEmpty.length > 1) {
        formatter.joinVoices(nonEmpty);
      }
    });

    // ===== FORMAT =====
    const voicesToFormat = allVoicesInMeasure.filter((v) => v.getTickables().length > 0);

    if (voicesToFormat.length > 0) {
      formatter.formatToStave(voicesToFormat, renderedStaves[0]);
    }

    // ===== DRAW =====
    staveVoicePairs.forEach(({ voice, stave, beams }) => {
      if (voice.getTickables().length > 0) {
        voice.draw(context, stave);
        beams.forEach((beam) => beam.setContext(context).draw());
      }
    });

    // ===== CONNECTORS (GRAND STAFF) =====
    if (renderedStaves.length > 1) {
      const firstStave = renderedStaves[0];
      const secondStave = renderedStaves[1];

      if (isStartOfLine) {
        new StaveConnector(firstStave, secondStave)
          .setType(StaveConnector.type.BRACE)
          .setContext(context)
          .draw();

        new StaveConnector(firstStave, secondStave)
          .setType(StaveConnector.type.SINGLE_LEFT)
          .setContext(context)
          .draw();
      }

      const connectorType = isLastMeasure
        ? StaveConnector.type.BOLD_DOUBLE_RIGHT
        : StaveConnector.type.SINGLE_RIGHT;

      new StaveConnector(firstStave, secondStave).setType(connectorType).setContext(context).draw();
    }

    // ===== DATASET FOR INTERACTIONS =====
    staveVoicePairs.forEach(({ notes, staveIndex, voiceIndex }) => {
      notes.forEach((note, noteIndex) => {
        const el = note.getSVGElement();
        if (!el) return;

        el.setAttribute('pointer-events', 'bounding-box');

        el.dataset.noteKey = note.getKeys()[0];
        el.dataset.measureIndex = String(measureIndex);
        el.dataset.noteIndex = String(noteIndex);
        el.dataset.staveIndex = String(staveIndex);
        el.dataset.voiceIndex = String(voiceIndex);
      });
    });
  });

  return { allStaveMeta };
}
