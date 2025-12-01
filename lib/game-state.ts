import { Category, CATEGORIES, calculateTotal } from './scoring';

export interface Player {
  id: string;
  name: string;
  scores: Record<Category, number | null>;
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  isComplete: boolean;
  createdAt: number;
}

export function createEmptyScores(): Record<Category, number | null> {
  return CATEGORIES.reduce((acc, cat) => {
    acc[cat] = null;
    return acc;
  }, {} as Record<Category, number | null>);
}

export function createPlayer(name: string): Player {
  return {
    id: crypto.randomUUID(),
    name,
    scores: createEmptyScores(),
  };
}

export function createGame(playerNames: string[]): GameState {
  return {
    id: crypto.randomUUID(),
    players: playerNames.map(name => createPlayer(name)),
    currentPlayerIndex: 0,
    isComplete: false,
    createdAt: Date.now(),
  };
}

export function setScore(
  game: GameState,
  playerId: string,
  category: Category,
  score: number | null
): GameState {
  const updatedPlayers = game.players.map(player => {
    if (player.id !== playerId) return player;
    return {
      ...player,
      scores: {
        ...player.scores,
        [category]: score,
      },
    };
  });

  const isComplete = checkGameComplete(updatedPlayers);

  return {
    ...game,
    players: updatedPlayers,
    isComplete,
  };
}

export function checkGameComplete(players: Player[]): boolean {
  return players.every(player =>
    CATEGORIES.every(cat => player.scores[cat] !== null)
  );
}

export function getPlayerTotal(player: Player): number {
  return calculateTotal(player.scores);
}

export function getWinners(game: GameState): Player[] {
  if (!game.isComplete) return [];

  const totals = game.players.map(p => ({
    player: p,
    total: getPlayerTotal(p),
  }));

  const maxTotal = Math.max(...totals.map(t => t.total));
  return totals.filter(t => t.total === maxTotal).map(t => t.player);
}

export function advancePlayer(game: GameState): GameState {
  const nextIndex = (game.currentPlayerIndex + 1) % game.players.length;
  return {
    ...game,
    currentPlayerIndex: nextIndex,
  };
}
