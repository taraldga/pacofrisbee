import * as React from 'react'

import { createStyles, makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Image from '../images/DiscGolfSmall.jpg';
import { Link } from 'react-router-dom'
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles(() =>
  createStyles({
    mainTitle: {
    "-webkit-text-stroke": "2px black",
    "color": "white",
    "fontWeight": "bolder",
    "fontSize": "5em",
    },
    layout: {
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      height: "100%",
      justifyContent: "space-around",
      backgroundImage: `url(${Image})`,
      backgroundSize: "cover",
      backgroundPosition: "50% 50%",
    },
    buttonRow: {
      display: "block",
    },
    startButton: {
      backgroundColor: "rgba(37, 92, 136, 0.5)",
      border: "white 1px solid",
      height: "65px",
      color: "white",
      width: "80%",
      margin: "10px 0",
      "&:hover": {
        backgroundColor: "rgba(37, 92, 136, 0.3)"
      }
    }
  }),
);

const HomeScreen : React.FC = () => {
    const classes = useStyles()
    return (
        <div className={classes.layout}>
          <h1 className={`${classes.mainTitle}`}>PaCount</h1>
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