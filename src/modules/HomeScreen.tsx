import * as React from 'react'

import { createStyles, makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles(() =>
  createStyles({
    layout: {
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      height: "100%",
      justifyContent: "space-around"
    },
    buttonRow: {
      display: "block",
    },
    startButton: {
      backgroundColor: "rgba(37, 92, 136 , 0.5)",
      border: "white 1px solid",
      height: "65px",
      color: "white",
      width: "80%",
      margin: "10px 0"
      
    }
  }),
);

const HomeScreen : React.FC = () => {
    const classes = useStyles()
    return (
        <div className={classes.layout}>
          <h1>PacoFrisbee</h1>
          <div className={classes.buttonRow}>
            <Link to="/create-game">
                <Button className={classes.startButton} variant="outlined" size="large" endIcon={<SendIcon />}>Play</Button>
            </Link>
            <Link to="/gameoverview">
                <Button className={classes.startButton} variant="outlined" size="large">History</Button>
            </Link>
          </div>
        </div>
    );
}


export default HomeScreen