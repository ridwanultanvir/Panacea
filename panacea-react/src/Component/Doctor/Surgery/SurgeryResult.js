import React, { Component } from 'react';
import {
    withStyles, AppBar, Drawer, Toolbar, List, Divider, TextField,
    CssBaseline, Typography, Card, Container, Grid, Box, Button,
    FormControl, NativeSelect
} from '@material-ui/core';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import { Redirect } from 'react-router-dom';
import CopyRight from '../../Copyright';
import { baseUrl } from '../../../Redux/ActionCreator';
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

class SurgeryResult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(),
            surgeryStatus: 'PENDING',
            comment: null,
            redirect: false
        }

        this.renderTestResult = this.renderTestResult.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);

        this.selectInput = React.createRef();
    }

    handleDateChange(date) {
        this.setState({ date: date });
    }

    handleSubmission() {
        if (this.state.surgeryStatus === 'PENDING' || this.state.comment === null) {
            alert('Please fill up the form');
        }
        else {
            let creds = JSON.parse(this.props.User.creds);
            let body = {
                'userID': creds.userId, 'token': this.props.User.token, 'surgery_result_id': this.props.surgery_result_id,
                'status': this.state.surgeryStatus, 'comment': this.state.comment,
                'date': this.state.date.getDate().toString() + '-' + (this.state.date.getMonth()+1).toString() + '-' + this.state.date.getFullYear().toString()

            };

            fetch(baseUrl + 'checkup/doctor/update-surgery-result/', {
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

        if (this.props.User.isAuthenticated && this.props.User.category === 'doctor') {

            if (this.state.redirect) {
                return (<Redirect to='/doctor/surgery' />);
            }

            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Doctor
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
                                        <Typography variant='h6' >Surgery result: </Typography>
                                        <div style={{ display: "flex" }}>
                                            <FormControl className={classes.formControl} style={{ width: 350, marginTop: 16 }}>
                                                <NativeSelect
                                                    inputRef={this.selectInput}
                                                    defaultValue={'PENDING'}
                                                    inputProps={{
                                                        name: 'name',
                                                        id: 'uncontrolled-native',
                                                    }}
                                                    onChange={(event) => { this.setState({ surgeryStatus: event.target.value }) }}
                                                >
                                                    <option value={'PENDING'}>Pending</option>
                                                    <option value={'SUCCESS'}>SUCCESS</option>
                                                    <option value={'FAILURE'}>FAILURE</option>
                                                </NativeSelect>
                                            </FormControl>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    required
                                                    id="date-of-birth"
                                                    label="Surgery date"
                                                    format="dd/MM/yyyy"
                                                    value={this.state.date}
                                                    onChange={this.handleDateChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    style={{ width: 350, marginLeft: 20 }}
                                                />
                                            </MuiPickersUtilsProvider>

                                        </div>
                                        <TextField
                                            required
                                            id="standard-textarea"
                                            label="Comment"
                                            placeholder="Comment"
                                            multiline
                                            style={{ marginTop: 20, width: 720 }}
                                            onChange={(event) => { this.setState({ comment: event.target.value }) }}
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

export default withStyles(styles)(SurgeryResult);