import * as React from 'react'

import './HoleView.css'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import PlayerRow from '../PlayerRow'
import { ScoreEntry } from 'types/ScoreEntry'
import Player from 'types/Player'
import TableContainer from '@material-ui/core/TableContainer'
import TableBody from '@material-ui/core/TableBody'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

export interface HoleViewProps {
  players: Player[];
  scoreEntries: ScoreEntry[];
  holeNumber: number;
  updateScoreEntry: (playerId: string, newScore: number) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tablecontainer: {
      margin: "0 15px",
      width: "auto",
      textAlign: "center"
    },
  }),
);

const HoleView: React.FC<HoleViewProps> = ({
  players,
  scoreEntries,
  holeNumber,
  updateScoreEntry
}) => {
  const classes = useStyles();

  return(
    <div>
      <TableContainer className={classes.tablecontainer}>
      <h3>Hole number {holeNumber} </h3>
        <Table
            aria-labelledby="tableTitle"
            size={false ? 'small' : 'medium'}
            aria-label="enhanced table"
            >
        <TableHead>
        <TableRow>
            <TableCell className="table-header-cell">Player Name</TableCell>
            <TableCell align="center" className="table-header-cell">Score</TableCell>
          </TableRow>
        </TableHead>
            <TableBody>
            {
              players.map(player => {
                const playerScoreEntry = scoreEntries.find(entry => entry.playerId === player.id)
                return <PlayerRow name={player.name} score={playerScoreEntry ? playerScoreEntry.score : 0}  updateScoreEntry={(newScore) => updateScoreEntry(player.id, newScore) }/>
              })
            }
            </TableBody>
        </Table>
      </TableContainer>

    </div>
  )
}


export default HoleView;