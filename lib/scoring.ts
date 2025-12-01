export const CATEGORIES = [
  'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
  'escalera', 'full', 'poker', 'generala'
] as const;

export type Category = typeof CATEGORIES[number];

export interface CategoryInfo {
  name: string;
  displayName: string;
  validScores: number[];
  maxScore: number;
  hasServido: boolean;
}

export const CATEGORY_INFO: Record<Category, CategoryInfo> = {
  ones: {
    name: 'ones',
    displayName: 'Ones',
    validScores: [0, 1, 2, 3, 4, 5],
    maxScore: 5,
    hasServido: false,
  },
  twos: {
    name: 'twos',
    displayName: 'Twos',
    validScores: [0, 2, 4, 6, 8, 10],
    maxScore: 10,
    hasServido: false,
  },
  threes: {
    name: 'threes',
    displayName: 'Threes',
    validScores: [0, 3, 6, 9, 12, 15],
    maxScore: 15,
    hasServido: false,
  },
  fours: {
    name: 'fours',
    displayName: 'Fours',
    validScores: [0, 4, 8, 12, 16, 20],
    maxScore: 20,
    hasServido: false,
  },
  fives: {
    name: 'fives',
    displayName: 'Fives',
    validScores: [0, 5, 10, 15, 20, 25],
    maxScore: 25,
    hasServido: false,
  },
  sixes: {
    name: 'sixes',
    displayName: 'Sixes',
    validScores: [0, 6, 12, 18, 24, 30],
    maxScore: 30,
    hasServido: false,
  },
  escalera: {
    name: 'escalera',
    displayName: 'Escalera',
    validScores: [0, 20, 25],
    maxScore: 25,
    hasServido: true,
  },
  full: {
    name: 'full',
    displayName: 'Full',
    validScores: [0, 30, 35],
    maxScore: 35,
    hasServido: true,
  },
  poker: {
    name: 'poker',
    displayName: 'Poker',
    validScores: [0, 40, 45],
    maxScore: 45,
    hasServido: true,
  },
  generala: {
    name: 'generala',
    displayName: 'Generala',
    validScores: [0, 50],
    maxScore: 50,
    hasServido: false,
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
