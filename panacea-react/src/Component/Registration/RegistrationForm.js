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

export default function RegistrationForm(props) {
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


    //props.setNewPatient(true);
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

                <Grid item xs={12}>
                    <TextField
                        id="standard-textarea"
                        label="Bio"
                        placeholder="Placeholder"
                        multiline
                        onBlur={(event) => props.setBio(event.target.value)}
                        style={{ width: 550 }}
                    />
                </Grid>

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