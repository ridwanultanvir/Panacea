import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { baseUrl } from '../../Redux/ActionCreator';
import { withStyles, FormControl, InputLabel, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import ScheduleTable from './ScheduleTable';

const styles = (theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: 220
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
})

class SelectDoctorForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            departments: [],
            doctors: [],
            selectedDepartment: null,
            selectedDoctor: null
        }

        this.fetchDepartments = this.fetchDepartments.bind(this);
        this.handleSelectDepartment = this.handleSelectDepartment.bind(this);
        this.handleSelectDoctor = this.handleSelectDoctor.bind(this);
        this.showDocInfo = this.showDocInfo.bind(this);
        this.fetchAllDoctorsInADept = this.fetchAllDoctorsInADept.bind(this);
        this.handleProblemDescription = this.handleProblemDescription.bind(this);
    }

    fetchDepartments() {

        fetch(baseUrl + 'appointment/get-departments/')
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
                    this.props.setDepartments(response.departments);
                }
                else {
                    let err = new Error(response.errorMessage);
                    err.response = response;
                    throw err;
                }
            })

    }

    fetchAllDoctorsInADept(departmentName) {
        let body = { 'dept_name': departmentName };
        fetch(baseUrl + 'appointment/get-all-doctors/', {
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
                    console.log('ulala1')
                    let err = new Error('Error ' + response.status + ': ' + response.statusText);
                    err.response = response;
                    throw err;
                }
            })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    this.props.setDoctors(response.doctors)
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

    fetchSchedule(docID) {
        let body = { 'docID': docID }
        fetch(baseUrl + 'appointment/get-schedule/', {
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
                    console.log('ulala1')
                    let err = new Error('Error ' + response.status + ': ' + response.statusText);
                    err.response = response;
                    throw err;
                }
            })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    this.props.setSchedule(response.scheduleData);
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


    handleSelectDepartment(event) {
        this.props.setSelectedDepartment(event.target.value);
        this.fetchAllDoctorsInADept(event.target.value);
    }

    handleSelectDoctor(event) {
        this.props.setSelectedDoctor(event.target.value);
        let docID = this.props.doctors.filter((doc) => doc.name === event.target.value)[0].id
        this.props.setSelectedDoctorID(docID);
        console.log(docID);
        this.fetchSchedule(docID);
    }

    handleProblemDescription(event) {
        this.props.setProblemDescription(event.target.value);
    }

    componentDidMount() {
        this.fetchDepartments();
    }

    showDocInfo() {
        if (this.props.selectedDoctor !== '') {
            let doctor = this.props.doctors.filter((doc) => doc.name === this.props.selectedDoctor)[0];
            if (doctor) {
                return (
                    <Card style={{ padding: 20 }}>
                        <CardContent>
                            <Typography variant='h6'>
                                {doctor.name}
                            </Typography>
                            <Typography variant='body1'>
                                Designation: {doctor.designation}
                            </Typography>
                            <Typography variant='body1'>
                                Qualification: {doctor.qualification}
                            </Typography>
                        </CardContent>
                    </Card>
                );
            }
            else {
                return null;
            }

        }
        else {
            return null;
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Select doctor
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Department
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value={this.props.selectedDepartment}
                                onChange={this.handleSelectDepartment}
                                displayEmpty
                                className={classes.selectEmpty}
                            // onBlur={(event) => console.log(event.target.value)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {this.props.departments.length === 0 ? <MenuItem value="">Loading</MenuItem> :
                                    this.props.departments.map((dept) => <MenuItem value={dept}>{dept}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Doctor
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value={this.props.selectedDoctor}
                                onChange={this.handleSelectDoctor}
                                displayEmpty
                                className={classes.selectEmpty}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {this.props.doctors.length === 0 ? <MenuItem value="">Loading</MenuItem> :
                                    this.props.doctors.map((doctor) => <MenuItem value={doctor.name}>{doctor.name}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        {this.showDocInfo()}
                    </Grid>
                    <Grid item xs={12}>

                        {this.props.schedule.length === 0 ? <Card style={{ padding: 20 }}><Typography variant='body1'>No schedule available</Typography></Card> :
                            <ScheduleTable
                                schedule={this.props.schedule}
                                patientUserID={this.props.patientUserID}
                                setSelectedSchedule={this.props.setSelectedSchedule}
                                newPatient={this.props.newPatient}
                                setScheduleMarked={this.props.setScheduleMarked}
                            />
                        }

                    </Grid>
                    {/* <Grid item xs={12} md={6}>
                        <TextField required id="expDate" label="Expiry date" fullWidth autoComplete="cc-exp" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cvv"
                            label="CVV"
                            helperText="Last three digits on signature strip"
                            fullWidth
                            autoComplete="cc-csc"
                        />
                    </Grid> */}
                    {/* <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
                            label="Remember credit card details for next time"
                        />
                    </Grid> */}
                    <Grid item xs={12}>
                        <TextField
                            id="standard-textarea"
                            label="Problem description"
                            placeholder="Placeholder"
                            multiline
                            onBlur={this.handleProblemDescription}
                            style={{ width: 550 }}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>

        );
    }
}

export default withStyles(styles)(SelectDoctorForm);

