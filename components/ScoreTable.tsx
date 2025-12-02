'use client';

import { useRef, useEffect } from 'react';
import { Player, getPlayerTotal } from '@/lib/game-state';
import { Category, CATEGORIES, CATEGORY_INFO } from '@/lib/scoring';
import ScoreCell from './ScoreCell';
import { Swords, Crown } from 'lucide-react';

interface ScoreTableProps {
  players: Player[];
  currentPlayerIndex: number;
  onSetScore: (playerId: string, category: Category, score: number | null) => void;
  winners?: Player[];
}

// Shared row height for synchronization (smaller on mobile)
const ROW_HEIGHT = 'h-[44px] sm:h-[52px]';
const HEADER_HEIGHT = 'h-[48px] sm:h-[56px]';
const FOOTER_HEIGHT = 'h-[52px] sm:h-[60px]';

export default function ScoreTable({ players, currentPlayerIndex, onSetScore, winners = [] }: ScoreTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isWinner = (playerId: string) => winners.some(w => w.id === playerId);

  // Auto-scroll to current player when they change
  useEffect(() => {
    if (scrollContainerRef.current && winners.length === 0) {
      const currentPlayerColumn = scrollContainerRef.current.querySelector(
        `[data-player-index="${currentPlayerIndex}"]`
      );
      if (currentPlayerColumn) {
        currentPlayerColumn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [currentPlayerIndex, winners.length]);

  return (
    <>
    <div className="flex rounded-lg overflow-hidden bg-base-200">
      {/* Fixed Category Column */}
      <div className="flex-shrink-0 w-20 sm:w-24 bg-base-200 border-r border-base-300">
        {/* Header */}
        <div className={`${HEADER_HEIGHT} flex items-center justify-center sm:justify-start px-2 sm:px-3 bg-base-300 font-[family-name:var(--font-cinzel)] text-primary text-base sm:text-lg font-semibold`}>
          <Crown size={26} className="sm:hidden" />
          <span className="hidden sm:inline">Category</span>
        </div>

        {/* Category rows */}
        {CATEGORIES.map((category, index) => (
          <div
            key={category}
            className={`${ROW_HEIGHT} flex items-center px-2 sm:px-3 text-sm sm:text-base font-medium ${
              index % 2 === 0 ? 'bg-base-200' : 'bg-base-200/50'
            }`}
          >
            <span className="hidden sm:inline">{CATEGORY_INFO[category].displayName}</span>
            <span className="sm:hidden">{CATEGORY_INFO[category].shortName || CATEGORY_INFO[category].displayName}</span>
            {CATEGORY_INFO[category].hasServido && (
              <span className="text-xs sm:text-sm text-base-content/50 ml-0.5 sm:ml-1">*</span>
            )}
          </div>
        ))}

        {/* Footer - Total */}
        <div className={`${FOOTER_HEIGHT} flex items-center px-2 sm:px-3 bg-base-300 font-[family-name:var(--font-cinzel)] text-primary text-lg sm:text-xl font-bold`}>
          TOTAL
        </div>
      </div>

      {/* Scrollable Player Columns */}
      <div className="relative flex-1 min-w-0">
        {/* Scroll indicator gradient on the right - outside scroll container so it stays fixed */}
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-base-100/60 to-transparent pointer-events-none z-30 md:hidden" />

        <div ref={scrollContainerRef} className="overflow-x-auto overflow-y-clip scroll-smooth">
          <div className="min-w-max">
          {/* Header row */}
          <div className={`${HEADER_HEIGHT} flex bg-base-300`}>
            {players.map((player, index) => {
              const playerIsWinner = isWinner(player.id);
              const isCurrentPlayer = index === currentPlayerIndex && winners.length === 0;
              return (
                <div
                  key={player.id}
                  data-player-index={index}
                  className={`min-w-[80px] sm:min-w-[100px] flex items-center justify-center px-2 text-base sm:text-lg font-semibold transition-colors ${
                    playerIsWinner
                      ? 'animate-winner-column'
                      : isCurrentPlayer
                        ? 'bg-primary text-primary-content'
                        : ''
                  }`}
                >
                  <span className="inline-flex items-center gap-0.5 sm:gap-1">
                    {playerIsWinner && <Swords size={14} className="sm:w-[18px] sm:h-[18px] text-amber-400" />}
                    <span className={`truncate max-w-[60px] sm:max-w-none ${playerIsWinner ? 'text-amber-200' : ''}`}>
                      {player.name}
                    </span>
                    {playerIsWinner && <Swords size={14} className="sm:w-[18px] sm:h-[18px] text-amber-400" />}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Score rows */}
          {CATEGORIES.map((category, rowIndex) => (
            <div
              key={category}
              className={`${ROW_HEIGHT} flex ${rowIndex % 2 === 0 ? 'bg-base-200' : 'bg-base-200/50'}`}
            >
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className="min-w-[80px] sm:min-w-[100px] flex items-center justify-center"
                >
                  <ScoreCell
                    category={category}
                    score={player.scores[category]}
                    onSetScore={(score) => onSetScore(player.id, category, score)}
                    isCurrentPlayer={index === currentPlayerIndex && winners.length === 0}
                    isWinner={isWinner(player.id)}
                  />
                </div>
              ))}
            </div>
          ))}

          {/* Footer row - Totals */}
          <div className={`${FOOTER_HEIGHT} flex bg-base-300`}>
            {players.map((player, index) => {
              const playerIsWinner = isWinner(player.id);
              const isCurrentPlayer = index === currentPlayerIndex && winners.length === 0;
              return (
                <div
                  key={player.id}
                  className={`min-w-[80px] sm:min-w-[100px] flex items-center justify-center text-lg sm:text-xl font-bold transition-colors ${
                    playerIsWinner
                      ? 'animate-winner-column text-amber-300'
                      : isCurrentPlayer
                        ? 'bg-primary/30 text-primary'
                        : 'text-primary'
                  }`}
                >
                  {getPlayerTotal(player)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </div>
    </>
  );
}
