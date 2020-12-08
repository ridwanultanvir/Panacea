import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { FormControl, Select, Menu, MenuItem, FormHelperText, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

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

// function createData(serialNo, patName, docName, probDesc, appntDate, schedule_date, time, status) {
//     return { serialNo, patName, docName, probDesc, appntDate, schedule_date, time, status };
// }

function createData(schedule_id, schedule_date, start_time, end_time, shift_title) {
    return { schedule_id, schedule_date, start_time, end_time, shift_title };
}

let rows = [];

export default function ReceptionistScheduleTable(props) {
    const classes = useStyles();

    rows = [];
    let schedules = props.schedules;
    if (schedules !== null) {
        schedules.map((schedule) => {
            rows.push(createData(schedule.schedule_id, schedule.schedule_date, schedule.start_time, schedule.end_time, schedule.shift_title));
        });
    }
    let idx = 1;
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Serial</TableCell>
                        <TableCell align="right">Schedule date</TableCell>
                        <TableCell align="right">Start time</TableCell>
                        <TableCell align="right">End time</TableCell>
                        <TableCell align="right">Shift title</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow key={row.schedule_id}>
                                <TableCell component="th" scope="row">
                                    {idx++}
                                </TableCell>
                                <TableCell align="right">{row.schedule_date}</TableCell>
                                <TableCell align="right">{row.start_time}</TableCell>
                                <TableCell align="right">{row.end_time}</TableCell>
                                <TableCell align="right">{row.shift_title}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
