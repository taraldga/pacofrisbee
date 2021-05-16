import * as React from 'react'
import { Link } from 'react-router-dom';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from "@material-ui/core/Button";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
import format from 'date-fns/format';

import { GameData } from 'types/Game';
import Player from 'types/Player';
import { getGames } from 'data/FrisbeegolfData';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      textAlign: "center"
    },
    root: {
      backgroundColor: theme.palette.background.paper,
    },
  }),
);


const GameOverview = () => {
  const [displayedGames, setDisplayedGames] = React.useState<GameData[] | undefined>();
  const [nextGameRef, setNextGameRef] = React.useState<any>();


  const loadNextPage = async () => {
    if(displayedGames) {
      const { games, latestGameRef } = await getGames(nextGameRef);
      setDisplayedGames([...displayedGames ,...games]);
      setNextGameRef(latestGameRef)
    }
  }

  React.useEffect(() => {
    const setupGames = async (pageUp?: boolean) => {
      const { games, latestGameRef } = await getGames();
      setDisplayedGames(games);
      setNextGameRef(latestGameRef)
    }

    setupGames();
  }, [])

  const classes = useStyles()
  const listplayers = (players: Player[]) => {
    return players.map(player => player.name.split(" ")[0]).join(", ")
  }

  return (
    <div>
      <h2 className={classes.header}>My played games</h2>
      <List className={classes.root}>
        {
          displayedGames?.sort((a,b) => b.date.getTime() - a.date.getTime()).map((game: GameData, idx: number) => {
            return (
              <div key={`game-${idx}`}>
                <Link to={`/game/${game.id}/1`}>
                    <ListItem>
                      <ListItemText primary={game.field.name} secondary={`${format(game.date, "dd.MM.yyyy")} - ${listplayers(game.players)}` } />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <SendIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                </Link>
                {idx < displayedGames.length-1 && <Divider />}
              </div>
        )})}
        <Button variant={"contained"} color={"primary"} size={"large"} fullWidth onClick={(e) => loadNextPage()}>Load more</Button>
      </List>
    </div>
  )
}


export default GameOverview;