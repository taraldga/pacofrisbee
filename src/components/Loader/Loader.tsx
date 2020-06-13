import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import Backdrop from '@material-ui/core/Backdrop/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';


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
  const [timer, setTimer] = React.useState<NodeJS.Timer | undefined>(undefined);
  const classes = useStyles();

  React.useEffect(() => {
    if(wait && wait > 0 && isOpen === true && !timer) {
      const newTimer = setTimeout(() => setRender(true), wait)
      setTimer(newTimer);
    } else {
      setRender(false);
      if(timer) {
        clearTimeout(timer)
        setTimer(undefined);
      }
    }
  }, [isOpen, timer, wait])

  return (
    <Backdrop className={classes.backdrop} open={render}>
      <h3>{text}</h3>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}


export default Loader;