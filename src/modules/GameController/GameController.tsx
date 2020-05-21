import * as React from 'react'

import './GameController.css'

import {
  useParams,
  useHistory
} from "react-router-dom";

import HoleView from 'components/HoleView/HoleView'
import { ScoreEntry } from 'types/ScoreEntry'
import { fetchGame, fetchScores, saveScoreEntries } from 'data/FrisbeegolfData';
import Pagination from '@material-ui/lab/Pagination';
import { Game } from 'types/Game';
import createInitialScoreEntries from 'helpers/createInitialScoreEntries';
import Button from '@material-ui/core/Button';
import ScoreDialog from 'components/ScoreDialog/ScoreDialog';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents'
import Grid from '@material-ui/core/Grid';
import Save from '@material-ui/icons/Save'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const GameController: React.FC = () => {
  const { holeId, gameId } = useParams();
  const history = useHistory()

  const [game, setGame] = React.useState<Game | undefined>(undefined);
  const [scoreEntries, setScoreEntries] = React.useState<ScoreEntry[] | undefined>(undefined);
  const [showStandings, setShowStandings] = React.useState(false);
  const [dirty, setDirty] = React.useState(false)
  const [showSuccessBar, setShowSuccessBar] = React.useState(false)

  // TODO: Remove this dirty hack and make a proper view.
  const setupScoreEntries = async (initGame?: Game) => {
    const currentGame = game ? game : initGame;
    if(!currentGame) return;
    const scores = await fetchScores(gameId, holeId)
    if(scores && scores.length > 0) {
      setScoreEntries(scores as ScoreEntry[])
    } else {
      setScoreEntries(createInitialScoreEntries(currentGame.field, holeId, currentGame.players, gameId))
    }
  }

  React.useEffect(() => {
    const setupGame = async () => {
      const currentGame: Game = (await fetchGame(gameId) as Game)
      setGame(currentGame)
      setupScoreEntries(currentGame)
    }
    setupGame()
    /* eslint-disable */
  }, [gameId])

  React.useEffect(() => {
    setupScoreEntries();
    /* eslint-disable */
  }, [holeId, gameId])


  const updateScore = (playerId: string, newScore: number) => {
    setDirty(true)
    let newScoreEntries = scoreEntries?.slice()
    if(newScoreEntries && game) {
      let scoreToUpdate = newScoreEntries.findIndex(entry => (entry.playerId === playerId && entry.hole === +holeId))
      if(scoreToUpdate > -1) {
        newScoreEntries[scoreToUpdate].score = newScore;
        newScoreEntries[scoreToUpdate].updated = true;

        setScoreEntries(newScoreEntries)
      }
    }

  }
  const changePage = async (nextPage: number) => {
    history.push(`/game/${gameId}/${nextPage}`)
  }

  const onSave = async () => {
    if(scoreEntries) {
      await saveScoreEntries(scoreEntries);
      setShowSuccessBar(true);
      setDirty(false)
    }
  }

  if(!scoreEntries || !game) {
    return null
  }

  return(
    <div>
      <h2>{game.field.name}</h2>
      <HoleView players={game.players} holeNumber={+holeId} scoreEntries={scoreEntries} updateScoreEntry={updateScore} />
      <Button disabled={!dirty} type="submit" startIcon={<Save />} className="standings-button" variant="contained" color="primary" size="large" onClick={() => onSave()}>Save scores</Button>
      <Button startIcon={<EmojiEventsIcon />} className="standings-button" variant="contained" color="primary" size="large" onClick={() => setShowStandings(true)}>View Standings</Button>
      <ScoreDialog isOpen={showStandings} handleClose={() => setShowStandings(false)} game={game} />
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
        <Pagination page={+holeId} onChange={(_, nextPage) => changePage(nextPage)} count={game.field.holes.length} color="primary" />
      </Grid>
    </div>
  )
}

export default GameController