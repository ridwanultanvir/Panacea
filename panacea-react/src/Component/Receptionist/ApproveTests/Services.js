import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
    withStyles, AppBar, Drawer, Toolbar,
    List,
    Divider, CssBaseline, Typography, Container, Grid, Box
} from '@material-ui/core';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import { baseUrl } from '../../../Redux/ActionCreator';
import CopyRight from '../../Copyright';
import AppointmentsTable from './AppointmentsTable';
import PendingTests from './PendingTests';
import PendingSurgeries from './PendingSurgeries';

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

class Services extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pendingTests: null,
            pendingSurgeries: null
        };
        this.renderTestsPage = this.renderTestsPage.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.setPendingServices = this.setPendingServices.bind(this);
    }

    setPendingServices(pendingTests, pendingSurgeries) {
        this.setState({ pendingTests: pendingTests, pendingSurgeries: pendingSurgeries })
    }

    fetchData(body) {
        fetch(baseUrl + 'checkup/receptionist/service-results-table/', {
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
                    this.setState({ pendingTests: response.pending_tests, pendingSurgeries: response.pending_surgeries });
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
        let body = {
            'userID': creds.userId, 'token': this.props.User.token, 'diagnosisID': this.props.diagnosisID
        };
        this.fetchData(body);
    }



    renderTestsPage() {
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
                                    <Typography variant='h5' style={{ marginBottom: 20 }}>Pending tests: </Typography>
                                    <PendingTests
                                        User={this.props.User}
                                        pendingTests={this.state.pendingTests}
                                        diagnosisID={this.props.diagnosisID}
                                        setPendingServices={(pendingTests, pendingSurgeries) => { this.setPendingServices(pendingTests, pendingSurgeries) }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant='h5' style={{ marginBottom: 20 }}>Pending surgeries: </Typography>
                                    <PendingSurgeries
                                        User={this.props.User}
                                        pendingSurgeries={this.state.pendingSurgeries}
                                        diagnosisID={this.props.diagnosisID}
                                        setPendingServices={(pendingTests, pendingSurgeries) => { this.setPendingServices(pendingTests, pendingSurgeries) }}
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
        let app = this.renderTestsPage()
        return (
            <React.Fragment>
                {app}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Services);