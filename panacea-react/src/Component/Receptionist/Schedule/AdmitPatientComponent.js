import React, { Component } from 'react';
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
import MenuItem from '@material-ui/core/MenuItem';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import { Redirect } from 'react-router-dom';
import { Form } from 'react-redux-form';
import { TextField, Button, CardContent, Card } from '@material-ui/core';
import { loadWardCategory } from '../../../Redux/ActionCreator';
import AddPatRoom from './AdmitPatSelect'
import CopyRight from '../../Copyright';


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


class ReceptionistAdmitPatient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            admitDate:null,
            patientID: null,
            ward: null,
            wardCategory: null
        };

        this.renderReceptionistAdmitPatient = this.renderReceptionistAdmitPatient.bind(this);
        this.setPatientID = this.setPatientID.bind(this);
        this.fetchRoomList = this.fetchRoomList.bind(this);
        this.loadWardList = this.loadWardList.bind(this);
        this.handlePatIDSubmit = this.handlePatIDSubmit.bind(this);
        this.handleAdmitPatient = this.handleAdmitPatient.bind(this);
    }



    componentDidMount() {
        let creds = JSON.parse(this.props.User.creds);
        //this.props.loadTimeTable({ 'userID': creds.userId, 'token': this.props.User.token });
        this.props.loadWardCategory({'userID': creds.userId, 'token': this.props.User.token, 
                                    'bypass': true, 'admission': true});
    }

    setPatientID(patID) {
        this.setState({patientID: patID})
        this.loadWardList();
    }

    fetchRoomList(category,type) {
        //console.log("fetching", category);
        this.props.loadAdmitRoomData({'admission':true, 'category':category, 'type': type});
    }

    fetchRoomTypes(category) {
        this.props.loadRoomTypes({'category': category})
    }

    loadWardList() {
        let wardCatTemp = null;
        
        wardCatTemp = this.props.WardTable.wardCategory.map((block) => {
            return (<MenuItem value={block.CATEGORY}>{block.CATEGORY}</MenuItem>);
        });
        this.setState({wardCategory:wardCatTemp });
        
    }

    handlePatIDSubmit() {
        let creds = JSON.parse(this.props.User.creds);
        this.props.patientDetails({'userID': creds.userID, 'patientID': this.state.patientID});
        loadWardCategory();
    }
    
    
    handleAdmitPatient(room_no, dateString) {
        //console.log(this.state.patientID, dateString, room_no);
        this.props.addAdmitPatient({'patientID': this.state.patientID, 'date': dateString, 'room_no': room_no});
    }

    renderReceptionistAdmitPatient() {
        const { classes } = this.props;
        if (this.props.User.isAuthenticated && this.props.User.category === 'RECEPTIONIST') {
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
                            <Typography variant="h5">
                                Patient ID:
                            </Typography>
                            <Form model='AdminScheduleUserID' onSubmit={() => this.handlePatIDSubmit()}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="patient-id"
                                    label="Patient ID"
                                    name="Patient ID"
                                    autoComplete="Patient ID"
                                    autoFocus
                                    onChange={(event) => this.setPatientID(event.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    View Details
                                </Button>
                            </Form>

                            {this.props.AdmitPatientTable.patientData !== null ?
                                (<div><Card style={{ marginBottom: 20 }}>
                                    <CardContent>
                                        <Typography variant="h6">Patient Name: {this.props.AdmitPatientTable.patientData.name} </Typography>
                                        <Typography variant="body1">Email: {this.props.AdmitPatientTable.patientData.email}</Typography>
                                        <Typography variant="body1">Phone Number: {this.props.AdmitPatientTable.patientData.phone}</Typography>
                                        <Typography variant="body1">Gender: {this.props.AdmitPatientTable.patientData.gender}</Typography>
                                        <Typography variant="body1">Age: {this.props.AdmitPatientTable.patientData.age}</Typography>
                                    </CardContent>
                                </Card> 
                                    <Card style={{ padding: 20 }}>
                                    <AddPatRoom
                                        wardList = {this.state.wardCategory}
                                        fetchRoomList = {(category, type) => this.fetchRoomList(category, type)} 
                                        fetchRoomTypes = {(category) => this.fetchRoomTypes(category)}
                                        AdmitPatientTable={this.props.AdmitPatientTable}
                                        handleAdmitPatient = {(room_no, dateString) => this.handleAdmitPatient(room_no, dateString)}
                                    />
                                </Card></div>):
                                null
                            }

                            

                            <Box pt={4}>
                                <CopyRight/>
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
        const receptionistAdmitPatient = this.renderReceptionistAdmitPatient();
        return (
            <React.Fragment>
                {receptionistAdmitPatient}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ReceptionistAdmitPatient);