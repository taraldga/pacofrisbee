import { ScoreEntry } from "types/ScoreEntry";

export function findScoreForPlayer(scoreEntries: ScoreEntry[], playerId: string) {
  return scoreEntries.filter(entry => entry.playerId === playerId).reduce((acc, curr) => acc + curr.score, 0);
}