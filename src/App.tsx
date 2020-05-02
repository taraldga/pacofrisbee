import './App.css';

import {
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";

import GameController from './controllers/GameController';
import GameCreator from './modules/GameCreator/GameCreator'
import HomeScreen from 'modules/HomeScreen';
import TopBar from 'components/TopBar/TopBar'
import React from 'react';

function App() {
  return (
    <Router>
      <div className="App">
        <TopBar />
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
        </Switch>
      </div>
    </Router>
  );
}

export default App;
