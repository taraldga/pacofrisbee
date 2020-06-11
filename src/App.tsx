import "./App.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";
import GameController from "./modules/GameController/GameController";
import GameCreator from "./modules/GameCreator/GameCreator";
import GameOverview from "modules/GameOverview/GameOverview";
import HomeScreen from "modules/HomeScreen";
import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "firebase/app";

export enum SignInState {
  waiting,
  notSignedIn,
}

function App() {
  const [user, setUser] = React.useState<firebase.User | SignInState>(
    SignInState.waiting
  );
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: "/",
    // We will display Google and Facebook as auth providers.
    signInOptions: [auth.GoogleAuthProvider.PROVIDER_ID],
  };
  auth().onAuthStateChanged(function (user) {
    if (user) {
      setUser(user);
    } else {
      setUser(SignInState.notSignedIn);
    }
  });

  let loginScreenJsx;
  if (user === SignInState.notSignedIn) {
    loginScreenJsx = (
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />
    );
  } else if (user === SignInState.waiting) {
    loginScreenJsx = <CircularProgress />;
  }

  return (
    <>
      <Router>
        {user !== SignInState.waiting && user !== SignInState.notSignedIn ? (
          <div className="App">
            <Switch>
              <Route exact path="/">
                <HomeScreen />
              </Route>
              <Route exact path="/create-game">
                <GameCreator />
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
          </div>
        ) : (
          loginScreenJsx
        )}
      </Router>
    </>
  );
}

export default App;
