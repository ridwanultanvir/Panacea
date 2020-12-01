import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PatientDetailForm from './PatientDetailForm';
import Review from './Review';
import { Link } from 'react-router-dom';
import SelectDoctorForm from './SelectDoctorForm';
import { baseUrl } from '../../Redux/ActionCreator';
import CopyRight from '../Copyright';

// function Copyright() {

//     return (
//         <Typography variant="body2" color="textSecondary" align="center">
//             {'Copyright © '}
//             <Link color="inherit" href="https://sadatshahriyar.pythonanywhere.com/">
//                 Sadat Shahriyar
//                 </Link>{' '}
//             {'& Jayanta Sadhu. '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    title: {
        flexGrow: 1
    },
}));

const steps = ['Patient details', 'Select doctor', 'Review your appointment'];



export default function Appointment(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    // appointment data
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('')
    const [dateOfBirth, setDateOfBirth] = React.useState(new Date());
    const [gender, setGender] = React.useState('');
    const [fetchedPatientData, setFetchedPatientData] = React.useState(false);
    const [bio, setBio] = React.useState('');
    const [patientUserID, setPatientUserID] = React.useState('')
    const [newPatient, setNewPatient] = React.useState(true);

    const [departments, setDepartments] = React.useState([]);
    const [doctors, setDoctors] = React.useState([]);
    const [selectedDepartment, setSelectedDepartment] = React.useState('');
    const [selectedDoctor, setSelectedDoctor] = React.useState('')
    const [selectedDoctorID, setSelectedDoctorID] = React.useState(0);
    const [schedule, setSchedule] = React.useState([]);
    const [selectedSchedule, setSelectedSchedule] = React.useState(0);
    const [scheduleMarked, setScheduleMarked] = React.useState(false);
    const [problemDescription, setProblemDescription] = React.useState('');

    const [finalMessage, setFinalMessage] = React.useState('')

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const checkPatientDetailsFilledUp = () => {
        console.log(firstName,lastName, address, email, phoneNumber, gender);
        if (firstName === '' || lastName === '' || address === '' || email === '' || phoneNumber === '' || gender === '') {
            alert('Please fill in all the information');
            setActiveStep(0);
            return false;
        }
        else return true;
    }

    const handleConfirmSubmission = () => {
        let date_of_birth = new Date(dateOfBirth);
        let body = {
            "newPatient": newPatient,
            "patientInfo": {
                "firstName": firstName,
                "lastName": lastName,
                "address": address,
                "email": email,
                "phoneNumber": phoneNumber,
                "dateOfBirth": date_of_birth.getDate().toString() + '-' + (date_of_birth.getMonth() + 1).toString() + '-' + date_of_birth.getFullYear().toString(),
                "gender": gender,
                "bio": bio,
                "patientUserId": patientUserID
            },
            "appointmentInfo": {
                "docId": selectedDoctorID,
                "problemDescription": problemDescription,
                "scheduleId": selectedSchedule
            }
        }

        fetch(baseUrl + 'appointment/save-appointment/', {
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
                    setFinalMessage(response.message)
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

        //alert(dateOfBirth.getDate().toString() + '-' + dateOfBirth.getMonth().toString() + '-' + dateOfBirth.getFullYear().toString());
        setActiveStep(activeStep + 1);
    }

    const checkScheduleSelected = () => {
        if (selectedSchedule === 0 && scheduleMarked === false) {
            alert('Please select a schedule with a doctor');
            setActiveStep(1);
            return false;
        }
        else if (selectedSchedule === 0 && scheduleMarked === true) {
            alert('Please check if the schedule is available for you');
            setActiveStep(1);
            return false;
        }
        else {
            return true;
        }
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar style={{ backgroundColor: 'white' }} >
                <Toolbar>
                    <div className={classes.title}>
                        <Link to='/home'>
                            <img src="logo.png" alt="logo" />
                        </Link>
                    </div>

                    <Link style={{ textDecoration: 'none' }} to='/sign-in'>
                        <Button variant='outlined' color='primary' style={{ marginRight: 10 }} >{props.User.isAuthenticated !== null && props.User.isAuthenticated ? 'Profile' : 'Sign In'}</Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Toolbar id="back-to-top-anchor" />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        Appointment
                    </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom>
                                    Thank you for your appointment.
                                </Typography>
                                <Typography variant="subtitle1">
                                    {finalMessage}
                                </Typography>
                            </React.Fragment>
                        ) : (
                                <React.Fragment>
                                    {/* {getStepContent(activeStep)} */}
                                    {activeStep === 0 ?
                                        <PatientDetailForm
                                            User={props.User}
                                            setFirstName={setFirstName}
                                            setLastName={setLastName}
                                            setAddress={setAddress}
                                            setEmail={setEmail}
                                            setPhoneNumber={setPhoneNumber}
                                            setDateOfBirth={setDateOfBirth}
                                            setGender={setGender}
                                            setBio={setBio}
                                            setPatientUserID={setPatientUserID}
                                            firstName={firstName}
                                            lastName={lastName}
                                            email={email}
                                            phoneNumber={phoneNumber}
                                            address={address}
                                            dateOfBirth={dateOfBirth}
                                            gender={gender}
                                            bio={bio}
                                            setFetchedPatientData={setFetchedPatientData}
                                            fetchedPatientData={fetchedPatientData}
                                            setNewPatient={setNewPatient}

                                        /> : null}
                                    {activeStep === 1 && checkPatientDetailsFilledUp() ?
                                        <SelectDoctorForm
                                            departments={departments}
                                            doctors={doctors}
                                            selectedDepartment={selectedDepartment}
                                            selectedDoctor={selectedDoctor}
                                            selectedDoctorID={selectedDoctorID}
                                            schedule={schedule}
                                            setDepartments={setDepartments}
                                            setDoctors={setDoctors}
                                            setSelectedDepartment={setSelectedDepartment}
                                            setSelectedDoctor={setSelectedDoctor}
                                            setSelectedDoctorID={setSelectedDoctorID}
                                            setSchedule={setSchedule}
                                            setSelectedSchedule={setSelectedSchedule}
                                            patientUserID={patientUserID}
                                            newPatient={newPatient}
                                            setScheduleMarked={setScheduleMarked}
                                            setProblemDescription={setProblemDescription}
                                        />
                                        : null}
                                    {activeStep === 2 && checkScheduleSelected() ?
                                        <Review
                                            firstName={firstName}
                                            lastName={lastName}
                                            address={address}
                                            email={email}
                                            phoneNumber={phoneNumber}
                                            dateOfBirth={dateOfBirth}
                                            gender={gender}
                                            bio={bio}
                                            selectedDoctor={selectedDoctor}
                                            selectedDepartment={selectedDepartment}
                                            schedule={schedule}
                                            selectedSchedule={selectedSchedule}
                                            problemDescription={problemDescription}
                                        /> : null}
                                    <div className={classes.buttons}>
                                        {activeStep !== 0 && (
                                            <Button onClick={handleBack} className={classes.button}>
                                                Back
                                            </Button>
                                        )}
                                        {activeStep === steps.length - 1 ?
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleConfirmSubmission}
                                                className={classes.button}
                                            >
                                                Confirm appointment
                                            </Button> :
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleNext}
                                                className={classes.button}
                                            >
                                                Next
                                            </Button>
                                        }
                                        {/* <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            className={classes.button}
                                        >
                                            {activeStep === steps.length - 1 ? 'Confirm appointment' : 'Next'}
                                        </Button> */}
                                    </div>
                                </React.Fragment>
                            )}
                    </React.Fragment>
                </Paper>
                {CopyRight}
            </main>
        </React.Fragment>
    );
}