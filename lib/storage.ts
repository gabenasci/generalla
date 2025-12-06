import { GameState } from './game-state';

const STORAGE_KEY = 'generalla_current_game';
const PREVIOUS_PLAYERS_KEY = 'generalla_previous_players';

export function saveGame(game: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

export function loadGame(): GameState | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as GameState;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
}

export function clearGame(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear game:', e);
  }
}

export function hasExistingGame(): boolean {
  return loadGame() !== null;
}

export function savePreviousPlayers(playerNames: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREVIOUS_PLAYERS_KEY, JSON.stringify(playerNames));
  } catch (e) {
    console.error('Failed to save previous players:', e);
  }
}

export function loadPreviousPlayers(): string[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(PREVIOUS_PLAYERS_KEY);
    if (!data) return null;
    return JSON.parse(data) as string[];
  } catch (e) {
    console.error('Failed to load previous players:', e);
    return null;
  }
}
