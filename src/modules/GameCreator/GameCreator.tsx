import React, { useState } from 'react';
import { getFields, getPlayers, createGame, savePlayers } from 'data/FrisbeegolfData';
import { useHistory } from "react-router-dom";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { Game } from 'types/Game';
import InputLabel from '@material-ui/core/InputLabel';
import { MenuItem, TableContainer, Table, TableBody, TableRow, TableCell, Checkbox, TableHead, Paper } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import uniqid from 'uniqid'
import "./GameCreator.css"
import Player from 'types/Player';
import TextField from '@material-ui/core/TextField';

const GameCreator : React.FC = () => {
    let history = useHistory();

    const [game, setGame] = useState<Game>({
        id: uniqid(),
        date: new Date(),
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
            <TableContainer component={Paper}>
            <Table
                size={'small'}
            >
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