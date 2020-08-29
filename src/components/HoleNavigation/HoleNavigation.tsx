import * as React from "react";

import Field from "types/Field";
import makeStyles from "@material-ui/core/styles/makeStyles";
import usePagination from "@material-ui/lab/Pagination/usePagination";
import AppBar from '@material-ui/core/AppBar';
import Tabs from "@material-ui/core/Tabs";
import Tab from '@material-ui/core/Tab';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles";


export interface HoleNavigationProps {
  currentHole: number;
  count: number;
  disabled: boolean;
  field: Field;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
}));

const HoleNavigation: React.FC<HoleNavigationProps> = ({
  currentHole,
  count,
  onChange,
  disabled,
  field
}) => {

  const classes = useStyles();
  const numberArray = React.useMemo(() => Array.apply(null, Array(count)).map(function (_, i) {return i + 1;}), [count]);
  const isFinishedColor = (num: number) => field.holes[num - 1].isPlayed ? "rgb(76,175,80, 0.12)" : undefined;

  return (
    <nav className={classes.root}>
      <AppBar position="fixed"  color="default" className={classes.appBar}>
        <Tabs
          value={currentHole - 1}
          onChange={(e, id) => onChange(e, id+1)}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          >
          {numberArray.map((_, idx) => <Tab key={`nav-item-${idx + 1}`} style={{backgroundColor: isFinishedColor(idx + 1)}} label={idx+1} {...a11yProps(idx+1)} />  )}
        </Tabs>
      </AppBar>
    </nav>
  );
};

export default HoleNavigation;
