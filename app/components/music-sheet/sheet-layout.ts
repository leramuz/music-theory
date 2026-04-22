import { MeasureConfig, Clef } from '@/types/music-sheet';
import { SHEET_DEFAULT_CONFIG } from '@/components/music-sheet/config';

export type StaveLayout = {
  x: number;
  y: number;
  width: number;
  clef?: Clef;
  staveIndex: number;
};

export type MeasureLayout = {
  measureIndex: number;
  staves: StaveLayout[];
};

export type SheetLayout = {
  width: number;
  height: number;
  measures: MeasureLayout[];
};

export function layoutSheet(measures: MeasureConfig[]): SheetLayout {
  const { measureWidth, measuresPerLine, staveGapY, paddingX, paddingY } = SHEET_DEFAULT_CONFIG;

  const numStavesPerMeasure = Math.max(...measures.map((m) => m.staves.length));
  const numLines = Math.ceil(measures.length / measuresPerLine);

  const width = Math.min(measures.length, measuresPerLine) * measureWidth + paddingX * 2;

  const height = numLines * numStavesPerMeasure * staveGapY + paddingY * 2;

  const layoutMeasures = measures.map((measure, measureIndex) => {
    const lineIndex = Math.floor(measureIndex / measuresPerLine);
    const measureIndexInLine = measureIndex % measuresPerLine;

    const x = measureIndexInLine * measureWidth + paddingX;

    const staves = measure.staves.map((staveConfig, staveIndex) => {
      const y = lineIndex * numStavesPerMeasure * staveGapY + staveIndex * staveGapY + paddingY;

      return {
        x,
        y,
        width: measureWidth,
        clef: staveConfig.clef,
        staveIndex,
      };
    });

    return {
      measureIndex,
      staves,
    };
  });

  return {
    width,
    height,
    measures: layoutMeasures,
  };
}
