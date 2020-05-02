import * as React from 'react'

import PlayerRow from './PlayerRow'
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

const HoleView: React.FC<HoleViewProps> = ({
  players,
  scoreEntries,
  holeNumber,
  updateScoreEntry
}) => {
  return(
    <div>
      <h3>Hole number {holeNumber} </h3>
      <TableContainer>
        <Table
            aria-labelledby="tableTitle"
            size={false ? 'small' : 'medium'}
            aria-label="enhanced table"
            >
        <TableHead>
        <TableRow>
            <TableCell>Player Name</TableCell>
            <TableCell align="right">Score</TableCell>
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