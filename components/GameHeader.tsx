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
}

export default function GameHeader({
  players,
  currentPlayerIndex,
  isComplete,
  onNewGame,
  onUndo,
  canUndo,
}: GameHeaderProps) {
  const currentPlayer = players[currentPlayerIndex];

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
        <button className="btn btn-ghost" onClick={onNewGame}>
          New Game
        </button>

        {!isComplete && currentPlayer && (
          <div className="badge badge-primary badge-lg gap-2 py-5 px-5 text-lg">
            <Swords size={18} />
            <span className="font-bold text-lg">{currentPlayer.name}</span>
            <Swords size={18} />
          </div>
        )}
      </div>
    </header>
  );
}
