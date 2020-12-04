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
import {FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import { Redirect } from 'react-router-dom';
import { Form } from 'react-redux-form';
import { TextField, Button, CardContent, Card } from '@material-ui/core';
import CopyRight from '../../Copyright';
import SelectIncharge from './InchargeSelectorTable'

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
    selectEmpty: {
        marginTop: theme.spacing(2),
    },

    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: 560
    },
});


class PutInCharge extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wardList: null,
            userID: null,
            userData: null,
            wardTypeSelected: null,
            wardTypeList: null,
            ward: null,
        };

        this.renderPutInCharge = this.renderPutInCharge.bind(this);
        this.setUserID = this.setUserID.bind(this);
        this.fetchRoomList = this.fetchRoomList.bind(this);
        //this.loadWardList = this.loadWardList.bind(this);
        this.handleUserIDSubmit = this.handleUserIDSubmit.bind(this);
        this.handleAdmitPatient = this.handleAdmitPatient.bind(this);
        this.loadWardCategory = this.loadWardCategory.bind(this);
        this.handleSelectWard = this.handleSelectWard.bind(this);
    }



    componentDidMount() {
        let creds = JSON.parse(this.props.User.creds);
        this.loadWardCategory(creds.userId);
    }

    loadWardCategory(userID) {
        let body = {
            'userID': userID,
            'token': "token",
        }
        let baseUrl = 'http://localhost:8000/';
        fetch(baseUrl + 'schedule/ward-category/', {
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
                if (response.success) {
                    //alert(response.alertMessage);
                    let wardTypeListTemp = response.wardCategory;
                    wardTypeListTemp = response.wardCategory.map((block) => {
                        return (<MenuItem value={block.CATEGORY}>{block.CATEGORY}</MenuItem>)
                    })
                    this.setState({wardTypeList: wardTypeListTemp});
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

    handleSelectWard(event) {
        this.setState({wardTypeSelected: event.target.value});
        let body = {
            'block-category': event.target.value, 
        }
        let baseUrl = 'http://localhost:8000/';
        fetch(baseUrl + 'schedule/block-ids-per-category/', {
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
                if (response.success) {
                    //alert(response.alertMessage);
                    let wardListTemp = null;
                    wardListTemp = response.blocks.map((block) => {
                        return (<MenuItem value={block.block_id}>{block.block_id}</MenuItem>)
                    })
                    this.setState({wardList: wardListTemp});
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

    setUserID(patID) {
        this.setState({patientID: patID})
    }

    fetchRoomList(category,type) {
        //console.log("fetching", category);
        this.props.loadAdmitRoomData({'admission':true, 'category':category, 'type': type});
    }

    fetchRoomTypes(category) {
        this.props.loadRoomTypes({'category': category})
    }

    // loadWardList() {
    //     let wardCatTemp = null;
        
    //     wardCatTemp = this.props.WardTable.wardCategory.map((block) => {
    //         return (<MenuItem value={block.CATEGORY}>{block.CATEGORY}</MenuItem>);
    //     });
    //     this.setState({wardCategory:wardCatTemp });
        
    // }

    handleUserIDSubmit() {
        let body = {
            'userID': this.state.patientID,
            'request-sender-category': this.props.User.category,
        };
        let baseUrl = 'http://localhost:8000/';
        fetch(baseUrl + 'schedule/time-table/', {
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
                if (response.success) {
                    this.setState({userData: response.userData})
                    console.log(response.userData);
                }
                else {
                    let err = new Error(response.alertMessage);
                    err.response = response;
                    throw err;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    }
    
    
    handleAdmitPatient(room_no, dateString) {
        console.log(this.state.patientID, dateString, room_no);
        this.props.addAdmitPatient({'patientID': this.state.patientID, 'date': dateString, 'room_no': room_no});
        // let body = {
        //     'patientID': this.state.patientID,
        //     'date': dateString,
        //     'room_no': room_no
        // };
        // let baseUrl = 'http://localhost:8000/';
        // fetch(baseUrl + 'schedule/time-table/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(body)
        // })
        //     .then((response) => {
                
        //         if (response.ok) {
        //             console.log('1st part')
        //             return response;
        //         }
        //         else {
        //             let err = new Error('Error ' + response.status + ': ' + response.statusText);
        //             err.response = response;
        //             console.log('throwing ')
        //             throw err;
        //         }
        //     })
        //     .then((response) => response.json())
        //     .then((response) => {
        //         console.log('2nd part')
        //         if (response.success) {
        //             alert(response.alertMessage);
        //         }
        //         else {
        //             let err = new Error(response.errorMessage);
        //             err.response = response;
        //             throw err;
        //         }
        //     })
        //     .catch((err) => {
        //         console.log("printing error");
        //         alert(err.message);
        //     });
    }

    renderPutInCharge() {
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
                            
                            {this.state.wardTypeList !== null &&
                                <div>
                                    <Card style={{ padding: 20 }}>
                                    <FormControl className={classes.formControl}>
                                        {/* <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                            Select Ward Category:
                                        </InputLabel> */}
                                        <Typography variant="h6" noWrap>
                                            Select Ward Category:
                                        </Typography>
                                        <Select
                                            labelId="demo-simple-select-placeholder-label-label"
                                            id="demo-simple-select-placeholder-label"
                                            value={this.state.wardTypeSelected}
                                            onChange={(event) => this.handleSelectWard(event)}
                                            displayEmpty
                                            className={classes.selectEmpty}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {this.state.wardTypeList} 
                                        </Select>
                                    </FormControl>
                                    </Card>
                                </div>
                            }

                            {this.state.wardList !== null &&
                                <div>
                                    <SelectIncharge
                                        wardList = {this.state.wardList}
                                    />
                                </div>
                            }

                            {/* {this.props.AdmitPatientTable.patientData !== null ?
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
                            } */}


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
        const receptionistputInCharge = this.renderPutInCharge();
        return (
            <React.Fragment>
                {receptionistputInCharge}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(PutInCharge);