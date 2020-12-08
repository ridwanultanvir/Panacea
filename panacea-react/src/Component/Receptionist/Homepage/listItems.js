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
import AirlineSeatFlatIcon from '@material-ui/icons/AirlineSeatFlat';
import { Link } from 'react-router-dom';
import { NotificationImportant, Schedule } from '@material-ui/icons';

export const mainListItems = (
    <div>
        <Link to='/receptionist/home' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
            </ListItem>
        </Link>
        <Link to='/receptionist/appointments' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button >
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Appointments" />
            </ListItem>
        </Link>
        <Link to='/receptionist/approve-service' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Approve service" />
            </ListItem>
        </Link>
        <Link to='/receptionist/put-in-charge' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Put In Charge" />
            </ListItem>
        </Link>

        <Link to='/receptionist/schedule-receptionist' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <Schedule />
                </ListItemIcon>
                <ListItemText primary="Schedule" />
            </ListItem>
        </Link>

        <Link to="/receptionist/notification" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <NotificationImportant />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
            </ListItem>
        </Link>
        {/* <ListItem button>
            <ListItemIcon>
                <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Service report" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Doctor's schedule" />
        </ListItem> */}
        {/* <Link to='/receptionist/surgery-schedule' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button >
                <ListItemIcon>
                    <AirlineSeatFlatIcon />
                </ListItemIcon>
                <ListItemText primary="Surgery Schedule" />
            </ListItem>
        </Link> */}
        <Link to='/receptionist/patient-admit' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button >
                <ListItemIcon>
                    <AirlineSeatFlatIcon />
                </ListItemIcon>
                <ListItemText primary="Admit Patient" />
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