import * as React from 'react'

import {
  Route,
  BrowserRouter as Router,
  Switch,
  useParams
} from "react-router-dom";

import Field from 'types/Field'
import HoleNavigation from 'components/HoleNavigation/HoleNavigation'
import HoleView from 'components/HoleView'
import Player from 'types/Player'
import { ScoreEntry } from 'types/ScoreEntry'
import createInitialScoreEntries from 'helpers/createInitialScoreEntries'
import { fetchGame } from 'data/FrisbeegolfData';

const GameController: React.FC = () => {
  const [scoreEntries, setScoreEntries] = React.useState<ScoreEntry[]>([])
  const { holeId, gameId } = useParams();

  const currentGame = fetchGame(gameId)

  const updateScore = (playerId: string, newScore: number) => {
    let newFields = scoreEntries.slice();
    let scoreToUpdate = newFields.find(entry => (entry.playerId === playerId && entry.hole === holeId))
    if(scoreToUpdate) {
      scoreToUpdate.playerScore = newScore;
      setScoreEntries(newFields)
    }
  }

  return(
    <div>
      <h2>Playing a game on {currentGame.field.name}</h2>
      <Switch>
        <Route path="/:holeId"></Route>
      </Switch>
      <HoleView holeNumber={holeId} scoreEntries={scoreEntries.filter(entry => entry.hole === holeId)} updateScoreEntry={updateScore} />
      <HoleNavigation
        gameId={gameId} 
        currentHole={holeId}
        lastHole={currentGame.holes.length}
      />
    </div>
  )
}

export default GameController