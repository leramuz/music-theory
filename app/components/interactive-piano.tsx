'use client';

import { useEffect, useMemo, useRef } from 'react';
import { PianoKey, PianoKeyId } from '@/types/piano-key';
import { getPianoKeysInRange, isWhiteKey } from '@/helpers/piano-key';
import { playPianoKey } from '@/helpers/audio';
import { Card } from '@/components/ui/card';

type PianoZoom = 0.5 | 1;

const DEFAULT_PIANO_RANGE = {
  from: PianoKeyId.A0,
  to: PianoKeyId.C8,
};

const WHITE_KEY_HEIGHT_PX = 224;
const WHITE_KEY_WIDTH_PX = 56;
const BLACK_KEY_HEIGHT_PX = 144;
const BLACK_KEY_WIDTH_PX = 32;

const getWhiteKeyHeight = (zoom: PianoZoom) => WHITE_KEY_HEIGHT_PX * zoom;
const getWhiteKeyWidth = (zoom: PianoZoom) => WHITE_KEY_WIDTH_PX * zoom;
const getBlackKeyHeight = (zoom: PianoZoom) => BLACK_KEY_HEIGHT_PX * zoom;
const getBlackKeyWidth = (zoom: PianoZoom) => BLACK_KEY_WIDTH_PX * zoom;

interface InteractivePianoProps {
  onKeyPlay?: (_key: PianoKeyId) => void;
  showKeyLabels?: boolean;
  showKeysOutOfRange?: boolean;
  range?: {
    from: PianoKeyId;
    to: PianoKeyId;
  };
  rightPedalOn?: boolean;
  zoom?: PianoZoom;
}

export function InteractivePiano({
  onKeyPlay,
  showKeyLabels = true,
  showKeysOutOfRange = false,
  range = DEFAULT_PIANO_RANGE,
  rightPedalOn = false,
  zoom = 0.5,
}: InteractivePianoProps) {
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const allPianoKeys = useMemo(() => {
    return getPianoKeysInRange(DEFAULT_PIANO_RANGE);
  }, []);
  const pianoKeysInRange = useMemo(() => {
    return getPianoKeysInRange(range);
  }, [range]);
  const keysInRangeSet = useMemo(() => {
    return new Set(pianoKeysInRange.map((k) => k.id));
  }, [pianoKeysInRange]);
  const displayedPianoKeys = showKeysOutOfRange ? allPianoKeys : pianoKeysInRange;

  const whiteKeys = displayedPianoKeys.filter((key) => isWhiteKey(key.id));
  const blackKeys = displayedPianoKeys.filter((key) => !isWhiteKey(key.id));

  const whiteIndexByKeyId = useMemo(() => {
    const map = new Map<number, number>();
    let whitesSeen = 0;

    displayedPianoKeys.forEach((k) => {
      if (isWhiteKey(k.id)) {
        map.set(k.id, whitesSeen);
        whitesSeen += 1;
      } else {
        map.set(k.id, whitesSeen - 1); // black key sits after previous white
      }
    });

    return map;
  }, [displayedPianoKeys]);

  const getWhiteIndex = (key: PianoKey) => {
    return whiteIndexByKeyId.get(key.id) ?? 0;
  };

  const playKey = (key: PianoKey) => {
    if (showKeysOutOfRange && !pianoKeysInRange.some((k) => k.id === key.id)) return;

    if (!rightPedalOn && activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
    }

    const audio = playPianoKey(key);
    activeAudioRef.current = audio;

    onKeyPlay?.(key.id);
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    element.scrollLeft = maxScrollLeft / 2;
  }, []);

  useEffect(() => {
    return () => {
      activeAudioRef.current?.pause();
    };
  }, []);

  return (
    <Card className="max-w-full">
      <div className="p-4 overflow-x-auto" ref={scrollRef}>
        <div className="relative w-max">
          <div className="flex items-center">
            {whiteKeys.map((key) => {
              const isOutOfRange = showKeysOutOfRange && !keysInRangeSet.has(key.id);

              return (
                <button
                  key={key.id}
                  type="button"
                  aria-label={`Play ${key.spellings[0]}`}
                  onClick={() => playKey(key)}
                  disabled={isOutOfRange}
                  className={`flex flex-col justify-end rounded-b-sm border border-black px-1 pb-2 text-center text-[10px] font-medium transition ${
                    isOutOfRange
                      ? 'border-zinc-300 cursor-default'
                      : 'bg-white hover:bg-zinc-100 active:bg-zinc-200'
                  }`}
                  style={{
                    width: `${getWhiteKeyWidth(zoom)}px`,
                    height: `${getWhiteKeyHeight(zoom)}px`,
                  }}
                >
                  {showKeyLabels && (
                    <span className={isOutOfRange ? 'text-zinc-300' : 'text-black/70'}>
                      {key.spellings[0]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {blackKeys.map((key) => {
            const isOutOfRange = showKeysOutOfRange && !keysInRangeSet.has(key.id);
            const left = getWhiteIndex(key) * getWhiteKeyWidth(zoom) + getWhiteKeyWidth(zoom);

            return (
              <button
                key={key.id}
                type="button"
                aria-label={`Play ${key.spellings[0]}`}
                onClick={() => playKey(key)}
                disabled={isOutOfRange}
                className={`flex flex-col justify-end absolute top-0 z-10 px-1 pb-2 -translate-x-1/2 rounded-b-sm border border-black/70 text-[9px] font-semibold text-white transition ${
                  isOutOfRange
                    ? 'bg-zinc-300 border-zinc-300 cursor-default'
                    : 'bg-zinc-900 hover:bg-black active:bg-zinc-700'
                }`}
                style={{
                  width: `${getBlackKeyWidth(zoom)}px`,
                  height: `${getBlackKeyHeight(zoom)}px`,
                  left: `${left}px`,
                }}
              >
                {showKeyLabels && zoom >= 1 && (
                  <div className={isOutOfRange ? 'text-zinc-300' : 'text-black'}>
                    <span className="block">{key.spellings[0]}</span>
                    <span className="block">{key.spellings[1]}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
