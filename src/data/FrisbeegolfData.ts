import Field from "types/Field"
import { Game } from "types/Game";
import Player from "types/Player";
import firebase from "firebase";

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
// Initialize firebase 
const firebaseConfig = {
    apiKey: "AIzaSyDOeiSHJc6XFwOP7LrdWrtYAlKDbnWXS-Q",
    authDomain: "pacount-d131a.firebaseapp.com",
    databaseURL: "https://pacount-d131a.firebaseio.com",
    projectId: "pacount-d131a",
    storageBucket: "pacount-d131a.appspot.com",
    messagingSenderId: "164274232100",
    appId: "1:164274232100:web:8f42eb0afee2a473b9f1b1",
    measurementId: "G-KQKTCY6Y4V"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

export const getFields = async () => {
    let fireBaseObject = await db.collection('fields').get()
    let fields: Field[] = []
    fireBaseObject.forEach(fieldObject => {
        const newObject = {
            ...fieldObject.data(),
            id: fieldObject.id
        }
        fields.push(newObject as Field)
    })
    return fields
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
    let parsedGames = currentlySavedGames ? JSON.parse(currentlySavedGames): undefined;
    return parsedGames.map((game: Game) => ({
        id: game.id,
        date: new Date(game.date),
        field: game.field,
        players: game.players,
        scoreEntries: game.scoreEntries
    }))
}

export const createGame = async (game: Game) => {
    await db.collection('games').add(game)
}

export function fetchGame(id: string): Game | undefined {
    let currentlySavedGames = window.localStorage.getItem("pacoGolfSavedData");
    if(currentlySavedGames) {
        return JSON.parse(currentlySavedGames).find((game: Game) => game.id === id)
    } else {
        return undefined
    }
}

export function fetchGames(): Game[] {
    return getGameData();
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