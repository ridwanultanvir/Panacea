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

function createData(heart_beat, sys_bp, dias_bp, temperature, oxygen_level, breathing_rate, hours_past, minutes_past, time_of_data) {
    return { heart_beat, sys_bp, dias_bp, temperature, oxygen_level, breathing_rate, hours_past, minutes_past, time_of_data };
}

let rows = [];

export default function PatientMonitorTable(props) {

    const classes = useStyles();

    rows = [];
    let monitor_data = props.monitor_data;
    if (monitor_data !== null) {
        monitor_data.map((data) => {
            rows.push(createData(data.heart_beat, data.sys_bp, data.dias_bp,
                data.temperature, data.oxygen_level, data.breathing_rate, data.hours_past,
                data.minutes_past, data.time_of_data
            ));
        })
    }
    return (
        <Paper>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Heart beat</TableCell>
                            <TableCell align="right">Systolic BP</TableCell>
                            <TableCell align="right">Diastolic BP</TableCell>
                            <TableCell align="right">Body temperature</TableCell>
                            <TableCell align="right">Oxygen level</TableCell>
                            <TableCell align="right">Breathing rate</TableCell>
                            <TableCell align="right">Time past</TableCell>
                            <TableCell align="right">Time of data</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <TableRow >
                                    <TableCell component="th" scope="row">
                                        {row.heart_beat}
                                    </TableCell>
                                    <TableCell align="right" >{row.sys_bp}</TableCell>
                                    <TableCell align="right">{row.dias_bp}</TableCell>
                                    <TableCell align="right">{row.temperature}</TableCell>
                                    <TableCell align="right">{row.oxygen_level * 100}%</TableCell>
                                    <TableCell align="right" >{row.breathing_rate}</TableCell>
                                    <TableCell align="right" >{row.hours_past} Hours - {row.minutes_past} Minutes</TableCell>
                                    <TableCell align="right" >{row.time_of_data}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
