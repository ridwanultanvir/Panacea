import React, { Component } from 'react';
import {
    withStyles, AppBar, Drawer, Toolbar, List, Divider, TextField,
    CssBaseline, Typography, Card, Container, Grid, Box, Link, Button,
    FormControl, NativeSelect, InputLabel
} from '@material-ui/core';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import { Redirect } from 'react-router-dom';
import CopyRight from '../../Copyright';
import { baseUrl } from '../../../Redux/ActionCreator';
import TestsTable from './TestsTable';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';


const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    margin: {
        margin: theme.spacing(1),
    },
});

class TestResult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(),
            sampleNo: null,
            testResult: null,
            redirect: false,
            status: 'NORMAL'
        }

        this.renderTestResult = this.renderTestResult.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);

        this.selectInput = React.createRef()
    }

    handleDateChange(date) {
        this.setState({ date: date });
    }

    handleSubmission() {
        if (this.state.sampleNo === null || this.state.testResult === null) {
            alert('Please fill up the form');
        }
        else {
            let creds = JSON.parse(this.props.User.creds);
            let body = {
                'userID': creds.userId, 'token': this.props.User.token, 'test_result_id': this.props.test_result_id,
                'sample_no': this.state.sampleNo, 'test_result': this.state.testResult,
                'status': this.state.status,
                'date': this.state.date.getDate().toString() + '-' + this.state.date.getMonth().toString() + '-' + this.state.date.getFullYear().toString()

            };

            fetch(baseUrl + 'checkup/technician/update-test-result/', {
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
                        //this.setState({ pendingTests: response.pending_tests });
                        this.setState({ redirect: true })
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

    }

    renderTestResult() {
        const { classes } = this.props;

        if (this.props.User.isAuthenticated && this.props.User.category === 'TECHNICIAN') {

            if (this.state.redirect) {
                return (<Redirect to='/technician/pending-tests' />);
            }

            let userData = JSON.parse(this.props.User.userData);
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Technician
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <Toolbar />
                        <div className={classes.drawerContainer}>
                            <List>{mainListItems}</List>
                            <Divider />
                            <List>{secondaryListItems}</List>
                        </div>
                    </Drawer>


                    <main className={classes.content}>
                        <Toolbar />
                        <div />
                        <Container maxWidth="lg" >
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Card style={{ padding: 30, width: 800, marginLeft: 200 }}>
                                        <Typography variant='h6' >Test result: </Typography>
                                        <div style={{ display: "flex" }}>
                                            <TextField
                                                required
                                                id="standard-basic"
                                                label="Sample no"
                                                style={{ width: 230 }}
                                                onChange={(event) => { this.setState({ sampleNo: event.target.value }) }}
                                            />
                                            <FormControl style={{ width: 230, marginLeft: 10 }}>
                                                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                                    Status
                                                </InputLabel>
                                                <NativeSelect
                                                    inputRef={this.selectInput}
                                                    defaultValue={'NORMAL'}
                                                    inputProps={{
                                                        name: 'name',
                                                        id: 'uncontrolled-native',
                                                    }}
                                                    onChange={(event) => { this.setState({ status: event.target.value }) }}

                                                >
                                                    <option value={'NORMAL'}>Normal</option>
                                                    <option value={'CRITICAL'}>Critical</option>
                                                </NativeSelect>
                                            </FormControl>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    required
                                                    id="date-of-birth"
                                                    label="Result date"
                                                    format="dd/MM/yyyy"
                                                    value={this.state.date}
                                                    onChange={this.handleDateChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    style={{ width: 230, marginLeft: 10 }}
                                                />
                                            </MuiPickersUtilsProvider>

                                        </div>
                                        <TextField
                                            required
                                            id="standard-textarea"
                                            label="Result"
                                            placeholder="Result"
                                            multiline
                                            style={{ marginTop: 20, width: 720 }}
                                            onChange={(event) => { this.setState({ testResult: event.target.value }) }}
                                        />

                                        <Button variant="contained" color="primary" style={{ marginTop: 20 }} onClick={this.handleSubmission}>
                                            Submit
                                        </Button>

                                    </Card>
                                </Grid>
                            </Grid>
                            <Box pt={4}>
                                {CopyRight}
                            </Box>
                        </Container>
                    </main>
                </div>
            );
        }
        else {
            return (<Redirect to='/sign-in' />);
        }
    }
    render() {
        const { classes } = this.props;

        const Component = this.renderTestResult();
        return (
            <React.Fragment>
                {Component}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(TestResult);