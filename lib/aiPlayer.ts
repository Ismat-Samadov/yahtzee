import { Die, DieValue, ScoreCard, ScoreCategory } from '@/types/game';
import { calculateScore, getAvailableCategories, isYahtzee } from './gameLogic';

// Easy AI: random strategy with some bias toward pairs
export function easyAIKeepDice(dice: Die[]): number[] {
  const heldIds: number[] = [];
  const counts = new Map<DieValue, number[]>();

  dice.forEach(d => {
    if (!counts.has(d.value)) counts.set(d.value, []);
    counts.get(d.value)!.push(d.id);
  });

  counts.forEach((ids) => {
    if (ids.length > 1 || Math.random() > 0.6) {
      heldIds.push(...ids.slice(0, Math.random() > 0.5 ? ids.length : 1));
    }
  });

  return heldIds;
}

export function easyAIChooseCategory(dice: DieValue[], scoreCard: ScoreCard): ScoreCategory {
  const available = getAvailableCategories(scoreCard);
  return available[Math.floor(Math.random() * available.length)];
}

// Hard AI: smart strategy
export function hardAIKeepDice(dice: Die[]): number[] {
  const values = dice.map(d => d.value);
  const counts = new Map<DieValue, number[]>();

  dice.forEach(d => {
    if (!counts.has(d.value)) counts.set(d.value, []);
    counts.get(d.value)!.push(d.id);
  });

  const maxCount = Math.max(...[...counts.values()].map(ids => ids.length));

  // 5 of a kind - keep all
  if (maxCount === 5) return dice.map(d => d.id);

  // 4 of a kind - keep the 4
  if (maxCount === 4) {
    for (const [, ids] of counts) {
      if (ids.length === 4) return ids;
    }
  }

  // Full house - keep all 5
  const sortedCounts = [...counts.values()].map(ids => ids.length).sort((a, b) => b - a);
  if (sortedCounts[0] === 3 && sortedCounts[1] === 2) {
    return dice.map(d => d.id);
  }

  // 3 of a kind - keep the 3
  if (maxCount === 3) {
    for (const [, ids] of counts) {
      if (ids.length === 3) return ids;
    }
  }

  // Check for large straight (5 consecutive)
  const unique = [...new Set(values)].sort((a, b) => a - b);
  const seqs5: number[][] = [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]];
  for (const seq of seqs5) {
    if (seq.every(v => unique.includes(v as DieValue))) {
      return dice.map(d => d.id);
    }
  }

  // Check for 4 consecutive (toward large straight or small straight)
  const seqs4: number[][] = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
  for (const seq of seqs4) {
    if (seq.every(v => unique.includes(v as DieValue))) {
      const toKeep: number[] = [];
      const usedIds = new Set<number>();
      for (const v of seq) {
        const die = dice.find(d => d.value === v && !usedIds.has(d.id));
        if (die) {
          toKeep.push(die.id);
          usedIds.add(die.id);
        }
      }
      return toKeep;
    }
  }

  // Pair - keep highest value pair
  if (maxCount === 2) {
    let bestVal = 0;
    let bestPairIds: number[] = [];

    for (const [val, ids] of counts) {
      if (ids.length === 2 && val > bestVal) {
        bestVal = val;
        bestPairIds = ids;
      }
    }

    if (bestPairIds.length > 0) return bestPairIds;
  }

  // Keep highest value die
  const maxVal = Math.max(...values) as DieValue;
  const bestDie = dice.find(d => d.value === maxVal);
  return bestDie ? [bestDie.id] : [];
}

export function hardAIChooseCategory(dice: DieValue[], scoreCard: ScoreCard): ScoreCategory {
  const available = getAvailableCategories(scoreCard);

  const scores = available.map(cat => ({
    category: cat,
    score: calculateScore(cat, dice),
  }));

  // If Yahtzee bonus scenario (already scored yahtzee with a positive score)
  const hasYahtzee = scoreCard.yahtzee !== undefined && scoreCard.yahtzee > 0;
  if (isYahtzee(dice) && hasYahtzee) {
    scores.sort((a, b) => b.score - a.score);
    return scores[0].category;
  }

  // High priority: Yahtzee if available
  const yahtzeeScore = scores.find(s => s.category === 'yahtzee');
  if (yahtzeeScore && yahtzeeScore.score === 50) return 'yahtzee';

  // High priority: Large straight (40 pts)
  const lgStraight = scores.find(s => s.category === 'largeStraight');
  if (lgStraight && lgStraight.score === 40) return 'largeStraight';

  // High priority: Small straight (30 pts)
  const smStraight = scores.find(s => s.category === 'smallStraight');
  if (smStraight && smStraight.score === 30) return 'smallStraight';

  // High priority: Full house (25 pts)
  const fullHouse = scores.find(s => s.category === 'fullHouse');
  if (fullHouse && fullHouse.score === 25) return 'fullHouse';

  // Choose highest scoring available category
  scores.sort((a, b) => b.score - a.score);

  // If best score is 0, pick the least valuable category to waste
  if (scores[0].score === 0) {
    const wastePriority: ScoreCategory[] = [
      'ones', 'chance', 'twos', 'threes', 'fours', 'fives', 'sixes',
      'threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee',
    ];
    for (const cat of wastePriority) {
      if (available.includes(cat)) return cat;
    }
  }

  return scores[0].category;
}
