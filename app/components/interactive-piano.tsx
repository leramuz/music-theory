'use client';

import { useEffect, useMemo, useRef } from 'react';
import { getPianoKeysInRange, isWhiteKey } from '@/helpers/piano-key';
import { playPianoKey } from '@/helpers/audio';
import { PianoKey, PianoKeyId } from '@/types/piano-key';
import { Card } from '@/components/ui/card';

type PianoZoom = 0.5 | 1;

export type KeyHighlightColor = 'blue' | 'amber' | 'green' | 'red';

const KEY_HIGHLIGHT: Record<KeyHighlightColor, string> = {
  blue: 'bg-blue-200 hover:bg-blue-100 active:bg-blue-300 border-blue-400',
  amber: 'bg-amber-200 hover:bg-amber-100 active:bg-amber-300 border-amber-400',
  green: 'bg-green-200 hover:bg-green-100 active:bg-green-300 border-green-500',
  red: 'bg-red-200 hover:bg-red-100 active:bg-red-300 border-red-400',
};

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

const buildHighlightMap = (keys?: { id: PianoKeyId; color: KeyHighlightColor }[]) =>
  new Map(keys?.map((h) => [h.id, h.color]));

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
  highlightedKeys?: { id: PianoKeyId; color: KeyHighlightColor }[];
  muted?: boolean;
  scrollToKeyId?: PianoKeyId;
  disabledKeys?: Set<PianoKeyId>;
}

export function InteractivePiano({
  onKeyPlay,
  showKeyLabels = true,
  showKeysOutOfRange = false,
  range = DEFAULT_PIANO_RANGE,
  rightPedalOn = false,
  zoom = 0.5,
  highlightedKeys,
  muted = false,
  scrollToKeyId,
  disabledKeys,
}: InteractivePianoProps) {
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const highlightMap = useMemo(() => buildHighlightMap(highlightedKeys), [highlightedKeys]);

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
    if (disabledKeys?.has(key.id)) return;

    if (!muted) {
      if (!rightPedalOn && activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      }

      const audio = playPianoKey(key);
      activeAudioRef.current = audio;
    }

    onKeyPlay?.(key.id);
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    if (scrollToKeyId !== undefined) {
      const whiteIndex = whiteIndexByKeyId.get(scrollToKeyId) ?? 0;
      const isBlack = !isWhiteKey(scrollToKeyId);
      const keyLeft = (whiteIndex + (isBlack ? 1 : 0)) * getWhiteKeyWidth(zoom);
      element.scrollLeft = Math.max(0, keyLeft - getWhiteKeyWidth(zoom) * 2);
    } else {
      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      element.scrollLeft = maxScrollLeft / 2;
    }
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
              const isDisabled = disabledKeys?.has(key.id) ?? false;

              return (
                <button
                  key={key.id}
                  type="button"
                  aria-label={`Play ${key.spellings[0]}`}
                  onClick={() => playKey(key)}
                  disabled={isOutOfRange || isDisabled}
                  className={`flex flex-col justify-end rounded-b-sm border px-1 pb-2 text-center text-[10px] font-medium transition ${
                    isOutOfRange || isDisabled
                      ? 'border-zinc-300 cursor-default'
                      : (() => {
                          const hlColor = highlightMap.get(key.id);
                          return hlColor
                            ? KEY_HIGHLIGHT[hlColor]
                            : 'border-black bg-white hover:bg-zinc-100 active:bg-zinc-200';
                        })()
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
            const isDisabled = disabledKeys?.has(key.id) ?? false;
            const left = getWhiteIndex(key) * getWhiteKeyWidth(zoom) + getWhiteKeyWidth(zoom);

            return (
              <button
                key={key.id}
                type="button"
                aria-label={`Play ${key.spellings[0]}`}
                onClick={() => playKey(key)}
                disabled={isOutOfRange || isDisabled}
                className={`flex flex-col justify-end absolute top-0 z-10 px-1 pb-2 -translate-x-1/2 rounded-b-sm border text-[9px] font-semibold text-white transition ${
                  isOutOfRange || isDisabled
                    ? 'bg-zinc-300 border-zinc-300 cursor-default'
                    : (() => {
                        const hlColor = highlightMap.get(key.id);
                        return hlColor
                          ? KEY_HIGHLIGHT[hlColor]
                          : 'border-black/70 bg-zinc-900 hover:bg-black active:bg-zinc-700';
                      })()
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
