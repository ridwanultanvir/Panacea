import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppBar, Toolbar, Button, CardContent, Card, Typography, TextField, FormControl, InputAdornment, InputLabel, OutlinedInput } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Form } from 'react-redux-form';
import Appointment from './Appointment';


// const styles = (theme) => ({
//     title: {
//         flexGrow: 1
//     },
//     form: {
//         width: '100%', // Fix IE 11 issue.
//         marginTop: theme.spacing(1),
//     },
// })

class AppointmentComponent extends Component {
    render() {
        return (
            <Appointment
                User={this.props.User}
            />
        );
    }
}

//export default withStyles(styles)(AppointmentComponent);

export default AppointmentComponent;