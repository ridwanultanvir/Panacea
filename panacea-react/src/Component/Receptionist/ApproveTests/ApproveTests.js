import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
    withStyles, AppBar, Drawer, Toolbar,
    List, InputBase,
    Divider, CssBaseline, Typography, Container, Grid, Box, TextField
} from '@material-ui/core';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import { baseUrl } from '../../../Redux/ActionCreator';
import CopyRight from '../../Copyright';
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
    inline: {
        display: 'inline',
    },
});

class ApproveTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkupList: null
        };
        this.renderApprovePage = this.renderApprovePage.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }


    fetchData(body) {
        fetch(baseUrl + 'checkup/receptionist/tests/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    return response;
                }
                else {
                    let err = new Error('Error ' + response.status + ': ' + response.statusText);
                    err.response = response;
                    throw err;
                }
            })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    console.log(response);
                    this.setState({ checkupList: response.tests });
                }
                else {
                    let err = new Error(response.errorMessage);
                    err.response = response;
                    throw err;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    componentDidMount() {
        let creds = JSON.parse(this.props.User.creds);
        let body = { 'userID': creds.userId, 'token': this.props.User.token, 'allTests': false, 'app_sl_no': null };
        this.fetchData(body);
    }



    renderApprovePage() {
        const { classes } = this.props;

        if (this.props.User.isAuthenticated && this.props.User.category === 'RECEPTIONIST') {
            let userData = JSON.parse(this.props.User.userData);
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
                                        User={this.props.User}
                                        checkupList={this.state.checkupList}
                                        fetchData={(body) => { this.fetchData(body) }}
                                    />
                                </Grid>
                            </Grid>
                            <Box pt={4}>
                                {CopyRight}
                            </Box>
                        </Container>
                    </main>
                </div>
            );
        }
        else {
            return (<Redirect to='/sign-in' />)
        }
    }

    render() {
        let app = this.renderApprovePage()
        return (
            <React.Fragment>
                {app}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ApproveTest);