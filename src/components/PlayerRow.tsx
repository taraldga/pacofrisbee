import * as React from 'react'
import NumberInput from './NumberInput/NumberInput'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

export interface PlayerRowProps {
  name: string;
  score: number;
  updateScoreEntry: (newScore: number) => void
}

const PlayerRow: React.FC<PlayerRowProps> = ({
  name,
  score,
  updateScoreEntry
}) => {
  return (
    <TableRow
      hover
      tabIndex={-1}
      key={name}
    >
  <TableCell padding="checkbox">
    {name}
  </TableCell>
  <TableCell align="right"><NumberInput value={score} onChange={updateScoreEntry}/></TableCell>
  </TableRow>
  )
}

export default PlayerRow;