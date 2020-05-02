import * as React from 'react'

import {
  Route,
  BrowserRouter as Router,
  Switch,
  useParams,
  useHistory
} from "react-router-dom";

import HoleView from 'components/HoleView'
import { ScoreEntry } from 'types/ScoreEntry'
import { fetchGame, saveGame } from 'data/FrisbeegolfData';
import Pagination from '@material-ui/lab/Pagination';
import { Game } from 'types/Game';
import createInitialScoreEntries from 'helpers/createInitialScoreEntries';

const findOrCreateScoreEntries = (game: Game | undefined, holeId: number): ScoreEntry[] => {
  if(game) {
    const existingScoreEntries = game.scoreEntries.filter(entry => entry.hole === holeId);
    return existingScoreEntries.length > 0 ? existingScoreEntries : createInitialScoreEntries(game.field, holeId, game.players)
  } else {
    return []
  }
}


const GameController: React.FC = () => {
  const { holeId, gameId } = useParams();
  const history = useHistory()
  const currentGame = fetchGame(gameId)

  const [scoreEntries, setScoreEntries] = React.useState<ScoreEntry[]>([])

  const updateScore = (playerId: string, newScore: number) => {
    let newFields = scoreEntries.slice();
    let scoreToUpdate = newFields.findIndex(entry => (entry.playerId === playerId && entry.hole === +holeId))
    if(scoreToUpdate > -1) {
      newFields[scoreToUpdate].score = newScore;
      setScoreEntries(newFields)
    }
  }

  const changePage = (nextPage: number) => {
    if(currentGame) { 
      scoreEntries.forEach(entry => {
        const entryIndex = currentGame.scoreEntries.findIndex(oldEntry => (oldEntry.playerId === entry.playerId && oldEntry.hole === entry.hole));
        if(entryIndex > -1) {
          currentGame.scoreEntries.splice(entryIndex, 1, entry)
        } else {
          currentGame.scoreEntries.push(entry)
        }
      })
      saveGame(currentGame);
      setScoreEntries([])
      history.push(`/game/${currentGame.id}/${nextPage}`)
    }
  }

  if(!currentGame) {
    return null
  }

  if(scoreEntries.length === 0) {
    let newScoreEntries = findOrCreateScoreEntries(currentGame, +holeId)
    setScoreEntries(newScoreEntries)
  }
  return(
    <div>
      <h2>Playing a game on {currentGame.field.name}</h2>
      <HoleView players={currentGame.players} holeNumber={+holeId} scoreEntries={scoreEntries.filter(entry => entry.hole === +holeId)} updateScoreEntry={updateScore} />
      <Pagination page={+holeId} onChange={(_, nextPage) => changePage(nextPage)} count={currentGame.field.holes.length} color="primary" />
    </div>
  )
}

export default GameController