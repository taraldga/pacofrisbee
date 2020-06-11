import * as React from "react";

import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import { CenteredLoader } from "components/CenteredLoader/CenteredLoader";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Player from "types/Player";
import { ScoreEntry } from "types/ScoreEntry";
import Slide from "@material-ui/core/Slide";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { TransitionProps } from "@material-ui/core/transitions/transition";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      padding: "10px",
    },
  })
);

export interface ScoreDialogProps {
  scoreEntries: ScoreEntry[];
  players: Player[];
  isOpen: boolean;
  handleClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const ScoreDialog: React.FC<ScoreDialogProps> = ({
  scoreEntries,
  players,
  isOpen,
  handleClose,
}) => {
  const classes = useStyles();
  if (!isOpen) {
    return null;
  }
  const isSaved = (entry: ScoreEntry) => {
    return (!entry.new && !entry.updated)
  }
  let scoreBoard = players
    .map((player) => {
      let playerScore = scoreEntries
        .filter((entry) => (entry.playerId === player.id) && isSaved(entry))
        .reduce((acc, curr) => acc + curr.score, 0);
      return {
        id: player.id,
        name: player.name,
        totalScore: playerScore,
      };
    })
    .sort((a, b) => a.totalScore - b.totalScore);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      className={classes.dialog}
    >
      <DialogTitle>Score</DialogTitle>
      <DialogContent>
        {scoreEntries.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Place</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scoreBoard.map((playerScore, idx) => {
                  return (
                    <TableRow>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{playerScore.name}</TableCell>
                      <TableCell align="right">
                        {playerScore.totalScore}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <CenteredLoader />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScoreDialog;
