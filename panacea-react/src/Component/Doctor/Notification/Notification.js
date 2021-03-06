import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
    withStyles, AppBar, Drawer, Toolbar, List, Divider, CssBaseline, Typography,
    Card, Container, Grid, Box, Link, ListItem, Button, lighten
} from '@material-ui/core';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import CopyRight from '../../Copyright';
import { baseUrl } from '../../../Redux/ActionCreator';
const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            borderBottom: 'unset',
        },
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
    highlightImportant: {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    },
    highlightUnread: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.action.hover,
    }

});

class NotificationDoctor extends Component {
    timeOutId;
    constructor(props) {
        super(props);

        this.state = {
            notifications: null
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.renderPage = this.renderPage.bind(this);
        this.fetchMarked = this.fetchMarked.bind(this);
        this.handleMarkread = this.handleMarkread.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.refreshNotifications = this.refreshNotifications.bind(this);
    }

    fetchData(body) {
        fetch(baseUrl + 'user/get-notifications/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
                console.log(response);
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
                    this.setState({ notifications: response.notifications });
                    this.timeOutId = setTimeout(this.refreshNotifications.bind(this), 3000);
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

    refreshNotifications() {
        let creds = JSON.parse(this.props.User.creds);
        let body = { 'userID': creds.userId, 'token': this.props.User.token };
        this.fetchData(body);
    }

    componentDidMount() {
        let creds = JSON.parse(this.props.User.creds);
        let body = { 'userID': creds.userId, 'token': this.props.User.token };
        this.fetchData(body);
    }

    componentWillUnmount() {
        clearTimeout(this.timeOutId);
    }

    handleLogout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('creds');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('userCategory');
    }

    fetchMarked(body) {
        fetch(baseUrl + 'user/notifications/mark-as-read/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
                console.log(response);
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
                    this.setState({ notifications: response.notifications });
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

    handleMarkread(noti_id, allmarked) {
        let creds = JSON.parse(this.props.User.creds);
        let body = { 'userID': creds.userId, 'token': this.props.User.token, 'notification_id': noti_id, 'allmarked': allmarked };
        this.fetchMarked(body)
    }


    renderPage() {

        const { classes } = this.props;

        if (this.props.User.isAuthenticated && this.props.User.category === 'doctor') {
            let userData = JSON.parse(this.props.User.userData);
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Doctor
                            </Typography>
                            <Link color='inherit' href='http://localhost:3000/home' onClick={() => { this.handleLogout() }} style={{ marginLeft: 'auto' }}>
                                Logout
                            </Link>
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
                                <Grid item xs={12}>
                                    <div style={{ display: "flex" }}>
                                        <Typography variant='body1'> </Typography>
                                        <Button
                                            style={{ marginLeft: 'auto' }}
                                            variant='contained'
                                            onClick={() => this.handleMarkread(null, true)}
                                        >
                                            Mark all as read
                                        </Button>
                                    </div>
                                    {this.state.notifications === null ? null :
                                        <List>
                                            {this.state.notifications.map((notification) => {
                                                let classs = null;
                                                if (notification.status === 'I') {
                                                    classs = classes.highlightImportant
                                                }
                                                else if (notification.status === 'U') {
                                                    classs = classes.highlightUnread;
                                                }
                                                return (
                                                    <ListItem key={notification.notification_id}>
                                                        <Card className={classs} style={{ padding: 20, width: 1150 }}>
                                                            <Typography variant='body1'>
                                                                {notification.message}
                                                            </Typography>
                                                            <Button
                                                                size='small'
                                                                style={{ marginTop: 5 }}
                                                                onClick={() => { this.handleMarkread(notification.notification_id, false) }}
                                                            >
                                                                Mark as read
                                                            </Button>
                                                        </Card>
                                                    </ListItem>
                                                );
                                            })
                                            }
                                        </List>
                                    }
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

    render() {
        const page = this.renderPage();
        return (
            <React.Fragment>
                {page}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(NotificationDoctor);