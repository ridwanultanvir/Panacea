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

function createData(test_result_id, service_name, patient_name) {
    return { test_result_id, service_name, patient_name };
}

let rows = [];

export default function TestsTable(props) {
    const [testResultId, setTestResultId] = React.useState(null);
    let textInput = useRef(null);
    let selectInput = useRef(null);
    const classes = useStyles();

    const handleSearch = () => {
        if (testResultId !== null) {
            let creds = JSON.parse(props.User.creds);
            let body = { 'userID': creds.userId, 'token': props.User.token, 'test_result_id': testResultId, 'all_tests': false };
            props.fetchData(body);
            selectInput.current.value = 'All';
        }
    }
    const handleReset = () => {
        let creds = JSON.parse(props.User.creds);
        let body = { 'userID': creds.userId, 'token': props.User.token, 'test_result_id': null, 'all_tests': false };
        props.fetchData(body);
        textInput.current.value = '';
        selectInput.current.value = 'Pending';
    }

    const handleAllAppointmentToggle = (value) => {
        let creds = JSON.parse(props.User.creds);

        if (value === 'All') {
            let body = { 'userID': creds.userId, 'token': props.User.token, 'test_result_id': null, 'all_tests': true };
            props.fetchData(body);
            textInput.current.value = '';
        }
        else if (value === 'Pending') {
            let body = { 'userID': creds.userId, 'token': props.User.token, 'test_result_id': null, 'all_tests': false };
            props.fetchData(body);
            textInput.current.value = '';
        }
    }

    rows = [];
    let pendingTests = props.pendingTests;
    if (pendingTests !== null) {
        pendingTests.map((pendingTest) => {
            rows.push(createData(pendingTest.test_result_id, pendingTest.service_name, pendingTest.patient_name));
        })
    }
    return (
        <Paper>
            <Toolbar className={classes.root}>
                <FormControl className={classes.formControl} style={{ marginLeft: 10 }}>
                    <NativeSelect
                        inputRef={selectInput}
                        defaultValue={'Pending'}
                        inputProps={{
                            name: 'name',
                            id: 'uncontrolled-native',
                        }}
                        onChange={(event) => { handleAllAppointmentToggle(event.target.value) }}
                    >
                        <option value={'Pending'}>Pending tests</option>
                        <option value={'All'}>All tests</option>
                    </NativeSelect>
                </FormControl>
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
                    onChange={(event) => { setTestResultId(event.target.value) }}
                    inputRef={textInput}
                    placeholder='Test no.'
                    style={{ marginLeft: 'auto' }}
                />
                <Button variant="contained" style={{ marginLeft: 10 }} onClick={() => { handleSearch() }}>Search</Button>
                <Button variant="contained" style={{ marginLeft: 10 }} onClick={() => { handleReset() }}>Reset</Button>

            </Toolbar>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Test no.</TableCell>
                            <TableCell align="right">Test name</TableCell>
                            <TableCell align="right">Patients Name</TableCell>
                            <TableCell align="right">View</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <TableRow >
                                    <TableCell component="th" scope="row">
                                        {row.test_result_id}
                                    </TableCell>
                                    <TableCell align="right">{row.service_name}</TableCell>
                                    <TableCell align="right">{row.patient_name}</TableCell>
                                    <TableCell align="right">
                                        <Link to={`/technician/pending-tests/${row.test_result_id}`} style={{ textDecoration: 'none', color: 'black' }}>
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
