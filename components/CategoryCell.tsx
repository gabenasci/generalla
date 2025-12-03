'use client';

import { Category, CATEGORY_INFO } from '@/lib/scoring';
import DiceIcon from './DiceIcon';
import { HelpCircle } from 'lucide-react';

interface CategoryCellProps {
  category: Category;
  isShowingExample: boolean;
  onShowExample: () => void;
}

export default function CategoryCell({ category, isShowingExample, onShowExample }: CategoryCellProps) {
  const info = CATEGORY_INFO[category];
  const displayName = category === 'generala' ? 'Generalla' : info.displayName;

  return (
    <button
      onClick={onShowExample}
      className="relative flex items-center justify-between w-full h-full cursor-pointer"
      aria-label={`Show example for ${displayName}`}
    >
      {/* Category name - fades out when showing example */}
      <div
        className={`flex items-center transition-opacity duration-300 ${
          isShowingExample ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="hidden sm:inline">{displayName}</span>
        <span className="sm:hidden">{info.shortName || displayName}</span>
        {info.hasServido && (
          <span className="text-xs sm:text-sm text-base-content/50 ml-0.5 sm:ml-1">*</span>
        )}
      </div>

      {/* Help icon */}
      <div
        className={`flex-shrink-0 p-1 transition-opacity ${
          isShowingExample ? 'opacity-0' : 'opacity-60'
        }`}
      >
        <HelpCircle size={14} className="sm:w-4 sm:h-4" />
      </div>

      {/* Dice display - positioned absolutely, fades in */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-0.5 sm:gap-1 transition-opacity duration-300 ${
          isShowingExample ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {info.exampleHand.map((value, i) => (
          <DiceIcon
            key={i}
            value={value}
            size={12}
            className="sm:w-5 sm:h-5"
          />
        ))}
      </div>
    </button>
  );
}
