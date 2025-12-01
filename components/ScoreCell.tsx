'use client';

import { useRef, useEffect } from 'react';
import { Category, CATEGORY_INFO } from '@/lib/scoring';

interface ScoreCellProps {
  category: Category;
  score: number | null;
  onSetScore: (score: number | null) => void;
  disabled?: boolean;
  isCurrentPlayer?: boolean;
}

export default function ScoreCell({
  category,
  score,
  onSetScore,
  disabled = false,
  isCurrentPlayer = false,
}: ScoreCellProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const info = CATEGORY_INFO[category];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        detailsRef.current.open = false;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: number | null) => {
    onSetScore(value);
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  const cellBg = isCurrentPlayer ? 'bg-base-300' : '';

  if (disabled) {
    return <td className={`text-center text-base-content/30 ${cellBg}`}>-</td>;
  }

  const hasScore = score !== null;
  const displayValue = hasScore
    ? (score === 0 ? <span className="text-error line-through opacity-60 text-lg">0</span> : <span className="text-success font-bold text-lg">{score}</span>)
    : <span className="text-primary text-xl">+</span>;

  return (
    <td className={`text-center p-1 transition-colors ${cellBg}`}>
      <details ref={detailsRef} className="dropdown dropdown-end">
        <summary className="btn btn-ghost btn-sm w-full list-none cursor-pointer">
          {displayValue}
        </summary>
        <ul className="dropdown-content z-50 menu p-2 shadow-lg bg-base-300 rounded-box min-w-[140px]">
          <li className="menu-title text-xs">{info.displayName}</li>
          {info.validScores.map((value) => (
            <li key={value}>
              <button
                onClick={() => handleSelect(value)}
                className={`${value === 0 ? 'text-error' : ''} ${value === score ? 'bg-primary/20' : ''}`}
              >
                {value === 0 ? 'Scratch (0)' : value}
                {info.hasServido && value === info.maxScore && (
                  <span className="badge badge-primary badge-xs ml-1">Servido</span>
                )}
              </button>
            </li>
          ))}
          {hasScore && (
            <>
              <li className="divider my-1"></li>
              <li>
                <button
                  onClick={() => handleSelect(null)}
                  className="text-warning"
                >
                  Reset
                </button>
              </li>
            </>
          )}
        </ul>
      </details>
    </td>
  );
}
