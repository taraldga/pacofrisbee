import * as React from "react";

import { GameData } from "types/Game";
import { Hole } from "types/Field";
import HomeIcon from '@material-ui/icons/Home'
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Player from "types/Player";
import { ScoreEntry } from "types/ScoreEntry";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import { findScoreForPlayer } from "util/findScoreForPlayer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useHistory } from "react-router-dom";

interface ScoreTableRowProps {
  hole: Hole;
  scoreEntries: ScoreEntry[];
  players: Player[];
}

const getScoreDisplay = (playerScore: number, holePar: number) => {
  let diff = playerScore - holePar;
  if (diff > 0) {
    return <span style={{ color: "red" }}>{`(+${diff}) ${playerScore} `}</span>;
  } else if (diff < 0) {
    return <span style={{ color: "green" }}>{`(${diff}) ${playerScore} `}</span>;
  } else {
    return <span>{playerScore}</span>;
  }
};

const ScoreTableRow: React.FC<ScoreTableRowProps> = ({
  hole,
  scoreEntries,
  players,
}) => {
  return (
    <TableRow>
      <TableCell>{hole.number}</TableCell>
      <TableCell>{hole.par}</TableCell>
      {players.map((player) => {
        const playerScore = scoreEntries.find(
          (entry) => entry.playerId === player.id
        )?.score;
        return (
          <TableCell align="right">
            {getScoreDisplay(playerScore ? playerScore : 0, hole.par)}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      fontWeight: "bold",
      backgroundColor: theme.palette.primary.main,
      color: "white"
    },
    homeButton: {
      position: "absolute",
      left: "5px",
      top: "11px"
    }
  })
);

const HomeButton: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <IconButton className={classes.homeButton} onClick={() => history.push("/")}>
      <HomeIcon />
    </IconButton>
  )
}

export interface ScoreTableProps {
  game: GameData;
}



const ScoreTable: React.FC<ScoreTableProps> = ({ game }) => {
  const classes = useStyles();
  const par = game.field.holes.reduce((curr, acc) => curr + acc.par, 0);
  return (
    <div className="center-wrapper">
      <HomeButton />
      <TableContainer component={Paper} className="paper-wrapper">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeader}>Hole</TableCell>
              <TableCell className={classes.tableHeader}>Par</TableCell>
              {game.players.map((player) => {
                return <TableCell align="right" className={classes.tableHeader}>{player.name}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Sum</TableCell>
              <TableCell>
                {game.field.holes.reduce((curr, acc) => curr + acc.par, 0)}
              </TableCell>
              {game.players.map((player) => {
                return (
                  <TableCell align="right">
                    {getScoreDisplay(findScoreForPlayer(game.scoreEntries, player.id), par)}
                  </TableCell>
                );
              })}
            </TableRow>
            {game.field.holes.map((hole) => {
              return (
                <ScoreTableRow
                  players={game.players}
                  hole={hole}
                  scoreEntries={game.scoreEntries.filter(
                    (entry) => entry.hole === hole.number
                  )}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ScoreTable;
