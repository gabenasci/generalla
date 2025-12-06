'use client';

import { useEffect } from 'react';
import { Player, getPlayerTotal } from '@/lib/game-state';
import { startVictoryConfetti, stopVictoryConfetti } from '@/lib/confetti';
import { Swords, Crown, Skull, Shield } from 'lucide-react';

interface VictoryDialogProps {
  winners: Player[];
  onRematch: () => void;
  onNewGame: () => void;
  onDismiss: () => void;
}

export default function VictoryDialog({ winners, onRematch, onNewGame, onDismiss }: VictoryDialogProps) {
  const isTie = winners.length > 1;
  const winningScore = getPlayerTotal(winners[0]);

  const handleDismiss = () => {
    stopVictoryConfetti();
    onDismiss();
  };

  useEffect(() => {
    startVictoryConfetti(isTie);

    return () => {
      stopVictoryConfetti();
    };
  }, [isTie]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Flames background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="flames-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="flame"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Dialog content */}
      <div className="relative z-10 max-w-lg w-full max-h-full overflow-y-auto animate-victory-entrance">
        <div className="bg-base-200/80 backdrop-blur-md rounded-2xl border-2 border-primary/50 shadow-2xl p-4 md:p-8 text-center relative">
          {/* Crown/Skull icon */}
          <div className="flex justify-center mb-2 md:mb-4">
            {isTie ? (
              <div className="flex items-center gap-2 md:gap-4">
                <Skull className="w-8 h-8 md:w-12 md:h-12 text-primary animate-pulse" />
                <Swords className="w-10 h-10 md:w-16 md:h-16 text-accent rotate-45" />
                <Skull className="w-8 h-8 md:w-12 md:h-12 text-primary animate-pulse" />
              </div>
            ) : (
              <Crown className="w-12 h-12 md:w-20 md:h-20 text-primary animate-victory-glow" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-3xl font-bold text-accent font-[family-name:var(--font-cinzel)] mb-3 md:mb-6 tracking-wider">
            {isTie ? 'WARRIORS MATCHED!' : 'GLORY TO THE VICTOR!'}
          </h2>

          {/* Winner name(s) - largest text */}
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
            <Swords className="w-6 h-6 md:w-8 md:h-8 text-primary hidden sm:block" />
            <h1 className="text-2xl xs:text-3xl md:text-5xl lg:text-6xl font-bold text-primary font-[family-name:var(--font-cinzel)] animate-victory-glow break-words max-w-[280px] sm:max-w-none">
              {isTie
                ? winners.map((w) => w.name).join(' & ')
                : winners[0].name}
            </h1>
            <Swords className="w-6 h-6 md:w-8 md:h-8 text-primary hidden sm:block" />
          </div>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-base-content/80 mb-1 md:mb-2 font-[family-name:var(--font-cinzel)]">
            {isTie ? 'Share Eternal Glory' : 'Enters Valhalla'}
          </p>

          {/* Score */}
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-8">
            <span className="text-2xl md:text-4xl font-bold text-accent">
              {winningScore}
            </span>
            <span className="text-lg md:text-xl text-base-content/70">points</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 md:gap-3 items-center">
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
              <button
                className="btn btn-primary btn-md md:btn-lg gap-2 font-[family-name:var(--font-cinzel)] text-base md:text-lg px-6 md:px-8"
                onClick={onRematch}
              >
                <Swords className="w-4 h-4 md:w-5 md:h-5" />
                Rematch
                <Swords className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button
                className="btn btn-ghost btn-md md:btn-lg gap-2 font-[family-name:var(--font-cinzel)] text-base md:text-lg border-primary/30"
                onClick={onNewGame}
              >
                <Shield className="w-4 h-4 md:w-5 md:h-5" />
                New Warriors
              </button>
            </div>

            <button
              className="text-sm text-base-content/40 hover:text-base-content/60 transition-colors mt-1 md:mt-2"
              onClick={handleDismiss}
            >
              view scoreboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
