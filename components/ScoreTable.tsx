'use client';

import { useRef, useEffect, useState } from 'react';
import { Player, getPlayerTotal } from '@/lib/game-state';
import { Category, CATEGORIES, CATEGORY_INFO } from '@/lib/scoring';
import ScoreCell from './ScoreCell';
import CategoryCell from './CategoryCell';
import { Swords } from 'lucide-react';
import DiceIcon from './DiceIcon';

interface CelebratingCell {
  playerId: string;
  category: Category;
}

interface ScoreTableProps {
  players: Player[];
  currentPlayerIndex: number;
  onSetScore: (playerId: string, category: Category, score: number | null) => void;
  winners?: Player[];
  celebratingCell?: CelebratingCell | null;
}

// Shared row height for synchronization (smaller on mobile)
const ROW_HEIGHT = 'h-[44px] sm:h-[52px]';
const HEADER_HEIGHT = 'h-[48px] sm:h-[72px]'; // Mobile: simple text, Desktop: shields
const FOOTER_HEIGHT = 'h-[52px] sm:h-[60px]';

export default function ScoreTable({ players, currentPlayerIndex, onSetScore, winners = [], celebratingCell }: ScoreTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isWinner = (playerId: string) => winners.some(w => w.id === playerId);

  // State for showing category example hands
  const [activeExampleCategory, setActiveExampleCategory] = useState<Category | null>(null);

  // Click-outside detection to dismiss example
  useEffect(() => {
    if (!activeExampleCategory) return;

    const handleClickOutside = () => {
      setActiveExampleCategory(null);
    };

    // Small delay to avoid immediate close on same click
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeExampleCategory]);

  // Auto-dismiss timer (5 seconds)
  useEffect(() => {
    if (!activeExampleCategory) return;

    const timeoutId = setTimeout(() => {
      setActiveExampleCategory(null);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [activeExampleCategory]);

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
    <div className="flex rounded-xl overflow-hidden bg-base-200 shadow-lg border border-base-300/50">
      {/* Fixed Category Column */}
      <div className="flex-shrink-0 w-20 sm:w-36 bg-base-200 border-r border-base-300">
        {/* Header */}
        <div className={`${HEADER_HEIGHT} flex items-center justify-center px-2 sm:px-3 bg-base-300`}>
          <div className="sm:hidden relative w-12 h-10">
            <div className="absolute left-0 top-0 rotate-[-8deg]"><DiceIcon value={1} size={14} /></div>
            <div className="absolute left-4 top-4 rotate-[10deg]"><DiceIcon value={2} size={15} /></div>
            <div className="absolute left-[26px] top-0 rotate-[5deg]"><DiceIcon value={3} size={14} /></div>
          </div>
          <div className="hidden sm:block relative w-28 h-14">
            <div className="absolute left-1 top-1 rotate-[-8deg]"><DiceIcon value={1} size={20} /></div>
            <div className="absolute left-6 top-6 rotate-[12deg]"><DiceIcon value={2} size={22} /></div>
            <div className="absolute left-[52px] top-0 rotate-[-3deg]"><DiceIcon value={3} size={21} /></div>
            <div className="absolute left-[76px] top-5 rotate-[7deg]"><DiceIcon value={4} size={20} /></div>
            <div className="absolute left-[42px] top-[38px] rotate-[-12deg]"><DiceIcon value={5} size={19} /></div>
          </div>
        </div>

        {/* Category rows */}
        {CATEGORIES.map((category, index) => (
          <div
            key={category}
            className={`${ROW_HEIGHT} flex items-center px-2 sm:px-3 text-sm sm:text-base font-medium ${
              index % 2 === 0 ? 'bg-base-200' : 'bg-base-200/50'
            }`}
          >
            <CategoryCell
              category={category}
              isShowingExample={activeExampleCategory === category}
              onShowExample={() => setActiveExampleCategory(category)}
            />
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
          <div className={`${HEADER_HEIGHT} flex items-center bg-base-300`}>
            {players.map((player, index) => {
              const playerIsWinner = isWinner(player.id);
              const isCurrentPlayer = index === currentPlayerIndex && winners.length === 0;
              return (
                <div
                  key={player.id}
                  data-player-index={index}
                  className={`min-w-[80px] sm:min-w-[120px] md:min-w-[140px] h-full flex items-center justify-center
                    ${isCurrentPlayer ? 'bg-primary text-primary-content' : ''}
                    ${playerIsWinner ? 'animate-winner-column' : ''}
                  `}
                >
                  {/* Mobile: Simple text only */}
                  <span
                    className={`sm:hidden truncate text-sm font-semibold font-[family-name:var(--font-cinzel)]
                      ${playerIsWinner ? 'text-amber-200' : ''}
                    `}
                  >
                    {player.name}
                  </span>

                  {/* Desktop: Shield headers with name on top, icon on bottom */}
                  <div
                    className={`shield-header
                      ${playerIsWinner
                        ? 'shield-header-active'
                        : isCurrentPlayer
                          ? 'shield-header-current'
                          : 'shield-header-inactive'
                      }`}
                  >
                    {/* Player name on top */}
                    <span className={`shield-header-name font-[family-name:var(--font-cinzel)] ${
                      playerIsWinner ? 'text-amber-200' : ''
                    }`}>
                      {player.name}
                    </span>
                    {/* Sword icon on bottom for current player or winner */}
                    <div className="shield-header-icon mt-1">
                      {(isCurrentPlayer || playerIsWinner) && (
                        <Swords size={16} />
                      )}
                    </div>
                  </div>
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
              {players.map((player, index) => {
                const playerIsWinner = isWinner(player.id);
                const isCurrentPlayer = index === currentPlayerIndex && winners.length === 0;
                return (
                  <div
                    key={player.id}
                    className={`min-w-[80px] sm:min-w-[120px] md:min-w-[140px] flex items-center justify-center ${
                      playerIsWinner
                        ? 'animate-winner-column'
                        : isCurrentPlayer
                          ? 'animate-current-player'
                          : ''
                    }`}
                  >
                    <ScoreCell
                      category={category}
                      score={player.scores[category]}
                      onSetScore={(score) => onSetScore(player.id, category, score)}
                      isCurrentPlayer={isCurrentPlayer}
                      isWinner={playerIsWinner}
                      isCelebrating={celebratingCell?.playerId === player.id && celebratingCell?.category === category}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          {/* Footer row - Totals */}
          <div className={`${FOOTER_HEIGHT} flex bg-base-300`}>
            {players.map((player, index) => {
              const playerIsWinner = isWinner(player.id);
              const isCurrentPlayer = index === currentPlayerIndex && winners.length === 0;
              const isCelebrating = celebratingCell?.playerId === player.id;
              return (
                <div
                  key={player.id}
                  className={`min-w-[80px] sm:min-w-[120px] md:min-w-[140px] flex items-center justify-center text-lg sm:text-xl font-bold transition-colors ${
                    playerIsWinner
                      ? 'animate-winner-column text-amber-300'
                      : isCelebrating
                        ? 'animate-total-triumph bg-primary text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                        : isCurrentPlayer
                          ? 'bg-primary text-primary-content'
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
