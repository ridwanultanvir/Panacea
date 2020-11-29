import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
    Button, TextField, Toolbar, Typography, InputAdornment,
    FormControl, NativeSelect, FormHelperText, InputLabel
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Search } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    table: {
        minWidth: 650,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 100,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing(1),
    },
    formControl: {
        marginLeft: theme.spacing(1),
        minWidth: 120,
    },
}));

function createData(serialNo, diagnosis_id, patName, docName, date) {
    return { serialNo, diagnosis_id, patName, docName, date };
}

let rows = [];

export default function AppointmentsTable(props) {
    const [appSlNo, setAppSlNo] = React.useState(null)
    let textInput = useRef(null)
    const classes = useStyles();
    const handleAllAppointmentToggle = (value) => {
        let creds = JSON.parse(props.User.creds);

        if (value === 'All appointments') {
            let body = { 'userID': creds.userId, 'token': props.User.token, 'allTests': true, 'app_sl_no': null };
            props.fetchData(body);
            textInput.current.value = '';
        }
        else if (value === 'Recent') {
            let body = { 'userID': creds.userId, 'token': props.User.token, 'allTests': false, 'app_sl_no': null };
            props.fetchData(body);
            textInput.current.value = '';
        }
    }
    const handleSearch = () => {
        if (appSlNo !== null) {
            console.log(appSlNo);
            let creds = JSON.parse(props.User.creds);
            let body = { 'userID': creds.userId, 'token': props.User.token, 'allTests': false, 'app_sl_no': appSlNo };
            props.fetchData(body);
        }
    }
    rows = [];
    let appointments = props.checkupList;
    if (appointments !== null) {
        appointments.map((appointment) => {
            console.log(appointment.schedule_date);
            rows.push(createData(appointment.app_sl_no, appointment.diagnosis_id, appointment.patient_name, appointment.doctor_name, appointment.date));
        })
    }
    return (
        <Paper>
            <Toolbar className={classes.root}>
                <TextField
                    className={classes.margin}
                    id="input-with-icon-textfield"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(event) => { setAppSlNo(event.target.value) }}
                    inputRef={textInput}
                />
                <Button variant="contained" style={{ marginLeft: 10 }} onClick={() => { handleSearch() }}>Search</Button>
                <FormControl className={classes.formControl} style={{ marginLeft: 'auto' }}>
                    <NativeSelect
                        defaultValue={'Recent'}
                        inputProps={{
                            name: 'name',
                            id: 'uncontrolled-native',
                        }}
                        onChange={(event) => { handleAllAppointmentToggle(event.target.value) }}
                    >
                        <option value={'Recent'}>Recent</option>
                        <option value={'All appointments'}>All appointments</option>
                    </NativeSelect>
                </FormControl>
            </Toolbar>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Appointment serial no.</TableCell>
                            <TableCell align="right">Patients's name</TableCell>
                            <TableCell align="right">Doctor's Name</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">View</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <TableRow >
                                    <TableCell component="th" scope="row">
                                        {row.serialNo}
                                    </TableCell>
                                    <TableCell align="right">{row.patName}</TableCell>
                                    <TableCell align="right">{row.docName}</TableCell>
                                    <TableCell align="right">{row.date}</TableCell>
                                    <TableCell align="right">
                                        <Link to={`/receptionist/approve-service/${row.diagnosis_id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                            <Button variant='contained'>
                                                View
                                        </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
