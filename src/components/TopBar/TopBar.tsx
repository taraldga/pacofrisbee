import * as React from "react";
import "./TopBar.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Home from "@material-ui/icons/Home";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const TopBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/" className="topbar-link" style={{display:"flex"}}>
          <div style={{margin: "auto 5px"}}>
            <Home />
          </div>
          <Typography variant="h6" className="">
            PaCounter
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
