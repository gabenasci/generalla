'use client';

import { Player } from '@/lib/game-state';
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
  const isWinner = isComplete && winners.some(w => w.id === currentPlayer?.id);

  return (
    <header className="navbar bg-base-200 shadow-lg px-4 py-3">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-primary font-[family-name:var(--font-cinzel)]">
          Generalla
        </h1>
      </div>

      <div className="flex-none flex gap-4 items-center">
        <button
          className="btn btn-ghost"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo last score"
        >
          <Undo2 size={20} />
        </button>
        <button
          className={`btn btn-ghost ${flashNewGame ? 'animate-flash-attention' : ''}`}
          onClick={onNewGame}
        >
          New Game
        </button>

        {!isComplete && currentPlayer && (
          <div className="badge badge-primary badge-lg gap-2 py-5 px-5 text-lg">
            <Swords size={18} />
            <span className="font-bold text-lg">{currentPlayer.name}</span>
            <Swords size={18} />
          </div>
        )}

        {isComplete && winners.length > 0 && (
          <div className="badge badge-lg gap-2 py-5 px-5 text-lg animate-winner-header rounded-lg">
            <Swords size={18} className="text-amber-400" />
            <span className="font-bold text-lg text-amber-200">
              {winners.length > 1
                ? winners.map(w => w.name).join(' & ')
                : winners[0].name}
            </span>
            <Swords size={18} className="text-amber-400" />
          </div>
        )}
      </div>
    </header>
  );
}
