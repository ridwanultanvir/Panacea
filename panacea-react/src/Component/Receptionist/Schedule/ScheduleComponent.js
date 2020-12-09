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
import AddSurSchedule from './AddSurSchedule'
import { TextField, Button, CardContent, Card } from '@material-ui/core';
import CopyRight from '../../Copyright';
import { baseUrl } from '../../../Redux/ActionCreator';


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


class ReceptionistSurSchedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            appnt_sl_no: null,
            docID: null,
            date: null,
            docSelectionOpt1: null,
            redirect: false,
        };

        //this.Copyright = this.Copyright.bind(this);
        this.renderReceptionistSurSchedule = this.renderReceptionistSurSchedule.bind(this);
        this.handleAppntSlSubmit = this.handleAppntSlSubmit.bind(this);
        this.setAppntSlNo = this.setAppntSlNo.bind(this);
        this.fetchDocList = this.fetchDocList.bind(this);
        this.setDocPrev = this.setDocPrev.bind(this);
        this.setDocNew = this.setDocNew.bind(this);
        this.fetchRoomList = this.fetchRoomList.bind(this);
        this.addSurgerySchedule = this.addSurgerySchedule.bind(this);
    }

    // Copyright() {
    //     return (
    //         <Typography variant="body2" color="textSecondary" align="center">
    //             {'Copyright © '}
    //             <Link color="inherit" href="https://sadatshahriyar.pythonanywhere.com/">
    //                 Sadat Shahriyar
    //             </Link>{' '}
    //             {new Date().getFullYear()}
    //             {'.'}
    //         </Typography>
    //     );
    // }

    setAppntSlNo(appnt_sl_no) {
        this.setState({ appnt_sl_no: appnt_sl_no });
    }

    setDocPrev() {
        this.setState({ docID: this.props.ScheduleSurgeryTable.appntDocData.id });
        this.setState({ docSelectionOpt1: true });
    }

    setDocNew() {

        this.setState({ docSelectionOpt1: false });
    }

    fetchDocList(date) {
        this.props.loadDocDeptData({
            'docID': this.props.ScheduleSurgeryTable.appntDocData.id,
            'date': date
        });
    }

    componentDidMount() {
        let creds = JSON.parse(this.props.User.creds);
        this.props.loadAppointmentData({
            'userID': creds.userId, 'token': this.props.User.token,
            'diagnosis-id': this.props.diagnosisID
        })
    }

    fetchRoomList(date, time) {
        console.log(date, time);
        this.props.loadRoomData({ 'date': date, 'time': time, 'type': "surgery" });
    }

    handleAppntSlSubmit() {
        if (this.state.appnt_sl_no === null || this.state.appnt_sl_no === '') {
            alert("Please insert appointment serial ID");
        }
        else {
            let creds = JSON.parse(this.props.User.creds);
            this.props.loadAppointmentData({
                'userID': creds.userId, 'token': this.props.User.token,
                'appointment-serial': this.state.appnt_sl_no
            })
        }
    }

    addSurgerySchedule(body) {
        fetch(baseUrl + 'schedule/add-sur-schedule/', {
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
                    alert(response.errorMessage);
                }
                else if (response.success) {
                    alert(response.message);
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
                //dispatch(scheduleFailure(err.message));
            });
    }


    handleAddSchedule(timeID, dateString, docID, room_no) {
        let creds = JSON.parse(this.props.User.creds);
        console.log(docID);
        // this.props.addSurgerySchedule({
        //     'userID': creds.userId, 'token': this.props.User.token,
        //     'inchargeDocID': docID, 'room_no': room_no, 'appnt_serial_no': this.props.ScheduleSurgeryTable.app_sl_no,
        //     'timeID': timeID, 'selectedDate': dateString, 'duration': 2,
        //     'patient_id': this.props.ScheduleSurgeryTable.patientData.id,
        //     'surgery_result_id': this.props.surgery_result_id
        // })

        this.addSurgerySchedule({
            'userID': creds.userId, 'token': this.props.User.token,
            'inchargeDocID': docID, 'room_no': room_no, 'appnt_serial_no': this.props.ScheduleSurgeryTable.app_sl_no,
            'timeID': timeID, 'selectedDate': dateString, 'duration': 2,
            'patient_id': this.props.ScheduleSurgeryTable.patientData.id,
            'surgery_result_id': this.props.surgery_result_id
        })
    }

    renderReceptionistSurSchedule() {
        const { classes } = this.props;
        //const copyRight = this.Copyright();
        if (this.props.User.isAuthenticated && this.props.User.category === 'RECEPTIONIST') {
            if (this.state.redirect) {
                return (<Redirect to={`/receptionist/approve-service/${this.props.diagnosisID}`} />);
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

                            {this.props.ScheduleSurgeryTable.patientData !== null ?
                                <Card style={{ marginBottom: 20 }}>
                                    <CardContent>
                                        <Typography variant="h6">PatientName: {this.props.ScheduleSurgeryTable.patientData.name} </Typography>
                                        <Typography variant="body1">Email: {this.props.ScheduleSurgeryTable.patientData.email}</Typography>
                                        <Typography variant="body1">Phone Number: {this.props.ScheduleSurgeryTable.patientData.phone}</Typography>
                                        <Typography variant="body1">Gender: {this.props.ScheduleSurgeryTable.patientData.gender}</Typography>
                                        <Typography variant="body1">Age: {this.props.ScheduleSurgeryTable.patientData.age}</Typography>
                                    </CardContent>
                                </Card> :
                                null
                            }

                            {this.props.ScheduleSurgeryTable.appntDocData !== null ?
                                <Card style={{ marginBottom: 20 }}>
                                    <CardContent>
                                        <Typography variant="h6">Appointment Made to Doctor: {this.props.ScheduleSurgeryTable.appntDocData.name} </Typography>
                                        <Typography variant="body1">Department: {this.props.ScheduleSurgeryTable.appntDocData.department}</Typography>
                                    </CardContent>
                                </Card> :
                                null
                            }

                            {this.props.ScheduleSurgeryTable.appntDocData !== null ?
                                <div className={classes.button}>
                                    <Button variant="outlined" color="primary" onClick={() => this.setDocPrev()}>Select schedule</Button>

                                    {/* <Button variant="outlined" color="primary" onClick={() => this.setDocPrev()}>Select Appointment Doctor in Charge of Surgery</Button> */}
                                    {/* <Button variant="outlined" color="primary" onClick={() => this.setDocNew()}>Assign New Doctor For Surgery</Button> */}
                                </div> : null
                            }

                            {(this.state.docSelectionOpt1 !== null) &&
                                <Card style={{ padding: 20 }}>
                                    <AddSurSchedule
                                        docSelectionOpt1={this.state.docSelectionOpt1}
                                        fetchDocList={(date) => this.fetchDocList(date)}
                                        fetchRoomList={(date, time) => this.fetchRoomList(date, time)}
                                        handleAddSchedule={(timeID, dateString, docID, room_no) => this.handleAddSchedule(timeID, dateString, docID, room_no)}
                                        ScheduleSurgeryTable={this.props.ScheduleSurgeryTable}
                                    />
                                </Card>
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
        const receptionistSurSchedule = this.renderReceptionistSurSchedule();
        return (
            <React.Fragment>
                {receptionistSurSchedule}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ReceptionistSurSchedule);