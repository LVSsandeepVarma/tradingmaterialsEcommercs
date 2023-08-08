import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const SecondarySidenav = () => {
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div style={{ position: 'fixed', top: '85px', width: '250px' }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleToggle}
        edge="start"
        sx={{ ml: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer variant="permanent" anchor="left" open={open} style={{ position:"relative", top: '100px !important' }}>
        <List>
          <ListItem button>
            <ListItemText primary="Item 1" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Item 2" />
          </ListItem>
          {/* Add more list items as needed */}
        </List>
      </Drawer>
    </div>
  );
};

export default SecondarySidenav;
