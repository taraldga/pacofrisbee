import * as React from 'react'
import NumberInput from './NumberInput/NumberInput'

export interface PlayerRowProps {
  name: string;
  score: number;
}

const PlayerRow: React.FC<PlayerRowProps> = ({
  name,
  score,
}) => {
  return (
      <div className="row">
        <p className="col-sm">{name}</p>
        <NumberInput value={score} onChange={() => {}}/>
      </div>
  )
}

export default PlayerRow;