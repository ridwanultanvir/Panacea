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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import { Link } from 'react-router-dom';
import { NotificationImportant, Schedule, Home, AccountCircle, Ballot } from '@material-ui/icons';

export const mainListItems = (
    <div>

        <Link to='/receptionist/home' style={{ textDecoration: 'none', color: 'black' }}>
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
        <Link to='/receptionist/appointments' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button >
                <ListItemIcon>
                    <Ballot />
                </ListItemIcon>
                <ListItemText primary="Appointments" />
            </ListItem>
        </Link>
        <Link to='/receptionist/approve-service' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Approve service" />
            </ListItem>
        </Link>
        <Link to='/receptionist/put-in-charge' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button>
                <ListItemIcon>
                    <AssignmentIndIcon />
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
                    <LocalHospitalIcon />
                </ListItemIcon>
                <ListItemText primary="Admit Patient" />
            </ListItem>
        </Link>

        <Link to='/receptionist/prepare-bill' style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem button >
                <ListItemIcon>
                    <AirlineSeatFlatIcon />
                </ListItemIcon>
                <ListItemText primary="Prepare Bill" />
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