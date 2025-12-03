'use client';

import { Player, getPlayerTotal } from '@/lib/game-state';
import { Swords, Undo2 } from 'lucide-react';

interface GameHeaderProps {
  players: Player[];
  currentPlayerIndex: number;
  isComplete: boolean;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  winners?: Player[];
  flashNewGame?: boolean;
  celebratingPlayerId?: string;
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
  celebratingPlayerId,
}: GameHeaderProps) {

  // Mobile: Shield scoreboard (name + score for each player)
  const renderMobileScoreboard = () => {
    return (
      <div className="sm:hidden w-full order-3">
        <div className="flex flex-wrap justify-center gap-2 py-2">
          {players.map((player, index) => {
            const isCurrentTurn = index === currentPlayerIndex && winners.length === 0;
            const isCelebrating = player.id === celebratingPlayerId;
            const total = getPlayerTotal(player);

            return (
              <div
                key={player.id}
                className={`shield ${
                  isCelebrating
                    ? 'shield-active shield-celebrating'
                    : isCurrentTurn
                      ? 'shield-active'
                      : 'shield-inactive'
                }`}
              >
                {/* Player name - TOP */}
                <span className="shield-name font-[family-name:var(--font-cinzel)]">
                  {player.name}
                </span>

                {/* Player score - MIDDLE */}
                <span className="shield-score font-[family-name:var(--font-cinzel)]">
                  {total}
                </span>

                {/* Sword icon - BOTTOM (only for current player) */}
                <div className="shield-icon flex items-center justify-center">
                  {isCurrentTurn && (
                    <Swords size={14} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <header className="navbar bg-base-200 shadow-lg px-2 sm:px-4 py-2 sm:py-3 flex-wrap gap-2">
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

      {/* Mobile: Shield scoreboard above table */}
      {!isComplete && renderMobileScoreboard()}

      {/* Winner badge */}
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
