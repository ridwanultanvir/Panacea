import React, { Component } from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import { Redirect } from 'react-router-dom';
import { Form } from 'react-redux-form';
import { TextField, Button, CardContent, Card, Grid } from '@material-ui/core';
import CopyRight from '../../Copyright';
import { baseUrl } from '../../../Redux/ActionCreator';
import BillDisplayTable from './BillDisplayTable';


const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: 'flex',
    },
    button: {
        '& > *': {
            margin: theme.spacing(3),
        },
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
    submit: {
        margin: theme.spacing(3, 0, 2),
        maxWidth: 200
    },
});


class PrepareBill extends Component {
    constructor(props) {
        super(props);

        this.state = {
            patientID: null,
            checkUpTableHeaders: null,
            surgTableHeaders: null,
            roomTableHeaders: null,
            medTableHeaders: null,
            resultCheckUpBill: null,
            resultSurgBill: null,
            resultRoomBill: null,
            resultMedBill: null,
            total_checkup_bill: null,
            total_surg_bill: null,
            total_room_bill: null,
            total_med_bill: null,
            total_bill: null,
            showDisplayTable: false,
            redirect: false,
        };

        this.renderPrepareBill = this.renderPrepareBill.bind(this);
        this.handlePatientIDSubmit = this.handlePatientIDSubmit.bind(this);
        this.handleExecutePayment = this.handleExecutePayment.bind(this);
    }


    handlePatientIDSubmit() {
        if (this.state.patientID === null || this.state.patientID === '') {
            alert("Please insert appointment serial ID");
        }
        else {
            let creds = JSON.parse(this.props.User.creds);
            let body = {
                'userID': creds.userId, 'token':'token', 'patientID' : this.state.patientID,
            }
            fetch(baseUrl + 'payment/get-patient-payment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
                .then((response) => {
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
                    if (response.success !== true) {
                        alert(response.alertMessage);
                    }
                    else if (response.success) {
                        console.log(response);
                        this.setState({
                            checkUpTableHeaders: response.checkUpTableHeaders,
                            surgTableHeaders: response.surgTableHeaders,
                            roomTableHeaders: response.roomTableHeaders,
                            medTableHeaders: response.medTableHeaders,
                            resultCheckUpBill: response.resultCheckUpBill,
                            resultSurgBill: response.resultSurgBill,
                            resultRoomBill: response.resultRoomBill,
                            resultMedBill: response.resultMedBill,
                            total_checkup_bill: response.total_checkup_bill,
                            total_surg_bill: response.total_surg_bill,
                            total_room_bill: response.total_room_bill,
                            total_med_bill: response.total_med_bill,
                            total_bill: response.total_bill,
                        });
                        this.setState({showDisplayTable: true});
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


    handleExecutePayment() {
        if (this.state.total_bill === 0.0)
        {
            alert("The Selected Patient Has No Dues Left");
            return;
        }
        let creds = JSON.parse(this.props.User.creds);
        let body = {
            'userID': creds.userId, 'token':'token', 'patientID' : this.state.patientID,'total_amount': this.state.total_bill
        }
        fetch(baseUrl + 'payment/save-payment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
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
                if (response.success !== true) {
                    alert(response.alertMessage);
                }
                else if (response.success) {
                    alert(response.message);
                    this.setState({redirect: true});
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


    renderPrepareBill() {
        const { classes } = this.props;
        if (this.props.User.isAuthenticated && this.props.User.category === 'RECEPTIONIST') {
            if (this.state.redirect) {
                return (<Redirect to='/receptionist/home' />);
            }
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Receptionist
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
                            <Card style={{ marginBottom: 20 }}>
                                <CardContent>
                                <Typography variant="h4" style={{fontFamily:'"Helvetica Neue"', marginLeft:'35%', 
                                    fontDisplay: 'swap',  fontWeight: 200, color: 'blue'}}>
                                    Bill Payment System
                                </Typography>
                                </CardContent></Card>

                            <Form model='AdminScheduleUserID' onSubmit={() => this.handlePatientIDSubmit()}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="patient-id"
                                    label="Patient ID"
                                    name="patient-id"
                                    autoComplete="patient-id"
                                    autoFocus
                                    onChange={(event) => this.setState({patientID: event.target.value})}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Create Bill
                                </Button>
                            </Form>


                            {this.state.showDisplayTable ?
                                (<div>
                                <Grid container spacing={3}>
                                    <Card style={{ marginBottom: 20, width:'80%', marginLeft:'10%', marginTop:20 }}>
                                    <CardContent>
                                    <Typography variant="h5" style={{fontFamily:'"Helvetica Neue"', marginLeft:'35%', 
                                        fontDisplay: 'swap',  fontWeight: 200, }}>
                                        Total Bill Transcript
                                    </Typography>
                                    </CardContent></Card>

                                    <Grid item xs={12}>

                                        <BillDisplayTable
                                            checkUpTableHeaders= {this.state.checkUpTableHeaders}
                                            surgTableHeaders= {this.state.surgTableHeaders}
                                            roomTableHeaders = {this.state.roomTableHeaders}
                                            medTableHeaders = {this.state.medTableHeaders}
                                            resultCheckUpBill = {this.state.resultCheckUpBill}
                                            resultSurgBill = {this.state.resultSurgBill}
                                            resultRoomBill = {this.state.resultRoomBill}
                                            resultMedBill = {this.state.resultMedBill}
                                            total_checkup_bill = {this.state.total_checkup_bill}
                                            total_surg_bill = {this.state.total_surg_bill}
                                            total_room_bill = {this.state.total_room_bill}
                                            total_med_bill = {this.state.total_med_bill}
                                            total_bill = {this.state.total_bill}
                                        />
                                    </Grid>

                                    <Typography variant="h5" style={{fontFamily:'"Helvetica Neue"', marginLeft:'35%',  
                                        fontDisplay: 'swap',  fontWeight: 200, }}>
                                        Gross Total Bill: {this.state.total_bill} Taka
                                    </Typography>

                                    <Button variant="contained" color="primary" style={{marginLeft:'10'}}onClick ={this.handleExecutePayment}>
                                        Accept Payment
                                    </Button>

                                </Grid>
                                 </div>):
                                null
                            }

                            

                            <Box pt={4}>
                                <CopyRight />
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
        const renderPrepareBill = this.renderPrepareBill();
        return (
            <React.Fragment>
                {renderPrepareBill}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(PrepareBill);