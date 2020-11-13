import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';


const addresses = ['1 Material-UI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
    { name: 'Card type', detail: 'Visa' },
    { name: 'Card holder', detail: 'Mr John Smith' },
    { name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234' },
    { name: 'Expiry date', detail: '04/2024' },
];

const useStyles = makeStyles((theme) => ({
    listItem: {
        padding: theme.spacing(1, 0),
    },
    total: {
        fontWeight: 700,
    },
    title: {
        marginTop: theme.spacing(2),
    },
}));

const getDetails = (props) => {
    //let schedule = props.schedule.filter((scheduleData) => scheduleData.schedule_id == props.selectedSchedule)[0];
    let details = [
        { header: 'Name', value: props.firstName + ' ' + props.lastName },
        { header: 'Address', value: props.address },
        { header: 'Email', value: props.email },
        { header: 'Phone number', value: props.phoneNumber },
        { header: 'Date of Birth', value: props.dateOfBirth.toString() },
        { header: 'Gender', value: props.gender },
        { header: 'Bio', value: props.bio },

    ];

    return details;
}

export default function Review(props) {
    const classes = useStyles();
    let details = getDetails(props);

    console.log(props.dateOfBirth);

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Appointment summary
            </Typography>
            <List disablePadding>
                {details.map((value) => (
                    <ListItem className={classes.listItem} key={value.value}>
                        <ListItemText primary={value.header} />
                        <Typography variant="body2">{value.value}</Typography>
                    </ListItem>
                ))}

            </List>

        </React.Fragment>
    );
}