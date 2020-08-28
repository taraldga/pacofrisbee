import * as functions from 'firebase-functions';
import { GameData } from './types/Game';
import { ScoreEntry } from './types/ScoreEntry';


const admin = require('firebase-admin');
admin.initializeApp();

export const adduserToDB = functions.auth.user().onCreate((user) => {
  admin.firestore().collection('users').add({
    name: user.displayName,
    email: user.email,
    id: user.uid
  })
});


const getAverageComparedToPar = (scores: ScoreEntry[]) => {
  return scores.reduce((acc, curr) => acc + (curr.score - curr.holePar), 0) / scores.length;
}

const getLowestScoreFromPar = (games: GameData[], player: string) => {
  let bestRoundScore = 99999;
  let bestRoundId = '';
  let bestRoundField = '';
  let bestRoundDate;
  games.forEach(game => {
    let gameScore =  game.scoreEntries.filter(scoreEntry => scoreEntry.playerName === player).reduce((acc, curr) => {
      return acc + (curr.score - curr.holePar);
    }, 0)
    if(gameScore < bestRoundScore) {
      bestRoundScore = gameScore;
      bestRoundId = game.id as string;
      bestRoundDate = game.date;
      bestRoundField = game.field.name;
    }
  })
  return {bestRoundScore, bestRoundId, bestRoundDate, bestRoundField}
}

const getTotalNumberOfThrows = (scores: ScoreEntry[]) => {
  return scores.reduce((acc, curr) => acc + curr.score, 0);
}

const getNumberOfAces = (scores: ScoreEntry[]) => {
  return scores.filter(score => score.score === 1).length;
}

const getScoresWithOffset = (scores: ScoreEntry[], offset: number) => {
  return scores.filter(score => score.score - score.holePar === offset ).length;
}

const concat = (x: any,y: any) =>
  x.concat(y)

const calculateStatsForPlayer = async (player: string) => {
  const result = await admin.firestore().collection('games').where('playerList', 'array-contains', player).get()
  const allPlayerGames: GameData[] = [];
   result.forEach((resultObject: any) => {
     if(resultObject) {
       const newObject = {
         ...resultObject.data(),
         id: resultObject.id,
         date: new Date(resultObject.data().date.seconds*1000),
        } 
        allPlayerGames.push(newObject);
      }
    })
  const allPlayerScores = allPlayerGames.map(game => game.scoreEntries.filter(score => score.playerName === player)).reduce(concat, []);

  let stats = {} as any;

  // General stats for player
  stats['playerName'] = player;
  stats['totalNumberOfGamesPlayed'] = allPlayerGames.length;
  stats['totalNumberOfHolesPlayed'] = allPlayerScores.length;
  stats['totalNumberOfThrows'] = getTotalNumberOfThrows(allPlayerScores);
  stats['averageDifferenceFromPar'] = getAverageComparedToPar(allPlayerScores);
  stats['bestRound'] = getLowestScoreFromPar(allPlayerGames, player)
  stats['numberOfAces'] = getNumberOfAces(allPlayerScores);
  stats['numberOfEagles'] = getScoresWithOffset(allPlayerScores, -2);
  stats['numberOfBirdies'] = getScoresWithOffset(allPlayerScores, -1);
  stats['numberOfPars'] = getScoresWithOffset(allPlayerScores, 0);
  stats['numberOfBogeys'] = getScoresWithOffset(allPlayerScores, 1);
  stats['numberOfDoubleBogeys'] = getScoresWithOffset(allPlayerScores, 2);

  return stats;
}


export const calculateStats = functions.firestore.document('games/{gameId}').onUpdate(async (change, context) => {
  if(change.after.data()?.isFinished && change.before.data()?.isFinished === undefined) {
    const game = await admin.firestore().collection('games').doc(context.params.gameId).get();
    const gameData: GameData = game.data();
    gameData.playerList?.forEach(async (player: string) => {
      const playerStats = await calculateStatsForPlayer(player);
      admin.firestore().collection('stats').doc(player).set(playerStats);
    });
  }
})