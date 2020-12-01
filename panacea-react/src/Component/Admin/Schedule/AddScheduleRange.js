import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { FormHelperText, RadioGroup, Radio } from '@material-ui/core';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { Typography } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
    root: {
        display: 'flex',
      },

}));

export default function AddScheduleRangeForm(props) {
    const classes = useStyles();
    const [time, setTime] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [block, setBlock] = React.useState('');
    const [blockList, setBlockList] = React.useState([]);
    const [dayofweek, setDayOfWeek] = React.useState([]);
    const [duration, setDuration] = React.useState('');
    const [selected, setSelected] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState(new Date());

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

    let timeTableMenu = null;
    if (props.TimeTable.timeTable !== null) {
        timeTableMenu = props.TimeTable.timeTable.map((time) => {
            return (<MenuItem value={time.TIME_ID}>{time.START_TIME} - {time.END_TIME} - {time.SHIFT_TITLE}</MenuItem>);
        })
    }

    let wardCategoryMenu = null;
    if (props.WardTable.wardCategory !== null) {
        wardCategoryMenu = props.WardTable.wardCategory.map((category) => {
            return (<MenuItem value={category.CATEGORY}>{category.CATEGORY}</MenuItem>)
        })
    }


    const handleDayChange = (event) => {
        let clonedDaysArr = [...dayofweek];
        if (event.target.checked === true) {
            clonedDaysArr.push(event.target.name);
            setDayOfWeek(clonedDaysArr);
        }
        else {
            let filtered = dayofweek.filter((day)=>{
                return day !== event.target.name;
            });
            clonedDaysArr = filtered;
            setDayOfWeek(clonedDaysArr);
        }
    };

    const handleRangeSelect = (event) => {
        setDuration(event.target.value);
    };

    const handleChange = (event) => {
        setTime(event.target.value);
    };

    const handleChangeWard = (event) => {
        setCategory(event.target.value);
        props.handleWardCategorySelect(event.target.value);
    };

    const handleSelectBlock = (event) => {
        setBlock(event.target.value);
    }

    const handleSelected = () => {
        if (selected === false){
            setSelected(true);
        }
    };


    const handleSubmit = () => {
        // selected === false
        if (dayofweek.length === 0 || duration === '' || time === '' || block === '') {
            alert('Fill all the boxes properly.')
        }
        else if (selected === false) {
            // console.log(dayofweek);
            // console.log(duration);
            // console.log(time);
            // console.log(block);
            handleSelected();
            var days = '';
            var i;
            for(i=0; i < dayofweek.length; i++) {
                days = (i === dayofweek.length-1)? days.concat(dayofweek[i]):days.concat(dayofweek[i]+",");
                //console.log(dayofweek[i]);
            }
            console.log(days);
            props.handleAddScheduleRange(time, days, block, duration);
        }
        else {
            alert('Already Scheduled');
        }

    }

    return (
        <div>
            <Typography variant='h6'>Add Schedule For a Range of Time</Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Days Of Week</FormLabel>
                    <FormGroup>
                    <FormControlLabel
                        control={<Checkbox onChange={handleDayChange} name="sat" />}
                        label="Saturday"
                    />
                    <FormControlLabel
                        control={<Checkbox onChange={handleDayChange} name="sun" />}
                        label="Sunday"
                    />
                    <FormControlLabel
                        control={<Checkbox onChange={handleDayChange} name="mon" />}
                        label="Monday"
                    />
                    <FormControlLabel
                        control={<Checkbox onChange={handleDayChange} name="tue" />}
                        label="Tuesday"
                    />
                    <FormControlLabel
                        control={<Checkbox onChange={handleDayChange} name="wed" />}
                        label="Wednesday"
                    />
                    <FormControlLabel
                        control={<Checkbox onChange={handleDayChange} name="thu" />}
                        label="Thursday"
                    />
                    <FormControlLabel
                        control={<Checkbox onChange={handleDayChange} name="fri" />}
                        label="Friday"
                    />
                    </FormGroup>
    
                </FormControl>
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

                    

                    <div>
                    <FormControl  component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Duration</FormLabel>
                        <RadioGroup aria-label="gender"  onChange={handleRangeSelect}>
                            <FormControlLabel value="7" control={<Radio />} label="7 days" />
                            <FormControlLabel value="15" control={<Radio />} label="15 days" />
                            <FormControlLabel value="30" control={<Radio />} label="1 Month" />
                            <FormControlLabel value="90" control={<Radio />} label="3 Months" />
                        </RadioGroup>
                    </FormControl>
                    </div>

                </Grid>
            </MuiPickersUtilsProvider>
            <Button color='primary' variant='contained' onClick={handleSubmit}>Add</Button>
        </div>
    );
}
