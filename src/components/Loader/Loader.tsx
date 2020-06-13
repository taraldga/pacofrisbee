import * as React from 'react';

import Backdrop from '@material-ui/core/Backdrop/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';

interface LoaderProps {
  isOpen: boolean;
  text?: string;
  wait?: number;
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
      display: "flex",
      flexDirection: "column"
    },
  }),
);

const Loader: React.FC<LoaderProps> = ({
  isOpen,
  text,
  wait
}) => {
  const [render, setRender] = React.useState(isOpen);
  const classes = useStyles();

  React.useEffect(() => {
    if(wait && wait > 0 && isOpen === true) {
      const newTimer = setTimeout(() => setRender(true), wait)
      console.log("Is reseting timer")
      return () => clearTimeout(newTimer);
    } else {
      setRender(isOpen);
    }
  }, [isOpen, wait])



  return (
    <Backdrop className={classes.backdrop} open={render}>
      <h3>{text}</h3>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}


export default Loader;