'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameHeader from '@/components/GameHeader';
import ScoreTable from '@/components/ScoreTable';
import WinnerBanner from '@/components/WinnerBanner';
import { GameState, setScore, getWinners } from '@/lib/game-state';
import { Category } from '@/lib/scoring';
import { loadGame, saveGame, clearGame } from '@/lib/storage';

export default function GamePage() {
  const router = useRouter();
  const [game, setGame] = useState<GameState | null>(null);
  const [previousGame, setPreviousGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedGame = loadGame();
    if (!savedGame) {
      router.push('/');
      return;
    }
    setGame(savedGame);
    setLoading(false);
  }, [router]);

  const handleSetScore = (playerId: string, category: Category, score: number | null) => {
    if (!game) return;

    // Only track undo for score sets (not resets)
    if (score !== null) {
      setPreviousGame(game);
    }

    // Find the index of the player who just scored
    const scorerIndex = game.players.findIndex(p => p.id === playerId);

    let updatedGame = setScore(game, playerId, category, score);

    // Only advance player when setting a score (not when resetting)
    // Set next player based on WHO scored, not current turn
    // Handles: wrap-around, edits, single player (stays at 0)
    if (score !== null && !updatedGame.isComplete) {
      const nextPlayerIndex = (scorerIndex + 1) % game.players.length;
      updatedGame = { ...updatedGame, currentPlayerIndex: nextPlayerIndex };
    }

    setGame(updatedGame);
    saveGame(updatedGame);
  };

  const handleNewGame = () => {
    clearGame();
    router.push('/');
  };

  const handleUndo = () => {
    if (!previousGame) return;
    setGame(previousGame);
    saveGame(previousGame);
    setPreviousGame(null);
  };

  if (loading || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const winners = getWinners(game);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <GameHeader
        players={game.players}
        currentPlayerIndex={game.currentPlayerIndex}
        isComplete={game.isComplete}
        onNewGame={handleNewGame}
        onUndo={handleUndo}
        canUndo={previousGame !== null}
      />

      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        {game.isComplete && winners.length > 0 && (
          <div className="mb-6">
            <WinnerBanner winners={winners} onNewGame={handleNewGame} />
          </div>
        )}

        <ScoreTable
          players={game.players}
          currentPlayerIndex={game.currentPlayerIndex}
          onSetScore={handleSetScore}
        />
      </main>
    </div>
  );
}
