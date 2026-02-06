
export type GameState = 'LOBBY' | 'PLAYING' | 'PAUSED' | 'FINAL_ROUND' | 'VICTORY';
export type ViewMode = 'LANDING' | 'GM' | 'TEAM_SELECT' | 'TEAM_QR' | 'TEAM';
export type TeamColor = string; // Hex code

export interface Team {
  id: string;
  name: string;
  color: TeamColor;
  accessCode: string; // New: 4-digit code for manual entry
  score: number;
  fragments: string[]; // Array of collected fragment IDs
  completedChallengeIds: string[];
  lastActivityTimestamp: number; // For tracking duration in current era
}

export type ChallengeType = 'QUIZ' | 'LOGIC' | 'QR_SCAN' | 'PHYSICAL';

export interface Challenge {
  id: string;
  eraId: string;
  type: ChallengeType;
  title: string;
  description: string;
  question?: string;
  options?: string[]; // For multiple choice
  correctAnswer: string; // Text answer or option index
  points: number;
  hint: string;
  rewardFragmentId?: string; // If completing this gives the era fragment
}

export interface Era {
  id: string;
  index: number;
  title: string;
  year: string;
  theme: string;
  introText: string;
  imageUrl: string;
  fragmentName: string; // The name of the piece they collect, e.g., "The Rosetta Algorithm"
  challenges: Challenge[];
}

export interface GameEvent {
  type: 'ERA_COMPLETE';
  teamId: string;
  eraName: string;
  timestamp: number;
}

export interface GameContextType {
  gameState: GameState;
  teams: Team[];
  currentEraIndex: number;
  lastEvent: GameEvent | null;
  setGameState: (state: GameState) => void;
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  updateTeamScore: (teamId: string, points: number) => void;
  collectFragment: (teamId: string, fragmentId: string) => void;
  unlockNextEra: () => void;
  triggerFinalRound: () => void;
  completeGame: () => void;
}
