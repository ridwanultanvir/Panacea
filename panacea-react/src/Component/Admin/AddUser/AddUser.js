import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
    withStyles, AppBar, Drawer, Toolbar, List,
    Divider, CssBaseline, Typography, Card, Container, Grid, Box, Link, TextField,
    FormControl, NativeSelect, Button
} from '@material-ui/core';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import CopyRight from '../../Copyright';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
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
});

class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: null,
            lastName: null,
            address: null,
            email: null,
            phoneNumber: null,
            category: null,
            dateOfBirth: new Date(),
            gender: 'M',

            docValues: false,
            doc_hire_date: new Date(),
            docDept: "CARDIOLOGY",
            docDesignation: "Consultant",
            docDeptHead: null,
            qualification: null,

            empValues: false,
            empHireDate: new Date(),
            empSalary: null,
            empEducation: null,
            empCommission: null,
            empTraining: null
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.renderPage = this.renderPage.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDocHireDate = this.handleDocHireDate.bind(this);
        this.handleEmpHireDate = this.handleEmpHireDate.bind(this);

        this.selectInput = React.createRef();
        this.selectInput1 = React.createRef();

        this.firstName = React.createRef();
        this.lastName = React.createRef();
        this.address = React.createRef();
        this.email = React.createRef();
        this.phoneNumber = React.createRef();
        this.category = React.createRef();
        this.dateOfBirth = React.createRef();
        this.gender = React.createRef();

        this.docHireDate = React.createRef();
        this.docDept = React.createRef();
        this.docDesignation = React.createRef();
        this.docdeptHead = React.createRef();
        this.docQualification = React.createRef();

        this.empHireDate = React.createRef();
        this.empSalary = React.createRef();
        this.empEducation = React.createRef();
        this.empCommision = React.createRef();
        this.empTraining = React.createRef();
    }

    handleLogout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('creds');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('userCategory');
    }

    handleDateChange(date) {
        this.setState({ dateOfBirth: date });
    }
    handleDocHireDate(date) {
        this.setState({ doc_hire_date: date });
    }
    handleEmpHireDate(date) {
        this.setState({ empHireDate: date });
    }

    fetchData(body) {
        fetch(baseUrl + 'user/admin/add-user/', {
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
                    alert(response.message);
                    this.firstName.current.value = '';
                    this.lastName.current.value = '';
                    this.address.current.value = '';
                    this.email.current.value = '';
                    this.phoneNumber.current.value = '';
                    this.category.current.value = null;
                    this.gender.current.value = 'M';
                    this.setState({ dateOfBirth: new Date() })

                    if (this.state.docValues) {
                        this.setState({ docHireDate: new Date() });
                        this.docDept.current.value = "CARDIOLOGY";
                        this.docDesignation.current.value = "Consultant";
                        this.docdeptHead.current.value = '';
                        this.docQualification.current.value = '';
                        this.setState({ docValues: false });
                    }


                    if (this.state.empValues) {
                        this.setState({ empHireDate: new Date() });
                        this.empSalary.current.value = '';
                        this.empEducation.current.value = '';
                        this.empCommision.current.value = '';
                        this.empTraining.current.value = '';
                        this.setState({ empValues: false });
                    }

                }
                else {
                    let err = new Error(response.errorMessage);
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

        if (this.state.category === 'doctor') {
            let dateOfBirth = this.state.dateOfBirth;
            let hireDate = this.state.doc_hire_date;
            let body = {
                'userID': creds.userId, 'token': this.props.User.token,
                'firstName': this.state.firstName, 'lastName': this.state.lastName,
                'address': this.state.address, 'email': this.state.email,
                'phoneNumber': this.state.phoneNumber, 'category': this.state.category,
                'dateOfBirth': dateOfBirth.getDate().toString() + '-' + (dateOfBirth.getMonth() + 1).toString() + '-' + dateOfBirth.getFullYear().toString(),
                'gender': this.state.gender,
                'hireDate': hireDate.getDate().toString() + '-' + (hireDate.getMonth() + 1).toString() + '-' + hireDate.getFullYear().toString(),
                'department': this.state.docDept,
                'designation': this.state.docDesignation, 'departmentHead': this.state.docDeptHead,
                'qualification': this.state.qualification
            }

            this.fetchData(body);
        }
        else if (this.category !== null) {
            let dateOfBirth = this.state.dateOfBirth;
            let hireDate = this.state.empHireDate;
            let body = {
                'userID': creds.userId, 'token': this.props.User.token,
                'firstName': this.state.firstName, 'lastName': this.state.lastName,
                'address': this.state.address, 'email': this.state.email,
                'phoneNumber': this.state.phoneNumber, 'category': this.state.category,
                'dateOfBirth': dateOfBirth.getDate().toString() + '-' + (dateOfBirth.getMonth() + 1).toString() + '-' + dateOfBirth.getFullYear().toString(),
                'gender': this.state.gender,
                'hireDate': hireDate.getDate().toString() + '-' + (hireDate.getMonth() + 1).toString() + '-' + hireDate.getFullYear().toString(),
                'salary': this.state.empSalary,
                'education': this.state.empEducation, 'commission': this.state.empCommission,
                'training': this.state.empTraining
            }
            this.fetchData(body);
        }
    }

    renderPage() {

        const { classes } = this.props;

        if (this.props.User.isAuthenticated && this.props.User.category === 'admin') {
            let userData = JSON.parse(this.props.User.userData);
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Doctor
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
                                <Grid item xs={12}>
                                    <Card style={{ padding: 40, width: 900, marginLeft: 120 }}>
                                        <Typography variant='h6'>User details</Typography>
                                        <TextField
                                            required
                                            inputRef={this.firstName}
                                            id="standard-basic"
                                            label="First name"
                                            onBlur={(event) => { this.setState({ firstName: event.target.value }) }}
                                            style={{ width: 400 }}
                                        />
                                        <TextField
                                            required
                                            inputRef={this.lastName}
                                            id="standard-basic"
                                            label="Last name"
                                            onBlur={(event) => { this.setState({ lastName: event.target.value }) }}
                                            style={{ width: 400, marginLeft: 20 }}
                                        />
                                        <TextField
                                            required
                                            inputRef={this.address}
                                            id="standard-basic"
                                            label="Address"
                                            onBlur={(event) => { this.setState({ address: event.target.value }) }}
                                            style={{ width: 820, marginTop: 10 }}
                                        />
                                        <TextField
                                            required
                                            inputRef={this.email}
                                            id="standard-basic"
                                            label="Email"
                                            onBlur={(event) => { this.setState({ email: event.target.value }) }}
                                            style={{ width: 820, marginTop: 10 }}
                                        />

                                        <div style={{ display: "flex", marginTop: 20 }}>
                                            <TextField
                                                inputRef={this.phoneNumber}
                                                required
                                                id="standard-basic"
                                                label="Phone number"
                                                onBlur={(event) => { this.setState({ phoneNumber: event.target.value }) }}
                                                style={{ width: 400 }}
                                            />
                                            <FormControl className={classes.formControl} style={{ width: 400, marginTop: 16, marginLeft: 20 }}>
                                                <NativeSelect
                                                    inputRef={this.category}
                                                    defaultValue={null}
                                                    inputProps={{
                                                        name: 'name',
                                                        id: 'uncontrolled-native',
                                                    }}
                                                    onChange={(event) => { this.setState({ category: event.target.value }) }}
                                                >
                                                    <option value={null}>None</option>
                                                    <option value={'doctor'}>Doctor</option>
                                                    <option value={'GUARD'}>Guard</option>
                                                    <option value={'NURSE'}>Nurse</option>
                                                    <option value={'WARD_BOY'}>Ward boy</option>
                                                    <option value={'TECHNICIAN'}>Technician</option>
                                                    <option value={'RECEPTIONIST'}>Receptionist</option>
                                                </NativeSelect>
                                            </FormControl>
                                        </div>
                                        <div style={{ display: "flex", marginTop: 20 }}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    required
                                                    id="date-of-birth"
                                                    label="Date of birth"
                                                    format="dd/MM/yyyy"
                                                    value={this.state.dateOfBirth}
                                                    onChange={this.handleDateChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    style={{ width: 400 }}
                                                />
                                            </MuiPickersUtilsProvider>
                                            <FormControl className={classes.formControl} style={{ width: 400, marginTop: 16, marginLeft: 20 }}>
                                                <NativeSelect
                                                    inputRef={this.gender}
                                                    defaultValue={'M'}
                                                    inputProps={{
                                                        name: 'name',
                                                        id: 'uncontrolled-native',
                                                    }}
                                                    onChange={(event) => { this.setState({ gender: event.target.value }) }}
                                                >
                                                    <option value={'F'}>Female</option>
                                                    <option value={'M'}>Male</option>
                                                </NativeSelect>
                                            </FormControl>
                                        </div>
                                    </Card>
                                </Grid>


                                <Grid item xs={12}>
                                    <Card style={{ padding: 40, width: 900, marginLeft: 120 }}>
                                        {this.state.category === null ? null :
                                            (this.state.category === 'doctor' ?
                                                <div>
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <KeyboardDatePicker
                                                            required
                                                            id="Hire-date"
                                                            label="Hire date"
                                                            format="dd/MM/yyyy"
                                                            value={this.state.doc_hire_date}
                                                            onChange={this.handleDocHireDate}
                                                            KeyboardButtonProps={{
                                                                'aria-label': 'change date',
                                                            }}
                                                            style={{ width: 400 }}
                                                        />
                                                    </MuiPickersUtilsProvider>
                                                    <FormControl className={classes.formControl} style={{ width: 400, marginTop: 16, marginLeft: 20 }}>
                                                        <NativeSelect
                                                            inputRef={this.docDept}
                                                            defaultValue={"CARDIOLOGY"}
                                                            inputProps={{
                                                                name: 'name',
                                                                id: 'uncontrolled-native',
                                                            }}
                                                            onChange={(event) => { this.setState({ docDept: event.target.value }) }}
                                                        >
                                                            <option value={"ANESTHESIOLOGY"}>ANESTHESIOLOGY</option>
                                                            <option value={'DERMATOLOGY'}>DERMATOLOGY</option>
                                                            <option value={'NEUROLOGY'}>NEUROLOGY</option>
                                                            <option value={'GYNECOLOGY'}>GYNECOLOGY</option>
                                                            <option value={'OPHTHALMOLOGY'}>OPHTHALMOLOGY</option>
                                                            <option value={'PATHOLOGY'}>PATHOLOGY</option>
                                                            <option value={'PEDIATRICS'}>PEDIATRICS</option>
                                                            <option value={'PSYCHIATRY'}>PSYCHIATRY</option>
                                                            <option value={'SURGERY'}>SURGERY</option>
                                                            <option value={'UROLOGY'}>UROLOGY</option>
                                                            <option value={'CARDIOLOGY'}>CARDIOLOGY</option>
                                                        </NativeSelect>
                                                    </FormControl>

                                                    <FormControl className={classes.formControl} style={{ width: 400, marginTop: 16 }}>
                                                        <NativeSelect
                                                            inputRef={this.docDesignation}
                                                            defaultValue={"Consultant"}
                                                            inputProps={{
                                                                name: 'name',
                                                                id: 'uncontrolled-native',
                                                            }}
                                                            onChange={(event) => { this.setState({ docDesignation: event.target.value }) }}
                                                        >
                                                            <option value={"Consultant"}>Consultant</option>
                                                            <option value={'Associate specialist'}>Associate specialist</option>
                                                            <option value={'Specialist'}>Specialist</option>
                                                            <option value={'Registrar'}>Registrar</option>
                                                            <option value={'Intern'}>Intern</option>
                                                        </NativeSelect>
                                                    </FormControl>
                                                    <TextField
                                                        required
                                                        inputRef={this.docdeptHead}
                                                        id="standard-basic"
                                                        label="Department head id"
                                                        onBlur={(event) => { this.setState({ docDeptHead: event.target.value }) }}
                                                        style={{ width: 400, marginLeft: 20 }}
                                                    />
                                                    <TextField
                                                        required
                                                        inputRef={this.docQualification}
                                                        id="standard-basic"
                                                        label="Qalification"
                                                        onBlur={(event) => { this.setState({ qualification: event.target.value, docValues: true }) }}
                                                        style={{ width: 820, marginTop: 10 }}
                                                    />

                                                </div> :
                                                <div>
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <KeyboardDatePicker
                                                            required
                                                            id="Hire-date"
                                                            label="Hire date"
                                                            format="dd/MM/yyyy"
                                                            value={this.state.empHireDate}
                                                            onChange={this.handleEmpHireDate}
                                                            KeyboardButtonProps={{
                                                                'aria-label': 'change date',
                                                            }}
                                                            style={{ width: 400 }}
                                                        />
                                                    </MuiPickersUtilsProvider>
                                                    <TextField
                                                        inputRef={this.empSalary}
                                                        required
                                                        id="standard-basic"
                                                        label="Salary"
                                                        onBlur={(event) => { this.setState({ empSalary: event.target.value }) }}
                                                        style={{ width: 400, marginLeft: 20 }}
                                                    />
                                                    <TextField
                                                        inputRef={this.empEducation}
                                                        required
                                                        id="standard-basic"
                                                        label="Education"
                                                        onBlur={(event) => { this.setState({ empEducation: event.target.value }) }}
                                                        style={{ width: 400 }}
                                                    />
                                                    <TextField
                                                        required
                                                        inputRef={this.empCommision}
                                                        id="standard-basic"
                                                        label="Commision percentage"
                                                        onBlur={(event) => { this.setState({ empCommission: event.target.value }) }}
                                                        style={{ width: 400, marginLeft: 20 }}
                                                    />
                                                    <TextField
                                                        required
                                                        inputRef={this.empTraining}
                                                        id="standard-basic"
                                                        label="Training"
                                                        onBlur={(event) => { this.setState({ empTraining: event.target.value, empValues: true }) }}
                                                        style={{ width: 820, marginTop: 10 }}
                                                    />
                                                </div>
                                            )
                                        }
                                    </Card>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button variant='contained' style={{ marginLeft: 120 }} onClick={() => { this.handleConfirm() }}>Confirm</Button>
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
        const page = this.renderPage();
        return (
            <React.Fragment>
                {page}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(AddUser);