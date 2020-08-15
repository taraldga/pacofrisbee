import "firebase/firestore"

import Field from "types/Field"
import { GameData } from "types/Game";
import Player from "types/Player";
import firebase from "firebase/app";

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
firebase.initializeApp(firebaseConfig);
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

function safelyParseJSON (json: string) {
    let parsed
    try {
        parsed = JSON.parse(json)
    } catch (e) {
        return[]
    }

    return parsed // Could be undefined!
}


export function savePlayer(playerToSave: Player){
    let localySavedPlayersObject = window.localStorage.getItem("pacoGolfSavedPlayers");
    let localPlayerList =safelyParseJSON(localySavedPlayersObject ?? '[]') as Player[]
    localPlayerList.push(playerToSave)
    window.localStorage.setItem("pacoGolfSavedPlayers", JSON.stringify(localPlayerList))
}

/**
 * Get all players currently stored on the server
 */
export const getPlayers = async () => {
    let localySavedPlayersObject = window.localStorage.getItem("pacoGolfSavedPlayers");
    let localPlayerList =safelyParseJSON(localySavedPlayersObject ?? '[]')
    let fireBaseObject = await db.collection('users').get()
    let players: Player[] = []
    fireBaseObject.forEach(fieldObject => {
        const newObject = {
            ...fieldObject.data(),
            objectId: fieldObject.id
        }
        players.push(newObject as Player)
    })
    return [...localPlayerList, ...players]
}

/**
 * Gets all games currently stored on the server
 */
export const getGames = async (playerName: string)  =>  {
    const firebaseObject = await db.collection('games').where('playerList', 'array-contains', playerName).get()
    const games: GameData[] = [];
    firebaseObject.forEach(gameObject => {
        const newObject = {
            ...gameObject.data(),
            id: gameObject.id,
            date: new Date(gameObject.data().date.seconds*1000),
        }
        games.push(newObject as GameData)
    })
    return games;
}

/**
 * Fetches a game with the given id. Looks first in the cache, and returns from server if nothing is found.
 * @param id The id of the game to be fetched
 */
export const fetchGame = async (id: string) => {
    try {
        const gameObject = await db.collection('games').doc(id).get({source: 'cache'});
        const newObject = {
            ...gameObject.data(),
            id: gameObject.id,
            date: new Date(gameObject.data()?.date.seconds*1000),
        }
        return newObject
    } catch (e) {
        const gameObject = await db.collection('games').doc(id).get();
        const newObject = {
            ...gameObject.data(),
            id: gameObject.id,
            date: new Date(gameObject.data()?.date.seconds*1000),
        }
        return newObject
    }
}

/**
 * Creates a new game on the server
 * @param game The game to save
 */
export const createGame = async (game: GameData) => {
    const newGame = await db.collection('games').add(game);
    return newGame;
}

export const updateGame = async (game: GameData) => {
    const savedGame = await db.collection('games').doc(game.id).update(game);
    return savedGame
}


export const saveScore = async (game: GameData) => {
    const ref = db.collection('games').doc(game.id);
    const newGameData = await ref.update({
        scoreEntries: game.scoreEntries,
        field: game.field
    })
    return newGameData;
}

export const deleteGame = async (game: GameData) => {
    const ref = db.collection('games').doc(game.id);
    const ok = await ref.delete();
    return ok
}