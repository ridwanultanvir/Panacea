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
import RegistrationForm from './RegistrationForm';
import Review from './Review';
import { Link } from 'react-router-dom';
import { baseUrl } from '../../Redux/ActionCreator';
import CopyRight from '../Copyright';

// function Copyright() {
//     return (
//         <Typography variant="body2" color="textSecondary" align="center">
//             {'Copyright © '}
//             <Link color="inherit" href="https://material-ui.com/">
//                 Sadat Shahriyar
//             </Link>{' '}
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

const steps = ['Patient details', 'Review your details'];



export default function Registrartion(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    // registration data
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('')
    const [dateOfBirth, setDateOfBirth] = React.useState(new Date());
    const [gender, setGender] = React.useState('');
    const [bio, setBio] = React.useState('');

    const [finalMessage, setFinalMessage] = React.useState('')

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const checkPatientDetailsFilledUp = () => {
        if (firstName === '' || lastName === '' || address === '' || email === '' || phoneNumber === '' || gender === '') {
            alert('Please fill in all the information');
            setActiveStep(0);
            return false;
        }
        else return true;
    }

    const handleConfirmSubmission = () => { // this function needs to be implemented
        let body = {
            "patientInfo": {
                "firstName": firstName,
                "lastName": lastName,
                "address": address,
                "email": email,
                "phoneNumber": phoneNumber,
                "dateOfBirth": dateOfBirth.getDate().toString() + '-' + (dateOfBirth.getMonth() + 1).toString() + '-' + dateOfBirth.getFullYear().toString(),
                "gender": gender,
                "bio": bio,
            }
        }

        //alert(JSON.stringify(body))

        fetch(baseUrl + 'user/registration/', {
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
        //console.log(body);
        //alert(dateOfBirth.getDate().toString() + '-' + dateOfBirth.getMonth().toString() + '-' + dateOfBirth.getFullYear().toString());
        setActiveStep(activeStep + 1);
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
                        <Button variant='outlined' color='primary' style={{ marginRight: 10 }} >SIgn in</Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Toolbar id="back-to-top-anchor" />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        Registration
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
                                    Thank you for your registration.
                                </Typography>
                                <Typography variant="subtitle1">
                                    {finalMessage}
                                </Typography>
                            </React.Fragment>
                        ) : (
                                <React.Fragment>
                                    {/* {getStepContent(activeStep)} */}
                                    {activeStep === 0 ?
                                        <RegistrationForm
                                            User={props.User}
                                            setFirstName={setFirstName}
                                            setLastName={setLastName}
                                            setAddress={setAddress}
                                            setEmail={setEmail}
                                            setPhoneNumber={setPhoneNumber}
                                            setDateOfBirth={setDateOfBirth}
                                            setGender={setGender}
                                            setBio={setBio}
                                            firstName={firstName}
                                            lastName={lastName}
                                            email={email}
                                            phoneNumber={phoneNumber}
                                            address={address}
                                            dateOfBirth={dateOfBirth}
                                            gender={gender}
                                            bio={bio}
                                        /> : null}
                                    {activeStep === 1 && checkPatientDetailsFilledUp() ?
                                        <Review
                                            firstName={firstName}
                                            lastName={lastName}
                                            address={address}
                                            email={email}
                                            phoneNumber={phoneNumber}
                                            dateOfBirth={dateOfBirth}
                                            gender={gender}
                                            bio={bio}
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
                                                Confirm registration
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