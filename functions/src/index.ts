import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});



export const adduserToDB = functions.auth.user().onCreate((user) => {
  admin.firestore().collection('users').add({
    name: user.displayName,
    email: user.email,
    id: user.uid
  })
});


export const calculateStats = functions.firestore.document('games/{gameId}').onUpdate((change, context) => {
  const game = admin.firestore().collection('games').doc(context.params.gameId).get();
  admin.firestore().collection('stats').add(game)
  admin.firestore().collection('log').add(change)
})