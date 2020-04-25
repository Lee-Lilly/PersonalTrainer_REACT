import React from 'react';
import './App.css';
import TrainingTable from './components/TrainingTable';
import CustomerTable from './components/CustomerTable';
import CalendarView from './components/TrainingSchedule';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import { Divider } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
   //size of drawer canvas
  drawerPaper: {
    width: 180,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#f2f2f2',
  },
  icon: {
    color: '#79a6d2',
  }
}));

function App() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [content, setContent] = React.useState(<CustomerTable />);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const showCustomers = () =>{
    setContent(<CustomerTable />);
  }

  const showTrainings = () => {
    setContent(<TrainingTable />);
  }
 
  const showCalendar = () => {
    setContent(<CalendarView />);
  }

  return (
    <div className={classes.root}>
     
      <AppBar position='static'>
        <Toolbar>
          <IconButton className={classes.menuButton} onClick={handleDrawerToggle} edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Personal Trainer
          </Typography>
           <div></div>
        </Toolbar>
      </AppBar>

      <Drawer 
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }} >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerToggle} color = "primary">
            <ArrowForwardRoundedIcon />
          </IconButton>
        </div>
          <Divider /> 
            <MenuItem onClick={showCustomers}>
              <ListItemIcon className={classes.icon}> <AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Customers" />
              </MenuItem>                    
           <MenuItem onClick={showTrainings}> 
              <ListItemIcon className ={classes.icon}> < DirectionsRunIcon /></ListItemIcon>
              <ListItemText primary="Training" /> 
           </MenuItem> 
           <MenuItem onClick={showCalendar}>
              <ListItemIcon className={classes.icon}> <ScheduleIcon /></ListItemIcon>
              <ListItemText primary="Schedule" /> 
           </MenuItem>                          
      </Drawer>

      <main className={classes.content}>
        {content}
      </main>   
    </div>
  );
}

export default App;
