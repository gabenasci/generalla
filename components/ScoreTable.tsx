'use client';

import { Player, getPlayerTotal } from '@/lib/game-state';
import { Category, CATEGORIES, CATEGORY_INFO } from '@/lib/scoring';
import ScoreCell from './ScoreCell';
import { Swords } from 'lucide-react';

interface ScoreTableProps {
  players: Player[];
  currentPlayerIndex: number;
  onSetScore: (playerId: string, category: Category, score: number | null) => void;
}

export default function ScoreTable({ players, currentPlayerIndex, onSetScore }: ScoreTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra bg-base-200 rounded-lg text-base">
        <thead>
          <tr className="bg-base-300">
            <th className="text-primary font-[family-name:var(--font-cinzel)] text-lg w-24">Category</th>
            {players.map((player, index) => (
              <th
                key={player.id}
                className={`text-center min-w-[100px] text-lg transition-colors ${
                  index === currentPlayerIndex
                    ? 'bg-primary text-primary-content'
                    : ''
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  {index === currentPlayerIndex && <Swords size={18} />}
                  {player.name}
                  {index === currentPlayerIndex && <Swords size={18} />}
                </span>
              </th>
            ))}
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
                  isCurrentPlayer={index === currentPlayerIndex}
                />
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-base-300 font-bold text-xl">
            <td className="text-primary font-[family-name:var(--font-cinzel)] w-24">TOTAL</td>
            {players.map((player, index) => (
              <td
                key={player.id}
                className={`text-center text-xl transition-colors ${
                  index === currentPlayerIndex
                    ? 'bg-primary/30 text-primary'
                    : 'text-primary'
                }`}
              >
                {getPlayerTotal(player)}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
      <p className="text-sm text-base-content/50 mt-2">
        * Categories marked with asterisk have +5 Servido bonus available
      </p>
    </div>
  );
}
