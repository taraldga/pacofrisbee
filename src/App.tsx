import './App.css';

import {
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

import GameController from './controllers/GameController';
import GameCreator from './modules/GameCreator/GameCreator'
import HomeScreen from 'modules/HomeScreen';
import TopBar from 'components/TopBar/TopBar'
import React, { useEffect } from 'react';
import GameOverview from 'modules/GameOverview/GameOverview';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { getFields } from 'data/FrisbeegolfData';

function App() {
  const [user, setUser] = React.useState<any>()
  const [isLoading, setIsLoading] = React.useState(true);
  // Configure FirebaseUI.
  const uiConfig = {
      // Popup signin flow rather than redirect flow.
      signInFlow: 'popup',
      // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
      signInSuccessUrl: '/',
      // We will display Google and Facebook as auth providers.
      signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ]
  };

  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setUser(user)
      } 
      setIsLoading(false)
  });


  useEffect(() => {
    const fetchData = async () => {
      let fields = await getFields()
      console.log(fields)
    }
    fetchData()
  }, [])

  return (
    <>
    <Router>
    <TopBar />
    {user ? (
      <div className="App">
        <Switch>
          <Route exact path="/">
            <HomeScreen />
          </Route>
          <Route exact path="/create-game">
            <GameCreator />
          </Route>
          <Route exact path="/game/:gameId/:holeId">
            <GameController />
          </Route>
          <Route exact path="/gameoverview">
            <GameOverview />
      </Route>
        </Switch>
      </div>
    ):
    (
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
      )
    }
    </Router>
    </>
    )
}

export default App;
