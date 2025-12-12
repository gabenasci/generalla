'use client';

import { useEffect } from 'react';
import { Swords } from 'lucide-react';
import { fireUnlockConfetti } from '@/lib/confetti';

interface DoubleGeneralaUnlockModalProps {
  playerName: string;
  onDismiss: () => void;
}

export default function DoubleGeneralaUnlockModal({ playerName, onDismiss }: DoubleGeneralaUnlockModalProps) {
  useEffect(() => {
    // Fire confetti on mount
    fireUnlockConfetti();

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

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
      <div className="relative z-10 max-w-lg w-full animate-victory-entrance">
        <div className="bg-base-200/80 backdrop-blur-md rounded-2xl border-2 border-primary/50 shadow-2xl p-6 md:p-10 text-center">
          {/* Double crossed swords icon */}
          <div className="flex justify-center mb-4 md:mb-6 animate-crossed-swords-glow">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              {/* Left sword - rotated */}
              <Swords
                className="absolute top-1/2 left-1/2 w-16 h-16 md:w-20 md:h-20 text-primary"
                style={{
                  transform: 'translate(-70%, -50%) rotate(-30deg)',
                }}
              />
              {/* Right sword - rotated opposite */}
              <Swords
                className="absolute top-1/2 left-1/2 w-16 h-16 md:w-20 md:h-20 text-primary"
                style={{
                  transform: 'translate(-30%, -50%) rotate(30deg) scaleX(-1)',
                }}
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-3xl font-bold text-primary font-[family-name:var(--font-cinzel)] mb-2 md:mb-4 tracking-wider animate-unlock-title-glow">
            DOUBLE GENERALLA
          </h2>
          <h3 className="text-2xl md:text-4xl font-bold text-accent font-[family-name:var(--font-cinzel)] mb-4 md:mb-6 tracking-widest animate-victory-glow">
            UNLOCKED!
          </h3>

          {/* Player name */}
          <p className="text-base md:text-lg text-base-content/90 mb-2 font-[family-name:var(--font-cinzel)]">
            <span className="text-primary font-bold">{playerName}</span>
          </p>
          <p className="text-sm md:text-base text-base-content/70 font-[family-name:var(--font-cinzel)]">
            has awakened the ancient power!
          </p>
        </div>
      </div>
    </div>
  );
}
