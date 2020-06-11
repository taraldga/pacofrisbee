import Archive from '@material-ui/icons/Archive';
import Delete from '@material-ui/icons/Delete';
import { FeedbackDialog } from 'components/FeedbackDialog/FeedbackDialog';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';

const ITEM_HEIGHT = 48;

export const GameMenu: React.FC<{onArchiveGame: () => void, onDeleteGame: () => void}> = React.memo(({onArchiveGame, onDeleteGame}) =>  {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [finishDialogOpen, setFinishDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openArchivePopup = () => {
    setAnchorEl(null);
    setFinishDialogOpen(true)
  }
  const openDeletePopup = () => {
    setAnchorEl(null);
    setDeleteDialogOpen(true)
  }

  const handleArchivePressed = () => {
    onArchiveGame()
  }
  
  const handleDeletePressed = () => {
    onDeleteGame()
  }

  return (
    <div style={{position: 'absolute', right: 0 }}>
      {finishDialogOpen && <FeedbackDialog open={finishDialogOpen} title="Finish game" content="Are you sure you want to finish the game?" onAgree={handleArchivePressed} onClose={() => setFinishDialogOpen(false)} /> }
      {deleteDialogOpen && <FeedbackDialog dangerous open={deleteDialogOpen} title="Delete" content="Are you sure you want to finish the game?" onAgree={handleDeletePressed} onClose={() => setDeleteDialogOpen(false)} /> }
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem key={"archive"} onClick={openArchivePopup}>
          <Archive />
          Finish game
        </MenuItem>
        <MenuItem key={"archive"} onClick={openDeletePopup} style={{color: "red"}}>
          <Delete />
          Delete game
        </MenuItem>
      </Menu>
    </div>
  );
})
