import { ScoreCategory } from '@/types/game';

export const TOTAL_ROUNDS = 13;
export const DICE_COUNT = 5;
export const MAX_ROLLS = 3;
export const UPPER_BONUS_THRESHOLD = 63;
export const UPPER_BONUS = 35;
export const FULL_HOUSE_SCORE = 25;
export const SMALL_STRAIGHT_SCORE = 30;
export const LARGE_STRAIGHT_SCORE = 40;
export const YAHTZEE_SCORE = 50;
export const YAHTZEE_BONUS = 100;

export const CATEGORY_LABELS: Record<string, string> = {
  ones: 'Ones',
  twos: 'Twos',
  threes: 'Threes',
  fours: 'Fours',
  fives: 'Fives',
  sixes: 'Sixes',
  threeOfAKind: 'Three of a Kind',
  fourOfAKind: 'Four of a Kind',
  fullHouse: 'Full House',
  smallStraight: 'Sm. Straight',
  largeStraight: 'Lg. Straight',
  yahtzee: 'YAHTZEE',
  chance: 'Chance',
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  ones: 'Sum of all 1s',
  twos: 'Sum of all 2s',
  threes: 'Sum of all 3s',
  fours: 'Sum of all 4s',
  fives: 'Sum of all 5s',
  sixes: 'Sum of all 6s',
  threeOfAKind: 'Sum all if 3+ same',
  fourOfAKind: 'Sum all if 4+ same',
  fullHouse: '25 pts - 3+2',
  smallStraight: '30 pts - 4 seq',
  largeStraight: '40 pts - 5 seq',
  yahtzee: '50 pts - 5 same',
  chance: 'Sum of all dice',
};

export const UPPER_CATEGORIES: ScoreCategory[] = [
  'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
];

export const LOWER_CATEGORIES: ScoreCategory[] = [
  'threeOfAKind', 'fourOfAKind', 'fullHouse',
  'smallStraight', 'largeStraight', 'yahtzee', 'chance',
];
