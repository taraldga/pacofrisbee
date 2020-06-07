import * as React from 'react'
import { getGames } from 'data/FrisbeegolfData';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import format from 'date-fns/format';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import { GameData } from 'types/Game';
import Player from 'types/Player';

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
  const [games, setGames] = React.useState<GameData[] | undefined>(undefined)
  React.useEffect(() => {
    const setupGames = async () => {
      let games = await getGames();
      setGames(games)
    }
    setupGames();
  }, [])
  let classes = useStyles()

  const listplayers = (players: Player[]) => {
    return players.map(player => player.name.split(" ")[0]).join(", ")
  }

  return (
    <div>
      <h2 className={classes.header}>My played games</h2>
      <List className={classes.root}>
        {
          games?.sort((a,b) => b.date.getTime() - a.date.getTime()).map((game: GameData, idx: number) => {
            return (
              <>
                <Link to={`/game/${game.id}/1`}>
                <ListItem>
                  <ListItemText primary={game.field.name} secondary={`${format(game.date, "dd.MM.yyyy")}  -    ${listplayers(game.players)}` } />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <SendIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                </Link>
                {idx < games.length-1 && <Divider />}
              </>
        )})}
      </List>
    </div>
  )
}


export default GameOverview;