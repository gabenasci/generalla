'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Swords, Shield, Flame, Axe, Crown, Skull } from 'lucide-react';
import PlayerSetup from '@/components/PlayerSetup';
import { createGame } from '@/lib/game-state';
import { saveGame, loadGame, clearGame } from '@/lib/storage';
import { VERSION } from '@/lib/version';

export default function Home() {
  const router = useRouter();
  const [hasExistingGame, setHasExistingGame] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    const existingGame = loadGame();
    setHasExistingGame(existingGame !== null && !existingGame.isComplete);
  }, []);

  const handleStartGame = (playerNames: string[]) => {
    const game = createGame(playerNames);
    saveGame(game);
    router.push('/game');
  };

  const handleContinueGame = () => {
    router.push('/game');
  };

  const handleNewGame = () => {
    clearGame();
    setHasExistingGame(false);
    setShowSetup(true);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-100 relative overflow-hidden">
      {/* Layer 1: Large Background Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Shield className="absolute top-[10%] left-[5%] w-20 h-20 md:w-32 md:h-32 text-primary/[0.15] float-drift" />
        <Swords className="absolute top-[15%] right-[8%] w-16 h-16 md:w-28 md:h-28 text-primary/[0.12] float-drift-reverse rotate-45" />
        <Axe className="absolute top-[45%] left-[3%] w-14 h-14 md:w-24 md:h-24 text-accent/[0.10] float-drift hidden md:block" />
        <Crown className="absolute top-[40%] right-[5%] w-12 h-12 md:w-20 md:h-20 text-primary/[0.08] slow-spin hidden md:block" />
        <Skull className="absolute bottom-[25%] left-[8%] w-16 h-16 md:w-24 md:h-24 text-accent/[0.12] pulse-subtle" />
        <Shield className="absolute bottom-[20%] right-[5%] w-20 h-20 md:w-28 md:h-28 text-primary/[0.15] float-drift-reverse" />
      </div>

      {/* Layer 2: Background Flames */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
        <div className="flames-container flames-ambient">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="flame flame-ambient"
              style={{
                left: `${i * 6.67}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: `${1.8 + Math.random() * 0.6}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Layer 3: Radial Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />

      {/* Layer 4: Main Content */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Epic Frame wrapping everything */}
        <div className="epic-frame animate-victory-entrance">
          {/* Hero Content */}
          <div className="text-center animate-home-entrance">
            {/* Large Decorative Icons with Glow */}
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-4">
              <Swords className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 text-primary -rotate-45 icon-glow-left" />
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 text-accent icon-glow-center" />
              <Swords className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 text-primary rotate-45 icon-glow-right" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-primary font-[family-name:var(--font-cinzel)] mb-4 animate-victory-glow">
              Generalla
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-base-content/70 max-w-md mx-auto font-[family-name:var(--font-cinzel)] tracking-wide mb-8">
              Roll the dice, claim your glory, enter Valhalla
            </p>

            {/* Buttons / Setup inside the frame */}
            {!showSetup ? (
              <div className="flex flex-col gap-4 items-center">
                {hasExistingGame && (
                  <button
                    className="btn btn-primary btn-lg w-full sm:w-auto gap-2 font-[family-name:var(--font-cinzel)] btn-epic-glow group"
                    onClick={handleContinueGame}
                  >
                    <Swords className="w-5 h-5 transition-transform group-hover:-rotate-12" />
                    Continue Battle
                    <Swords className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  </button>
                )}
                <button
                  className={`btn btn-lg w-full sm:w-auto gap-2 font-[family-name:var(--font-cinzel)] btn-epic-glow ${
                    hasExistingGame ? 'btn-ghost border-primary/30' : 'btn-primary'
                  }`}
                  onClick={handleNewGame}
                >
                  <Shield className="w-5 h-5" />
                  New Game
                </button>
              </div>
            ) : (
              <PlayerSetup onStartGame={handleStartGame} />
            )}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-4 text-center text-base-content/40 text-sm z-40">
        {VERSION}
      </footer>
    </main>
  );
}
