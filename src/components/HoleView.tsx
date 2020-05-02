import * as React from 'react'

import PlayerRow from './PlayerRow'
import { ScoreEntry } from 'types/ScoreEntry'
import Player from 'types/Player'

export interface HoleViewProps {
  players: Player[];
  scoreEntries: ScoreEntry[];
  holeNumber: number;
  updateScoreEntry: (playerId: string, newScore: number) => void
}

const HoleView: React.FC<HoleViewProps> = ({
  players,
  scoreEntries,
  holeNumber,
  updateScoreEntry
}) => {
  console.log(scoreEntries)
  return(
    <div>
      <h3>Hole number {holeNumber} </h3>
      {
        players.map(player => {
          console.log(`player.id: ${player.id}`)
          const playerScoreEntry = scoreEntries.find(entry => entry.playerId === player.id)
          console.log(playerScoreEntry)
          return <PlayerRow name={player.name} score={playerScoreEntry ? playerScoreEntry.score : 0}  updateScoreEntry={(newScore) => updateScoreEntry(player.id, newScore) }/>
        })
      }
    </div>
  )
}


export default HoleView;