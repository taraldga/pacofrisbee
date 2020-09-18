import PrivateRoute from "components/PrivateRoute";
import GameController from "modules/GameController/GameController";
import GameCreator from "modules/GameCreator/GameCreator";
import GameOverview from "modules/GameOverview/GameOverview";
import Stats from "modules/Stats/Stats";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";

export interface RoutesInterface {
  isAuthenticated: boolean;
}

const Routes: React.FunctionComponent<RoutesInterface> = ({
  isAuthenticated,
}) => {
  return (
    <Switch>
      <Route exact path="/login">
        <LoginScreen />
      </Route>
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        exact
        path="/"
        component={HomeScreen}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        exact
        path="/create-game"
        component={GameCreator}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        exact
        path="/stats"
        component={Stats}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        exact
        path="/game/:gameId/:holeId"
        component={GameController}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        exact
        path="/gameoverview"
        component={GameOverview}
      />
    </Switch>
  );
};

export default Routes;
