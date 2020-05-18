import * as React from 'react'

import './GameController.css'

import {
  useParams,
  useHistory
} from "react-router-dom";

import HoleView from 'components/HoleView/HoleView'
import { ScoreEntry } from 'types/ScoreEntry'
import { fetchGame, saveGame } from 'data/FrisbeegolfData';
import Pagination from '@material-ui/lab/Pagination';
import { Game } from 'types/Game';
import createInitialScoreEntries from 'helpers/createInitialScoreEntries';
import Button from '@material-ui/core/Button';
import ScoreDialog from 'components/ScoreDialog/ScoreDialog';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents'


const findOrCreateScoreEntries = (game: Game | undefined, holeId: number): ScoreEntry[] => {
  if(game) {
    const existingScoreEntries = game.scoreEntries.filter(entry => entry.hole === holeId);
    return existingScoreEntries.length > 0 ? existingScoreEntries : createInitialScoreEntries(game.field, holeId, game.players, game.id ?? '')
  } else {
    return []
  }
}


const GameController: React.FC = () => {
  const { holeId, gameId } = useParams();
  const history = useHistory()

  const [game, setGame] = React.useState<Game | undefined>(undefined);
  // const [scoreEntries, setScoreEntries] = React.useState<ScoreEntry[] | undefined>(undefined); 
  const [showStandings, setShowStandings] = React.useState(false);

  React.useEffect(() => {
    const setupGame = async () => {
      const currentGame = await fetchGame(gameId)
      setGame(currentGame as Game)
    }
    setupGame()
  }, [gameId])

  const updateScore = (playerId: string, newScore: number) => {
    let newScoreEntries = game?.scoreEntries.slice();
    if(newScoreEntries && game) {
      let scoreToUpdate = newScoreEntries.findIndex(entry => (entry.playerId === playerId && entry.hole === +holeId))
      if(scoreToUpdate > -1) {
        newScoreEntries[scoreToUpdate].score = newScore;
        setGame({
          ...game,
          scoreEntries: newScoreEntries
        })
      }
    }

  }

  const changePage = (nextPage: number) => {
    if(game) { 
      saveGame(game);
      history.push(`/game/${game.id}/${nextPage}`)
    }
  }

  if(!game) {
    return null
  }

  if(game?.scoreEntries.filter(entry => entry.hole === +holeId).length === 0) {
    if(game) {
      let generatedScoreEntries = findOrCreateScoreEntries(game, +holeId)
      const newScoreEntries = [...game.scoreEntries, ...generatedScoreEntries]
      
      setGame({
        ...game,
        scoreEntries: newScoreEntries
      })
    }
  }

  return(
    <div>
      <h2>{game.field.name}</h2>
      <HoleView players={game.players} holeNumber={+holeId} scoreEntries={game.scoreEntries.filter(entry => entry.hole === +holeId)} updateScoreEntry={updateScore} />
      <Button endIcon={<EmojiEventsIcon />} className="standings-button" variant="contained" color="primary" size="large" onClick={() => setShowStandings(true)}>View Standings</Button>
      <ScoreDialog isOpen={showStandings} handleClose={() => setShowStandings(false)} game={game} />
      <Pagination page={+holeId} onChange={(_, nextPage) => changePage(nextPage)} count={game.field.holes.length} color="primary" />
    </div>
  )
}

export default GameController