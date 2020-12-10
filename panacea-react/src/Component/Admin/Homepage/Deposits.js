import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

function preventDefault(event) {
    event.preventDefault();
}

const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});

export default function Deposits(props) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Title>Total</Title>
            <Typography component="p" variant="h4">
                {props.totalPatServed}
            </Typography>
            <Typography color="textSecondary" className={classes.depositContext}>
                patients served last 30 days
      </Typography>
            {/* <div>
                <Link color="primary" href="#" onClick={preventDefault}>
                    View balance
                </Link>
            </div> */}
        </React.Fragment>
    );
}