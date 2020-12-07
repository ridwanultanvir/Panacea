import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TextField, Typography } from '@material-ui/core';
import { baseUrl } from '../../../Redux/ActionCreator';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditProfile(props) {
    const [open, setOpen] = React.useState(false);



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    let name = props.userData.name.split(" ");
    let firstName = name[0];
    let lastName = name[1];


    const [fName, setFName] = React.useState(firstName);
    const [lName, setLName] = React.useState(lastName);
    const [email, setEmalil] = React.useState(props.userData.email);
    const [phoneNumber, setPhoneNumber] = React.useState(props.userData.phoneNum);
    const [address, setAddress] = React.useState(props.userData.address);
    const [education, setEducation] = React.useState(props.userData.education);
    const [training, setTraining] = React.useState(props.userData.training)

    const handleSubmit = () => {
        // alert(fName + lName + email + phoneNumber + address + qualification);
        let creds = JSON.parse(props.User.creds);
        let body = {
            'userID': creds.userId, 'token': props.User.token,
            'first_name': fName, 'last_name': lName, 'email': email, 'address': address,
            'phoneNumber': phoneNumber, 'doc_qualification': null, 'pat_bio': null,
            'emp_education': education, 'emp_training': training

        };

        props.updateUser(body);


        handleClose();
    }

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Edit profile
            </Button>
            <Typography variant='body2' color='secondary'>{props.User.updateErrorMessage}</Typography>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Update profile"}</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        id="standard-basic"
                        label="First name"
                        defaultValue={firstName}
                        style={{ margin: 2, width: 270 }}
                        onChange={(event) => { setFName(event.target.value) }}
                    //onChange={(event) => { this.setState({ sampleNo: event.target.value }) }}
                    />
                    <TextField
                        required
                        id="standard-basic"
                        label="Last name"
                        defaultValue={lastName}
                        style={{ margin: 2, width: 270 }}
                        onChange={(event) => { setLName(event.target.value) }}
                    />
                    <TextField
                        required
                        id="standard-basic"
                        label="Email"
                        defaultValue={props.userData.email}
                        style={{ margin: 2, width: 270 }}
                        onChange={(event) => { setEmalil(event.target.value) }}
                    />
                    <TextField
                        required
                        id="standard-basic"
                        label="Phone number"
                        defaultValue={props.userData.phoneNum}
                        style={{ margin: 2, width: 270 }}
                        onChange={(event) => { setPhoneNumber(event.target.value) }}
                    />
                    <TextField
                        required
                        id="standard-basic"
                        label="Address"
                        defaultValue={props.userData.address}
                        style={{ margin: 2, width: 544 }}
                        onChange={(event) => { setAddress(event.target.value) }}
                    />
                    <TextField
                        required
                        id="standard-basic"
                        label="Education"
                        defaultValue={props.userData.education}
                        style={{ margin: 2, width: 544 }}
                        onChange={(event) => { setEducation(event.target.value) }}
                    />

                    <TextField
                        required
                        id="standard-basic"
                        label="Training"
                        defaultValue={props.userData.training}
                        style={{ margin: 2, width: 544 }}
                        onChange={(event) => { setTraining(event.target.value) }}
                    />



                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} color="primary">
                        Confirm
                    </Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}
