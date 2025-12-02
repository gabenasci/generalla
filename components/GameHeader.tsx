'use client';

import { Player, getPlayerTotal } from '@/lib/game-state';
import { Swords, Undo2, Flame } from 'lucide-react';

interface GameHeaderProps {
  players: Player[];
  currentPlayerIndex: number;
  isComplete: boolean;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  winners?: Player[];
  flashNewGame?: boolean;
}

export default function GameHeader({
  players,
  currentPlayerIndex,
  isComplete,
  onNewGame,
  onUndo,
  canUndo,
  winners = [],
  flashNewGame = false,
}: GameHeaderProps) {
  const currentPlayer = players[currentPlayerIndex];

  // Desktop: Beautiful enhanced badge with separator
  const renderDesktopBadge = () => {
    if (!currentPlayer) return null;
    const playerTotal = getPlayerTotal(currentPlayer);

    return (
      <div className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-primary to-primary/90 text-primary-content rounded-xl px-5 py-3 shadow-[0_0_20px_rgba(255,215,0,0.35)] order-3 sm:order-none">
        {/* Player section */}
        <div className="flex items-center gap-2">
          <Swords size={18} className="drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
          <span className="font-bold text-lg truncate max-w-[150px]">{currentPlayer.name}</span>
        </div>

        {/* Glowing separator */}
        <span className="w-px h-6 bg-gradient-to-b from-transparent via-amber-200/70 to-transparent shadow-[0_0_8px_rgba(255,215,0,0.6)]" />

        {/* Score section */}
        <div className="flex items-center gap-1.5">
          <Flame size={16} className="text-amber-300 drop-shadow-[0_0_6px_rgba(255,191,0,0.8)]" />
          <span className="font-bold text-xl font-[family-name:var(--font-cinzel)] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            {playerTotal}
          </span>
        </div>
      </div>
    );
  };

  // Mobile: Compact scoreboard showing all players
  const renderMobileScoreboard = () => {
    return (
    <div className="sm:hidden w-full order-3">
      <div className="flex flex-wrap justify-center gap-1.5">
        {players.map((player, index) => {
          const isCurrentTurn = index === currentPlayerIndex;
          const total = getPlayerTotal(player);

          return (
            <div
              key={player.id}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all
                ${isCurrentTurn
                  ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-content shadow-[0_0_12px_rgba(255,215,0,0.4)]'
                  : 'bg-base-300/50 text-base-content/80'
                }`}
            >
              {isCurrentTurn && (
                <Swords size={12} className="flex-shrink-0 drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]" />
              )}
              <span className={`font-medium truncate max-w-[70px] ${isCurrentTurn ? '' : 'opacity-80'}`}>
                {player.name}
              </span>
              <span className={`font-bold font-[family-name:var(--font-cinzel)] ${
                isCurrentTurn
                  ? 'drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]'
                  : 'text-primary'
              }`}>
                {total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
    );
  };

  return (
    <header className="navbar bg-base-200 shadow-lg px-2 sm:px-4 py-2 sm:py-3 flex-wrap sm:flex-nowrap gap-2">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-cinzel)]">
          Generalla
        </h1>
      </div>

      <div className="flex-none flex gap-1 sm:gap-2 md:gap-4 items-center order-2 sm:order-none">
        <button
          className="btn btn-ghost btn-sm sm:btn-md"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo last score"
        >
          <Undo2 size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button
          className={`btn btn-ghost btn-sm sm:btn-md ${flashNewGame ? 'animate-flash-attention' : ''}`}
          onClick={onNewGame}
        >
          <span className="hidden xs:inline">New Game</span>
          <span className="xs:hidden">New</span>
        </button>
      </div>

      {/* Current player display - responsive */}
      {!isComplete && currentPlayer && (
        <>
          {renderDesktopBadge()}
          {renderMobileScoreboard()}
        </>
      )}

      {/* Winner badge - full width on mobile */}
      {isComplete && winners.length > 0 && (
        <div className="badge badge-md sm:badge-lg gap-1 sm:gap-2 py-3 px-3 sm:py-5 sm:px-5 text-sm sm:text-lg animate-winner-header rounded-lg order-3 sm:order-none w-full sm:w-auto justify-center">
          <Swords size={14} className="sm:w-[18px] sm:h-[18px] text-amber-400" />
          <span className="font-bold text-amber-200 truncate max-w-[150px] sm:max-w-none">
            {winners.length > 1
              ? winners.map(w => w.name).join(' & ')
              : winners[0].name}
          </span>
          <Swords size={14} className="sm:w-[18px] sm:h-[18px] text-amber-400" />
        </div>
      )}
    </header>
  );
}
