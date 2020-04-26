import * as React from 'react'
import NumberInput from './NumberInput/NumberInput'

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
      <div className="row">
        <p className="col-sm">{name}</p>
        <NumberInput value={score} onChange={updateScoreEntry}/>
      </div>
  )
}

export default PlayerRow;