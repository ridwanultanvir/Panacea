import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import NotesIcon from '@material-ui/icons/Note'
import { Link } from 'react-router-dom';
import { NotificationImportant, Schedule, Tv, Home, AccountCircle, Ballot, LocalHospital } from '@material-ui/icons';

export const mainListItems = (
    <div>

        <Link to='/doctor/home' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Profile" />
            </ListItem>
        </Link>
        <Link to='/home' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItem>
        </Link>
        <Link to='/doctor/appointment' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button >
                <ListItemIcon>
                    <Ballot />
                </ListItemIcon>
                <ListItemText primary="Appointments" />
            </ListItem>
        </Link>
        <Link to="/doctor/appointment/all" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <NotesIcon />
                </ListItemIcon>
                <ListItemText primary="All appointments" />
            </ListItem>
        </Link>
        <Link to="/doctor/surgery" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <LocalHospital />
                </ListItemIcon>
                <ListItemText primary="Surgery" />
            </ListItem>
        </Link>

        <Link to="/doctor/monitor-patient" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <Tv />
                </ListItemIcon>
                <ListItemText primary="Monitor Patient" />
            </ListItem>
        </Link>

        <Link to="/doctor/schedule" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <Schedule />
                </ListItemIcon>
                <ListItemText primary="Schedule" />
            </ListItem>
        </Link>

        <Link to="/doctor/notification" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <NotificationImportant />
                </ListItemIcon>
                <ListItemText primary="Notification" />
            </ListItem>
        </Link>

    </div>
);

export const secondaryListItems = (
    <div>
        {/* <ListSubheader inset>Saved reports</ListSubheader>
        <ListItem button>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Current month" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Last quarter" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Year-end sale" />
        </ListItem> */}
    </div>
);