import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { Card, CardContent } from '@material-ui/core';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { Form } from 'react-redux-form';
import { baseUrl } from '../../Redux/ActionCreator';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: 560
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: 250
    },
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    title: {
        flexGrow: 1
    },
    paper: {
        margin: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function PatientDetailForm(props) {
    const classes = useStyles();
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [previousPatient, setPreviousPatient] = React.useState(false);
    const [userID, setUserID] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleDateChange = (date) => {
        setSelectedDate(date);
        props.setDateOfBirth(date);
    };

    const handleChange = (event) => {
        props.setGender(event.target.value)
    };

    const handleCheck = () => {
        setPreviousPatient(!previousPatient);
    }

    const fetchPatientData = () => {
        console.log('inside fetch');
        if (userID !== '' && password !== '') {
            let creds = { 'userId': userID, 'password': password };
            fetch(baseUrl + 'user/get-patient-data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(creds)
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
                        setPreviousPatient(false);
                        props.setFetchedPatientData(true);
                        let f_name = response.name.split(" ")[0]
                        let l_name = response.name.split(" ")[1]

                        props.setFirstName(f_name);
                        props.setLastName(l_name);
                        props.setAddress(response.address);
                        props.setEmail(response.email);
                        props.setPhoneNumber(response.phoneNum);
                        if (response.date_of_birth != null) {
                            props.setDateOfBirth(response.date_of_birth);
                        }
                        props.setGender(response.gender);
                        props.setBio(response.bio);
                        props.setPatientUserID(userID);
                        props.setNewPatient(false);
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
        else {
            alert('Insert user id and password');
        }


    }


    if (props.User.isAuthenticated && props.User.category === 'patient') {
        let userData = JSON.parse(props.User.userData);
        let creds = JSON.parse(props.User.creds)
        var name = userData.name.split(" ");
        var firstName = name[0];
        var lastName = name[1];
        props.setFirstName(firstName);
        props.setLastName(lastName);
        props.setAddress(userData.address);
        props.setEmail(userData.email);
        props.setPhoneNumber(userData.phoneNum);
        if (userData.date_of_birth != null) {
            //console.log('dob', userData.date_of_birth);
            props.setDateOfBirth(userData.date_of_birth);
        }
        props.setGender(userData.gender);
        props.setBio(userData.bio)
        props.setPatientUserID(creds.userId);
        props.setNewPatient(false);
        return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Patient details
                </Typography>
                <Card style={{ padding: 10, marginTop: 10 }}>
                    <CardContent>
                        <Typography variant='h6'>{userData.name}</Typography>
                        <Typography variant='body1'>Email: {userData.email}</Typography>
                        <Typography variant='body1'>Phone number: {userData.phoneNum}</Typography>
                        {userData.gender === 'F' ? <Typography variant='body1'>Gender: Female</Typography> : <Typography variant='body1'>Gender: Male</Typography>}
                        <Typography variant='body1'>Address: {userData.address}</Typography>
                        <Typography variant='body1'>Date of birth: {userData.date_of_birth}</Typography>
                        <Typography variant='body1'>Bio: {userData.bio}</Typography>
                    </CardContent>
                </Card>
            </React.Fragment>
        );
    }
    else if (props.fetchedPatientData) {


        return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Patient details
                </Typography>
                <Card style={{ padding: 10, marginTop: 10 }}>
                    <CardContent>
                        <Typography variant='h6'>{props.firstName + ' ' + props.lastName}</Typography>
                        <Typography variant='body1'>Email: {props.email}</Typography>
                        <Typography variant='body1'>Phone number: {props.phoneNumber}</Typography>
                        {props.gender === 'F' ? <Typography variant='body1'>Gender: Female</Typography> : <Typography variant='body1'>Gender: Male</Typography>}
                        <Typography variant='body1'>Address: {props.address}</Typography>
                        {/* <Typography variant='body1'>Date of birth: {(dateOfBirth.getDate().toString() + '/' + dateOfBirth.getMonth().toString() + '/' + dateOfBirth.getFullYear().toString())}</Typography> */}
                        <Typography variant='body1'>Bio: {props.bio}</Typography>
                    </CardContent>
                </Card>
            </React.Fragment>
        );
    }
    else if (previousPatient) {
        return (
            <React.Fragment>
                <div className={classes.paper}>
                    <Typography variant="h6" gutterBottom>
                        Enter UserID and password
                    </Typography>
                    <Form model='AppointmentPageLogin' className={classes.form} onSubmit={() => { fetchPatientData() }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="UserID"
                            label="User ID"
                            name="UserID"
                            autoComplete="UserID"
                            autoFocus
                            onBlur={(event) => { setUserID(event.target.value) }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onBlur={(event) => { setPassword(event.target.value) }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Get User Info
                        </Button>
                    </Form>

                </div>
                <FormControlLabel
                    control={<Checkbox color="secondary" name="patientBeforeCheck" value="yes" onClick={handleCheck} checked={previousPatient} />}
                    label="Has been a patient before"
                />
            </React.Fragment>
        );
    }


    else {
        props.setNewPatient(true);
        return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Patient details
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="firstName"
                            name="firstName"
                            label="First name"
                            fullWidth
                            autoComplete="given-name"
                            defaultValue={props.firstName}
                            onBlur={(event) => { props.setFirstName(event.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="lastName"
                            name="lastName"
                            label="Last name"
                            fullWidth
                            autoComplete="family-name"
                            defaultValue={props.lastName}
                            onBlur={(event) => props.setLastName(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="address"
                            name="address"
                            label="Address"
                            fullWidth
                            autoComplete="address"
                            defaultValue={props.address}
                            onBlur={(event) => props.setAddress(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="email"
                            name="email"
                            label="Email"
                            fullWidth
                            autoComplete="email"
                            defaultValue={props.email}
                            onBlur={(event) => props.setEmail(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="phoneNum"
                            name="phoneNum"
                            label="Phone number"
                            fullWidth
                            autoComplete="phone number"
                            defaultValue={props.phoneNumber}
                            onBlur={(event) => props.setPhoneNumber(event.target.value)}
                        />
                    </Grid>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid item xs={12} sm={6}>
                            <KeyboardDatePicker
                                required
                                id="date-of-birth"
                                label="Date of birth"
                                format="dd/MM/yyyy"
                                value={props.dateOfBirth}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                style={{ marginTop: 9 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl className={classes.formControl}>
                                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                    Gender
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-placeholder-label-label"
                                    id="demo-simple-select-placeholder-label"
                                    onChange={handleChange}
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    defaultValue={props.gender}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value='F'>F</MenuItem>
                                    <MenuItem value='M'>M</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </MuiPickersUtilsProvider>

                    {/* <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox color="secondary" name="patientBeforeCheck" value="yes" onClick={handleCheck} />}
                            label="Has been a patient before"
                        />
                    </Grid> */}
                </Grid>
            </React.Fragment>
        );
    }

}