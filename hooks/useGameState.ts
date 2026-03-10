'use client';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { Die, DieValue, GameState, Player, ScoreCard, ScoreCategory } from '@/types/game';
import {
  rollDie,
  calculateScore,
  isScoreCardComplete,
  isYahtzee,
} from '@/lib/gameLogic';
import {
  hardAIChooseCategory,
  hardAIKeepDice,
  easyAIChooseCategory,
  easyAIKeepDice,
} from '@/lib/aiPlayer';
import { DICE_COUNT, MAX_ROLLS, TOTAL_ROUNDS, YAHTZEE_BONUS } from '@/lib/constants';

function createInitialDice(): Die[] {
  return Array.from({ length: DICE_COUNT }, (_, i) => ({
    id: i,
    value: 1 as DieValue,
    held: false,
    isRolling: false,
  }));
}

function createInitialScoreCard(): ScoreCard {
  return { yahtzeeBonuses: 0 };
}

type Action =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'ROLL_DICE' }
  | { type: 'ROLL_COMPLETE'; newDice: Die[] }
  | { type: 'TOGGLE_HOLD'; dieId: number }
  | { type: 'SCORE_CATEGORY'; category: ScoreCategory }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  phase: 'setup',
  dice: createInitialDice(),
  rollsRemaining: MAX_ROLLS,
  currentPlayerIndex: 0,
  players: [],
  currentRound: 1,
  totalRounds: TOTAL_ROUNDS,
  isRolling: false,
  isPaused: false,
  hasRolledOnce: false,
};

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        phase: 'playing',
        players: action.players,
      };

    case 'ROLL_DICE':
      return {
        ...state,
        isRolling: true,
        dice: state.dice.map(d => ({ ...d, isRolling: !d.held })),
      };

    case 'ROLL_COMPLETE':
      return {
        ...state,
        isRolling: false,
        dice: action.newDice,
        rollsRemaining: state.rollsRemaining - 1,
        hasRolledOnce: true,
      };

    case 'TOGGLE_HOLD': {
      if (!state.hasRolledOnce) return state;
      return {
        ...state,
        dice: state.dice.map(d =>
          d.id === action.dieId ? { ...d, held: !d.held } : d
        ),
      };
    }

    case 'SCORE_CATEGORY': {
      const player = state.players[state.currentPlayerIndex];
      const diceValues = state.dice.map(d => d.value);
      const score = calculateScore(action.category, diceValues);

      let yahtzeeBonuses = player.scoreCard.yahtzeeBonuses || 0;
      if (
        isYahtzee(diceValues) &&
        player.scoreCard.yahtzee !== undefined &&
        player.scoreCard.yahtzee > 0 &&
        action.category !== 'yahtzee'
      ) {
        yahtzeeBonuses += 1;
      }

      const newScoreCard: ScoreCard = {
        ...player.scoreCard,
        [action.category]: score,
        yahtzeeBonuses,
      };

      const updatedPlayers = state.players.map((p, i) =>
        i === state.currentPlayerIndex ? { ...p, scoreCard: newScoreCard } : p
      );

      const allComplete = updatedPlayers.every(p => isScoreCardComplete(p.scoreCard));

      if (allComplete) {
        return {
          ...state,
          players: updatedPlayers,
          phase: 'ended',
        };
      }

      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const nextRound =
        nextPlayerIndex === 0 ? state.currentRound + 1 : state.currentRound;

      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        currentRound: nextRound,
        rollsRemaining: MAX_ROLLS,
        dice: createInitialDice(),
        hasRolledOnce: false,
      };
    }

    case 'TOGGLE_PAUSE':
      return { ...state, isPaused: !state.isPaused };

    case 'RESET_GAME':
      return { ...initialState };

    default:
      return state;
  }
}

// Unused import silencer
void YAHTZEE_BONUS;

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const rollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const startGame = useCallback((playerName: string, difficulty: 'easy' | 'hard') => {
    const humanPlayer: Player = {
      id: 'human',
      name: playerName || 'Player',
      isAI: false,
      scoreCard: createInitialScoreCard(),
    };
    const aiPlayer: Player = {
      id: 'ai',
      name: difficulty === 'easy' ? 'Bot (Easy)' : 'Bot (Hard)',
      isAI: true,
      aiDifficulty: difficulty,
      scoreCard: createInitialScoreCard(),
    };
    dispatch({ type: 'START_GAME', players: [humanPlayer, aiPlayer] });
  }, []);

  const rollDice = useCallback(() => {
    if (state.rollsRemaining <= 0 || state.isRolling || state.isPaused) return;
    dispatch({ type: 'ROLL_DICE' });

    rollTimeoutRef.current = setTimeout(() => {
      const newDice: Die[] = state.dice.map(d => ({
        ...d,
        value: d.held ? d.value : rollDie(),
        isRolling: false,
      }));
      dispatch({ type: 'ROLL_COMPLETE', newDice });
    }, 600);
  }, [state.rollsRemaining, state.isRolling, state.dice, state.isPaused]);

  const toggleHold = useCallback(
    (dieId: number) => {
      if (state.isRolling || state.isPaused) return;
      dispatch({ type: 'TOGGLE_HOLD', dieId });
    },
    [state.isRolling, state.isPaused]
  );

  const scoreCategory = useCallback(
    (category: ScoreCategory) => {
      if (!state.hasRolledOnce || state.isRolling || state.isPaused) return;
      const player = state.players[state.currentPlayerIndex];
      if (
        player.scoreCard[category as keyof ScoreCard] !== undefined &&
        category !== ('yahtzeeBonuses' as ScoreCategory)
      )
        return;
      dispatch({ type: 'SCORE_CATEGORY', category });
    },
    [state.hasRolledOnce, state.isRolling, state.players, state.currentPlayerIndex, state.isPaused]
  );

  const togglePause = useCallback(() => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  }, []);

  const resetGame = useCallback(() => {
    clearTimeout(aiTimeoutRef.current);
    clearTimeout(rollTimeoutRef.current);
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // AI auto-play
  useEffect(() => {
    if (state.phase !== 'playing' || state.isRolling || state.isPaused) return;

    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer?.isAI) return;

    const difficulty = currentPlayer.aiDifficulty || 'easy';
    const diceValues = state.dice.map(d => d.value);

    if (!state.hasRolledOnce) {
      // Always roll first
      aiTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'ROLL_DICE' });
        rollTimeoutRef.current = setTimeout(() => {
          const newDice: Die[] = state.dice.map(d => ({
            ...d,
            value: rollDie(),
            isRolling: false,
          }));
          dispatch({ type: 'ROLL_COMPLETE', newDice });
        }, 600);
      }, 800);
    } else if (state.rollsRemaining > 0) {
      // Decide which dice to keep, then maybe roll again
      aiTimeoutRef.current = setTimeout(() => {
        const keptIds =
          difficulty === 'hard'
            ? hardAIKeepDice(state.dice)
            : easyAIKeepDice(state.dice);

        const shouldRoll = state.rollsRemaining > 0 && Math.random() > 0.3;

        if (shouldRoll) {
          dispatch({ type: 'ROLL_DICE' });
          rollTimeoutRef.current = setTimeout(() => {
            const rolledDice: Die[] = state.dice.map(d => ({
              ...d,
              held: keptIds.includes(d.id),
              value: keptIds.includes(d.id) ? d.value : rollDie(),
              isRolling: false,
            }));
            dispatch({ type: 'ROLL_COMPLETE', newDice: rolledDice });
          }, 600);
        } else {
          const category =
            difficulty === 'hard'
              ? hardAIChooseCategory(diceValues, currentPlayer.scoreCard)
              : easyAIChooseCategory(diceValues, currentPlayer.scoreCard);
          dispatch({ type: 'SCORE_CATEGORY', category });
        }
      }, 1200);
    } else {
      // No rolls remaining, must score
      aiTimeoutRef.current = setTimeout(() => {
        const category =
          difficulty === 'hard'
            ? hardAIChooseCategory(diceValues, currentPlayer.scoreCard)
            : easyAIChooseCategory(diceValues, currentPlayer.scoreCard);
        dispatch({ type: 'SCORE_CATEGORY', category });
      }, 1000);
    }

    return () => {
      clearTimeout(aiTimeoutRef.current);
      clearTimeout(rollTimeoutRef.current);
    };
  }, [
    state.phase,
    state.currentPlayerIndex,
    state.isRolling,
    state.hasRolledOnce,
    state.rollsRemaining,
    state.isPaused,
  ]);

  return {
    state,
    startGame,
    rollDice,
    toggleHold,
    scoreCategory,
    togglePause,
    resetGame,
  };
}
