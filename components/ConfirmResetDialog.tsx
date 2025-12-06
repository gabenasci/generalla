'use client';

import { Skull, Swords, X } from 'lucide-react';

interface ConfirmResetDialogProps {
  playerName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmResetDialog({ playerName, onConfirm, onCancel }: ConfirmResetDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog content */}
      <div className="relative z-10 max-w-md w-full animate-victory-entrance">
        <div className="bg-base-200/95 backdrop-blur-md rounded-2xl border-2 border-error/50 shadow-2xl p-6 text-center relative">
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-base-content/40 hover:text-base-content/80 transition-colors"
            onClick={onCancel}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <Skull className="w-12 h-12 text-error" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-error font-[family-name:var(--font-cinzel)] mb-4 tracking-wider">
            RESET BATTLE?
          </h2>

          {/* Message */}
          <p className="text-base-content/80 mb-2">
            Adding <span className="font-bold text-primary">{playerName}</span> will reset all scores.
          </p>
          <p className="text-base-content/60 text-sm mb-6">
            All warriors will start fresh with empty score sheets.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="btn btn-error btn-md gap-2 font-[family-name:var(--font-cinzel)]"
              onClick={onConfirm}
            >
              <Swords className="w-4 h-4" />
              Reset & Add
            </button>
            <button
              className="btn btn-ghost btn-md font-[family-name:var(--font-cinzel)] border-base-content/20"
              onClick={onCancel}
            >
              Keep Playing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
