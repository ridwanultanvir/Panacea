import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {InputLabel,TextField} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';



const useStyles = makeStyles((theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: 560
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },

}));

export default function SelectIncharge(props) {
    const classes = useStyles();
    const [inchargeID, setInchargeID] = React.useState("");
    const [blockID, setBlockID] = React.useState("");
    const [redirect, setRedirect] = React.useState(false);


    // here 
    const handleBlockID = (event) => {
        setBlockID(event.target.value);
    };

    const handleSubmit = () => {

        if (inchargeID === "" || blockID === "") {
            alert("Please Fill all blocks properly");
        }
        else {
            let body = {
                'inChargeID': inchargeID,
                'block_id': blockID,
            }
            console.log(body);
            let baseUrl = 'http://localhost:8000/';
            fetch(baseUrl + 'schedule/add-incharge/', {
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
                        console.log("success");
                        alert(response.alertMessage);
                        setRedirect(true);
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

    if (!redirect){
        return (
        <div>
            <Typography variant='h6'>Select The Following:</Typography>
                <Grid container justify="space-around">
                    
                    <div>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Ward ID:
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value={blockID}
                                onChange={handleBlockID}
                                displayEmpty
                                className={classes.selectEmpty}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                    { props.wardList}
                            </Select>
                        </FormControl>
                        <TextField
                            //inputRef={inchargeID}
                            id="standard-basic"
                            label="Incharge ID"
                            onBlur={(event) => { setInchargeID(event.target.value); console.log(event.target.value); }}
                            style={{ width: 400, marginLeft: 10, marginBottom: 20}}
                        />
                    </div>

                </Grid>
            <Button color='primary' variant='contained' onClick={handleSubmit}>Save </Button>
        </div>
    );
    }
    else{
        return (<Redirect to="/patient/home"/>);
    }
    
}
