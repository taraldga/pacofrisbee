import * as React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

import { Link } from 'react-router-dom'

const useStyles = makeStyles(() =>
  createStyles({
    layout: {
      display: "flex",
      flexDirection: "column",
      textAlign: "center"
    },
  }),
);

const HomeScreen : React.FC = () => {
    const classes = useStyles()
    return (
        <div className={classes.layout}>
          <h1>Welcome to PacoFrisbee</h1>
          <Link to="/create-game">
              <Button fullWidth variant="contained" color="primary" size="large" endIcon={<SendIcon />}>Start new round</Button>
          </Link>
          <Link to="/gameoverview">
              <Button fullWidth variant="contained" color="primary" size="large">View my games</Button>
          </Link>
        </div>
    );
}


export default HomeScreen