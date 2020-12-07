import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Toolbar, FormControl, NativeSelect, TextField, Button, InputAdornment } from '@material-ui/core';
import { Search } from '@material-ui/icons';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
}));

function createData(app_sl_no, surgery_result_id, surgery_date, surgery_desc, completed, status, result, doctor_name) {
    return {
        app_sl_no, surgery_result_id, surgery_date, surgery_desc, completed, status, result, doctor_name
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {(row.app_sl_no ? row.app_sl_no : 'N/A')}
                </TableCell>
                <TableCell >{(row.doctor_name ? row.doctor_name : 'N/A')}</TableCell>
                <TableCell align="right">{(row.surgery_desc ? row.surgery_desc.substr(0, 50) + '...' : 'N/A')}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h7" gutterBottom component="div">
                                Surgery result id: {(row.surgery_result_id ? row.surgery_result_id : 'N/A')}
                            </Typography>
                            <Typography variant="h7" gutterBottom component="div">
                                Surgery date : {(row.surgery_date ? row.surgery_date : 'N/A')}
                            </Typography>
                            <Typography variant="h7" gutterBottom component="div">
                                Surgery Description : {(row.surgery_desc ? row.surgery_desc : 'N/A')}
                            </Typography>
                            <Typography variant="h7" gutterBottom component="div">
                                Completed : {(row.completed ? row.completed : 'N/A')}
                            </Typography>
                            <Typography variant="h7" gutterBottom component="div">
                                Status: {(row.status ? row.status : 'N/A')}
                            </Typography>
                            <Typography variant="h7" gutterBottom component="div">
                                Result: {(row.result ? row.result : 'N/A')}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
};


export default function SurgeryResultTable(props) {
    const [appSlNo, setAppSlNo] = React.useState(null);
    let textInput = useRef(null);
    let selectInput = useRef(null);
    const classes = useStyles();

    let surg = props.surgery;
    let rows = [];
    if (surg !== null) {
        surg.map((block) => {
            rows.push(createData(block.app_sl_no, block.surgery_result_id, block.surgery_date, block.surgery_desc, block.completed,
                block.status, block.result, block.doctor_name))
        });
    }

    const handleSearch = () => {
        if (appSlNo !== null) {
            let creds = JSON.parse(props.User.creds);
            let body = {
                'userID': creds.userId, 'token': props.User.token,
                'allSurgery': false, 'pendingSurgery': false,
                'completedSurgery': false, 'app_sl_no': appSlNo
            };
            props.fetchData(body);
            selectInput.current.value = 'All';
        }
    }
    const handleReset = () => {
        let creds = JSON.parse(props.User.creds);
        let body = {
            'userID': creds.userId, 'token': props.User.token,
            'allSurgery': false, 'pendingSurgery': false,
            'completedSurgery': true, 'app_sl_no': null
        };
        props.fetchData(body);
        textInput.current.value = '';
        selectInput.current.value = 'Completed';
    }


    const handleAllSurgeryToggle = (value) => {
        if (value === 'All') {
            let creds = JSON.parse(props.User.creds);
            let body = {
                'userID': creds.userId, 'token': props.User.token,
                'allSurgery': true, 'pendingSurgery': false,
                'completedSurgery': false, 'app_sl_no': null
            };
            props.fetchData(body);
            textInput.current.value = '';
        }
        else if (value === 'Pending') {
            let creds = JSON.parse(props.User.creds);
            let body = {
                'userID': creds.userId, 'token': props.User.token,
                'allSurgery': false, 'pendingSurgery': true,
                'completedSurgery': false, 'app_sl_no': null
            };
            props.fetchData(body);
            textInput.current.value = '';
        }
        else if (value === 'Completed') {
            let creds = JSON.parse(props.User.creds);
            let body = {
                'userID': creds.userId, 'token': props.User.token,
                'allSurgery': false, 'pendingSurgery': false,
                'completedSurgery': true, 'app_sl_no': null
            };
            props.fetchData(body);
            textInput.current.value = '';
        }
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
                        onChange={(event) => { handleAllSurgeryToggle(event.target.value) }}
                    >
                        <option value={'Completed'}>Completed surgeries</option>
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
                    onChange={(event) => { setAppSlNo(event.target.value) }}
                    inputRef={textInput}
                    placeholder='Appointment Sl.No.'
                    style={{ marginLeft: 'auto' }}
                />
                <Button variant="contained" style={{ marginLeft: 10 }} onClick={() => { handleSearch() }}>Search</Button>
                <Button variant="contained" style={{ marginLeft: 10 }} onClick={() => { handleReset() }}>Reset</Button>

            </Toolbar>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Appointment Sl No.</TableCell>
                            <TableCell>Doctor's Name</TableCell>
                            <TableCell align='right' >Surgery</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}