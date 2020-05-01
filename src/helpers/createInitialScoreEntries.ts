import Field from "types/Field";
import Player from "types/Player";
import { ScoreEntry } from "types/ScoreEntry";

const createInitialScoreEntries = (field: Field, players: Player[]): ScoreEntry[] => {
  return field.holes.flatMap(hole => {
    return players.map(player => {
      return {
        date: new Date(),
        field: field.name,
        hole: hole.number,
        holePar: hole.par,
        playerId: player.id,
        playerName: player.name,
        playerScore: hole.par,
        updated: false
      }
    })
  })
}

export default createInitialScoreEntries;