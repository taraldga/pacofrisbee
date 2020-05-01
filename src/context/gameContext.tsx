
export {}

// import React, { createContext, useState } from 'react'

// import Field from 'types/Field';
// import { Game } from 'types/Game';
// import Player from 'types/Player';
// import { ScoreEntry } from 'types/ScoreEntry';

// export interface GameProviderProps {
//     children: React.ReactNode
// }


// const emptyGame: Game = {
//     field: {name: "", holes: []},
//     players: [],
//     scoreEntries: [],
// }

// const elementIsInArray = (index: number) => index !== -1


// export const GameContext = createContext(emptyGame);


// const GameProvider = (props: GameProviderProps) => {
//     const [ game, setGame ] = useState(emptyGame)

//     const updateGameField = (field: Field) => {
//         setGame({
//             ...game,
//             field: field
//         })
//     }

//     const updateGamePlayers = (newPlayer: Player) => {
//         let newPlayers = Array.from(game.players);
//         const playerIndex = newPlayers.findIndex(player => player.id === newPlayer.id)

//         if(!elementIsInArray(playerIndex)) {
//             newPlayers.push(newPlayer)
//         } else {
//             newPlayers.splice(playerIndex, 1);
//         }
//         setGame({
//             ...game,
//             players: newPlayers
//         })
//     }

//     const updateGameScoreEntry = (newScoreEntry: ScoreEntry) => {
//         let newScoreEntries = Array.from(game.scoreEntries);
//         const scoreEntryIndex = newScoreEntries.findIndex(scoreEntry => scoreEntry.id === newScoreEntry.id)
        
//         if(!elementIsInArray(scoreEntryIndex)) {
//             newScoreEntries.push(newScoreEntry)
//         } else {
//             newScoreEntries.splice(scoreEntryIndex, 1);
//         }

//         setGame({
//             ...game,
//             scoreEntries: newScoreEntries
//         })
//     }

//     return (
//         <GameContext.Provider value={{...game, updateGameField, updateGamePlayers, updateGameScoreEntry}}>{props.children}</GameContext.Provider>
//     )
// }

// export default GameProvider