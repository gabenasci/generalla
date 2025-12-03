export const CATEGORIES = [
  'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
  'escalera', 'full', 'poker', 'generala'
] as const;

export type Category = typeof CATEGORIES[number];

export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export interface CategoryInfo {
  name: string;
  displayName: string;
  shortName?: string;  // Optional short name for mobile displays
  validScores: number[];
  maxScore: number;
  hasServido: boolean;
  exampleHand: [DiceValue, DiceValue, DiceValue, DiceValue, DiceValue];
}

export const CATEGORY_INFO: Record<Category, CategoryInfo> = {
  ones: {
    name: 'ones',
    displayName: 'Ones',
    validScores: [0, 1, 2, 3, 4, 5],
    maxScore: 5,
    hasServido: false,
    exampleHand: [1, 1, 1, 1, 1],
  },
  twos: {
    name: 'twos',
    displayName: 'Twos',
    validScores: [0, 2, 4, 6, 8, 10],
    maxScore: 10,
    hasServido: false,
    exampleHand: [2, 2, 2, 2, 2],
  },
  threes: {
    name: 'threes',
    displayName: 'Threes',
    validScores: [0, 3, 6, 9, 12, 15],
    maxScore: 15,
    hasServido: false,
    exampleHand: [3, 3, 3, 3, 3],
  },
  fours: {
    name: 'fours',
    displayName: 'Fours',
    validScores: [0, 4, 8, 12, 16, 20],
    maxScore: 20,
    hasServido: false,
    exampleHand: [4, 4, 4, 4, 4],
  },
  fives: {
    name: 'fives',
    displayName: 'Fives',
    validScores: [0, 5, 10, 15, 20, 25],
    maxScore: 25,
    hasServido: false,
    exampleHand: [5, 5, 5, 5, 5],
  },
  sixes: {
    name: 'sixes',
    displayName: 'Sixes',
    validScores: [0, 6, 12, 18, 24, 30],
    maxScore: 30,
    hasServido: false,
    exampleHand: [6, 6, 6, 6, 6],
  },
  escalera: {
    name: 'escalera',
    displayName: 'Escalera',
    shortName: 'Esc.',
    validScores: [0, 20, 25],
    maxScore: 25,
    hasServido: true,
    exampleHand: [1, 2, 3, 4, 5],
  },
  full: {
    name: 'full',
    displayName: 'Full',
    validScores: [0, 30, 35],
    maxScore: 35,
    hasServido: true,
    exampleHand: [3, 3, 3, 2, 2],
  },
  poker: {
    name: 'poker',
    displayName: 'Poker',
    validScores: [0, 40, 45],
    maxScore: 45,
    hasServido: true,
    exampleHand: [4, 4, 4, 4, 2],
  },
  generala: {
    name: 'generala',
    displayName: 'Generala',
    shortName: 'Gen.',
    validScores: [0, 50],
    maxScore: 50,
    hasServido: false,
    exampleHand: [5, 5, 5, 5, 5],
  },
};

export function isValidScore(category: Category, score: number): boolean {
  return CATEGORY_INFO[category].validScores.includes(score);
}

export function getServidoScore(category: Category): number | null {
  const info = CATEGORY_INFO[category];
  if (!info.hasServido) return null;
  return info.maxScore;
}

export function getNormalScore(category: Category): number | null {
  const info = CATEGORY_INFO[category];
  if (!info.hasServido) return null;
  return info.maxScore - 5;
}

export function calculateTotal(scores: Record<Category, number | null>): number {
  return CATEGORIES.reduce((total, cat) => {
    const score = scores[cat];
    return total + (score ?? 0);
  }, 0);
}
