export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export type ScoreCategory =
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'
  | 'threeOfAKind'
  | 'fourOfAKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yahtzee'
  | 'chance';

export interface Die {
  value: DieValue;
  held: boolean;
  id: number;
  isRolling: boolean;
}

export interface ScoreCard {
  ones?: number;
  twos?: number;
  threes?: number;
  fours?: number;
  fives?: number;
  sixes?: number;
  threeOfAKind?: number;
  fourOfAKind?: number;
  fullHouse?: number;
  smallStraight?: number;
  largeStraight?: number;
  yahtzee?: number;
  chance?: number;
  yahtzeeBonuses: number;
}

export interface Player {
  id: string;
  name: string;
  isAI: boolean;
  aiDifficulty?: 'easy' | 'hard';
  scoreCard: ScoreCard;
}

export type GamePhase = 'setup' | 'playing' | 'ended';
export type Difficulty = 'easy' | 'hard';

export interface GameState {
  phase: GamePhase;
  dice: Die[];
  rollsRemaining: number;
  currentPlayerIndex: number;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  isRolling: boolean;
  isPaused: boolean;
  hasRolledOnce: boolean;
}
