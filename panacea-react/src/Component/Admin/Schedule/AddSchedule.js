import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { FormHelperText } from '@material-ui/core';
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

export default function AddScheduleForm(props) {
    const classes = useStyles();
    const [time, setTime] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const [category, setCategory] = React.useState('');
    const [block, setBlock] = React.useState('');
    const [blockList, setBlockList] = React.useState([]);

    useEffect(() => {
        
        let blockListTemp = null;
        setBlockList([]);
        setBlock("");
        if (props.WardTable.wardTable !== null) {
            
            blockListTemp = props.WardTable.wardTable.map((block) => {
                //console.log(block.block);
                return (<MenuItem value={block.block}>{block.block}</MenuItem>)
            });
        }
        console.log(blockListTemp);
        setBlockList(blockListTemp);
    }, [props.WardTable.wardTable]);


    let wardCategoryMenu = null;
    if (props.WardTable.wardCategory !== null) {
        wardCategoryMenu = props.WardTable.wardCategory.map((category) => {
            return (<MenuItem value={category.CATEGORY}>{category.CATEGORY}</MenuItem>)
        })
    }

    let timeTableMenu = null;
    if (props.TimeTable.timeTable !== null) {
        timeTableMenu = props.TimeTable.timeTable.map((time) => {
            return (<MenuItem value={time.TIME_ID}>{time.START_TIME} - {time.END_TIME} - {time.SHIFT_TITLE}</MenuItem>);
        })
    }

    const handleSelectBlock = (event) => {
        setBlock(event.target.value);
    };

    const handleChangeWard = (event) => {
        setCategory(event.target.value);
        props.handleWardCategorySelect(event.target.value);
    };


    const handleChange = (event) => {
        setTime(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubmit = () => {
        let month = selectedDate.getMonth() + 1;
        let date = selectedDate.getDate().toString() + '/' + month.toString() + '/' + selectedDate.getFullYear().toString()

        if (time !== '') {
            props.handleAddSchedule(time, date, block);
        }
        else {
            alert('Please insert a valid shift');
        }
        // console.log(time + ' ' + selectedDate.getDate() + '/' + month + '/' + selectedDate.getFullYear())
        // alert(time + ' ' + selectedDate.getDate() + '/' + selectedDate.getMonth() + '/' + selectedDate.getFullYear());
    }

    return (
        <div>
            <Typography variant='h6'>Add Schedule</Typography>
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
                                {timeTableMenu}
                            </Select>
                        </FormControl>
                    </div>

                    <div>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Ward Category
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value={category}
                                onChange={handleChangeWard}
                                displayEmpty
                                className={classes.selectEmpty}>
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {wardCategoryMenu}
                            </Select>
                        </FormControl>
                    </div>

     
                    { props.WardTable.wardTable !== null?
                        <FormControl className={classes.formControl}>
                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Block
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label"
                            value={block}
                            onChange={handleSelectBlock}
                            displayEmpty
                            className={classes.selectEmpty}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {blockList}
                        </Select>
                    </FormControl>
                        : null
                    } 


                </Grid>
            </MuiPickersUtilsProvider>
            <Button color='primary' variant='contained' onClick={handleSubmit}>Add</Button>
        </div>
    );
}
