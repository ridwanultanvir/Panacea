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

function createData(test_result_id, service_name, cost) {
    return { test_result_id, service_name, cost };
}

let rows = [];

export default function PendingTests(props) {
    const classes = useStyles();

    const handleApprove = (test_result_id) => {
        console.log('inside handle approve');
        let creds = JSON.parse(props.User.creds);
        let body = {
            'userID': creds.userId, 'token': props.User.token, 'diagnosisID': props.diagnosisID, 'test_result_id': test_result_id
        };
        fetch(baseUrl + 'checkup/receptionist/approve-test/', {
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
    let tests = props.pendingTests;
    if (tests !== null) {
        tests.map((test) => {
            rows.push(createData(test.test_result_id, test.service_name, test.cost));
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
                        <TableCell align="right">Approve</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow key={row.test_result_id}>
                                <TableCell component="th" scope="row">
                                    {idx++}
                                </TableCell>
                                <TableCell align="right">{row.service_name}</TableCell>
                                <TableCell align="right">{row.cost}</TableCell>
                                <TableCell align="right">
                                    <Button variant='contained' onClick={() => { handleApprove(row.test_result_id) }}>
                                        Approve
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
