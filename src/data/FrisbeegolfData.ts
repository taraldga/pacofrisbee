import Field from "types/Field"
import { Game } from "types/Game";
import Player from "types/Player";
import firebase from "firebase";

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

/**
 * Get all players currently stored on the server
 */
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

/**
 * Gets all games currently stored on the server
 */
export const getGames = async ()  =>  {
    const firebaseObject = await db.collection('games').get()
    const games: Game[] = [];
    firebaseObject.forEach(gameObject => {
        console.log(gameObject.data())
        const newObject = {
            ...gameObject.data(),
            id: gameObject.id,
            date: new Date(gameObject.data().date.seconds*1000),
        }
        console.log(gameObject.data().date)
        games.push(newObject as Game)
        console.log(games)
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




export function saveGame(gameToSave: Game) {

}

export function saveScoreEntries(game: Game) {
    
}