export interface ScoreEntry {
  id?: string;
  date: Date;
  gameId: string;
  field: string;
  hole: number;
  holePar: number;
  playerId: string;
  playerName: string;
  score: number;
  updated?: boolean;
  new?: boolean
}