import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    loginUser,
    loadDocSchedule,
    deleteSchedule,
    loadTimeTable,
    addSchedule,
    getReceptionistAppointments,
    acceptReceptionistAppointment,
    getDoctorsAppointment
} from '../Redux/ActionCreator';

import Home from './HomeComponent';
import SignIn from './SignInComponent';
import AppointmentComponent from './Appointment/AppointmentComponent'
import Profile from './ProfileComponent';
import AdminHome from './Admin/Homepage/AdminProfileHomePageComponent';
import PatientHome from './PatientProfileHomePageComponent';
import Schedule from './Admin/Schedule/ScheduleComponent';
import RegistrationComponent from './Registration/RegistrationComponent'
import ReceptionistHome from './Receptionist/Homepage/ReceptionistHome';
import ReceptionistAppointment from './Receptionist/Appointments/Appointments';
import DoctorHome from './Doctor/Homepage/DoctorHome';
import DoctorAppointment from './Doctor/Appointment/Appointment';
import AllDoctorAppointment from './Doctor/AllAppointments/AllAppointments';
import DocDiagnosis from './Doctor/Appointment/Diagnosis';
import ApproveTest from './Receptionist/ApproveTests/ApproveTests'
import Services from './Receptionist/ApproveTests/Services';
import TechnicianHome from './Technician/Homepage/TechnicianHome';
import PendingTests from './Technician/PendingTests/PendingTests';
import TestResult from './Technician/PendingTests/TestResult';

const mapStateToProps = (state) => {
    return {
        User: state.User,
        ScheduleTable: state.ScheduleTable,
        TimeTable: state.TimeTable,
        ReceptionistsAppointments: state.ReceptionistsAppointments,
        DoctorsAppointments: state.DoctorsAppointments
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginUser: (creds) => (dispatch(loginUser(creds))),
        loadDocSchedule: (body) => (dispatch(loadDocSchedule(body))),
        deleteSchedule: (body) => (dispatch(deleteSchedule(body))),
        loadTimeTable: (body) => (dispatch(loadTimeTable(body))),
        addSchedule: (body) => (dispatch(addSchedule(body))),
        getReceptionistAppointments: (body) => (dispatch(getReceptionistAppointments(body))),
        acceptReceptionistAppointment: (body) => (dispatch(acceptReceptionistAppointment(body))),
        getDoctorsAppointment: (body) => (dispatch(getDoctorsAppointment(body))),
    };
}

class Main extends Component {

    constructor(props) {
        super(props);
        this.renderDoctorDiagnosisPage = this.renderDoctorDiagnosisPage.bind(this);
        this.renderReceptionistServicesPage = this.renderReceptionistServicesPage.bind(this);
        this.renderTechnicianTestResultPage = this.renderTechnicianTestResultPage.bind(this);
    }

    renderDoctorDiagnosisPage({ match }) {
        let app_sl_no = match.params.app_sl_no;
        console.log(app_sl_no);

        return (
            <DocDiagnosis
                User={this.props.User}
                app_sl_no={app_sl_no}
            />
        );
    }

    renderReceptionistServicesPage({ match }) {
        let diagnosisID = match.params.diagnosisID;
        console.log(diagnosisID);
        return (
            <Services
                User={this.props.User}
                diagnosisID={diagnosisID}
            />
        );
    }

    renderTechnicianTestResultPage({ match }) {
        let test_result_id = match.params.test_result_id;
        console.log(test_result_id);

        return (
            <TestResult
                User={this.props.User}
                test_result_id={test_result_id}
            />
        );
    }

    render() {
        return (
            <React.Fragment>
                <Switch>
                    <Route path='/home'>
                        <Home
                            User={this.props.User}
                        />
                    </Route>
                    <Route path='/sign-in'>
                        <SignIn
                            loginUser={this.props.loginUser}
                            User={this.props.User}
                        />
                    </Route>
                    <Route path='/appointment'>
                        <AppointmentComponent
                            User={this.props.User}
                        />
                    </Route>
                    <Route path='/profile'>
                        <Profile
                            User={this.props.User}
                        />
                    </Route>
                    <Route path="/admin/home">
                        <AdminHome
                            User={this.props.User}
                        />
                    </Route>
                    <Route path="/admin/schedule">
                        <Schedule
                            User={this.props.User}
                            ScheduleTable={this.props.ScheduleTable}
                            TimeTable={this.props.TimeTable}
                            loadDocSchedule={this.props.loadDocSchedule}
                            deleteSchedule={this.props.deleteSchedule}
                            loadTimeTable={this.props.loadTimeTable}
                            addSchedule={this.props.addSchedule}
                        />
                    </Route>
                    <Route path="/doctor/home">
                        <DoctorHome
                            User={this.props.User}
                        />
                    </Route>
                    <Route exact path="/doctor/appointment">
                        <DoctorAppointment
                            User={this.props.User}
                            getDoctorsAppointment={this.props.getDoctorsAppointment}
                            DoctorsAppointments={this.props.DoctorsAppointments}
                        />
                    </Route>
                    <Route path="/doctor/appointment/all">
                        <AllDoctorAppointment
                            User={this.props.User}
                            getDoctorsAppointment={this.props.getDoctorsAppointment}
                            DoctorsAppointments={this.props.DoctorsAppointments}
                        />
                    </Route>
                    <Route path="/doctor/appointment/:app_sl_no" component={this.renderDoctorDiagnosisPage} />
                    <Route path="/patient/home">
                        <PatientHome
                            User={this.props.User}
                        />
                    </Route>
                    <Route path="/registration">
                        <RegistrationComponent />
                    </Route>
                    <Route path='/receptionist/home'>
                        <ReceptionistHome
                            User={this.props.User}
                        />
                    </Route>
                    <Route path='/receptionist/appointments'>
                        <ReceptionistAppointment
                            User={this.props.User}
                            ReceptionistsAppointments={this.props.ReceptionistsAppointments}
                            getReceptionistAppointments={this.props.getReceptionistAppointments}
                            acceptReceptionistAppointment={this.props.acceptReceptionistAppointment}
                        />
                    </Route>
                    <Route exact path='/receptionist/approve-service'>
                        <ApproveTest
                            User={this.props.User}
                        />
                    </Route>
                    <Route path='/receptionist/approve-service/:diagnosisID' component={this.renderReceptionistServicesPage} />
                    <Route path='/technician/home'>
                        <TechnicianHome
                            User={this.props.User}
                        />
                    </Route>
                    <Route exact path='/technician/pending-tests'>
                        <PendingTests
                            User={this.props.User}
                        />
                    </Route>
                    <Route path='/technician/pending-tests/:test_result_id' component={this.renderTechnicianTestResultPage} />
                    <Redirect to="/home" />
                </Switch>
            </React.Fragment>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));