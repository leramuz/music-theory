import { describe, it, expect } from 'vitest';
import { makeIntervalMeasure } from '@/helpers/interval-sheet';
import { Clef, NoteDuration } from '@/types/music-sheet';
import { Accidental } from '@/types/accidental';

describe('makeIntervalMeasure', () => {
  describe('clef selection', () => {
    it('uses treble clef when bottom note is G3 or above', () => {
      const measure = makeIntervalMeasure('G3');
      expect(measure.staves[0].clef).toBe(Clef.TREBLE);
    });

    it('uses treble clef for notes above G3', () => {
      const measure = makeIntervalMeasure('C4');
      expect(measure.staves[0].clef).toBe(Clef.TREBLE);
    });

    it('uses bass clef for notes below G3', () => {
      const measure = makeIntervalMeasure('C3');
      expect(measure.staves[0].clef).toBe(Clef.BASS);
    });
  });

  describe('bottom note only', () => {
    it('produces a single voice', () => {
      const measure = makeIntervalMeasure('C4');
      expect(measure.staves[0].voices).toHaveLength(1);
    });

    it('uses the default whole note duration', () => {
      const measure = makeIntervalMeasure('C4');
      expect(measure.staves[0].voices[0].notes[0].duration).toBe(NoteDuration.WHOLE);
    });

    it('sets the correct vex key for the bottom note', () => {
      const measure = makeIntervalMeasure('C4');
      expect(measure.staves[0].voices[0].notes[0].keys[0]).toBe('c/4');
    });

    it('sets no accidental for a natural note', () => {
      const measure = makeIntervalMeasure('C4');
      expect(measure.staves[0].voices[0].notes[0]?.accidentals?.[0]).toBeNull();
    });

    it('sets a sharp accidental', () => {
      const measure = makeIntervalMeasure('C#4');
      expect(measure.staves[0].voices[0].notes[0]?.accidentals?.[0]).toBe(Accidental.SHARP);
    });

    it('sets a flat accidental', () => {
      const measure = makeIntervalMeasure('Eb4');
      expect(measure.staves[0].voices[0].notes[0]?.accidentals?.[0]).toBe(Accidental.FLAT);
    });
  });

  describe('with top note', () => {
    it('produces two voices', () => {
      const measure = makeIntervalMeasure('C4', 'E4');
      expect(measure.staves[0].voices).toHaveLength(2);
    });

    it('sets the correct vex key for the top note', () => {
      const measure = makeIntervalMeasure('C4', 'G4');
      expect(measure.staves[0].voices[1].notes[0].keys[0]).toBe('g/4');
    });

    it('sets accidental on the top note', () => {
      const measure = makeIntervalMeasure('C4', 'Bb4');
      expect(measure.staves[0].voices[1].notes[0]?.accidentals?.[0]).toBe(Accidental.FLAT);
    });
  });

  describe('custom duration', () => {
    it('uses the provided duration for both voices', () => {
      const measure = makeIntervalMeasure('C4', 'E4', NoteDuration.HALF);
      expect(measure.staves[0].voices[0].notes[0].duration).toBe(NoteDuration.HALF);
      expect(measure.staves[0].voices[1].notes[0].duration).toBe(NoteDuration.HALF);
    });
  });
});
