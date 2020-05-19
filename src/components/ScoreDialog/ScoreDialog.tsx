import * as React from 'react'
import { Game } from 'types/Game'
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import Slide from '@material-ui/core/Slide';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ScoreEntry } from 'types/ScoreEntry';
import { fetchScores } from 'data/FrisbeegolfData';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      padding: "10px"
    },
  }),
);

export interface ScoreDialogProps {
  game: Game;
  isOpen: boolean;
  handleClose: () => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ScoreDialog: React.FC<ScoreDialogProps> = ({
  game,
  isOpen,
  handleClose
}) => {
  const [scoreEntries, setScoreEntries] = React.useState<ScoreEntry[]>([])
  React.useEffect(() => {
    const setupScoreEntries = async () => {
      if(game.id && isOpen) {
        const scores = await fetchScores(game.id ?? '')
        setScoreEntries(scores)
      }
    }
    setupScoreEntries();
  }, [isOpen, game.id])
  const classes = useStyles();
  let scoreBoard = game.players.map(player => {
    let playerScore = scoreEntries.filter(entry => entry.playerId === player.id).reduce((acc, curr) => acc + curr.score, 0)
    return {
      id: player.id,
      name: player.name,
      totalScore: playerScore,      
    }
  }).sort((a,b) => a.totalScore - b.totalScore)
  


  return (
    <Dialog  open={isOpen} onClose={handleClose} TransitionComponent={Transition} className={classes.dialog}>
      <DialogTitle>Current standings</DialogTitle>
      <DialogContent>
    <TableContainer >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Place</TableCell>
          <TableCell>Name</TableCell>
          <TableCell align="right">Score</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          scoreBoard.map((playerScore, idx) => {
            return(
              <TableRow>
                <TableCell>{idx+1}</TableCell>
                <TableCell>{playerScore.name}</TableCell>
                <TableCell align="right">{playerScore.totalScore}</TableCell>
              </TableRow>
            )
          })
        }
      </TableBody>
    </Table>
    </TableContainer>
    </DialogContent>
    <DialogActions>
      <Button fullWidth variant="contained" color="secondary" size="large" onClick={handleClose}>Close</Button>
    </DialogActions>
    </Dialog>
  )
}

export default ScoreDialog