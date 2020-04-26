import React from 'react';
import './App.css';
import RoundController from './Controllers/GameController';
import Player from './Types/Player';
import Field from 'Types/Field';


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
      }
    ]
  }
  return (
    <div className="App">
      <h1>PacoFrisbeeGolf</h1>
      <RoundController field={field} players={players}/>
    </div>
  );
}

export default App;
