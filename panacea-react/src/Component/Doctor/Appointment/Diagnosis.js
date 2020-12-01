import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import {
    withStyles, AppBar, Drawer, Toolbar,
    List, ListItemIcon, ListItemText, Checkbox, Button,
    Divider, CssBaseline, Typography, Card, Container, Grid, Box, ListItem, FormControl, TextField
} from '@material-ui/core';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import AppointmentsTable from './AppointmentsTable';
import { baseUrl, getDoctorsAppointment } from '../../../Redux/ActionCreator';
import { FixedSizeList } from 'react-window';
import CopyRight from '../../Copyright';
import { LocalForm } from 'react-redux-form';


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

class DocDiagnosis extends Component {
    constructor(props) {
        super(props);

        this.state = {
            patientInfo: null,
            tests: null,
            surgeries: null,
            errorMessage: null,
            testChecked: [],
            surgeriesChecked: [],
            specialSurgDesc: null,
            medicine: null,
            diagnosisDescription: null
        }

        this.renderAppointment = this.renderAppointment.bind(this);
        this.getDiagnosisList = this.getDiagnosisList.bind(this);
        this.handleTestToggle = this.handleTestToggle.bind(this);
        this.handleSurgeryToggle = this.handleSurgeryToggle.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);
        this.handleSpecialSurgery = this.handleSpecialSurgery.bind(this);
        this.handleMedicine = this.handleMedicine.bind(this);

        this.medicineRef = React.createRef();
        this.surgRef = React.createRef();
        this.descRef = React.createRef();
    }

    getDiagnosisList(body) {

        fetch(baseUrl + 'checkup/get-diagnosis-list/', {
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
                    this.setState({ errorMessage: null });
                    this.setState({ patientInfo: response.patient_info });
                    this.setState({ tests: response.tests });
                    this.setState({ surgeries: response.surgeries });
                }
                else {
                    let err = new Error(response.errorMessage);
                    err.response = response;
                    throw err;
                }
            })
            .catch((err) => {
                this.setState({ errorMessage: err.message });
            });
    }

    componentDidMount() {
        let creds = JSON.parse(this.props.User.creds);
        console.log(this.props.app_sl_no);
        let body = { 'userID': creds.userId, 'token': this.props.User.token, 'app_sl_no': this.props.app_sl_no };
        this.getDiagnosisList(body);
    }

    handleSpecialSurgery(value) {
        this.setState({ specialSurgDesc: value });
    }
    handleMedicine(value) {
        this.setState({ medicine: value });
    }
    handleDescription(value) {
        this.setState({ diagnosisDescription: value });
    }

    handleTestToggle(value) {
        const currentIndex = this.state.testChecked.indexOf(value);
        const newChecked = [...this.state.testChecked];

        if (currentIndex === -1) {
            newChecked.push(value);
        }
        else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({ testChecked: newChecked });
        console.log(this.state.testChecked);

    }


    handleSurgeryToggle(value) {
        const currentIndex = this.state.surgeriesChecked.indexOf(value);
        const newChecked = [...this.state.surgeriesChecked];
        if (currentIndex === -1) {
            newChecked.push(value);
        }
        else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({ surgeriesChecked: newChecked });
        console.log(this.state.surgeriesChecked);
    }

    handleSubmission() {
        let creds = JSON.parse(this.props.User.creds);
        //console.log(this.props.app_sl_no);

        let body = {
            'userID': creds.userId, 'token': this.props.User.token, 'app_sl_no': this.props.app_sl_no,
            'tests': this.state.testChecked, 'surgeries': this.state.surgeriesChecked,
            'specialSurgery': this.state.specialSurgDesc, 'medicine': this.state.medicine,
            'diagnosisDescription': this.state.diagnosisDescription
        };

        this.setState({ medicine: null, diagnosisDescription: null, specialSurgDesc: null });

        fetch(baseUrl + 'checkup/diagnosis/', {
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
                    this.setState({
                        testChecked: [], surgeriesChecked: [], medicine: null, specialSurgDesc: null,
                        diagnosisDescription: null
                    })
                    console.log(response);
                    alert(response.message);
                    this.medicineRef.current.value = '';
                    this.surgRef.current.value = '';
                    this.descRef.current.value = '';
                }
                else {
                    let err = new Error(response.errorMessage);
                    err.response = response;
                    throw err;
                }
            })
            .catch((err) => {
                this.setState({ errorMessage: err.message });
            });
    }

    renderAppointment() {
        const { classes } = this.props;

        if (this.props.User.isAuthenticated && this.props.User.category === 'doctor') {
            let userData = JSON.parse(this.props.User.userData);
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Doctor
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
                                    <Link
                                        to={`/doctor/diagnosis-history/${this.props.app_sl_no}`}
                                        style={{ textDecoration: 'none', color: 'black', marginLeft: 'auto', marginBottom: 20, marginTop: 10 }}
                                    >
                                        <Button variant='contained'>
                                            Diagnosis history
                                        </Button>

                                    </Link>
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.errorMessage !== null ?
                                        <h1>{this.state.errorMessage}</h1> :
                                        null
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.patientInfo === null ? null :
                                        <Card style={{ padding: 20 }}>
                                            <Typography variant='h6'>Name: {this.state.patientInfo.name}</Typography>
                                            <Typography variant='body1'>Email: {this.state.patientInfo.email}</Typography>
                                            <Typography variant='body1'>Address: {this.state.patientInfo.address}</Typography>
                                            <Typography variant='body1'>Phone number: {this.state.patientInfo.phone_number}</Typography>
                                            <Typography variant='body1'>Date of birth: {this.state.patientInfo.date_of_birth}</Typography>
                                            <Typography variant='body1'>Gender: {this.state.patientInfo.gender}</Typography>
                                            <Typography variant='body1'>Bio: {this.state.patientInfo.bio}</Typography>
                                        </Card>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.tests === null ? null : <Typography variant='h6'>Tests:</Typography>}
                                    <List style={{ columnCount: "2", WebkitColumnCount: "2", MozColumnCount: "2", listStyleType: "none" }}>
                                        {this.state.tests === null ? null :
                                            this.state.tests.map((test) => {
                                                //console.log('ulalala')
                                                return (
                                                    <ListItem key={test.service_id} role={undefined} dense button onClick={() => (this.handleTestToggle(test.service_id))}>
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={this.state.testChecked.indexOf(test.service_id) !== -1}
                                                                tabIndex={-1}
                                                                disableRipple
                                                                inputProps={{ 'aria-labelledby': test.service_name }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            id={test.service_name}
                                                            primary={test.service_name}
                                                            secondary={test.service_desc}
                                                        />
                                                    </ListItem>
                                                );
                                            })
                                        }
                                    </List>
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.surgeries === null ? null :
                                        <div>
                                            <Typography variant='h6'>Surgeries:</Typography>
                                            <List style={{ columnCount: "2", WebkitColumnCount: "2", MozColumnCount: "2", listStyleType: "none" }}>
                                                {this.state.surgeries.map((surgery) => {
                                                    return (
                                                        <ListItem key={surgery.service_id} role={undefined} dense button onClick={() => (this.handleSurgeryToggle(surgery.service_id))}>
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    edge="start"
                                                                    checked={this.state.surgeriesChecked.indexOf(surgery.service_id) !== -1}
                                                                    tabIndex={-1}
                                                                    disableRipple
                                                                    inputProps={{ 'aria-labelledby': surgery.service_name }}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                id={surgery.service_name}
                                                                primary={surgery.service_name}
                                                                secondary={
                                                                    <React.Fragment>
                                                                        <Typography
                                                                            component="span"
                                                                            variant="body2"
                                                                            className={classes.inline}
                                                                            color='textSecondary'
                                                                        >
                                                                            {surgery.department}
                                                                        </Typography> <br />

                                                                        {surgery.service_desc}
                                                                    </React.Fragment>
                                                                }
                                                            />

                                                        </ListItem>
                                                    );
                                                })}
                                            </List>
                                        </div>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='h6'>Special surgery: </Typography>
                                    <FormControl fullWidth>
                                        <TextField
                                            inputRef={this.surgRef}
                                            multiline
                                            rows={4}
                                            variant='outlined'
                                            onChange={(event) => { this.handleSpecialSurgery(event.target.value) }}
                                            value={this.state.specialSurgDesc}
                                            defaultValue={this.state.specialSurgDesc}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant='h6'>Medicine: </Typography>
                                    <FormControl fullWidth>
                                        <TextField
                                            inputRef={this.medicineRef}
                                            multiline
                                            rows={4}
                                            variant='outlined'
                                            onChange={(event) => { this.handleMedicine(event.target.value) }}
                                            value={this.state.medicine}
                                            defaultValue={this.state.medicine}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='h6'>Description: </Typography>
                                    <FormControl fullWidth>
                                        <TextField
                                            inputRef={this.descRef}
                                            multiline
                                            rows={4}
                                            variant='outlined'
                                            onChange={(event) => { this.handleDescription(event.target.value) }}
                                            value={this.state.diagnosisDescription}
                                            defaultValue={this.state.diagnosisDescription}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" onClick={() => { this.handleSubmission() }}>
                                        Done
                                    </Button>
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
        let app = this.renderAppointment()
        return (
            <React.Fragment>
                {app}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(DocDiagnosis);