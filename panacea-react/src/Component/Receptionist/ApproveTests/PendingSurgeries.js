import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import { baseUrl } from '../../../Redux/ActionCreator';
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

function createData(surgery_result_id, surgery_desc, service_name, cost, department) {
    return { surgery_result_id, surgery_desc, service_name, cost, department };
}

let rows = [];

export default function PendingSurgeries(props) {
    const classes = useStyles();

    const handleApprove = (surgery_result_id) => {
        console.log('inside handle approve');
        let creds = JSON.parse(props.User.creds);
        let body = {
            'userID': creds.userId, 'token': props.User.token, 'diagnosisID': props.diagnosisID, 'surgery_result_id': surgery_result_id
        };
        fetch(baseUrl + 'checkup/receptionist/approve-surgery/', {
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
                    console.log(response);
                    props.setPendingServices(response.pending_tests, response.pending_surgeries);
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

    rows = [];
    let surgeries = props.pendingSurgeries;
    if (surgeries !== null) {
        surgeries.map((surgery) => {
            rows.push(createData(surgery.surgery_result_id, surgery.surgery_desc, surgery.service_name, surgery.cost, surgery.department));
        })
    }
    let idx = 1;
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Serial No.</TableCell>
                        <TableCell align="right">Service name</TableCell>
                        <TableCell align="right">Cost</TableCell>
                        <TableCell align="right">Description</TableCell>
                        <TableCell align="right">Department</TableCell>
                        <TableCell align="right">Approve</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow key={row.serialNo}>
                                <TableCell component="th" scope="row">
                                    {idx++}
                                </TableCell>
                                <TableCell align="right">{row.service_name}</TableCell>
                                <TableCell align="right">{row.cost}</TableCell>
                                <TableCell align="right">{row.surgery_desc}</TableCell>
                                <TableCell align="right">{row.department}</TableCell>
                                <TableCell align="right">
                                    <Link to={`/receptionist/surgery-schedule/${props.diagnosisID}/${row.surgery_result_id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                        <Button variant='contained' >
                                            Schedule
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
