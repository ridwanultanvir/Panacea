import React, { useState, Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { Link, Redirect } from 'react-router-dom';
import { Button, Avatar, TextField, Grid } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Form } from 'react-redux-form';
import { Loading } from './LoadingComponent';

const styles = (theme) => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    title: {
        flexGrow: 1
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: '',
            password: '',
            redirect: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.Copyright = this.Copyright.bind(this);
        this.SignInForm = this.SignInForm.bind(this);
        this.setUserID = this.setUserID.bind(this);
        this.setPassword = this.setPassword.bind(this);
    }

    Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link to='/home' color='inherit'>
                    Sadat Shahriyar
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }



    handleSubmit() {
        let creds = { 'userId': this.state.userID, 'password': this.state.password };
        this.props.loginUser(creds);
    }

    setUserID(userID) {
        this.setState({ userID: userID });
    }
    setPassword(password) {
        this.setState({ password: password });
    }


    SignInForm() {
        const { classes } = this.props;

        const copyRight = this.Copyright();

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Form model='LoginForm' className={classes.form} noValidate onSubmit={() => this.handleSubmit()}>
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
                            onBlur={(event) => this.setUserID(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onBlur={(event) => this.setPassword(event.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container justify='center'>

                            <Grid item>
                                <Link to="/registration" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Form>
                </div>
                <Box mt={8}>
                    {copyRight}
                </Box>
            </Container>
        );
    }

    renderSignInForm() {
        const { classes } = this.props;
        const signInForm = this.SignInForm();

        if (this.props.User.isLoading) {
            return (
                <div className="container" style={{ marginLeft: '18%' }}>
                    <div className="row mx-auto my-auto">
                        <Loading />
                    </div>
                </div>
            );
        }
        if (this.props.User.isAuthenticated) {
            return (<Redirect to='/profile' />);
        }
        else {
            return (
                <React.Fragment>
                    <CssBaseline />
                    <AppBar style={{ backgroundColor: 'white' }} >
                        <Toolbar>
                            <div className={classes.title}>
                                <Link to='/home' >
                                    <img src="logo.png" alt="logo" />
                                </Link>
                            </div>

                            <Link style={{ textDecoration: 'none' }} to='/sign-in'>
                                <Button variant='text' style={{ marginRight: 10, color: 'gray' }} >Sign in</Button>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} to='/appointment'>
                                <Button variant="outlined" color="primary">
                                    Make an appointment
                            </Button>
                            </Link>

                        </Toolbar>
                    </AppBar>
                    <Toolbar id="back-to-top-anchor" />
                    <Container>
                        <Box my={2}>
                            {signInForm}
                        </Box>
                    </Container>

                </React.Fragment>
            );
        }

    }

    render() {
        const signInForm = this.renderSignInForm();
        return (
            <React.Fragment>
                {signInForm}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(SignIn);