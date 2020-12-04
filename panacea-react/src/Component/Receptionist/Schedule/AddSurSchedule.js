import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
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

export default function AddSurSchedule(props) {
    const classes = useStyles();
    const [time, setTime] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [docID, setDocID] = React.useState("");
    const [docList, setDocList] = React.useState([]);
    const [room, setRoom] = React.useState("");
    const [roomList, setRoomList] = React.useState([]);


    useEffect(() => {

        let docListTemp = null;
        setDocList([]);
        setDocID("");
        if (props.ScheduleSurgeryTable.docData !== null) {

            docListTemp = props.ScheduleSurgeryTable.docData.map((block) => {
                //console.log(block.block);
                return (<MenuItem value={block.id}>{block.name}</MenuItem>)
            });
        }

        setDocList(docListTemp);
    }, [props.ScheduleSurgeryTable.docData]);

    useEffect(() => {

        let roomListTemp = null;
        setRoomList([]);
        setRoom("");
        if (props.ScheduleSurgeryTable.roomData !== null) {

            roomListTemp = props.ScheduleSurgeryTable.roomData.map((block) => {
                return (<MenuItem value={block.room_no}>{block.room_no}-{block.room_name}</MenuItem>)
            });
        }

        setRoomList(roomListTemp);
    }, [props.ScheduleSurgeryTable.roomData]);

    // here 
    const handleChange = (event) => {
        setTime(event.target.value);
        let month = selectedDate.getMonth() + 1;
        let dateString = selectedDate.getDate().toString() + '/' + month.toString() + '/' + selectedDate.getFullYear().toString()
        props.fetchRoomList(dateString, event.target.value);
    };

    const handleSelectDoc = (event) => {
        setDocID(event.target.value);
    };

    const handleSelectRoom = (event) => {
        setRoom(event.target.value);
    }
    // const handleOpen = () => {
    //     setOpen(true);
    // };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (props.docSelectionOpt1 === false) {
            let month = selectedDate.getMonth() + 1;
            let dateString = selectedDate.getDate().toString() + '/' + month.toString() + '/' + selectedDate.getFullYear().toString()
            props.fetchDocList(dateString);
        }
    };

    const handleSubmit = () => {

        if (time === '' || room === "") {
            alert('Please fill all the boxes properly');
        }
        else {

            // if (docID === '') {
            //     setDocID(props.ScheduleSurgeryTable.appntDocData.id);
            // }
            let month = selectedDate.getMonth() + 1;
            let dateString = selectedDate.getDate().toString() + '/' + month.toString() + '/' + selectedDate.getFullYear().toString()

            if (docID === "") {

                props.handleAddSchedule(time, dateString, props.ScheduleSurgeryTable.appntDocData.id, room);
            }
            else {
                props.handleAddSchedule(time, dateString, docID, room);
            }

        }
    }

    return (
        <div>
            <Typography variant='h6'>Select Surgery Conditionals</Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                    <KeyboardDatePicker
                        id="date-picker-dialog"
                        label="Date picker dialog"
                        format="dd/MM/yyyy"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        style={{ width: 560, marginTop: 9 }}
                    />
                    <div>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Shift
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value={time}
                                onChange={handleChange}
                                displayEmpty
                                className={classes.selectEmpty}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="8">
                                    <em>Operation Theatre(M) 10:00 - 12:00</em>
                                </MenuItem>
                                <MenuItem value="9">
                                    <em>Operation Theatre(E) 14:00 - 16:00</em>
                                </MenuItem>
                                <MenuItem value="10">
                                    <em>Operation Theatre(N) 21:00 - 23:00</em>
                                </MenuItem>

                            </Select>
                        </FormControl>
                    </div>
                    {
                        (props.docSelectionOpt1 === false) ?
                            (<div>
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                        Select Doctor
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-placeholder-label-label"
                                        id="demo-simple-select-placeholder-label"
                                        value={docID}
                                        onChange={handleSelectDoc}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {docList}
                                    </Select>
                                </FormControl>
                            </div>) : null
                    }

                    {
                        (time !== '') &&
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



                </Grid>
            </MuiPickersUtilsProvider>
            <Button color='primary' variant='contained' onClick={handleSubmit}>Save Schedule</Button>
        </div>
    );
}
