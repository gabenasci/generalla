'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameHeader from '@/components/GameHeader';
import ScoreTable from '@/components/ScoreTable';
import VictoryDialog from '@/components/VictoryDialog';
import AddPlayerDialog from '@/components/AddPlayerDialog';
import ConfirmResetDialog from '@/components/ConfirmResetDialog';
import { GameState, setScore, getWinners, createGame, gameHasAnyScores, addPlayerToGame, resetGameScores } from '@/lib/game-state';
import { Category } from '@/lib/scoring';

interface CelebratingCell {
  playerId: string;
  category: Category;
}
import { loadGame, saveGame, clearGame, savePreviousPlayers } from '@/lib/storage';

export default function GamePage() {
  const router = useRouter();
  const [game, setGame] = useState<GameState | null>(null);
  const [previousGame, setPreviousGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [flashNewGame, setFlashNewGame] = useState(false);
  const [showVictoryDialog, setShowVictoryDialog] = useState(true);
  const [celebratingCell, setCelebratingCell] = useState<CelebratingCell | null>(null);
  const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false);
  const [showConfirmResetDialog, setShowConfirmResetDialog] = useState(false);
  const [pendingPlayerName, setPendingPlayerName] = useState('');

  useEffect(() => {
    let savedGame = loadGame();

    // Dev mode: add more mock players if URL param is set
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('dev-6players')) {
      if (savedGame && savedGame.players.length < 6) {
        const mockNames = ['Soren', 'Freya', 'Bjorn', 'Astrid the Mighty Warrior King of the North', 'Saga'];
        const newPlayers = savedGame.players;
        while (newPlayers.length < 6) {
          const player = mockNames[newPlayers.length - 1];
          if (player) {
            newPlayers.push({
              id: `mock-${player}`,
              name: player,
              scores: savedGame.players[0].scores
            });
          }
        }
        savedGame = { ...savedGame, players: newPlayers };
      }
    }

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
      // Start celebration animation
      setCelebratingCell({ playerId, category });
    }

    // Find the index of the player who just scored
    const scorerIndex = game.players.findIndex(p => p.id === playerId);

    const updatedGame = setScore(game, playerId, category, score);

    // Update score immediately (player sees their score right away)
    setGame(updatedGame);
    saveGame(updatedGame);

    // Show victory dialog when game completes
    if (updatedGame.isComplete && !game.isComplete) {
      setShowVictoryDialog(true);
    }

    // Advance player after delay (only for score sets, not resets)
    // This gives the scoring player time to see their score before turn switches
    if (score !== null && !updatedGame.isComplete) {
      setTimeout(() => {
        setCelebratingCell(null); // End celebration
        setGame(currentGame => {
          // Verify game state hasn't changed (e.g., undo wasn't pressed)
          if (currentGame === updatedGame) {
            const nextPlayerIndex = (scorerIndex + 1) % game.players.length;
            const advancedGame = { ...currentGame, currentPlayerIndex: nextPlayerIndex };
            saveGame(advancedGame);
            return advancedGame;
          }
          return currentGame;
        });
      }, 2000);
    }
  };

  const handleNewGame = () => {
    clearGame();
    router.push('/');
  };

  const handleRematch = () => {
    if (!game) return;
    const playerNames = game.players.map(p => p.name);
    savePreviousPlayers(playerNames);
    const newGame = createGame(playerNames);
    saveGame(newGame);
    setGame(newGame);
    setPreviousGame(null);
    setShowVictoryDialog(false);
    setCelebratingCell(null);
  };

  const handleUndo = () => {
    if (!previousGame) return;
    setGame(previousGame);
    saveGame(previousGame);
    setPreviousGame(null);
  };

  const handleDismissVictory = () => {
    setShowVictoryDialog(false);
  };

  const handleAddPlayerRequest = () => {
    setShowAddPlayerDialog(true);
  };

  const handleAddPlayer = (name: string) => {
    if (!game) return;

    if (gameHasAnyScores(game)) {
      setPendingPlayerName(name);
      setShowAddPlayerDialog(false);
      setShowConfirmResetDialog(true);
    } else {
      const updatedGame = addPlayerToGame(game, name);
      setGame(updatedGame);
      saveGame(updatedGame);
      setShowAddPlayerDialog(false);
    }
  };

  const handleConfirmReset = () => {
    if (!game) return;

    let updatedGame = resetGameScores(game);
    updatedGame = addPlayerToGame(updatedGame, pendingPlayerName);
    setGame(updatedGame);
    saveGame(updatedGame);
    setPreviousGame(null);
    setShowConfirmResetDialog(false);
    setPendingPlayerName('');
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
    <div className="min-h-screen flex flex-col bg-base-100 relative overflow-hidden">
      {/* Background Flames */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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

      <div className="relative z-10">
        <GameHeader
          players={game.players}
          currentPlayerIndex={game.currentPlayerIndex}
          isComplete={game.isComplete}
          onNewGame={handleNewGame}
          onUndo={handleUndo}
          canUndo={previousGame !== null}
          winners={winners}
          flashNewGame={flashNewGame}
          celebratingPlayerId={celebratingCell?.playerId}
        />
      </div>

      {/* Victory Dialog - fixed overlay */}
      {game.isComplete && winners.length > 0 && showVictoryDialog && (
        <VictoryDialog
          winners={winners}
          onRematch={handleRematch}
          onNewGame={handleNewGame}
          onDismiss={handleDismissVictory}
        />
      )}

      {/* Add Player Dialog */}
      {showAddPlayerDialog && (
        <AddPlayerDialog
          existingNames={game.players.map(p => p.name)}
          onAddPlayer={handleAddPlayer}
          onClose={() => setShowAddPlayerDialog(false)}
        />
      )}

      {/* Confirm Reset Dialog */}
      {showConfirmResetDialog && (
        <ConfirmResetDialog
          playerName={pendingPlayerName}
          onConfirm={handleConfirmReset}
          onCancel={() => {
            setShowConfirmResetDialog(false);
            setPendingPlayerName('');
          }}
        />
      )}

      <main className="flex-1 p-4 md:p-8 w-full md:w-fit max-w-6xl mx-auto relative z-10">
        <ScoreTable
          players={game.players}
          currentPlayerIndex={game.currentPlayerIndex}
          onSetScore={handleSetScore}
          winners={winners}
          celebratingCell={celebratingCell}
          onAddPlayer={handleAddPlayerRequest}
          gameComplete={game.isComplete}
        />
      </main>
    </div>
  );
}
