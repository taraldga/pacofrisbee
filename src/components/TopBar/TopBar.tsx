import * as React from 'react'
import "./TopBar.css"
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';




const TopBar : React.FC = () => {
  return (
    <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" className="" color="inherit" aria-label="menu">
        <MenuIcon />
      </IconButton>
      <Link to="/" className="topbar-link">
      <Typography variant="h6" className="">
        PaCounter
      </Typography>
      </Link>
    </Toolbar>
  </AppBar>
  )
}


export default TopBar;