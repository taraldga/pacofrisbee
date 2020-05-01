import React, { useState } from 'react';
import { getFields, getPlayers } from 'data/FrisbeegolfData';

import Button from '@material-ui/core/Button';
import Field from 'types/Field';
import FormControl from '@material-ui/core/FormControl';
import { Game } from 'types/Game';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { Link } from 'react-router-dom'
import { MenuItem } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import uniqid from 'uniqid'

const GameCreator : React.FC = () => {
    console.log("Is in gamecreator")
    const [game, setGame] = useState<Game>({
        id: uniqid(),
        field: {name: "", holes: []},
        players: [],
        scoreEntries: [] 
    })
    
    const fields = getFields()
    const players = getPlayers()

    const updateField = (event: React.ChangeEvent<{ value: unknown }>) => {
        console.log("Something happened")
        console.log(event)
        const newField = fields.find(field => field.id === event.target.value);
        if(newField) {
            setGame({
                ...game,
                field: newField
            })
        }
    } 
    console.log(game)
    return (
        <div>
            <FormControl>
                <InputLabel>Select Field</InputLabel>
                <Select
                    placeholder="Select field"
                    value={game?.field}
                    onChange={updateField}
                >
                    {fields.map((field) => (
                        <MenuItem key={field.id} value={field.id}>{field.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Select Players</InputLabel>
                <Select
                    placeholder="Select field"
                    value={game?.players}
                    onChange={updateField}
                >
                    {fields.map((field) => (
                        <MenuItem key={field.id} value={field.id}>{field.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Link to="/">
                <Button color="default" size="large">Home</Button>
            </Link>
            <Button color="primary" size="large">Start Game</Button>
        </div>
    );
}


export default GameCreator