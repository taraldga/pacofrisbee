import React, { useState, useEffect } from 'react';
import { getFields, getPlayers, createGame, savePlayer} from 'data/FrisbeegolfData';
import { useHistory } from "react-router-dom";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { GameData } from 'types/Game';
import InputLabel from '@material-ui/core/InputLabel';
import { MenuItem, TableContainer, Table, TableBody, TableRow, TableCell, Checkbox, TableHead } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import uniqid from 'uniqid'
import "./GameCreator.css"
import Player from 'types/Player';
import TextField from '@material-ui/core/TextField';
import Field from 'types/Field';

const GameCreator : React.FC = () => {
    let history = useHistory();
    const [fields, setFields] = useState<Field[]>([])

    const [game, setGame] = useState<GameData>({
        id: uniqid(),
        date: new Date(),
        field: {name: "", holes: []},
        players: [],
        scoreEntries: [] 
    })

    const [newPlayerName, setNewPlayerName] = useState("")
    const [error, setError] = useState<{[key: string]: string}>({})
    const [players, setPlayers] = useState<Player[]>([])
    
    useEffect(() => {
        const fetchData = async () => {
          let fields = await getFields()
          setFields(fields)
        }
        fetchData()
      }, [])

      useEffect(() => {
        const fetchData = async () => {
          let players = await getPlayers()
          setPlayers(players)
        }
        fetchData()
      }, [])

    const updateField = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newField = fields.find(field => field.id === event.target.value);
        if(newField) {
            setGame({
                ...game,
                field: newField
            })
        }
    }

    const updatePlayers = (newPlayer: Player) => {
        let newPlayers = Array.from(game.players);
        const playerIndex = newPlayers.findIndex(player => player.id === newPlayer.id)

        if(playerIndex === -1) {
            newPlayers.push(newPlayer)
        } else {
            newPlayers.splice(playerIndex, 1);
        }
        setGame({
            ...game,
            players: newPlayers
        })
    }

    const startGame = async () => {
        let error = verifyInput(game);
        if(Object.keys(error).length === 0 && error.constructor === Object) {
            let dbGame = await createGame(game)
            console.log(dbGame)
            history.push(`/game/${dbGame.id}/${1}`)
        } else {
            setError(error)
        }
    }

    const addPlayer = () => {
        const newPlayer: Player = {
            id: uniqid(),
            name: newPlayerName
        }
        players.push(newPlayer)
        savePlayer(newPlayer);
        updatePlayers(newPlayer)
        setNewPlayerName("")
    }
    
    const isSelected = (playerId: string) => game.players.findIndex(player => player.id === playerId) > -1

    const verifyInput = (game: GameData) => {
        let error: {[key: string]: string} = {};

        if( game.field.name === "" ) {
            error["field"] = "You must select a field"
        }
        if( game.players.length === 0 ) {
            error["players"] = "You must select at least one player"
        }
        return error
    }
    
    return (
        <div className="game-creator-view">
        <h3>Select field</h3>
        <div className="input-group">
            <FormControl className="gamecreator-select" error={ error["field"]!== undefined}>
                <InputLabel>Select Field</InputLabel>
                <Select
                    placeholder="Select field"
                    value={game?.field.id}
                    onChange={updateField}
                >
                    {fields.map((field) => (
                        <MenuItem key={field.id} value={field.id}>{field.name}</MenuItem>
                    ))}
                </Select>

            </FormControl>
        </div>
        <h3>Select players</h3>
        <div className="input-group">
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Checked</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                    {players.map((player, index) => {
                        const isItemSelected = isSelected(player.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                            <TableRow
                                hover
                                onClick={(_) => updatePlayers(player)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={player.id}
                                selected={isItemSelected}
                            >
                            <TableCell align="left">{player.name}</TableCell>
                            <TableCell align="right" padding="checkbox">
                                <Checkbox
                                    checked={isItemSelected}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </TableCell>
                            </TableRow>
                        );
                        })}
                    <TableRow>
                        <TableCell >
                            <TextField onChange={(e) => setNewPlayerName(e.target.value)} value={newPlayerName} label="Player Name" variant="standard" />
                        </TableCell>
                        <TableCell align="right">
                            <Button color="default" size="small" variant="contained" onClick={() => addPlayer()} >Add</Button>
                        </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <div className="input-group">
            <Button fullWidth color="primary" size="large" variant="contained" onClick={startGame}>Start Game</Button>
        </div>
        </div>
    );
}


export default GameCreator