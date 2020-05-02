import Field from "types/Field";
import Player from "types/Player";
import { ScoreEntry } from "types/ScoreEntry";


/**
 * Creates initial scoreentry values for the given players on the given hole on the given field.
 * Will use the par as the base for the score.
 * @param field 
 * @param holeNumber 
 * @param players 
 */
const createInitialScoreEntries = (field: Field, holeNumber: number, players: Player[]): ScoreEntry[] => {
  return players.map(player => {
    const hole = field.holes[holeNumber-1];
    return {
      date: new Date(),
      field: field.name,
      hole: hole.number,
      holePar: hole.par,
      playerId: player.id,
      playerName: player.name,
      score: hole.par,
      updated: false
    }
  })
}

export default createInitialScoreEntries;