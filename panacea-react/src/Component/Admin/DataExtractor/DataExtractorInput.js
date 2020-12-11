import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
    withStyles, AppBar, Drawer, Toolbar, List,
    Divider, CssBaseline, Typography, Card, Container, Grid, Box, Link, TextField,
    FormControl, NativeSelect, Button, InputLabel, MenuItem, Select
} from '@material-ui/core';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import CopyRight from '../../Copyright';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import DataDisplayTable from './DataDisplayTable';
import { baseUrl } from '../../../Redux/ActionCreator';


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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: 560
    },
});

class DataExtractorInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            serial: null,
            patientID: null,
            docID: null,
            displayTable: false,
            date_range: null,
            employeeID: null,
            wardCategory: null,
            sch_on_Date: new Date(),

            table_header: null,
            table_data: null,
            wardTypeList: null,
            wardSelForDets: null,
            switch9: false,
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.renderDataExtractorInput = this.renderDataExtractorInput.bind(this);
        this.loadWardCategory = this.loadWardCategory.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleLogout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('creds');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('userCategory');
    }

    componentDidMount() {
        this.setState({ serial: this.props.serial });
        // console.log(this.props.serial);
        this.loadWardCategory();
    }

    loadWardCategory() {
        let creds = JSON.parse(this.props.User.creds);
        let userID = creds.userId;
        let body = {
            'userID': userID,
            'token': this.props.User.token,
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
                    this.setState({ wardTypeList: wardTypeListTemp });
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


    fetchData(body, url) {
        fetch(baseUrl + url, {
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
                    console.log(response);
                    if (response.switch9 === true) {
                        this.setState({
                            switch9: true,
                            employeeHeader: response.employeeHeader,
                            patientHeader: response.patientHeader,
                            inchargeInfo: response.inchargeInfo,
                            patientInWard: response.patientInWard,
                            employeeInWard: response.employeeInWard,
                        });
                    }
                    else {
                        this.setState({ table_header: response.tableHeader, table_data: response.tableData });
                        this.setState({ displayTable: true });
                    }
                    
                }
                else {
                    let err = new Error(response.alertMessage);
                    err.response = response;
                    throw err;
                }
            })
            .catch((err) => {
                alert(err.message)
            });
    }

    handleConfirm() {
        let creds = JSON.parse(this.props.User.creds);
        let body = null;
        if (this.state.serial == "1") {
            if (this.state.patientID === null || this.state.date_range === null) {
                alert("Please Fill All The Boxes Properly!");
                return;
            }
            body = {
                'userID': creds.userId, 'token': this.props.User.token,
                'patientID': this.state.patientID, 'date_range': this.state.date_range,
            }
            let url = 'appointment/get-appnt-for-patient/';
            this.fetchData(body, url);
        }
        else if (this.state.serial == "2") {
            if (this.state.patientID === null || this.state.date_range === null) {
                alert("Please Fill All The Boxes Properly!");
                return;
            }
            body = {
                'userID': creds.userId, 'token': this.props.User.token,
                'patientID': this.state.patientID, 'date_range': this.state.date_range,
            }
            let url = 'appointment/get-appnt-for-patient';
            //this.fetchData(body, url);
            this.setState({ displayTable: true });

        }
        else if (this.state.serial == "3") {
            if (this.state.docID === null) {
                alert("Please Fill All The Boxes Properly!");
                return;
            }
            body = {
                'userID': creds.userId, 'token': this.props.User.token,
                'docID': this.state.docID,
            }
            let url = 'appointment/get-appnt-under-doc/';
            this.fetchData(body, url);

        }
        else if (this.state.serial == "4") {
            if (this.state.docID === null) {
                alert("Please Fill All The Boxes Properly!");
                return;
            }
            body = {
                'userID': creds.userId, 'token': this.props.User.token,
                'docID': this.state.docID,
            }
            let url = 'checkup/get-tests-under-doc/';
            this.fetchData(body, url);

        }
        else if (this.state.serial == "5") {
            if (this.state.employeeID === null) {
                alert("Please Fill All The Boxes Properly!");
                return;
            }
            body = {
                'userID': creds.userId, 'token': this.props.User.token,
                'employeeID': this.state.employeeID,
            }
            let url = 'schedule/get-schedule-for-employee/';
            this.fetchData(body, url);
        }
        else if (this.state.serial == "6") {
            if (this.state.wardCategory === null || this.state.sch_on_Date === null) {
                alert("Please Fill All The Boxes Properly!");
                return;
            }
            let month = this.state.sch_on_Date.getMonth() + 1;
            let date = this.state.sch_on_Date.getDate().toString() + '/' + month.toString() + '/' + this.state.sch_on_Date.getFullYear().toString()
            body = {
                'userID': creds.userId, 'token': this.props.User.token,
                'wardCategory': this.state.wardCategory, 'sch_on_date': date,
            }
            let url = 'schedule/schedule-on-date/';
            this.fetchData(body, url);

        }
        else if (this.state.serial == "9") {
            if (this.state.wardSelForDets === null) {
                alert("Please Fill All The Boxes Properly!");
                return;
            }
            let month = this.state.sch_on_Date.getMonth() + 1;
            let date = this.state.sch_on_Date.getDate().toString() + '/' + month.toString() + '/' + this.state.sch_on_Date.getFullYear().toString()
            body = {
                'userID': creds.userId, 'token': this.props.User.token,
                'blockID': this.state.wardSelForDets,
            }
            console.log(body['blockID'])
            let url = 'schedule/ward-details-disp/';
            this.fetchData(body, url);

        }
    }


    renderDataExtractorInput() {

        const { classes } = this.props;

        if (this.props.User.isAuthenticated && this.props.User.category === 'admin') {
            let userData = JSON.parse(this.props.User.userData);
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Admin
                            </Typography>
                            <Link color='inherit' href='http://localhost:3000/home' onClick={() => { this.handleLogout() }} style={{ marginLeft: 'auto' }}>
                                Logout
                            </Link>
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
                                {this.state.serial === "1" &&
                                    (
                                        <Grid item xs={12}>
                                            <Card style={{ padding: 40, width: 900, marginLeft: 10 }}>
                                                <Typography variant='h6' >Appointment Data For A Patient:</Typography>
                                                <TextField
                                                    value={this.state.patientID}
                                                    id="standard-textarea"
                                                    label="Patient ID"
                                                    onChange={(event) => { this.setState({ patientID: event.target.value }) }}
                                                    style={{ width: 600 }}
                                                />
                                                <div>
                                                    <FormControl className={classes.formControl} style={{ width: 600, marginTop: 10 }}>
                                                        <InputLabel id="demo-simple-select-label">Range of Time</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={this.state.date_range}
                                                            onChange={(event) => { this.setState({ date_range: event.target.value }) }}
                                                        >
                                                            <MenuItem value={7}>1 week</MenuItem>
                                                            <MenuItem value={15}>15 Days</MenuItem>
                                                            <MenuItem value={30}>1 Month</MenuItem>
                                                            <MenuItem value={-1}>All Time</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </Card>
                                        </Grid>
                                    )
                                }


                                {this.state.serial === "3" &&
                                    (
                                        <Grid item xs={12}>
                                            <Card style={{ padding: 40, width: 900, marginLeft: 10 }}>
                                                <Typography variant='h6' >Appointments Under A Doctor:</Typography>
                                                <TextField
                                                    value={this.state.docID}
                                                    id="standard-textarea"
                                                    label="Doctor's ID"
                                                    onChange={(event) => { this.setState({ docID: event.target.value }) }}
                                                    style={{ width: 600 }}
                                                />
                                            </Card>
                                        </Grid>
                                    )
                                }

                                {this.state.serial === "4" &&
                                    (
                                        <Grid item xs={12}>
                                            <Card style={{ padding: 40, width: 900, marginLeft: 10 }}>
                                                <Typography variant='h6' >Tests Recommended By Doctor:</Typography>
                                                <TextField
                                                    value={this.state.docID}
                                                    id="standard-textarea"
                                                    label="Doctor's ID"
                                                    onChange={(event) => { this.setState({ docID: event.target.value }) }}
                                                    style={{ width: 600 }}
                                                />
                                            </Card>
                                        </Grid>
                                    )
                                }

                                {this.state.serial === "5" &&
                                    (
                                        <Grid item xs={12}>
                                            <Card style={{ padding: 40, width: 900, marginLeft: 10 }}>
                                                <Typography variant='h6' >Schedule History:</Typography>
                                                <TextField
                                                    value={this.state.employeeID}
                                                    id="standard-textarea"
                                                    label="Employee's ID"
                                                    onChange={(event) => { this.setState({ employeeID: event.target.value }) }}
                                                    style={{ width: 600 }}
                                                />
                                            </Card>
                                        </Grid>
                                    )
                                }

                                {this.state.serial === "6" &&
                                    (
                                        <Grid item xs={12}>
                                            <Card style={{ padding: 40, width: 900, marginLeft: 120 }}>
                                                <Typography variant='h6'>Employees In a Ward Type On a Date</Typography>
                                                {this.state.wardTypeList !== null &&
                                                    (<div>
                                                        <FormControl className={classes.formControl}>
                                                            <Typography noWrap>
                                                                Select Ward Category:
                                                </Typography>
                                                            <Select
                                                                labelId="demo-simple-select-placeholder-label-label"
                                                                id="demo-simple-select-placeholder-label"
                                                                label="Select Ward"
                                                                value={this.state.wardTypeSelected}
                                                                onChange={(event) => { this.setState({ wardCategory: event.target.value }) }}
                                                                displayEmpty
                                                                className={classes.selectEmpty}
                                                            >
                                                                <MenuItem value="">
                                                                    <em>None</em>
                                                                </MenuItem>
                                                                {this.state.wardTypeList}
                                                            </Select></FormControl></div>)

                                                }
                                                <div style={{ display: "flex", marginTop: 20 }}>
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <KeyboardDatePicker
                                                            required
                                                            id="date-of-birth"
                                                            label="Date"
                                                            format="dd/MM/yyyy"
                                                            value={this.state.sch_on_Date}
                                                            onChange={(date) => { this.setState({ sch_on_Date: date }) }}
                                                            KeyboardButtonProps={{
                                                                'aria-label': 'change date',
                                                            }}
                                                            style={{ width: 400 }}
                                                        />
                                                    </MuiPickersUtilsProvider>
                                                </div>
                                            </Card>
                                        </Grid>
                                    )
                                }



                                {this.state.serial === "8" &&
                                    (
                                        <Grid item xs={12}>
                                            <Card style={{ padding: 40, width: 900, marginLeft: 120 }}>
                                                <Typography variant='h6'>Surgeries Performed</Typography>
                                                <div>
                                                    <FormControl className={classes.formControl} style={{ width: 600, marginTop: 10 }}>
                                                        <InputLabel id="demo-simple-select-label">Range of Time</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={this.state.date_range}
                                                            onChange={(event) => { this.setState({ date_range: event.target.value }) }}
                                                        >
                                                            <MenuItem value={1}>Today</MenuItem>
                                                            <MenuItem value={7}>1 week</MenuItem>
                                                            <MenuItem value={15}>15 Days</MenuItem>
                                                            <MenuItem value={30}>1 Month</MenuItem>
                                                            <MenuItem value={-1}>All Time</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </Card>
                                        </Grid>
                                    )
                                }


                                {this.state.serial === "9" &&
                                    (
                                        <Grid item xs={12}>
                                            <Card style={{ padding: 40, width: 900, marginLeft: 120 }}>
                                                <Typography variant='h6'>Ward Details</Typography>
                                                <TextField
                                                    value={this.state.wardSelForDets}
                                                    id="standard-textarea"
                                                    label="Block ID"
                                                    onChange={(event) => { this.setState({ wardSelForDets: event.target.value }) }}
                                                    style={{ marginLeft: 10, width: 600 }}
                                                />
                                            </Card>
                                        </Grid>
                                    )
                                }
                                <Grid item xs={12}>
                                    <Button variant='contained' color='primary' style={{ marginLeft: 10 }} onClick={() => { this.handleConfirm() }}>View</Button>
                                </Grid>

                                {this.state.displayTable === true &&
                                    (
                                        <Grid item xs={12}>
                                            <DataDisplayTable
                                                tableHeader={this.state.table_header}
                                                tableData={this.state.table_data}
                                            />
                                        </Grid>
                                    )
                                }

                                {this.state.switch9 === true &&
                                    (
                                        
                                        <Grid item xs={12}>
                                            <Typography variant='h6'>Employees/Doctor Working In This Ward Currently</Typography>
                                            <DataDisplayTable
                                                tableHeader={this.state.employeeHeader}
                                                tableData={this.state.employeeInWard}
                                            />
                                        
                                            <Typography variant='h6'>Patients In This Ward Currently</Typography>
                                        
                                            <DataDisplayTable
                                                tableHeader={this.state.patientHeader}
                                                tableData={this.state.patientInWard}
                                            />
                                        </Grid>
                                    )
                                }

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
        const dataExtractorInput = this.renderDataExtractorInput();
        return (
            <React.Fragment>
                {dataExtractorInput}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(DataExtractorInput);