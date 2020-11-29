import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Profile extends Component {
    constructor(props) {
        super(props);
    }

    renderProfile() {
        if (this.props.User.isAuthenticated) {
            if (this.props.User.category === 'admin') {
                return (<Redirect to="/admin/home" />);
            }
            else if (this.props.User.category === 'doctor') {
                return (<Redirect to="/doctor/home" />);
            }
            else if (this.props.User.category === 'patient') {
                return (<Redirect to="/patient/home" />);
            }
            else if (this.props.User.category === 'RECEPTIONIST') {
                return (<Redirect to='/receptionist/home' />);
            }
            else if (this.props.User.category === 'TECHNICIAN') {
                return (<Redirect to='/technician/home' />);
            }
        }
        else {
            return <Redirect to='/sign-in' />
        }
    }


    render() {
        const profile = this.renderProfile();
        return (
            <React.Fragment>
                {profile}
            </React.Fragment>
        );
    }
}

export default Profile;