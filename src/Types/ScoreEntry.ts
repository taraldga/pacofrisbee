export interface ScoreEntry {
  id?: string;
  date: Date;
  field: string;
  hole: number;
  holePar: number;
  playerId: string;
  playerName: string;
  playerScore: number;
  updated?: boolean;
}