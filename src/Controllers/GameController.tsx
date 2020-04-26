import * as React from 'react'

import Player from 'Types/Player'
import { ScoreEntry } from 'Types/ScoreEntry'
import Field from 'Types/Field'
import HoleView from 'Components/HoleView'
import createInitialScoreEntries from 'helpers/createInitialScoreEntries'

export interface RoundControllerProps {
  players: Player[];
  field: Field;
}

const GameController: React.FC<RoundControllerProps> = ({
  players,
  field
}) => {
  const [scoreEntries, setScoreEntries] = React.useState<ScoreEntry[]>(createInitialScoreEntries(field, players))
  const [currentHole, setCurrentHole] = React.useState<number>(1)

  const updateScore = (playerId: string, newScore: number) => {
    let newFields = scoreEntries.slice();
    let scoreToUpdate = newFields.find(entry => (entry.playerId === playerId && entry.hole === currentHole))
    if(scoreToUpdate) {
      console.log(scoreToUpdate)
      scoreToUpdate.playerScore = newScore;
      setScoreEntries(newFields)
    }
  }

  return(
    <div>
      <h2>Playing a game on {field.name}</h2>
      <HoleView holeNumber={currentHole} scoreEntries={scoreEntries.filter(entry => entry.hole === currentHole)} updateScoreEntry={updateScore} />
    </div>
  )
}

export default GameController