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

function createData(app_sl_no, test_result_id, service_name, complete_date, test_result, completed, doctor_name) {
    return { app_sl_no, test_result_id, service_name, complete_date, test_result, completed, doctor_name };
}

let rows = [];

export default function TestResultTable(props) {
    const [appSlNo, setAppSlNo] = React.useState(null);
    let textInput = useRef(null);
    let selectInput = useRef(null);
    const classes = useStyles();

    const handleSearch = () => {
        if (appSlNo !== null) {
            let creds = JSON.parse(props.User.creds);
            let body = {
                'userID': creds.userId, 'token': props.User.token,
                'allTests': false, 'pendingTests': false,
                'completedTests': false, 'app_sl_no': appSlNo
            };
            props.fetchData(body);
            selectInput.current.value = 'All';
        }
    }
    const handleReset = () => {
        let creds = JSON.parse(props.User.creds);
        let body = {
            'userID': creds.userId, 'token': props.User.token,
            'allTests': false, 'pendingTests': false,
            'completedTests': true, 'app_sl_no': null
        };
        props.fetchData(body);
        textInput.current.value = '';
        selectInput.current.value = 'Completed';
    }

    const handleAllTestToggle = (value) => {
        let creds = JSON.parse(props.User.creds);

        if (value === 'All') {
            let creds = JSON.parse(props.User.creds);
            let body = {
                'userID': creds.userId, 'token': props.User.token,
                'allTests': true, 'pendingTests': false,
                'completedTests': false, 'app_sl_no': null
            };
            props.fetchData(body);
            textInput.current.value = '';
        }
        else if (value === 'Pending') {
            let creds = JSON.parse(props.User.creds);
            let body = {
                'userID': creds.userId, 'token': props.User.token,
                'allTests': false, 'pendingTests': true,
                'completedTests': false, 'app_sl_no': null
            };
            props.fetchData(body);
            textInput.current.value = '';
        }
        else if (value === 'Completed') {
            let creds = JSON.parse(props.User.creds);
            let body = {
                'userID': creds.userId, 'token': props.User.token,
                'allTests': false, 'pendingTests': false,
                'completedTests': true, 'app_sl_no': null
            };
            props.fetchData(body);
            textInput.current.value = '';
        }
    }

    rows = [];
    let test_results = props.test_results;
    if (test_results !== null) {
        test_results.map((test_result) => {
            rows.push(createData(test_result.app_sl_no, test_result.test_result_id, test_result.service_name, test_result.test_complete_date,
                test_result.test_Rresult, test_result.completed, test_result.doctor_name));
        })
    }
    return (
        <Paper>
            <Toolbar className={classes.root}>
                <FormControl className={classes.formControl} style={{ marginLeft: 10 }}>
                    <NativeSelect
                        inputRef={selectInput}
                        defaultValue={'Completed'}
                        inputProps={{
                            name: 'name',
                            id: 'uncontrolled-native',
                        }}
                        onChange={(event) => { handleAllTestToggle(event.target.value) }}
                    >
                        <option value={'Completed'}>Completed tests</option>
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
                    onChange={(event) => { setAppSlNo(event.target.value) }}
                    inputRef={textInput}
                    placeholder='Appointment Sl.No.'
                    style={{ marginLeft: 'auto' }}
                />
                <Button variant="contained" style={{ marginLeft: 10 }} onClick={() => { handleSearch() }}>Search</Button>
                <Button variant="contained" style={{ marginLeft: 10 }} onClick={() => { handleReset() }}>Reset</Button>

            </Toolbar>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Appointment Sl No.</TableCell>
                            <TableCell align="right">Test name</TableCell>
                            <TableCell align="right">Result date</TableCell>
                            <TableCell align="right">Test result</TableCell>
                            <TableCell align="right">Doctors name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <TableRow >
                                    <TableCell component="th" scope="row">
                                        {(row.app_sl_no ? row.app_sl_no : 'N/A')}
                                    </TableCell>
                                    <TableCell align="right">{(row.service_name ? row.service_name : 'N/A')}</TableCell>
                                    <TableCell align="right">{(row.complete_date ? row.complete_date : 'N/A')}</TableCell>
                                    <TableCell align="right">{(row.test_result ? row.test_result : 'N/A')}</TableCell>
                                    <TableCell align="right">{(row.doctor_name ? row.doctor_name : 'N/A')}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
