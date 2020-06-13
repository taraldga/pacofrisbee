import './HoleView.css'

import * as React from 'react'

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import NumberInput from 'components/NumberInput/NumberInput';
import Player from 'types/Player'
import { ScoreEntry } from 'types/ScoreEntry'
import TableContainer from '@material-ui/core/TableContainer'

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
  updateScoreEntry
}) => {
  const classes = useStyles();

  const isDirty = (scoreEntry: ScoreEntry) => (scoreEntry.new || scoreEntry.updated);
  return(
    <div>
      <TableContainer className={classes.tablecontainer}>
        <List className="score-list">
          {
            players.map((player, idx) => {
              const playerScoreEntry = scoreEntries.find(entry => entry.playerId === player.id) as ScoreEntry;
              if(playerScoreEntry) {
                return (
                  <div key={`score-${idx}`}>
                  <ListItem className={`list-row ${!!isDirty(playerScoreEntry) && "is-dirty"}`}>
                    <ListItemText primary={player.name} />
                    <ListItemSecondaryAction>
                      <NumberInput isDirty={!!isDirty(playerScoreEntry)} value={playerScoreEntry.score} onChange={(newScore) => updateScoreEntry(player.id, newScore)}/>
                    </ListItemSecondaryAction>
                 </ListItem>
                 {idx < players.length-1 && <Divider />}
                 </div>
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