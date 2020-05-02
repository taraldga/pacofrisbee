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
  let scoreBoard = game.players.map(player => {
    let playerScore = game.scoreEntries.filter(entry => entry.playerId === player.id).reduce((acc, curr) => acc + curr.score, 0)
    return {
      id: player.id,
      name: player.name,
      totalScore: playerScore,      
    }
  }).sort((a,b) => a.totalScore - b.totalScore)
  


  console.log(isOpen)
  return (
    <Dialog open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
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
    <Button fullWidth variant="contained" color="secondary" size="large" onClick={handleClose}>Close</Button>
    </Dialog>
  )
}

export default ScoreDialog