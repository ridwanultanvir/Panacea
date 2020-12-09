import React, { Component } from 'react';
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
import MenuItem from '@material-ui/core/MenuItem';
import { mainListItems, secondaryListItems } from '../Homepage/listItems';
import { Redirect } from 'react-router-dom';
import { Form } from 'react-redux-form';
import { TextField, Button, CardContent, Card } from '@material-ui/core';
import CopyRight from '../../Copyright';
import { baseUrl } from '../../../Redux/ActionCreator';


const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: 'flex',
    },
    button: {
        '& > *': {
            margin: theme.spacing(1),
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
    submit: {
        margin: theme.spacing(3, 0, 2),
        maxWidth: 200
    },
});


class Dispensary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            admitDate:null,
            patientID: null,
            stockAdd: null,
            newPrice: null,
            selectStock: null,
            med_name:  null,
            med_id: null,
            med_data: null,
            redirect: false,
        };

        this.renderDispensary = this.renderDispensary.bind(this);
        this.fetchMedData = this.fetchMedData.bind(this);
        this.dispenseMed = this.dispenseMed.bind(this);
    }

    fetchMedData() {
        if (this.state.med_id === null || this.state.med_name === null) {
            alert("Please Fill All The Boxes Properly");
            return;
        }
        let creds = JSON.parse(this.props.User.creds);
        let body = {
            'userID':creds.userId, 'token': this.props.User.token,
            'med_id': this.state.med_id, 'med_name': this.state.med_name
        }
        fetch(baseUrl + 'checkup/get_med_details/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
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
                if (response.success !== true) {
                    alert(response.errorMessage);
                }
                else if (response.success) {
                    console.log(response.med_data)
                    this.setState({ med_data: response.med_data })
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

    dispenseMed() {
        if (this.state.patientID === null || this.state.amount === null) {
            alert("Please Fill All The Boxes Properly");
            return;
        }
        if (this.state.med_data.stock < this.state.amount) {
            alert("The Selected Amount Is Greater Than Stock");
            return;
        }
        let creds = JSON.parse(this.props.User.creds);
        let body = {
            'userID':creds.userId, 'token': this.props.User.token,
            'patientID': this.state.patientID, 'quantity': this.state.amount, 'medID': this.state.med_id
        }
        //console.log(body);
        fetch(baseUrl + 'checkup/sell-medicine/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
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
                if (response.success !== true) {
                    alert(response.errorMessage);
                }
                else if (response.success) {
                    alert(response.Message)
                    this.setState({ redirect: true })
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

    addStock() {
        if (this.state.stockAdd === null ) {
            alert("Please Fill Quantity to be Added");
            return;
        }
        let creds = JSON.parse(this.props.User.creds);
        let body = {
            'userID':creds.userId, 'token': this.props.User.token, 'medID': this.state.med_id,
            'amount': this.state.stockAdd, 'new_price': (this.state.newPrice===null?0:this.state.newPrice),
        }
        fetch(baseUrl + 'checkup/add_to_stock/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
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
                if (response.success !== true) {
                    alert(response.errorMessage);
                }
                else if (response.success) {
                    alert(response.Message)
                    this.setState({ redirect: true })
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

    

    renderDispensary() {
        const { classes } = this.props;
        if (this.state.redirect === true) {
            return (<Redirect to='/nurse/home' />);
        }
        else if (this.props.User.isAuthenticated && this.props.User.category === 'NURSE') {
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Nurse
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

                                <Card style={{ marginBottom: 20 }}>
                                    <CardContent>
                                    <Button variant="contained" color="primary" onClick={() => this.setState({selectStock: false, med_data: null})}
                                        style={{width:'35%', marginLeft:'10%'}}>Dispense Medicine</Button> 
                                    <Button variant="contained" color="primary" onClick={() => this.setState({selectStock: true, med_data: null})}
                                        style={{width:'35%', marginLeft:'10%'}}>Add To Stock</Button>    
                                    </CardContent>
                                </Card>
                            {this.state.selectStock === true ?
                                (<div>
                                    <Typography variant="h5">
                                        Add To Current Stock
                                    </Typography>
                                    <Form model='AdminScheduleUserID' onSubmit={() => this.fetchMedData()}>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="med-name"
                                            label="Medicine Name"
                                            name="med-name"
                                            autoComplete="Medicine Name"
                                            autoFocus
                                            onChange={(event) => this.setState({med_name: event.target.value})}
                                        />
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="med-id"
                                            label="Medicine ID"
                                            name="med-id"
                                            autoComplete="Medicine ID"
                                            autoFocus
                                            onChange={(event) => this.setState({med_id: event.target.value})}
                                        />
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                        >
                                            View Details
                                        </Button>
                                    </Form>
                                </div>):
                                null
                            }

                            {(this.state.selectStock === false )?
                                (<div>
                                    <Typography variant="h5">
                                        Discharge Medicine
                                    </Typography>
                                    <Form model='AdminScheduleUserID' onSubmit={() => this.fetchMedData()}>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="med-name"
                                            label="Medicine Name"
                                            name="med-name"
                                            autoComplete="Medicine Name"
                                            autoFocus
                                            onChange={(event) => this.setState({med_name: event.target.value})}
                                        />
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="med-id"
                                            label="Medicine ID"
                                            name="med-id"
                                            autoComplete="Medicine ID"
                                            autoFocus
                                            onChange={(event) => this.setState({med_id: event.target.value})}
                                        />
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                        >
                                            View Details
                                        </Button>
                                    </Form>
                                </div>):
                                null
                            }

                            {(this.state.med_data !== null && this.state.selectStock === true) ?
                                (<div><Card style={{ marginBottom: 20 }}>
                                    <CardContent>
                                    <Typography variant="h6">Medicine Name: {this.state.med_data.med_name} </Typography>
                                        <Typography variant="body1">Stock Quantity: {this.state.med_data.stock}</Typography>
                                        <Typography variant="body1">Price Per Piece: {this.state.med_data.price_per_piece}</Typography>
                                        <Typography variant="body1">Medicine Genre: {this.state.genre}</Typography>
                                    </CardContent>
                                </Card> 
                                <Card style={{ padding: 20 }}>
                                    <Form model='AdminScheduleUserID' onSubmit={() => this.addStock()}>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="add_stock"
                                            label="Increment Stock By"
                                            name="add_stock"
                                            autoComplete="0"
                                            autoFocus
                                            onChange={(event) => this.setState({stockAdd: event.target.value})}
                                        />
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="price"
                                            label="New Price"
                                            name="price"
                                            autoComplete="+0"
                                            autoFocus
                                            onChange={(event) => this.setState({newPrice: event.target.value})}
                                        />
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                        >
                                            Save Changes
                                        </Button>
                                    </Form>
                                </Card></div>):
                                null
                            }


                            {(this.state.med_data !== null && this.state.selectStock === false) ?
                                (<div><Card style={{ marginBottom: 20 }}>
                                    <CardContent>
                                    <Typography variant="h6">Medicine Name: {this.state.med_data.med_name} </Typography>
                                        <Typography variant="body1">Stock Quantity: {this.state.med_data.stock}</Typography>
                                        <Typography variant="body1">Price Per Piece: {this.state.med_data.price_per_piece}</Typography>
                                        <Typography variant="body1">Medicine Genre: {this.state.genre}</Typography>
                                    </CardContent>
                                </Card> 
                                <Card style={{ padding: 20 }}>
                                    <Form model='AdminScheduleUserID' onSubmit={() => this.dispenseMed()}>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="patient_id"
                                            label="Assigned To Patient"
                                            name="patient_id"
                                            autoComplete="0"
                                            autoFocus
                                            onChange={(event) => this.setState({patientID: event.target.value})}
                                        />
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="amount"
                                            label="Amount"
                                            name="amount"
                                            autoComplete="+0"
                                            autoFocus
                                            onChange={(event) => this.setState({amount: event.target.value})}
                                        />
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                        >
                                            Discharge
                                        </Button>
                                    </Form>
                                </Card></div>):
                                null
                            }

                                


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
        const renderDispensary = this.renderDispensary();
        return (
            <React.Fragment>
                {renderDispensary}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Dispensary);