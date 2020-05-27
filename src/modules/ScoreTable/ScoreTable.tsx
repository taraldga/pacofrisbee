import * as React from "react";
import { ScoreEntry } from "types/ScoreEntry";
import Game from "data/Game";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Player from "types/Player";
import { Hole } from "types/Field";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { findScoreForPlayer } from "util/findScoreForPlayer";

interface ScoreTableRowProps {
  hole: Hole; 
  scoreEntries: ScoreEntry[];
  players: Player[]
}

const getScoreDisplay = (playerScore: number, holePar: number) => {
  let diff = playerScore - holePar;
  if(diff > 0) {
    return <span style={{color: 'red'}}>{`${playerScore} (+${diff})`}</span>
  } else if (diff < 0) {
    return <span style={{color: 'green'}}>{`${playerScore} (${diff})`}</span>
  } else {
    return <span>{playerScore}</span>
  }
}

const ScoreTableRow: React.FC<ScoreTableRowProps> = ({
  hole,
  scoreEntries,
  players
}) => {
  return (
    <TableRow>
      <TableCell>{hole.number}</TableCell>
      <TableCell>{hole.par}</TableCell>
      {players.map(player => {
        const playerScore = scoreEntries.find(entry => entry.playerId === player.id)?.score;
        return <TableCell align="right">{getScoreDisplay(playerScore ? playerScore : 0, hole.par)}</TableCell>
      })}
    </TableRow>
  )
}

export interface ScoreTableProps {
  game: Game;
}

const ScoreTable : React.FC<ScoreTableProps> = ({
  game
}) => {
  return (
    <div className="center-wrapper">
    <TableContainer component={Paper} className="paper-wrapper">
      <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell className="sum-cell">Hole</TableCell>
          <TableCell className="sum-cell">Par</TableCell>
          {
            game?.getPlayers().map(player => {
              return <TableCell align="right">{player.name}</TableCell>
            })
          }
        </TableRow>
      </TableHead>
      <TableBody>
      <TableRow>
        <TableCell>Sum</TableCell>
        <TableCell>{game?.getField().holes.reduce((curr, acc) => curr + acc.par, 0)}</TableCell>
        {game?.getPlayers().map(player => {
          return <TableCell align="right">{findScoreForPlayer(game?.getScoreEntries(), player.id)}</TableCell>
        })}
      </TableRow>
      {
        game?.getField().holes.map(hole => {
          return(
            <ScoreTableRow 
              players={game?.getPlayers()} 
              hole={hole}
              scoreEntries={game?.getScoreEntries().filter(entry => entry.hole === hole.number)} />
          )
        })
      }
      </TableBody>
      </Table>
      </TableContainer>
      </div>
  )
}

export default ScoreTable;