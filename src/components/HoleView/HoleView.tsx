import * as React from 'react'

import './HoleView.css'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ScoreEntry } from 'types/ScoreEntry'
import Player from 'types/Player'
import TableContainer from '@material-ui/core/TableContainer'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import NumberInput from 'components/NumberInput/NumberInput';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';



export interface HoleViewProps {
  players: Player[];
  scoreEntries: ScoreEntry[];
  holeNumber: number;
  updateScoreEntry: (playerId: string, newScore: number) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tablecontainer: {
      margin: "0 15px",
      width: "auto",
      textAlign: "center",
    },
  }),
);

const HoleView: React.FC<HoleViewProps> = ({
  players,
  scoreEntries,
  holeNumber,
  updateScoreEntry,
}) => {
  const classes = useStyles();

  const isDirty = (scoreEntry: ScoreEntry) => (scoreEntry.new || scoreEntry.updated);
  return(
    <div>
      <TableContainer className={classes.tablecontainer}>
      <h3>Hole number {holeNumber} </h3>
        <List className="score-list">
          {
            players.map((player, idx) => {

              const playerScoreEntry = scoreEntries.find(entry => entry.playerId === player.id)
              if(playerScoreEntry) {
                return (
                  <>
                  <ListItem className="list-row">
                    <ListItemText primary={player.name} />
                    <ListItemSecondaryAction>
                      <NumberInput isDirty={!!isDirty(playerScoreEntry)} value={playerScoreEntry.score} onChange={(newScore) => updateScoreEntry(player.id, newScore)}/>
                    </ListItemSecondaryAction>
                 </ListItem>
                 {idx < players.length-1 && <Divider />}
                 </>
               )
              } else {
                return null
              }
            })
          }
        </List>
      </TableContainer>

    </div>
  )
}


export default HoleView;