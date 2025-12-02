'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Swords, Shield } from 'lucide-react';
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
      {/* Background Flames */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {/* Radial Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-home-entrance">
          {/* Decorative Icons */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-4">
            <Swords className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary/60 -rotate-45" />
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent" />
            <Swords className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary/60 rotate-45" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-primary font-[family-name:var(--font-cinzel)] mb-4 animate-victory-glow">
            Generalla
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-base-content/70 max-w-md mx-auto font-[family-name:var(--font-cinzel)] tracking-wide">
            Roll the dice, claim your glory, enter Valhalla
          </p>
        </div>

        {/* Content Area */}
        {!showSetup ? (
          <div className="bg-base-200/60 backdrop-blur-sm rounded-2xl border border-primary/30 p-6 md:p-8 shadow-2xl animate-victory-entrance">
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
          </div>
        ) : (
          <div className="animate-victory-entrance">
            <PlayerSetup onStartGame={handleStartGame} />
          </div>
        )}
      </div>

      <footer className="absolute bottom-4 text-center text-base-content/40 text-sm z-10">
        {VERSION}
      </footer>
    </main>
  );
}
