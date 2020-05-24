import * as React from 'react'

import './GameController.css'

import {
  useParams,
  useHistory
} from "react-router-dom";

import HoleView from 'components/HoleView/HoleView'
import { ScoreEntry } from 'types/ScoreEntry'
import { fetchGame, fetchScores } from 'data/FrisbeegolfData';
import Pagination from '@material-ui/lab/Pagination';
import { GameData } from 'types/Game';
import Button from '@material-ui/core/Button';
import ScoreDialog from 'components/ScoreDialog/ScoreDialog';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents'
import Grid from '@material-ui/core/Grid';
import Save from '@material-ui/icons/Save';
import Archive from '@material-ui/icons/Archive';
import Unarchive from '@material-ui/icons/Unarchive';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Game from 'data/Game';


function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const GameController: React.FC = () => {
  const { holeId, gameId } = useParams();
  const history = useHistory()

  const [game, setGame] = React.useState<Game | undefined>(undefined);
  const [scoreEntries, setScoreEntries] = React.useState<ScoreEntry[] | undefined>(game?.getScoreEntries());
  const [showStandings, setShowStandings] = React.useState(false);
  const [showSuccessBar, setShowSuccessBar] = React.useState(false);

  React.useEffect(() => {
    const setupGame = async () => {
      const currentGame: GameData = (await fetchGame(gameId) as GameData)
      const scores = (await fetchScores(gameId)as ScoreEntry[])
      const newGame = new Game(currentGame, scores);
      setGame(newGame)
    }
    setupGame()
  }, [gameId])

  React.useEffect(() => {
    if(game) {
      const newScores = game.getScoreEntries(+holeId)
      setScoreEntries(newScores)
    }
  }, [holeId, game])


  const updateScore = (playerId: string, newScore: number) => {
    game?.updateScoreEntry(playerId, +holeId, newScore)
    setScoreEntries(game?.getScoreEntries(+holeId))
  }

  const changePage = async (nextPage: number) => {
    history.push(`/game/${gameId}/${nextPage}`)
  }

  const onSave = async () => {
    if(game) {
      await game.saveScoreEntries(+holeId);
      setShowSuccessBar(true);
    }
  }

  const isDataDirty = () => {
    return !scoreEntries?.some(scoreEntry => scoreEntry.new || scoreEntry.updated)
  }

  if(game && !scoreEntries) {
    setScoreEntries(game.getScoreEntries(+holeId))
  }

  if(!game || !scoreEntries) {
    return null
  }

  const finishButtonIcon = game.isFinished() ? <Unarchive /> : <Archive />;
  const toggleFinished = () => {
    if(game.isFinished()) {
      game.openGame()
    } else {
      game.finishGame()
    }
  }

  return(
    <div>
      <h2>{game.getField().name}</h2>
      <HoleView players={game.getPlayers()} holeNumber={+holeId} scoreEntries={scoreEntries} updateScoreEntry={updateScore} />
      <Button disabled={isDataDirty()} type="submit" startIcon={<Save />} className="standings-button" variant="contained" color="primary" size="large" onClick={() => onSave()}>Save scores</Button>
      <Button startIcon={<EmojiEventsIcon />} className="standings-button" variant="contained" color="primary" size="large" onClick={() => setShowStandings(true)}>View Standings</Button>
      <Button startIcon={finishButtonIcon} className="standings-button" variant="contained" color="primary" size="large" onClick={toggleFinished}>{game.isFinished() ? "Re-open Game" : "Finish Game"}</Button>
      <ScoreDialog isOpen={showStandings} handleClose={() => setShowStandings(false)} players={game.getPlayers()} scoreEntries={game.getScoreEntries().filter(entry => !(entry.new || entry.updated))} />
      <Snackbar open={showSuccessBar} autoHideDuration={6000} onClose={() => {setShowSuccessBar(false)}}>
        <Alert onClose={() => {setShowSuccessBar(false)}} severity="success">
          The scores were saved!
        </Alert>
      </Snackbar>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Pagination page={+holeId} onChange={(_, nextPage) => changePage(nextPage)} count={game.getField().holes.length} color="primary" />
      </Grid>
    </div>
  )
}

export default GameController