import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import RoundController from './controllers/GameController';
import Player from './Types/Player';
import Field from 'Types/Field';
import HomeScreen from 'modules/HomeScreen';


function App() {

  const players: Player[] = [
    {
      id: "1",
      name: "Tarald"
    },
    {
      id: "2",
      name: "Pål"
    },
    {
      id: "3",
      name: "William",
    }
  ]

  const field: Field = {
    name: "Holmenkollen",
    holes: [
      {
        number: 1,
        par: 3
      },
      {
        number: 2,
        par: 3
      },
      {
        number: 3,
        par: 3
      },
      {
        number: 4,
        par: 5
      }
    ]
  }
  return (
    <div className="App">
      <h1>PacoFrisbeeGolf</h1>

      <Switch>
        <Route exact path="/">
          <HomeScreen />
        </Route>
        <Route exact path="/game/:gameId">
          <RoundController field={field} players={players}/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
