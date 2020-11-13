import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { FormControl, Select, Menu, MenuItem, FormHelperText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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
}));

function createData(serialNo, patName, docName, probDesc, appntDate, schedule_date, time, status) {
    return { serialNo, patName, docName, probDesc, appntDate, schedule_date, time, status };
}

let rows = [];

export default function AppointmentsTable(props) {
    const classes = useStyles();

    const handleChange = (event) => {
        if (event.target.value !== 'pending') {
            let creds = JSON.parse(props.User.creds);
            props.acceptReceptionistAppointment({ 'userID': creds.userId, 'token': props.User.token, 'app_sl_no': event.target.value });
        }
    };

    rows = [];
    let appointments = props.ReceptionistsAppointments.appointments;
    console.log(props.ReceptionistsAppointments)
    if (appointments !== null) {
        appointments.map((appointment) => {
            console.log(appointment.schedule_date);
            rows.push(createData(appointment.app_sl_no, appointment.patient_name, appointment.doctor_name, appointment.problem_desc, appointment.appointment_date, appointment.schedule_date, appointment.start_time + '-' + appointment.end_time, appointment.status));
        })
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Serial No.</TableCell>
                        <TableCell align="right">Patients's name</TableCell>
                        <TableCell align="right">Doctor's Name</TableCell>
                        <TableCell align="right">Problem description</TableCell>
                        <TableCell align="right">Application date</TableCell>
                        <TableCell align="right">Schedule date</TableCell>
                        <TableCell align="right">Time</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow key={row.serialNo}>
                                <TableCell component="th" scope="row">
                                    {row.serialNo}
                                </TableCell>
                                <TableCell align="right">{row.patName}</TableCell>
                                <TableCell align="right">{row.docName}</TableCell>
                                <TableCell align="right">{row.probDesc}</TableCell>
                                <TableCell align="right">{row.appntDate}</TableCell>
                                <TableCell align="right">{row.schedule_date}</TableCell>
                                <TableCell align="right">{row.time}</TableCell>
                                <TableCell align="right">
                                    <FormControl className={classes.formControl}>
                                        <Select
                                            defaultValue='pending'
                                            onChange={handleChange}
                                            displayEmpty
                                            className={classes.selectEmpty}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value={row.status}>
                                                <em>{row.status}</em>
                                            </MenuItem>
                                            <MenuItem value={row.serialNo}>accepted</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
