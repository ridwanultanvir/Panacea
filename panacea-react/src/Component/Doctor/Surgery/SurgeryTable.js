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

function createData(surgery_result_id, surgery_desc, completed, surgery_date, status, result) {
    return { surgery_result_id, surgery_desc, completed, surgery_date, status, result };
}

let rows = [];

export default function SurgeryTable(props) {
    const [surgery_result_id, set_surgery_result_id] = React.useState(null);
    let textInput = useRef(null);
    let selectInput = useRef(null);
    const classes = useStyles();

    const handleSearch = () => {
        if (surgery_result_id !== null) {
            let creds = JSON.parse(props.User.creds);
            let body = { 'userID': creds.userId, 'token': props.User.token, 'doc_id': creds.userId, 'all_surgery': false, 'surgery_id': surgery_result_id };
            props.fetchData(body);
            selectInput.current.value = 'All';
        }
    }
    const handleReset = () => {
        let creds = JSON.parse(props.User.creds);
        let body = { 'userID': creds.userId, 'token': props.User.token, 'doc_id': creds.userId, 'all_surgery': false, 'surgery_id': null };
        props.fetchData(body);
        textInput.current.value = '';
        selectInput.current.value = 'Pending';
    }

    const handleAllSurgeryToggle = (value) => {
        let creds = JSON.parse(props.User.creds);

        if (value === 'All') {
            let body = { 'userID': creds.userId, 'token': props.User.token, 'doc_id': creds.userId, 'all_surgery': true, 'surgery_id': null };
            props.fetchData(body);
            textInput.current.value = '';
        }
        else if (value === 'Pending') {
            let body = { 'userID': creds.userId, 'token': props.User.token, 'doc_id': creds.userId, 'all_surgery': false, 'surgery_id': null };
            props.fetchData(body);
            textInput.current.value = '';
        }
    }

    rows = [];
    let surgeries = props.surgeries;
    if (surgeries !== null) {
        surgeries.map((surgery) => {
            rows.push(createData(surgery.surgery_result_id, surgery.surgery_desc, surgery.completed, surgery.surgery_date, surgery.status, surgery.result));
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
                        onChange={(event) => { handleAllSurgeryToggle(event.target.value) }}
                    >
                        <option value={'Pending'}>Pending surgeries</option>
                        <option value={'All'}>All surgeries</option>
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
                    onChange={(event) => { set_surgery_result_id(event.target.value) }}
                    inputRef={textInput}
                    placeholder='Surgery no.'
                    style={{ marginLeft: 'auto' }}
                />
                <Button variant="contained" style={{ marginLeft: 10 }} onClick={() => { handleSearch() }}>Search</Button>
                <Button variant="contained" style={{ marginLeft: 10 }} onClick={() => { handleReset() }}>Reset</Button>

            </Toolbar>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Surgery no.</TableCell>
                            <TableCell align="right">Surgery description</TableCell>
                            <TableCell align="right">Completed</TableCell>
                            <TableCell align="right">Surgery date</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Comment</TableCell>
                            <TableCell align="right">View</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <TableRow >
                                    <TableCell component="th" scope="row">
                                        {row.surgery_result_id}
                                    </TableCell>
                                    <TableCell align="right" style={{ maxWidth: 40 }}>{row.surgery_desc}</TableCell>
                                    <TableCell align="right">{row.completed}</TableCell>
                                    <TableCell align="right">{row.surgery_date}</TableCell>
                                    <TableCell align="right">{row.status}</TableCell>
                                    <TableCell align="right" style={{ maxWidth: 40 }}>{row.result}</TableCell>
                                    <TableCell align="right">
                                        <Link to={`/doctor/surgery/${row.surgery_result_id}`} style={{ textDecoration: 'none', color: 'black' }}>
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
