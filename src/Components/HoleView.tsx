import * as React from 'react'
import Player from 'Types/Player'
import { ScoreEntry } from 'Types/ScoreEntry'
import PlayerRow from './PlayerRow'


export interface HoleViewProps {
  scoreEntries: ScoreEntry[];
  holeNumber: number;
  updateScoreEntry: (playerId: string, newScore: number) => void
}

const HoleView: React.FC<HoleViewProps> = ({
  scoreEntries,
  holeNumber,
  updateScoreEntry
}) => {

  return(
    <div>
      <h3>Hole number {holeNumber} </h3>
      {
        scoreEntries.map(scoreEntry => {
          return <PlayerRow name={scoreEntry.playerName} score={scoreEntry.playerScore}  updateScoreEntry={(newScore) => updateScoreEntry(scoreEntry.playerId, newScore) }/>
        })
      }
    </div>
  )
}


export default HoleView;