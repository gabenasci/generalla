'use client';

import { useRef, useEffect, useState } from 'react';
import { Category, CATEGORY_INFO } from '@/lib/scoring';

interface ScoreCellProps {
  category: Category;
  score: number | null;
  onSetScore: (score: number | null) => void;
  disabled?: boolean;
  isCurrentPlayer?: boolean;
  isWinner?: boolean;
  isCelebrating?: boolean;
}

interface DropdownPosition {
  top?: number;
  bottom?: number;
  left: number;
  minWidth: number;
}

export default function ScoreCell({
  category,
  score,
  onSetScore,
  disabled = false,
  isCurrentPlayer = false,
  isWinner = false,
  isCelebrating = false,
}: ScoreCellProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const info = CATEGORY_INFO[category];

  const handleOpen = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 300; // approximate max height
    const dropdownWidth = 140;

    // Calculate left position, ensuring it stays within viewport
    let left = rect.left + (rect.width / 2) - (dropdownWidth / 2);
    left = Math.max(8, Math.min(left, window.innerWidth - dropdownWidth - 8));

    if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
      // Open downward
      setPosition({ top: rect.bottom + 4, left, minWidth: dropdownWidth });
    } else {
      // Open upward
      setPosition({ bottom: window.innerHeight - rect.top + 4, left, minWidth: dropdownWidth });
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setPosition(null);
  };

  const handleSelect = (value: number | null) => {
    onSetScore(value);
    handleClose();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        handleClose();
      }
    };

    // Small delay to avoid immediate close on the same click that opened it
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on scroll to prevent stale position
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => handleClose();
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  const cellBg = isCelebrating
    ? 'animate-score-triumph'
    : isWinner
      ? 'animate-winner-cell'
      : isCurrentPlayer
        ? 'bg-base-300'
        : '';

  if (disabled) {
    return <div className={`text-center text-base-content/30 ${cellBg}`}>-</div>;
  }

  const hasScore = score !== null;
  const displayValue = hasScore
    ? (score === 0
        ? <span className="text-error line-through opacity-60 text-lg">0</span>
        : <span className={`font-bold text-lg ${isCelebrating ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-success'}`}>{score}</span>)
    : <span className="text-primary text-xl">+</span>;

  return (
    <div className={`text-center p-1 sm:p-1.5 transition-colors w-full ${cellBg}`}>
      <button
        ref={buttonRef}
        onClick={isOpen ? handleClose : handleOpen}
        className="btn btn-ghost btn-sm sm:btn-md w-full min-h-[36px] sm:min-h-[44px] cursor-pointer"
      >
        {displayValue}
      </button>

      {isOpen && position && (
        <ul
          ref={dropdownRef}
          className="fixed z-[100] menu p-2 bg-base-300 rounded-box ring-1 ring-primary/30 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
          style={{
            top: position.top,
            bottom: position.bottom,
            left: position.left,
            minWidth: position.minWidth,
          }}
        >
          <li className="menu-title text-xs">{info.displayName}</li>
          {info.validScores.map((value) => (
            <li key={value}>
              <button
                onClick={() => handleSelect(value)}
                className={`min-h-[40px] ${value === 0 ? 'text-error' : ''} ${value === score ? 'bg-primary/20' : ''}`}
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
      )}
    </div>
  );
}
