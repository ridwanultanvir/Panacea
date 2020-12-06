import React, { Component } from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Drawer,Box,AppBar,Toolbar, List, Typography, Divider, 
    Container, ListItem, ListItemIcon, ListItemText, Card, CardActions, CardContent , } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import AssessmentIcon from '@material-ui/icons/Assessment';
import Link from '@material-ui/core/Link';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import { Redirect } from 'react-router-dom';
import { Form } from 'react-redux-form';
import { TextField, Button } from '@material-ui/core';
import CopyRight from '../../Copyright';




const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: 'flex',
        
    },
    root1 : {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    cardRoot : {
        minWidth: 275,
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
    submit: {
        margin: theme.spacing(3, 0, 2),
        maxWidth: 200
    },
});


class DataExtractor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            docID: null,
            redirect: false,
            serial: null,
        };

        this.renderDataExtractor = this.renderDataExtractor.bind(this);
        this.handleClick = this.handleClick.bind(this);
        // this.handleUserIdSubmit = this.handleUserIdSubmit.bind(this);
        // this.setUserId = this.setUserId.bind(this);
        // this.handleScheduleDelete = this.handleScheduleDelete.bind(this);
        // this.handleAddSchedule = this.handleAddSchedule.bind(this);
        // this.handleWardCategorySelect = this.handleWardCategorySelect.bind(this);
    }

    componentDidMount() {
        let creds = JSON.parse(this.props.User.creds);
        if (this.state.redirect != false) {
            this.setState({redirect: false});
        }
    }

    handleClick(message) {
        this.setState({serial: message});
        this.setState({redirect: true});
    }
    // setUserId(id) {
    //     this.setState({ docID: id });
    // }

    // handleUserIdSubmit() {
    //     if (this.state.docID === null || this.state.docID === '') {
    //         alert("Please insert doctor's ID");
    //     }
    //     else {
    //         let creds = JSON.parse(this.props.User.creds);
    //         console.log(creds);
    //         this.props.loadDocSchedule({ 'userID': creds.userId, 'token': this.props.User.token, 
    //                                     'docUserID': this.state.docID, 'userCategory': "doctor" })
    //     }
    // }

    // handleScheduleDelete(selectedScheduleID) {
    //     let creds = JSON.parse(this.props.User.creds);
    //     console.log(creds);
    //     console.log(selectedScheduleID)
    //     this.props.deleteSchedule({ 'userID': creds.userId, 'token': this.props.User.token, 
    //                             'docUserID': this.state.docID, 'userCategory': "doctor", 'selectedSchedules': selectedScheduleID });
    // }

    // handleWardCategorySelect(category) {
    //     console.log(category);
    //     let creds = JSON.parse(this.props.User.creds);
    //     this.props.loadWardTable({'userID': creds.userId, 'token': this.props.User.token, 'category': category});
    // }

    // handleAddSchedule(timeID, date, block) {
    //     let creds = JSON.parse(this.props.User.creds);
    //     console.log(timeID + ' ' + date);
    //     console.log('block id', block);
    //     this.props.addSchedule({ 'userID': creds.userId, 'token': this.props.User.token, 
    //                             'docUserID': this.state.docID, 'userCategory': "doctor", 
    //                             'timeID': timeID, 'date': date, 'block': block })
    // }

    renderDataExtractor() {
        const { classes } = this.props;
        if (this.props.User.isAuthenticated && this.props.User.category === 'admin' && !this.state.redirect) {
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
                            <Typography variant="h5">
                                Select Search Query:
                            </Typography>
                            <div className={classes.root2}>
                            <List component="nav" aria-label="main mailbox folders">
                                <ListItem button onClick={() => this.handleClick('1')}>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Appointments For a Patient" />
                                </ListItem>
                                <ListItem button onClick={() => this.handleClick('2')}>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Appointments Each Day Over a Range of Time" />
                                </ListItem>
                                <ListItem button onClick={() => this.handleClick('3')}>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Appointments Under a Doctor" />
                                </ListItem>
                                <ListItem button onClick={() => this.handleClick('4')}>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Tests Recommended By A Doctor" />
                                </ListItem>
                                <ListItem button onClick={() => this.handleClick('5')}>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Schedule History For An Employee/Doctor" />
                                </ListItem>
                                <ListItem button onClick={() => this.handleClick('6')}>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Employees Assigned In Wards On a Date" />
                                </ListItem>
                                <ListItem button onClick={() => this.handleClick('7')}>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Hospital Bill Income In a Range of Time" />
                                </ListItem>
                                <ListItem button onClick={() => this.handleClick('8')}>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Surgeries Performed" />
                                </ListItem>
                                <ListItem button onClick={() => this.handleClick('9')}>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Ward History" />
                                </ListItem>
                                <ListItem button onClick={() => this.handleClick('10')}>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Patient Analytics" />
                                </ListItem>
                            </List>
                            <Divider />
                            
                            </div>

                            



                            <Box pt={4}>
                                {CopyRight}
                            </Box>
                        </Container>
                    </main>
                </div>
            );
        }
        else if (this.state.redirect) {
            let path = "/admin/in-data-for-extraction";
            path = path + "/" + this.state.serial;
            return (<Redirect to={path} />);
        }
        else {
            return (<Redirect to='/sign-in' />);
        }
    }
    render() {
        const dataExtractor = this.renderDataExtractor();
        return (
            <React.Fragment>
                {dataExtractor}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(DataExtractor);