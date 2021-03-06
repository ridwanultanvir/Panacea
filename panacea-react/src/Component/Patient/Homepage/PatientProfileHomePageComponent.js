import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
    withStyles, AppBar, Drawer, Toolbar, List, Divider, CssBaseline, Typography,
    Card, Container, Grid, Box, Link
} from '@material-ui/core';
import { mainListItems, secondaryListItems } from './listItems';
import CopyRight from '../../Copyright';
import AppointmentDetailsTable from './AllAppntDataTable';
import EditProfile from './EditProfile';

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

class PatientHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            appointmentData: null,
            patientData: null,
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.renderProfile = this.renderProfile.bind(this);
        this.handlePatientAppntDataLoad = this.handlePatientAppntDataLoad.bind(this);
        this.calculateAge = this.calculateAge.bind(this);
        this.handleAppntDataProcess = this.handleAppntDataProcess.bind(this);
    }


    handlePatientAppntDataLoad(userID) {
        let body = {
            'userID': userID
        };
        let baseUrl = 'http://localhost:8000/';
        fetch(baseUrl + 'appointment/get-patient-all-appnt/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((response) => {

                if (response.ok) {
                    return response;
                }
                else {
                    let err = new Error('Error ' + response.status + ': ' + response.statusText);
                    err.response = response;
                    console.log('throwing ')
                    throw err;
                }
            })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    //alert(response.alertMessage);
                    // console.log('data', response.appointment_data);
                    this.setState({ appointmentData: response.appointment_data })
                }
                else {
                    let err = new Error(response.errorMessage);
                    err.response = response;
                    throw err;
                }
            })
            .catch((err) => {
                console.log("printing error");
                alert(err.message);
            });
    }


    handleAppntDataProcess(appointment_data) {
        //console.log(appointment_data);
    }

    calculateAge(dateString) {
        let birthDay = new Date(dateString);
        var ageDifMs = Date.now() - birthDay.getTime();
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    componentDidMount() {
        let creds = JSON.parse(this.props.User.creds);
        let userData = JSON.parse(this.props.User.userData);
        this.handlePatientAppntDataLoad(creds.userId);
        console.log(userData);
    }


    handleLogout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('creds');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('userCategory');
    }


    renderProfile() {

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
                                    <Card style={{ padding: 20 }}>
                                        <Typography variant='h6'>Patient Name: {userData.name}</Typography>
                                        <Typography variant='body1'>Email: {userData.email}</Typography>
                                        <Typography variant='body1'>Address: {userData.address}</Typography>
                                        <Typography variant='body1'>Phone number: {userData.phoneNum}</Typography>
                                        <Typography variant='body1'>Age: {this.calculateAge(userData.date_of_birth)} years </Typography>
                                        <Typography variant='body1'>Bio Data: {userData.bio}</Typography>
                                        <Typography variant='body1'>Gender: {userData.gender === 'M' ? "Male" : "Female"}</Typography>
                                    </Card>

                                    <EditProfile
                                        userData={userData}
                                        User={this.props.User}
                                        updateUser={this.props.updateUser}
                                    />
                                </Grid>
                            </Grid>
                            {(this.state.appointmentData !== null) &&
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant='h6'>Appointment History and Details</Typography>
                                        <AppointmentDetailsTable
                                            appointment_data={this.state.appointmentData}
                                        />
                                    </Grid>
                                </Grid>
                            }

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
        const profile = this.renderProfile();
        return (
            <React.Fragment>
                {profile}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(PatientHome);