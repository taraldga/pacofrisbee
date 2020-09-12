import * as React from 'react';

import { useUser } from 'util/UseUser';
import { getStatsForPlayer } from 'data/FrisbeegolfData';
import { useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles, Theme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home'
import { ThrowTypeGraph } from './Compontents/ThrowTypeGraph'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      fontWeight: "bold",
      backgroundColor: theme.palette.primary.main,
      color: "white"
    },
    homeButton: {
      position: "absolute",
      right: "5px",
      top: "11px"
    }
  })
);

const HomeButton: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <IconButton className={classes.homeButton} onClick={() => history.push("/")}>
      <HomeIcon />
    </IconButton>
  )
}

const Stats: React.FC<{}> = () => {
  const user = useUser();
  const [currentUserStats, setCurrentUserStats] = React.useState<any>();

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getStatsForPlayer(user.name);
      setCurrentUserStats(data);
    }
    fetchData();
  }, [user.name])

  if(!currentUserStats) return <div />

  return(
    <div className="center-wrapper">
      <h1> Super Barebone stats </h1>
      <HomeButton />
      <ThrowTypeGraph 
        aces={currentUserStats['numberOfAces']}
        eagles={currentUserStats['numberOfEagles']}
        birdies={currentUserStats['numberOfBirdies']}
        pars={currentUserStats['numberOfPars']}
        bogeys={currentUserStats['numberOfBogeys']}
        doubleBogeys={currentUserStats['numberOfDoubleBogeys']}
      />
      {Object.keys(currentUserStats).filter(key => typeof(currentUserStats[key]) === 'number').map(statKey => {
        return(
          <>
          <div style={{display:"flex",justifyContent:"space-between", padding: "20px"}}>
            <div><strong>{statKey}:</strong></div>
            <div>{Math.round(currentUserStats[statKey]*100)/100}</div>
          </div>
          <hr/>
          </>
          )
      })}
    </div>
  )
}

export default Stats;
