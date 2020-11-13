import React, { Component } from 'react';
import { withStyles, AppBar, Drawer, Toolbar, List, Divider, CssBaseline, Typography, Card, Container, Grid, Box, Link } from '@material-ui/core';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import { Redirect } from 'react-router-dom';
import AppointmentsTable from './AppointmentsTable';

const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
});

class ReceptionistAppointment extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.renderAppointment = this.renderAppointment.bind(this);
        this.Copyright = this.Copyright.bind(this);
    }

    componentDidMount() {
        let creds = JSON.parse(this.props.User.creds);
        this.props.getReceptionistAppointments({ 'userID': creds.userId, 'token': this.props.User.token });
    }

    Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://sadatshahriyar.pythonanywhere.com/">
                    Sadat Shahriyar
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    renderAppointment() {
        const { classes } = this.props;
        if (this.props.User.isAuthenticated && this.props.User.category === 'RECEPTIONIST') {
            let copyRight = this.Copyright();
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Receptionist
                        </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <Toolbar />
                        <div className={classes.drawerContainer}>
                            <List>{mainListItems}</List>
                            <Divider />
                            <List>{secondaryListItems}</List>
                        </div>
                    </Drawer>


                    <main className={classes.content}>
                        <Toolbar />
                        <div />
                        <Container maxWidth="lg" >
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <AppointmentsTable
                                        ReceptionistsAppointments={this.props.ReceptionistsAppointments}
                                        acceptReceptionistAppointment={this.props.acceptReceptionistAppointment}
                                        User={this.props.User}
                                    />
                                </Grid>
                            </Grid>
                            <Box pt={4}>
                                {copyRight}
                            </Box>
                        </Container>
                    </main>
                </div>
            );
        }
        else {
            return (<Redirect to='/sign-in' />);
        }
    }
    render() {
        const { classes } = this.props;

        const profile = this.renderAppointment();
        return (
            <React.Fragment>
                {profile}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ReceptionistAppointment);