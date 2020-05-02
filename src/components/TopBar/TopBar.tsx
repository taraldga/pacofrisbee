import * as React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu';
import { Typography, Button } from '@material-ui/core';




const TopBar : React.FC = () => {
  return (
    <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" className="" color="inherit" aria-label="menu">
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" className="">
        PaCounter
      </Typography>
    </Toolbar>
  </AppBar>
  )
}


export default TopBar;