import "./App.css";
import "firebase/auth";

import * as firebase from "firebase/app";

import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import React, { useEffect } from "react";
import { CenteredLoader } from "components/CenteredLoader/CenteredLoader";
import UserContext, { PlayerPlaceHolder } from "util/UserContext";
import Player from "types/Player";
import Routes from "modules/Home/Routes";

export enum SignInState {
  waiting,
  notSignedIn,
  signedIn,
}

function App() {
  const [user, setUser] = React.useState<Player>(PlayerPlaceHolder);
  const [signedInState, setSignedInState] = React.useState<SignInState>(
    SignInState.waiting
  );

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#255C88",
      },
    },
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        const userPlayer: Player = {
          id: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? "",
        };
        setUser(userPlayer);
        setSignedInState(SignInState.signedIn);
      } else {
        setSignedInState(SignInState.notSignedIn);
      }
    });
  }, []);

  if (signedInState === SignInState.waiting) {
    return(
      <div className="login_loader">
        <CenteredLoader />
      </div>
    );
  }
  console.log(signedInState)
  return (
    <>
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={user}>
          <Router>
            <div className="App">
              <Routes isAuthenticated={signedInState === SignInState.signedIn} />
            </div>
          </Router>
        </UserContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
