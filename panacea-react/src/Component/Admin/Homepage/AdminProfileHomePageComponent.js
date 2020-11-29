import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import { mainListItems, secondaryListItems } from './listItems';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import { Redirect } from 'react-router-dom';
import CopyRight from '../../Copyright';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

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


export default function AdminHome(props) {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    if (props.User.isAuthenticated && props.User.category === 'admin') {
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Admin
                </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <List>{mainListItems}</List>
                        <Divider />
                        <List>{secondaryListItems}</List>
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <Toolbar />
                    <div />
                    <Container maxWidth="lg" >
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12} md={8} lg={9}>
                                <Paper className={fixedHeightPaper}>
                                    <Chart />
                                </Paper>
                            </Grid>
                            {/* Recent Deposits */}
                            <Grid item xs={12} md={4} lg={3}>
                                <Paper className={fixedHeightPaper}>
                                    <Deposits />
                                </Paper>
                            </Grid>
                            {/* Recent Orders */}
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <Orders />
                                </Paper>
                            </Grid>
                        </Grid>
                        <Box pt={4}>
                            {CopyRight}
                        </Box>
                    </Container>
                </main>
            </div>
        );
    }
    else {
        return (<Redirect to='/sign-in' />);
    }

}
