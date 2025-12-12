import { Category, CATEGORIES, BASE_CATEGORIES, calculateTotal } from './scoring';

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
  doubleGeneralaUnlocked: boolean;
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
    doubleGeneralaUnlocked: false,
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

  // Check if double generalla should be unlocked (any player scores generala > 0)
  const doubleGeneralaUnlocked = game.doubleGeneralaUnlocked ||
    updatedPlayers.some(player => {
      const generalaScore = player.scores['generala'];
      return generalaScore !== null && generalaScore > 0;
    });

  const isComplete = checkGameComplete(updatedPlayers, doubleGeneralaUnlocked);

  return {
    ...game,
    players: updatedPlayers,
    isComplete,
    doubleGeneralaUnlocked,
  };
}

export function checkGameComplete(players: Player[], doubleGeneralaUnlocked: boolean = false): boolean {
  // Base categories must always be completed
  const baseComplete = players.every(player =>
    BASE_CATEGORIES.every(cat => player.scores[cat] !== null)
  );

  if (!baseComplete) return false;

  // If double generalla is unlocked, it must also be completed for all players
  if (doubleGeneralaUnlocked) {
    return players.every(player => player.scores['doubleGenerala'] !== null);
  }

  return true;
}

// Check if a player can score double generalla (must have scored generala > 0)
export function canPlayerScoreDoubleGenerala(player: Player): boolean {
  const generalaScore = player.scores['generala'];
  return generalaScore !== null && generalaScore > 0;
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

export function gameHasAnyScores(game: GameState): boolean {
  return game.players.some(player =>
    CATEGORIES.some(cat => player.scores[cat] !== null)
  );
}

export function addPlayerToGame(game: GameState, playerName: string): GameState {
  const newPlayer = createPlayer(playerName);
  return {
    ...game,
    players: [...game.players, newPlayer],
  };
}

export function resetGameScores(game: GameState): GameState {
  return {
    ...game,
    players: game.players.map(player => ({
      ...player,
      scores: createEmptyScores(),
    })),
    currentPlayerIndex: 0,
    isComplete: false,
    doubleGeneralaUnlocked: false,
  };
}
