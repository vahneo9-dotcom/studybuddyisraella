export interface Case {
  id: string;
  title: string;
  story: string;
  question: string;
  type: 'addition' | 'subtraction' | 'mixed' | 'grouping';
  number1: number;
  number2: number;
  number3?: number;
  correctAnswer: number;
  operationText: string; // e.g., "15 + 12"
  explanation: string;
  emoji: string;
  clue: string;
  category: 'squirrels' | 'space' | 'baking' | 'ocean' | 'toys';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
  requirement: string;
}

export interface GameState {
  currentLevel: number;
  score: number;
  completedCaseIds: string[];
  badges: Badge[];
  activeCases: Case[];
  answers: { [caseId: string]: string };
  feedback: { [caseId: string]: { isCorrect: boolean; showFeedback: boolean; attempts: number } };
  rank: string;
}
