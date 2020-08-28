import "./App.css";
import 'firebase/auth';

import * as firebase from 'firebase/app';

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import GameController from "./modules/GameController/GameController";
import GameCreator from "./modules/GameCreator/GameCreator";
import GameOverview from "modules/GameOverview/GameOverview";
import Stats from './modules/Stats/Stats'
import HomeScreen from "modules/HomeScreen";
import React, { useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { CenteredLoader } from "components/CenteredLoader/CenteredLoader";
import UserContext, { PlayerPlaceHolder } from "util/UserContext";
import Player from "types/Player";


export enum SignInState {
  waiting,
  notSignedIn,
  signedIn
}



function App() {
  const [user, setUser] = React.useState<Player>(PlayerPlaceHolder)
  const [signedInState, setSignedInState] = React.useState<SignInState>(SignInState.waiting);

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#255C88"
      }
    }
  });
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: "/",
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };


  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        const userPlayer: Player = {
          id: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? ""
        }
        setUser(userPlayer);
        setSignedInState(SignInState.signedIn);
      } else {
        setSignedInState(SignInState.notSignedIn);
      }
    })
    }, []);

  let loginScreenJsx;
  if (signedInState === SignInState.notSignedIn) {
    loginScreenJsx = (
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    );
  } else if (signedInState === SignInState.waiting) {
    loginScreenJsx = (
      <div className="login_loader">
        <CenteredLoader />
      </div>
    )
  }
  return (
    <>
    <ThemeProvider theme={theme}>
    <UserContext.Provider value={user}>
      <Router>
        <div className="App">
        {signedInState !== SignInState.waiting && signedInState !== SignInState.notSignedIn ? (
            <Switch>
              <Route exact path="/">
                <HomeScreen />
              </Route>
              <Route exact path="/create-game">
                <GameCreator />
              </Route>
              <Route exact path="/stats">
                <Stats />
              </Route>
              <Route
                exact
                path="/game/:gameId/:holeId"
                component={GameController}
              />
              <Route exact path="/gameoverview">
                <GameOverview />
            </Route>
            </Switch>
        ) : (
          loginScreenJsx
          )}
        </div>
      </Router>
      </UserContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
