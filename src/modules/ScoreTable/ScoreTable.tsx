import * as React from "react";
import { ScoreEntry } from "types/ScoreEntry";

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
import { GameData } from "types/Game";

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
  game: GameData;
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
            game.players.map(player => {
              return <TableCell align="right">{player.name}</TableCell>
            })
          }
        </TableRow>
      </TableHead>
      <TableBody>
      <TableRow>
        <TableCell>Sum</TableCell>
        <TableCell>{game.field.holes.reduce((curr, acc) => curr + acc.par, 0)}</TableCell>
        {game.players.map(player => {
          return <TableCell align="right">{findScoreForPlayer(game.scoreEntries, player.id)}</TableCell>
        })}
      </TableRow>
      {
        game.field.holes.map(hole => {
          return(
            <ScoreTableRow 
              players={game.players} 
              hole={hole}
              scoreEntries={game.scoreEntries.filter(entry => entry.hole === hole.number)} />
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