import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
    withStyles, AppBar, Drawer, Toolbar, List, Divider, CssBaseline, Typography,
    Card, Container, Grid, Box, Link
} from '@material-ui/core';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import CopyRight from '../../Copyright';
import { baseUrl } from '../../../Redux/ActionCreator';
import SurgeryResultTable from './SurgeryResultTable';


const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            borderBottom: 'unset',
        },
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

class PatientSurgeryResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            surgery: null
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.renderPage = this.renderPage.bind(this);
    }

    handleLogout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('creds');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('userCategory');
    }

    fetchData(body) {
        fetch(baseUrl + 'checkup/patient/get-patient-surgery-result/', {
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
                    this.setState({ surgery: response.surgery_result })
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
            'userID': creds.userId, 'token': this.props.User.token,
            'allSurgery': false, 'pendingSurgery': false,
            'completedSurgery': true, 'app_sl_no': null
        };
        this.fetchData(body);
    }

    renderPage() {
        const { classes } = this.props;

        if (this.props.User.isAuthenticated && this.props.User.category === 'patient') {
            let userData = JSON.parse(this.props.User.userData);
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Patient
                            </Typography>
                            <Link color='inherit' href='http://localhost:3000/home' onClick={() => { this.handleLogout() }} style={{ marginLeft: 'auto' }}>
                                Logout
                            </Link>
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
                                    <SurgeryResultTable
                                        User={this.props.User}
                                        fetchData={(body) => { this.fetchData(body) }}
                                        surgery={this.state.surgery}
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
            return (<Redirect to='/sign-in' />);
        }
    }

    render() {
        const page = this.renderPage();
        return (
            <React.Fragment>
                {page}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(PatientSurgeryResult);