import * as React from 'react'

import PlayerRow from './PlayerRow'
import { Player } from '../Types'

export interface RoundControllerProps {
  players: Player[]
}

const RoundController: React.FC<RoundControllerProps> = ({
  players
}) => {
  return(
    <div>
      <PlayerRow name="Tarald" score={3} />
      <PlayerRow name="Pål" score={3} />
      <PlayerRow name="William" score={3} />
    </div>
  )
}

export default RoundController