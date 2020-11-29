import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import { Button, Paper, Card, CardContent, CardMedia, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Carousel from 'react-material-ui-carousel';
import PersonalVideoIcon from '@material-ui/icons/PersonalVideo';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import CopyRight from './Copyright';


const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    title: {
        flexGrow: 1
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        // marginTop: theme.spacing(8),
        padding: theme.spacing(10, 0)
    },
}));

function ScrollTop(props) {
    const { children, window } = props;
    const classes = useStyles();
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation" className={classes.root}>
                {children}
            </div>
        </Zoom>
    );
}

ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

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


function Footer(props) {
    const classes = useStyles();
    const { description, title } = props;

    return (
        <footer className={classes.footer}>
            <Container maxWidth="lg">
                <Typography variant="h6" align="center" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    {description}
                </Typography>
                {CopyRight}
            </Container>
        </footer>
    );
}

export default function Home(props) {
    const classes = useStyles();
    var items = [
        {
            name: "Random Name #1",
            description: "Probably the most random thing you have ever seen!",
            image: 'image/banner5.jpg'
        },
        {
            name: "Random Name #2",
            description: "Hello World!",
            image: 'image/banner6.jpg'
        },
        {
            name: "Random Name #2",
            description: "Hello World!",
            image: 'image/banner7.jpg'
        }
    ]

    var testmonialItems = [
        {
            name: 'Dr. Asana Korim',
            image: 'image/testmonial/1.png',
            statement: "A doctor's mission should not be to prevent death but more importantly it should be to improve the quality of"
        },
        {
            name: 'Dr. Touhid Shaon',
            image: 'image/testmonial/2.png',
            statement: 'The art of medicine consists of amusing the patient while nature cures the disease.'
        }
    ]
    return (
        <div>
            <CssBaseline />
            <AppBar style={{ backgroundColor: 'white' }} >
                <Toolbar>
                    <div className={classes.title}>
                        <Link to='/home'>
                            <img src="logo.png" alt="logo" />
                        </Link>
                    </div>

                    <Link style={{ textDecoration: 'none' }} to='/sign-in'>
                        <Button variant='text' style={{ marginRight: 10, color: 'gray' }} >{props.User.isAuthenticated !== null && props.User.isAuthenticated ? 'Profile' : 'Sign In'}</Button>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} to='/appointment'>
                        <Button variant="outlined" color="primary">
                            Make an appointment
                        </Button>
                    </Link>

                </Toolbar>
            </AppBar>
            <Toolbar id="back-to-top-anchor" />

            <Carousel autoPlay indicators={false}>
                {
                    items.map((item, i) => <Item key={i} item={item} />)
                }
            </Carousel>
            <Grid container justify="center">
                <Grid item xs={4}>
                    <Card style={{ backgroundColor: 'lightblue', height: 300, width: '100%' }}>
                        <CardContent style={{ paddingLeft: 100, paddingTop: 60 }}>
                            <PersonalVideoIcon style={{ fontSize: 70, color: '#303f9f' }} />
                            <Typography variant="h5" style={{ color: '#303f9f' }}>Hospitality</Typography>
                            <Typography variant="body1" style={{ color: '#303f9f' }}>Clinical excellence must be the priority for any health care service provider</Typography>
                            <Button variant="outlined" style={{ color: '#303f9f', marginTop: 20 }}> Apply for bed</Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card style={{ backgroundColor: 'lightcyan', height: 300, width: '100%' }}>
                        <CardContent style={{ paddingLeft: 50, paddingTop: 60 }}>
                            <PhoneInTalkIcon style={{ fontSize: 70, color: '#303f9f' }} />
                            <Typography variant="h5" style={{ color: '#303f9f' }}>Emergency Care</Typography>
                            <Typography variant="body1" style={{ color: '#303f9f' }}>Clinical excellence must be the priority for any health care service provider</Typography>
                            <Button variant="outlined" style={{ color: '#303f9f', marginTop: 20 }}> +10 352 676 4996</Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card style={{ backgroundColor: 'lightblue', height: 300, width: '100%' }}>
                        <CardContent style={{ paddingLeft: 50, paddingTop: 60 }}>
                            <LocalHospitalIcon style={{ fontSize: 70, color: '#303f9f' }} />
                            <Typography variant="h5" style={{ color: '#303f9f' }}>Chamber Service</Typography>
                            <Typography variant="body1" style={{ color: '#303f9f' }}>Clinical excellence must be the priority for any health care service provider</Typography>
                            <Button variant="outlined" style={{ color: '#303f9f', marginTop: 20 }}> Make an appointment</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container style={{ marginTop: 100 }}>
                <Grid item xs={6}>
                    <Card style={{ position: 'relative', marginLeft: 230, height: 605 }}>
                        <CardContent>
                            <img src='image/1.png' />
                            <img src='image/2.png' style={{ position: 'absolute', top: 150, left: 150 }} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <div style={{ marginLeft: 80, maxWidth: 500 }}>
                        <Typography variant="body1" style={{ fontSize: 20, marginTop: 120 }}>Welcome to panacea</Typography>
                        <Typography variant="body1" style={{ fontSize: 20, color: 'lightblue' }}>____________</Typography>
                        <Typography variant="h4" style={{ marginTop: 20 }}>
                            <Box fontWeight="fontWeightBold" m={1}>
                                BEST CARE FOR YOUR
                            </Box>
                        </Typography>
                        <Typography variant="h4" >
                            <Box fontWeight="fontWeightBold" m={1}>
                                GOOD HEALTH
                            </Box>
                        </Typography>
                        <Typography variant='body1' style={{ fontsize: 20, marginLeft: 10 }}>
                            Esteem spirit temper too say adieus who direct esteem.
                            It esteems luckily or picture placing drawing.
                            Apartments frequently or motionless on reasonable projecting expression.
                        </Typography>

                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 20, marginLeft: 5 }}>
                            <CheckCircleOutlineIcon style={{ color: 'cyan' }} />
                            <text>Apartments frequently or motionless.</text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 5 }}>
                            <CheckCircleOutlineIcon style={{ color: 'cyan' }} />
                            <text>Duis aute irure dolor in reprehenderit in voluptate.</text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 5 }}>
                            <CheckCircleOutlineIcon style={{ color: 'cyan' }} />
                            <text>Voluptatem quia voluptas sit aspernatur.</text>
                        </div>
                    </div>
                </Grid>
            </Grid>

            <Paper justify='center' style={{ paddingTop: 100, paddingBottom: 100, backgroundColor: 'lightcyan', marginTop: 100 }}>
                <Typography variant='h3' style={{ marginLeft: 600 }}>Our Department</Typography>
                <Typography variant="body1" style={{ marginLeft: 750, fontSize: 20, color: 'lightblue' }}>_______</Typography>
                <Grid container>
                    <Grid item xs={4} >
                        <Card style={{ marginLeft: 180, maxWidth: 350 }}>
                            <img
                                src='image/department/1.png'
                            />
                            <CardContent>
                                <Typography variant='h5'>Eye care</Typography>
                                <Typography variant='body1'>Esteem spirit temper too say adieus who direct esteem.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card style={{ marginLeft: 90, maxWidth: 350 }}>
                            <img
                                src='image/department/2.png'
                            />
                            <CardContent>
                                <Typography variant='h5'>Physical therapy</Typography>
                                <Typography variant='body1'>Esteem spirit temper too say adieus who direct esteem.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card style={{ marginLeft: 30, maxWidth: 350 }}>
                            <img
                                src='image/department/3.png'
                            />
                            <CardContent>
                                <Typography variant='h5'>Dental care</Typography>
                                <Typography variant='body1'>Esteem spirit temper too say adieus who direct esteem.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid container style={{ marginTop: 30 }}>
                    <Grid item xs={4} >
                        <Card style={{ marginLeft: 180, maxWidth: 350 }}>
                            <img
                                src='image/department/4.png'
                            />
                            <CardContent>
                                <Typography variant='h5'>Diagnostic Test</Typography>
                                <Typography variant='body1'>Esteem spirit temper too say adieus who direct esteem.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card style={{ marginLeft: 90, maxWidth: 350 }}>
                            <img
                                src='image/department/5.png'
                            />
                            <CardContent>
                                <Typography variant='h5'>Skin Surgery</Typography>
                                <Typography variant='body1'>Esteem spirit temper too say adieus who direct esteem.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card style={{ marginLeft: 30, maxWidth: 350 }}>
                            <img
                                src='image/department/6.png'
                            />
                            <CardContent>
                                <Typography variant='h5'>Surgery Service</Typography>
                                <Typography variant='body1'>Esteem spirit temper too say adieus who direct esteem.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            <Carousel autoPlay indicators={false}>
                {
                    testmonialItems.map((item, i) => <TestmonialCarousel key={i} item={item} />)
                }
            </Carousel>

            <Footer title={'Panacea'} description={'Not the medical care you need but the medical care you want'} />

            <ScrollTop {...props}>
                <Fab color="primary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
        </div>
    );
}

const TestmonialCarousel = (props) => {
    return (
        < Card style={{ position: 'relative' }}>
            <CardContent>
                <CardMedia style={{ height: 600, opacity: 0.5 }} image={props.item.image} />
                <Paper style={{ position: 'absolute', top: 70, left: 350, height: 350, width: 800, backgroundColor: 'transparent', paddingTop: 100 }} elevation={0}>

                    <Typography variant='h4' align='center' style={{ color: 'grey' }}><FormatQuoteIcon style={{ fontSize: 100 }} /></Typography>
                    <Typography variant='h4' align='center' style={{ color: 'grey' }}>{props.item.statement}</Typography>
                    <Typography variant='h5' align='center' style={{ color: 'black', marginTop: 20 }}>{props.item.name}</Typography>
                </Paper>
            </CardContent>
        </Card >
    )
}

function Item(props) {
    return (
        <Card>
            <CardContent>
                <CardMedia style={{ height: 600, padding: 180 }} image={props.item.image} >
                    <Typography variant="h2" >
                        <Box fontWeight="fontWeightBold" m={1}>
                            HEALTH CARE
                        </Box>
                    </Typography>
                    <Typography variant="h2">
                        FOR WHOLE FAMILY
                    </Typography>
                    <Typography variant="body1" >
                        In healthcare sector, service excellence is the facility of the hospital as
                        healthcare service provider to consistently.
                    </Typography>
                    <Button style={{ marginTop: 20 }} size="large" variant="contained" color="primary">Check Our Services</Button>
                </CardMedia>
            </CardContent>
        </Card>
    )
}

Footer.propTypes = {
    description: PropTypes.string,
    title: PropTypes.string,
};