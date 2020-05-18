import Field from "types/Field"
import { Game } from "types/Game";
import Player from "types/Player";
import firebase from "firebase";
import { ScoreEntry } from "types/ScoreEntry";

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
export const getGames = async ()  =>  {
    const firebaseObject = await db.collection('games').get()
    const games: Game[] = [];
    firebaseObject.forEach(gameObject => {
        const newObject = {
            ...gameObject.data(),
            id: gameObject.id,
            date: new Date(gameObject.data().date.seconds*1000),
        }
        games.push(newObject as Game)
    })
    return games;
}

/**
 * Creates a new game on the server
 * @param game The game to save
 */
export const createGame = async (game: Game) => {
    await db.collection('games').add(game)
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


const cleanScoreEntry = (scoreEntry: ScoreEntry) => {
    delete(scoreEntry.updated);
    delete(scoreEntry.new);
}

export const saveScoreEntries = async (scoreEntries: ScoreEntry[]) => {
    const batch = db.batch();

    // Create all new entries
    scoreEntries.filter(scoreEntry => scoreEntry.new).forEach(scoreEntry => {
        cleanScoreEntry(scoreEntry)
        let newEntryRef = db.collection('scores').doc()
        batch.set(newEntryRef, scoreEntry)
    })

    // Update all entries that should be updated
    scoreEntries.filter(scoreEntry => scoreEntry.updated && !scoreEntry.new).forEach(scoreEntry => {
        cleanScoreEntry(scoreEntry)
        let updatedEntryRef = db.collection('scores').doc(scoreEntry.id)
        batch.set(updatedEntryRef, scoreEntry)
    })

    await batch.commit()
}

export const fetchScores = async (gameId: string, hole?: string) => {
    let scoreObjects;
    if(hole) {
        scoreObjects = await db.collection('scores').where('gameId', '==', gameId).where('hole', '==', +hole).get();
    } else {
        scoreObjects = await db.collection('scores').where('gameId', '==', gameId).get();
    }
    console.log(hole)
    const scoreEntries: ScoreEntry[] = [];
    scoreObjects.forEach(scoreObject => {
        const newObject = {
            ...scoreObject.data(),
            id: scoreObject.id,
            date: new Date(scoreObject.data().date.seconds*1000),
        }
        scoreEntries.push(newObject as ScoreEntry)
    })
    console.log(scoreEntries)
    return scoreEntries
}