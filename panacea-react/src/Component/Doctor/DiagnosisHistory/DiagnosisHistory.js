import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
    withStyles, AppBar, Drawer, Toolbar, List,
    Divider, CssBaseline, Typography, Card, Container, Grid, Box,
    ListItem, CardContent, Breadcrumbs,
    FormControl, NativeSelect, Link
} from '@material-ui/core';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import CopyRight from '../../Copyright';
import { baseUrl } from '../../../Redux/ActionCreator';
//import { Link } from 'react-router-dom';
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
    cardroot: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

class DiagnosisHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tests: null,
            surgeries: null
        }

        this.fetchData = this.fetchData.bind(this);
        this.renderPage = this.renderPage.bind(this);
        this.handleHistoryToggle = this.handleHistoryToggle.bind(this);
        this.selectInput = React.createRef();
    }

    fetchData(body) {
        fetch(baseUrl + 'checkup/doctor/get-diagnosis-history/', {
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
                    this.setState({ tests: response.tests.length === 0 ? null : response.tests, surgeries: response.surgeries.length === 0 ? null : response.surgeries })
                }
                else {
                    let err = new Error(response.errorMessage);
                    err.response = response;
                    throw err;
                }
            })
            .catch((err) => {
                alert(err.message)
            });
    }

    componentDidMount() {
        let creds = JSON.parse(this.props.User.creds);
        let body = { 'userID': creds.userId, 'token': this.props.User.token, 'full_history': false, 'app_sl_no': this.props.app_sl_no }
        this.fetchData(body);
    }

    handleHistoryToggle(value) {
        if (value === 'Full') {
            let creds = JSON.parse(this.props.User.creds);
            let body = { 'userID': creds.userId, 'token': this.props.User.token, 'full_history': true, 'app_sl_no': this.props.app_sl_no }
            this.fetchData(body);
        }
        else if (value === 'This') {
            let creds = JSON.parse(this.props.User.creds);
            let body = { 'userID': creds.userId, 'token': this.props.User.token, 'full_history': false, 'app_sl_no': this.props.app_sl_no }
            this.fetchData(body);
        }
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
                                        <Breadcrumbs aria-label="breadcrumb">
                                            <Link color="inherit" href={`http://localhost:3000/doctor/appointment/${this.props.app_sl_no}`} >
                                                Diagnosis
                                            </Link>
                                            <Typography color="textPrimary">Diagnosis history</Typography>
                                        </Breadcrumbs>

                                        <FormControl className={classes.formControl} style={{ marginLeft: 'auto' }}>
                                            <NativeSelect
                                                inputRef={this.selectInput}
                                                defaultValue={'This'}
                                                inputProps={{
                                                    name: 'name',
                                                    id: 'uncontrolled-native',
                                                }}
                                                onChange={(event) => { this.handleHistoryToggle(event.target.value) }}
                                            >
                                                <option value={'This'}>Current appointment</option>
                                                <option value={'Full'}>Full history</option>
                                            </NativeSelect>
                                        </FormControl>
                                    </div>

                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='h6'>Test results</Typography>
                                    {
                                        this.state.tests === null ?
                                            <Typography variant='body1'>No result available</Typography> :
                                            <List>
                                                {
                                                    this.state.tests.map((test) => {
                                                        return (
                                                            <ListItem key={test.test_result_id} role={undefined} dense>
                                                                <Card style={{ padding: 20, width: 1100 }}>
                                                                    <Typography variant="h5" component="h2">
                                                                        {test.test_name}
                                                                    </Typography>
                                                                    <Typography color="textSecondary">
                                                                        Completion date: {test.test_complete_date}
                                                                    </Typography>
                                                                    <Typography variant='body1'>
                                                                        {test.completed === 'F' ? 'Pending' : test.test_result}
                                                                    </Typography>
                                                                </Card>
                                                            </ListItem>
                                                        );
                                                    })
                                                }
                                            </List>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='h6'>Surgery results</Typography>
                                    {
                                        this.state.surgeries === null ?
                                            <Typography variant='body1'>No result available</Typography> :
                                            <List>
                                                {
                                                    this.state.surgeries.map((surgery) => {
                                                        return (
                                                            <ListItem key={surgery.surgery_result_id} role={undefined} dense>
                                                                <Card style={{ padding: 20, width: 1100 }}>
                                                                    <Typography variant="h6">
                                                                        {surgery.surgery_desc}
                                                                    </Typography>
                                                                    <Typography color="textSecondary">
                                                                        Completion date: {surgery.surgery_date}
                                                                    </Typography>
                                                                    <Typography variant='body1'>
                                                                        {surgery.completed === 'F' ? 'Pending' :
                                                                            <div>
                                                                                <Typography variant='body1'>Status: {surgery.status}</Typography>
                                                                                <Typography variant='body1'>Comment: {surgery.result}</Typography>
                                                                            </div>
                                                                        }
                                                                    </Typography>
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

export default withStyles(styles)(DiagnosisHistory);