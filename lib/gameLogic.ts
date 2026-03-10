import { DieValue, ScoreCategory, ScoreCard } from '@/types/game';
import {
  UPPER_BONUS,
  UPPER_BONUS_THRESHOLD,
  YAHTZEE_BONUS,
  FULL_HOUSE_SCORE,
  SMALL_STRAIGHT_SCORE,
  LARGE_STRAIGHT_SCORE,
  YAHTZEE_SCORE,
} from './constants';

export function rollDie(): DieValue {
  return (Math.floor(Math.random() * 6) + 1) as DieValue;
}

function countValues(dice: DieValue[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const d of dice) counts.set(d, (counts.get(d) || 0) + 1);
  return counts;
}

export function calculateScore(category: ScoreCategory, dice: DieValue[]): number {
  const counts = countValues(dice);
  const sum = dice.reduce((a, b) => a + b, 0);
  const vals = [...counts.values()].sort((a, b) => b - a);

  switch (category) {
    case 'ones':
      return dice.filter(d => d === 1).reduce((a, b) => a + b, 0);
    case 'twos':
      return dice.filter(d => d === 2).reduce((a, b) => a + b, 0);
    case 'threes':
      return dice.filter(d => d === 3).reduce((a, b) => a + b, 0);
    case 'fours':
      return dice.filter(d => d === 4).reduce((a, b) => a + b, 0);
    case 'fives':
      return dice.filter(d => d === 5).reduce((a, b) => a + b, 0);
    case 'sixes':
      return dice.filter(d => d === 6).reduce((a, b) => a + b, 0);
    case 'threeOfAKind':
      return vals[0] >= 3 ? sum : 0;
    case 'fourOfAKind':
      return vals[0] >= 4 ? sum : 0;
    case 'fullHouse':
      return vals[0] === 3 && vals[1] === 2 ? FULL_HOUSE_SCORE : 0;
    case 'smallStraight':
      return hasSmallStraight(dice) ? SMALL_STRAIGHT_SCORE : 0;
    case 'largeStraight':
      return hasLargeStraight(dice) ? LARGE_STRAIGHT_SCORE : 0;
    case 'yahtzee':
      return vals[0] === 5 ? YAHTZEE_SCORE : 0;
    case 'chance':
      return sum;
    default:
      return 0;
  }
}

function hasSmallStraight(dice: DieValue[]): boolean {
  const u = new Set(dice);
  return (
    (u.has(1) && u.has(2) && u.has(3) && u.has(4)) ||
    (u.has(2) && u.has(3) && u.has(4) && u.has(5)) ||
    (u.has(3) && u.has(4) && u.has(5) && u.has(6))
  );
}

function hasLargeStraight(dice: DieValue[]): boolean {
  const u = new Set(dice);
  return (
    (u.has(1) && u.has(2) && u.has(3) && u.has(4) && u.has(5)) ||
    (u.has(2) && u.has(3) && u.has(4) && u.has(5) && u.has(6))
  );
}

export function calculateUpperScore(scoreCard: ScoreCard): number {
  return (['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'] as ScoreCategory[]).reduce(
    (sum, cat) => sum + ((scoreCard[cat as keyof ScoreCard] as number) || 0),
    0
  );
}

export function calculateUpperBonus(scoreCard: ScoreCard): number {
  return calculateUpperScore(scoreCard) >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS : 0;
}

export function calculateTotalScore(scoreCard: ScoreCard): number {
  const upper = calculateUpperScore(scoreCard);
  const bonus = upper >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS : 0;
  const lower = (
    [
      'threeOfAKind',
      'fourOfAKind',
      'fullHouse',
      'smallStraight',
      'largeStraight',
      'yahtzee',
      'chance',
    ] as ScoreCategory[]
  ).reduce((sum, cat) => sum + ((scoreCard[cat as keyof ScoreCard] as number) || 0), 0);
  return upper + bonus + lower + (scoreCard.yahtzeeBonuses || 0) * YAHTZEE_BONUS;
}

export function getAvailableCategories(scoreCard: ScoreCard): ScoreCategory[] {
  const all: ScoreCategory[] = [
    'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
    'threeOfAKind', 'fourOfAKind', 'fullHouse',
    'smallStraight', 'largeStraight', 'yahtzee', 'chance',
  ];
  return all.filter(cat => scoreCard[cat as keyof ScoreCard] === undefined);
}

export function isScoreCardComplete(scoreCard: ScoreCard): boolean {
  return getAvailableCategories(scoreCard).length === 0;
}

export function isYahtzee(dice: DieValue[]): boolean {
  return new Set(dice).size === 1;
}

// Unused but exported for completeness
export { YAHTZEE_BONUS };
