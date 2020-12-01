import React, { Component } from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import { Redirect } from 'react-router-dom';
import { Form } from 'react-redux-form';
import { TextField, Button, CardContent, Card } from '@material-ui/core';
import ScheduleEmpTable from './ScheduleEmpTable';
import AddScheduleEmpForm from './AddScheduleEmp';
import AddScheduleRangeForm from './AddScheduleRange'

const drawerWidth = 240;

const styles = (theme) => ({
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
    submit: {
        margin: theme.spacing(3, 0, 2),
        maxWidth: 200
    },
});


class ScheduleEmp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            empID: null
        };

        this.Copyright = this.Copyright.bind(this);
        this.renderSchedule = this.renderSchedule.bind(this);
        this.handleUserIdSubmit = this.handleUserIdSubmit.bind(this);
        this.setUserId = this.setUserId.bind(this);
        this.handleScheduleDelete = this.handleScheduleDelete.bind(this);
        this.handleAddSchedule = this.handleAddSchedule.bind(this);
        this.handleAddScheduleRange = this.handleAddScheduleRange.bind(this);
        this.handleWardCategorySelect = this.handleWardCategorySelect.bind(this);
    }

    componentDidMount() {
        let creds = JSON.parse(this.props.User.creds);
        this.props.loadTimeTable({ 'userID': creds.userId, 'token': this.props.User.token });
        this.props.loadWardCategory({'userID': creds.userId, 'token': this.props.User.token});
    }

    Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://sadatshahriyar.pythonanywhere.com/">
                    Sadat Shahriyar
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    setUserId(id) {
        this.setState({ empID: id });
    }

    handleUserIdSubmit() {
        if (this.state.empID === null || this.state.empID === '') {
            alert("Please insert employee's ID");
        }
        else {
            let creds = JSON.parse(this.props.User.creds);
            console.log(creds);
            this.props.loadEmpSchedule({ 'userID': creds.userId, 'token': this.props.User.token, 
                                        'empUserID': this.state.empID, 'userCategory': "employee" });
        }
    }

    handleWardCategorySelect(category) {
        console.log(category);
        let creds = JSON.parse(this.props.User.creds);
        this.props.loadWardTable({'userID': creds.userId, 'token': this.props.User.token, 'category': category});
    }

    handleScheduleDelete(selectedScheduleID) {
        let creds = JSON.parse(this.props.User.creds);
        console.log(creds);
        console.log(selectedScheduleID)
        this.props.deleteSchedule({ 'userID': creds.userId, 'token': this.props.User.token, 
                                'empUserID': this.state.empID, 'userCategory': "employee", 'selectedSchedules': selectedScheduleID });
    }

    handleAddSchedule(timeID, date, block) {
        let creds = JSON.parse(this.props.User.creds);
        console.log(timeID + ' ' + date);
        console.log('block id', block);
        this.props.addSchedule({ 'userID': creds.userId, 'token': this.props.User.token, 
                                'empUserID': this.state.empID, 'userCategory': "employee", 
                                'timeID': timeID, 'date': date, 'block': block });
    }

    handleAddScheduleRange(timeID, days, blockID, scheduleLength) {
        let creds = JSON.parse(this.props.User.creds);
        this.props.addScheduleRange({'userID': creds.userId, 'token': this.props.User.token, 
                                    'empUserID': this.state.empID, 'userCategory': "employee", 
                                    'timeID': timeID, 'days': days, 'blockID': blockID, 
                                    'scheduleLength': scheduleLength });
    }

    renderSchedule() {
        const { classes } = this.props;
        const copyRight = this.Copyright();
        if (this.props.User.isAuthenticated && this.props.User.category === 'admin') {
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
                                User's ID:
                            </Typography>
                            <Form model='AdminScheduleUserID' onSubmit={() => this.handleUserIdSubmit()}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="UserID"
                                    label="User ID"
                                    name="UserID"
                                    autoComplete="UserID"
                                    autoFocus
                                    onChange={(event) => this.setUserId(event.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    View Schedule
                                </Button>
                            </Form>

                            {this.props.ScheduleEmpTable.empData !== null ?
                                <Card style={{ marginBottom: 20 }}>
                                    <CardContent>
                                        <Typography variant="h6">{this.props.ScheduleEmpTable.empData.category} :
                                                                {this.props.ScheduleEmpTable.empData.name}</Typography>
                                    </CardContent>
                                </Card> :
                                null
                            }

                            {this.props.ScheduleEmpTable.schedule !== null ?
                                (this.props.ScheduleEmpTable.schedule[0].SCHEDULE_ID !== null ?
                                    (<div>
                                        <ScheduleEmpTable
                                            ScheduleEmpTable={this.props.ScheduleEmpTable}
                                            handleScheduleDelete={(selectedScheduleID) => this.handleScheduleDelete(selectedScheduleID)}
                                        />
                                        <div>
                                        <Card style={{ padding: 20 }}>
                                            <AddScheduleEmpForm
                                                TimeTable={this.props.TimeTable}
                                                WardTable={this.props.WardTable}
                                                handleWardCategorySelect = {(category) => this.handleWardCategorySelect(category)}
                                                handleAddSchedule={(timeID, date, block) => this.handleAddSchedule(timeID, date, block)}
                                            />
                                        </Card>
                                        </div>
                                        <div style = {{marginTop:20}}>
                                        <Card style ={{ padding: 20 }}>
                                            <AddScheduleRangeForm 
                                                TimeTable={this.props.TimeTable}
                                                WardTable={this.props.WardTable}
                                                handleWardCategorySelect = {(category) => this.handleWardCategorySelect(category)}
                                                handleAddScheduleRange={(timeID, days, blockID, scheduleLength) => this.handleAddScheduleRange(timeID, days, blockID, scheduleLength)}
                                            />
                                        </Card>
                                        </div>
                                    </div>) :
                                    <div>
                                        <Card style={{ padding: 20, marginBottom: 20 }}>
                                            <Typography variant="body1">No Schedule available</Typography>
                                        </Card>
                                        <div>
                                        <Card style={{ padding: 20 }}>
                                            <AddScheduleEmpForm
                                                TimeTable={this.props.TimeTable}
                                                WardTable={this.props.WardTable}
                                                handleWardCategorySelect = {(category) => this.handleWardCategorySelect(category)}
                                                handleAddSchedule={(timeID, date, block) => this.handleAddSchedule(timeID, date, block)}
                                            />
                                        </Card>
                                        </div>
                                        <div style = {{marginTop:20}}>
                                        <Card style ={{ padding: 20 }}>
                                            <AddScheduleRangeForm 
                                                TimeTable={this.props.TimeTable}
                                                WardTable={this.props.WardTable}
                                                handleWardCategorySelect = {(category) => this.handleWardCategorySelect(category)}
                                                handleAddScheduleRange={(timeID, days, blockID, scheduleLength) => this.handleAddScheduleRange(timeID, days, blockID, scheduleLength)}
                                            />
                                        </Card>
                                        </div>
                                    </div>) :
                                null
                            }

                            <Box pt={4}>
                                {copyRight}
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
    render() {
        const schedule = this.renderSchedule();
        return (
            <React.Fragment>
                {schedule}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ScheduleEmp);