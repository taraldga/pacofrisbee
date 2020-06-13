import "./GameCreator.css";

import React, { useEffect, useState } from "react";
import {
  createGame,
  getFields,
  getPlayers,
  savePlayer,
} from "data/FrisbeegolfData";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Field from "types/Field";
import FormControl from "@material-ui/core/FormControl";
import { GameData } from "types/Game";
import InputLabel from "@material-ui/core/InputLabel";
import Loader from "components/Loader/Loader";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Paper from "@material-ui/core/Paper/Paper";
import Player from "types/Player";
import Select from "@material-ui/core/Select";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TextField from "@material-ui/core/TextField";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import uniqid from "uniqid";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gameCreator: {
        textAlign: "center",
        height: "100%",
        backgroundColor: ""
    },
    addPlayerRow: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        margin: "20px 0",
    },
    addplayerInput: {
        width: "200px"
    },
    inputGroup: {
        margin: "20px 10px",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        "& h2": {
            backgroundColor: theme.palette.primary.main,
            margin: "0",
            padding: "10px 0",
            textAlign: "center",
            color: "white",
        }
    },
    inputTable: {
        maxHeight: "400px",
        width: "98%",
        margin: "10px auto"
    },
    inputDropDown: {
        width: "98%",
        margin: "10px auto"
    },
    ".Mui-selected": {
        backgroundColor: theme.palette.primary.main,
        
    }
  })
);

const GameCreator: React.FC = () => {
  let history = useHistory();
  const [fields, setFields] = useState<Field[]>([]);

  const [game, setGame] = useState<GameData>({
    id: uniqid(),
    date: new Date(),
    field: { name: "", holes: [] },
    players: [],
    scoreEntries: [],
  });

  const [newPlayerName, setNewPlayerName] = useState("");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      let fields = await getFields();
      setFields(fields);
      let players = await getPlayers();
      setPlayers(players);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const updateField = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newField = fields.find((field) => field.id === event.target.value);
    if (newField) {
      setGame({
        ...game,
        field: newField,
      });
    }
  };

  const updatePlayers = (newPlayer: Player) => {
    let newPlayers = Array.from(game.players);
    const playerIndex = newPlayers.findIndex(
      (player) => player.id === newPlayer.id
    );

    if (playerIndex === -1) {
      newPlayers.push(newPlayer);
    } else {
      newPlayers.splice(playerIndex, 1);
    }
    setGame({
      ...game,
      players: newPlayers,
    });
  };

  const startGame = async () => {
    let error = verifyInput(game);
    if (Object.keys(error).length === 0 && error.constructor === Object) {
      setIsLoading(true);
      game.playerList = game.players.map((player) => player.name);
      let dbGame = await createGame(game);
      history.push(`/game/${dbGame.id}/${1}`);
    } else {
      setError(error);
    }
  };

  const addPlayer = () => {
    const newPlayer: Player = {
      id: uniqid(),
      name: newPlayerName,
    };
    players.push(newPlayer);
    savePlayer(newPlayer);
    updatePlayers(newPlayer);
    setNewPlayerName("");
  };

  const isSelected = (playerId: string) =>
    game.players.findIndex((player) => player.id === playerId) > -1;

  const verifyInput = (game: GameData) => {
    let error: { [key: string]: string } = {};

    if (game.field.name === "") {
      error["field"] = "You must select a field";
    }
    if (game.players.length === 0) {
      error["players"] = "You must select at least one player";
    }
    return error;
  };

  return (
    <div className={classes.inputGroup}>
      {/* <Loader isOpen={isLoading} text="Loading..." wait={700} /> */}
      <Paper className={classes.inputGroup}>
        <h2>Select field</h2>
        <FormControl
          error={error["field"] !== undefined}
          className={classes.inputDropDown}
        >
          <InputLabel>Select Field</InputLabel>
          <Select
            placeholder="Select field"
            value={game?.field.id ?? ''}
            onChange={updateField}
          >
            {fields.map((field) => (
              <MenuItem key={field.id} value={field.id}>
                {field.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
      <Paper className={classes.inputGroup}>
        <h2>Select players</h2>
        <TableContainer className={classes.inputTable}>
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
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell>
                  <TextField
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    value={newPlayerName}
                    label="Player Name"
                    variant="standard"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    color="default"
                    size="small"
                    variant="contained"
                    onClick={() => addPlayer()}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div className={classes.inputGroup}>
        <Button
          fullWidth
          color="primary"
          size="large"
          variant="contained"
          onClick={startGame}
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default GameCreator;
