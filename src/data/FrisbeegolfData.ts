import Field from "types/Field"
import { Game } from "types/Game";
import Player from "types/Player";

const fields: Field[] = [
    {
        id: "0kq06gugls",
        name: "Holmenkollen",
        holes: Array.from(Array(18)).map((_, index) => ({number: index + 1, par: 3}))
    },
    {
        id: "7j1xc36xqt",
        name: "Charlottenlund",
        holes: Array.from(Array(9)).map((_, index) => ({number: index + 1, par: 3}))
    }
]

const players: Player[] = [
    {
        id: "1",
        name: "Tarald Gåsbakk"
    },
    {
        id: "2",
        name: "Pål Nesbø Lekven"
    },
    {
        id: "3",
        name: "Håvard Snarby"
    },
    {
        id: "4",
        name: "William Tisdal"
    },

]


export function getFields () {
    return fields;
}

export function savePlayers(playersToSave: Player[]){
    window.localStorage.setItem("pacoGolfSavedPlayers", JSON.stringify(playersToSave))
}

export function getPlayers() {
    let currentlySavedPlayers = window.localStorage.getItem("pacoGolfSavedPlayers");
    let playersObject = currentlySavedPlayers ? JSON.parse(currentlySavedPlayers) as Player[] : [];
    if(playersObject.length === 0) {
        savePlayers(players);
        return players
    } else {
        return playersObject;
    }
}

function getGameData(): Game[] {
    let currentlySavedGames = window.localStorage.getItem("pacoGolfSavedData");
    return currentlySavedGames ? JSON.parse(currentlySavedGames): undefined;
}

export function createGame(game: Game) {
    let currentlySavedGames = window.localStorage.getItem("pacoGolfSavedData");
    let newSave = currentlySavedGames ? JSON.parse(currentlySavedGames) as Game[] : [];
    newSave.push(game)
    window.localStorage.setItem("pacoGolfSavedData", JSON.stringify(newSave))
}

export function fetchGame(id: string): Game | undefined {
    let currentlySavedGames = window.localStorage.getItem("pacoGolfSavedData");
    if(currentlySavedGames) {
        return JSON.parse(currentlySavedGames).find((game: Game) => game.id === id)
    } else {
        return undefined
    }
}


export function saveGame(gameToSave: Game) {
    let gameData = getGameData();
    if(gameData) {
        let gameIndex = gameData.findIndex(game => game.id === gameToSave.id)
        if(gameIndex > -1) {
            gameData.splice(gameIndex, 1, gameToSave)
            window.localStorage.setItem("pacoGolfSavedData", JSON.stringify(gameData))
        }
    }
}