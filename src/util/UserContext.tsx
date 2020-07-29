import React from 'react'
import Player from 'types/Player'

export const PlayerPlaceHolder: Player = {
  id: "12345",
  name: "No Name",
}

export const UserContext = React.createContext<Player>(PlayerPlaceHolder)

export default UserContext