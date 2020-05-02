import React, { useState } from 'react';
import { getFields, getPlayers, createGame, savePlayers } from 'data/FrisbeegolfData';
import { useHistory } from "react-router-dom";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { Game } from 'types/Game';
import InputLabel from '@material-ui/core/InputLabel';
import { Link } from 'react-router-dom'
import { MenuItem, TableContainer, Table, TableBody, TableRow, TableCell, Checkbox } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import uniqid from 'uniqid'
import "./GameCreator.css"
import Player from 'types/Player';
import TextField from '@material-ui/core/TextField';


const GameCreator : React.FC = () => {
    let history = useHistory();

    const [game, setGame] = useState<Game>({
        id: uniqid(),
        field: {name: "", holes: []},
        players: [],
        scoreEntries: [] 
    })

    const [newPlayerName, setNewPlayerName] = useState("")
    
    const fields = getFields()
    const players = getPlayers()

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

    const startGame = () => {
        createGame(game)
        history.push(`/game/${game.id}/${1}`)
    }

    const addPlayer = () => {
        const newPlayer: Player = {
            id: uniqid(),
            name: newPlayerName
        }
        players.push(newPlayer)
        savePlayers(players);
        updatePlayers(newPlayer)
        setNewPlayerName("")
    }
    
    const isSelected = (playerId: string) => game.players.findIndex(player => player.id === playerId) > -1
    
    return (
        <div className="game-creator-view">
        <h3>Select field</h3>
        <div className="input-group">
            <FormControl className="gamecreator-select">
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
            <Table
                aria-labelledby="tableTitle"
                size={false ? 'small' : 'medium'}
                aria-label="enhanced table"
            >
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
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </TableCell>
                        <TableCell align="right">{player.name}</TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
        <h3>Add player</h3>
        <div className="add-player-row">
            <TextField onChange={(e) => setNewPlayerName(e.target.value)} value={newPlayerName} id="new-player-input" label="Player Name" variant="standard" />
            <Button color="default" size="large" variant="contained" onClick={() => addPlayer()} >Add player</Button>
        </div>
        <div className="input-group">
            <Link to="/">
                <Button color="default" size="large" variant="contained">Home</Button>
            </Link>
            <Button color="primary" size="large" variant="contained" onClick={startGame}>Start Game</Button>
        </div>
        </div>
    );
}


export default GameCreator