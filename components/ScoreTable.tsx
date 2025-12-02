'use client';

import { Player, getPlayerTotal } from '@/lib/game-state';
import { Category, CATEGORIES, CATEGORY_INFO } from '@/lib/scoring';
import ScoreCell from './ScoreCell';
import { Swords } from 'lucide-react';

interface ScoreTableProps {
  players: Player[];
  currentPlayerIndex: number;
  onSetScore: (playerId: string, category: Category, score: number | null) => void;
  winners?: Player[];
}

export default function ScoreTable({ players, currentPlayerIndex, onSetScore, winners = [] }: ScoreTableProps) {
  const isWinner = (playerId: string) => winners.some(w => w.id === playerId);
  return (
    <div className="overflow-x-auto overflow-y-visible">
      <table className="table table-zebra bg-base-200 rounded-lg text-base">
        <thead>
          <tr className="bg-base-300">
            <th className="text-primary font-[family-name:var(--font-cinzel)] text-lg w-24">Category</th>
            {players.map((player, index) => {
              const playerIsWinner = isWinner(player.id);
              const isCurrentPlayer = index === currentPlayerIndex && winners.length === 0;
              return (
                <th
                  key={player.id}
                  className={`text-center min-w-[100px] text-lg transition-colors ${
                    playerIsWinner
                      ? 'animate-winner-column'
                      : isCurrentPlayer
                        ? 'bg-primary text-primary-content'
                        : ''
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {(isCurrentPlayer || playerIsWinner) && <Swords size={18} className={playerIsWinner ? 'text-amber-400' : ''} />}
                    <span className={playerIsWinner ? 'text-amber-200' : ''}>{player.name}</span>
                    {(isCurrentPlayer || playerIsWinner) && <Swords size={18} className={playerIsWinner ? 'text-amber-400' : ''} />}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {CATEGORIES.map((category) => (
            <tr key={category}>
              <td className="font-medium text-base w-24">
                {CATEGORY_INFO[category].displayName}
                {CATEGORY_INFO[category].hasServido && (
                  <span className="text-sm text-base-content/50 ml-1">*</span>
                )}
              </td>
              {players.map((player, index) => (
                <ScoreCell
                  key={player.id}
                  category={category}
                  score={player.scores[category]}
                  onSetScore={(score) => onSetScore(player.id, category, score)}
                  isCurrentPlayer={index === currentPlayerIndex && winners.length === 0}
                  isWinner={isWinner(player.id)}
                />
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-base-300 font-bold text-xl">
            <td className="text-primary font-[family-name:var(--font-cinzel)] w-24">TOTAL</td>
            {players.map((player, index) => {
              const playerIsWinner = isWinner(player.id);
              const isCurrentPlayer = index === currentPlayerIndex && winners.length === 0;
              return (
                <td
                  key={player.id}
                  className={`text-center text-xl transition-colors ${
                    playerIsWinner
                      ? 'animate-winner-column text-amber-300'
                      : isCurrentPlayer
                        ? 'bg-primary/30 text-primary'
                        : 'text-primary'
                  }`}
                >
                  {getPlayerTotal(player)}
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>
      <p className="text-sm text-base-content/50 mt-2">
        * Categories marked with asterisk have +5 Servido bonus available
      </p>
    </div>
  );
}
