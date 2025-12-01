'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlayerSetup from '@/components/PlayerSetup';
import { createGame } from '@/lib/game-state';
import { saveGame, loadGame, clearGame } from '@/lib/storage';

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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-100">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-primary font-[family-name:var(--font-cinzel)] mb-4">
          Generalla
        </h1>
        <p className="text-xl text-base-content/70 max-w-md mx-auto">
          Roll the dice, claim your glory, enter Valhalla
        </p>
      </div>

      {!showSetup ? (
        <div className="flex flex-col gap-4 items-center">
          {hasExistingGame && (
            <button
              className="btn btn-primary btn-lg font-[family-name:var(--font-cinzel)]"
              onClick={handleContinueGame}
            >
              Continue Battle
            </button>
          )}
          <button
            className={`btn btn-lg font-[family-name:var(--font-cinzel)] ${
              hasExistingGame ? 'btn-ghost' : 'btn-primary'
            }`}
            onClick={handleNewGame}
          >
            New Game
          </button>
        </div>
      ) : (
        <PlayerSetup onStartGame={handleStartGame} />
      )}

      <footer className="absolute bottom-4 text-center text-base-content/40 text-sm">
        A Norse-themed Generala dice game tracker
      </footer>
    </main>
  );
}
