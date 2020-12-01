import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';



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

export default function AddPatRoom(props) {
    const classes = useStyles();
    const [room, setRoom] = React.useState("");
    const [roomList, setRoomList] = React.useState([]);
    const [ward, setWard] = React.useState("");
    const [roomType, setRoomType] = React.useState("");
    const [roomTypeList, setRoomTypeList] = React.useState([]);


    useEffect(() => {
        
        let docListTemp = null;
        if (props.AdmitPatientTable.roomTypes !== null) {
            
            docListTemp = props.AdmitPatientTable.roomTypes.map((block) => {
                //console.log(block.block);
                return (<MenuItem value={block.room_type}>{block.room_type}</MenuItem>)
            });
        }
        
        setRoomTypeList(docListTemp);
    }, [props.AdmitPatientTable.roomTypes]);

    useEffect(() => {
        
        let ListTemp = null;
        if (props.AdmitPatientTable.roomData !== null) {
            
            ListTemp = props.AdmitPatientTable.roomData.map((block) => {
                return (<MenuItem value={block.room_no}>{block.room_no} - {block.room_type} - Charge:{block.charge}</MenuItem>)
            });
        }
        
        setRoomList(ListTemp);
    }, [props.AdmitPatientTable.roomData]);


    // here 
    // const handleChange = (event) => {
    //     setTime(event.target.value);
    //     
    //     let dateString = selectedDate.getDate().toString() + '/' + month.toString() + '/' + selectedDate.getFullYear().toString()
    //     props.fetchRoomList(dateString, event.target.value);
    // };

    const handleSelectWard = (event) => {
        setWard(event.target.value);
        setRoomType("");
        setRoom("");
        console.log(event.target.value);
        props.fetchRoomTypes(event.target.value);
    };

    const handleSelectRoomType = (event) => {
        setRoomType(event.target.value);
        setRoom("");
        console.log(ward);
        props.fetchRoomList(ward, event.target.value);
    }

    const handleSelectRoom = (event) => {
        setRoom(event.target.value);
    }

    const handleSubmit = () => {
        if (ward === ""|| room === "" || roomType === "") {
            alert('Please fill all the boxes properly');
        }
        else {
            let selectedDate = new Date()
            let month = selectedDate.getMonth() + 1;
            let dateString = selectedDate.getDate().toString() + '/' + month.toString() + '/' + selectedDate.getFullYear().toString()
            props.handleAdmitPatient(room, dateString)
        }
    }

    return (
        <div>
            <Typography variant='h6'>Select Admission Conditionals</Typography>
                    {
                        (props.wardList !== null )?
                        (<div>
                            <FormControl className={classes.formControl}>
                                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                    Ward Selection
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-placeholder-label-label"
                                    id="demo-simple-select-placeholder-label"
                                    value={ward}
                                    onChange={handleSelectWard}
                                    displayEmpty
                                    className={classes.selectEmpty}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {props.wardList}
                                </Select>
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                    Room Type Selection
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-placeholder-label-label"
                                    id="demo-simple-select-placeholder-label"
                                    value={roomType}
                                    onChange={handleSelectRoomType}
                                    displayEmpty
                                    className={classes.selectEmpty}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {roomTypeList}
                                </Select>
                            </FormControl>

                        </div>):null
                    }

                    {
                        (props.AdmitPatientTable.roomData !== null) &&
                        <div>
                            <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Select Room
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value={room}
                                onChange={handleSelectRoom}
                                displayEmpty
                                className={classes.selectEmpty}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {roomList}
                            </Select>
                        </FormControl>
                        </div>
                    }
                    
            <Button color='primary' variant='contained' onClick={handleSubmit}>Admit Patient</Button>
        </div>
    );
}
