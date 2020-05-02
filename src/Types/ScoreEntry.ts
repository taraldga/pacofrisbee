export interface ScoreEntry {
  id?: string;
  date: Date;
  hole: number;
  holePar: number;
  playerId: string;
  score: number;
  updated?: boolean;
}