import * as ActionTypes from './ActionTypes';
import { Appointments } from './Reducers/ReceptionistsAppointment';

export const baseUrl = 'http://localhost:8000/'

const userLoginRequest = (creds) => {
    return {
        type: ActionTypes.USER_LOGIN_REQUEST,
        creds: creds
    }
}

const userLoginSuccess = (token, userData, category) => {
    return {
        type: ActionTypes.USER_LOGIN_SUCCESS,
        token: token,
        userData: userData,
        category: category
    }
}

const userLoginFailure = (errorMessage) => {
    return {
        type: ActionTypes.USER_LOGIN_FAILURE,
        message: errorMessage
    }
}

export const loginUser = (creds) => (dispatch) => {
    dispatch(userLoginRequest(JSON.stringify(creds)));
    sessionStorage.setItem('creds', JSON.stringify(creds));
    console.log(sessionStorage.getItem('creds'));
    //alert(creds)
    fetch(baseUrl + 'user/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
    })
        .then((response) => {
            console.log(response);
            if (response.ok) {
                return response;
            }
            else {
                console.log('ulala1')
                let err = new Error('Error ' + response.status + ': ' + response.statusText);
                err.response = response;
                throw err;
            }
        })
        .then((response) => response.json())
        .then((response) => {
            //alert(JSON.stringify(response));
            if (response.success) {
                console.log('ulala2')
                sessionStorage.setItem('token', response.token);
                sessionStorage.setItem('userData', JSON.stringify(response.userData));
                sessionStorage.setItem('userCategory', response.category);
                dispatch(userLoginSuccess(response.token, response.userData, response.category))
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            console.log('ulala3')
            alert(err.message);
            dispatch(userLoginFailure(err.message))
        });

    // alert(JSON.stringify(creds))
}

const scheduleLoading = (userID) => {
    return {
        type: ActionTypes.EMP_SHCEDULE_TABLE_LOADING,
        userID: userID
    }
}


const docScheduleLoading = (userID) => {
    return {
        type: ActionTypes.SHCEDULE_TABLE_LOADING,
        userID: userID
    }
}
const docScheduleSuccess = (scheduleData, docData) => {
    return {
        type: ActionTypes.SCHEDULE_TABLE_SUCCESS,
        scheduleData: scheduleData,
        docData: docData
    }
}

const empScheduleSuccess = (scheduleData, empData) => {
    return {
        type: ActionTypes.EMP_SCHEDULE_TABLE_SUCCESS,
        scheduleData: scheduleData,
        empData: empData
    }
}

const docScheduleFailure = (message) => {
    return {
        type: ActionTypes.SCHEDULE_TABLE_FAILURE,
        message: message
    }
}

const scheduleFailure = (message) => {
    return {
        type: ActionTypes.EMP_SCHEDULE_TABLE_FAILURE,
        message: message
    }
}


export const loadEmpSchedule = (body) => (dispatch) => {
    //console.log(body.empUserID);
    dispatch(scheduleLoading(body.empUserID));

    fetch(baseUrl + 'schedule/schedule-table/', {
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
            if (response.success) {
                dispatch(empScheduleSuccess(response.scheduleData, response.empData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(scheduleFailure(err.message));
        });
}


export const loadDocSchedule = (body) => (dispatch) => {
    //console.log(body.docUserID);
    dispatch(docScheduleLoading(body.docUserID));

    fetch(baseUrl + 'schedule/schedule-table/', {
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
            if (response.success) {
                dispatch(docScheduleSuccess(response.scheduleData, response.docData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(docScheduleFailure(err.message));
        });
}


const deleteScheduleLoading = () => {
    return {
        type: ActionTypes.DELETE_SCHEDULE_LOADING
    }
}

const deleteScheduleSuccess = (scheduleData) => {
    return {
        type: ActionTypes.DELETE_SCHEDULE_SUCCESS,
        scheduleData: scheduleData
    }
}

const deleteScheduleFailure = (message) => {
    return {
        type: ActionTypes.SCHEDULE_TABLE_FAILURE,
        message: message
    }
}


export const deleteSchedule = (body) => (dispatch) => {
    dispatch(deleteScheduleLoading());
    fetch(baseUrl + 'schedule/delete-schedule/', {
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
            if (response.success) {
                dispatch(deleteScheduleSuccess(response.scheduleData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(deleteScheduleFailure(err.message))
        })
}

const addScheduleLoading = () => {
    return {
        type: ActionTypes.ADD_SCHEDULE_LOADING
    }
}

const addScheduleSuccess = (scheduleData) => {
    return {
        type: ActionTypes.ADD_SCHEDULE_SUCCESS,
        scheduleData: scheduleData
    }
}
const addScheduleFailure = (message) => {
    return {
        type: ActionTypes.ADD_SCHEDULE_FAILURE,
        message: message
    }
}

export const addSchedule = (body) => (dispatch) => {
    dispatch(addScheduleLoading());
    fetch(baseUrl + 'schedule/add-schedule/', {
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
            if (response.success) {
                dispatch(addScheduleSuccess(response.scheduleData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(addScheduleFailure(err.message));
        });
}

export const addScheduleRange = (body) => (dispatch) => {
    dispatch(addScheduleLoading());
    fetch(baseUrl + 'schedule/add-schedule-range/', {
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
            if (response.success) {
                dispatch(addScheduleSuccess(response.scheduleData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(addScheduleFailure(err.message));
        });
}

const timeTableLoading = () => {
    return {
        type: ActionTypes.TIME_TABLE_LOADING
    }
}

const timeTableSuccess = (timeTableData) => {
    return {
        type: ActionTypes.TIME_TABLE_SUCCESS,
        timeTableData: timeTableData
    }
}
const timeTableFailure = (message) => {
    return {
        type: ActionTypes.TIME_TABLE_FAILURE,
        message: message
    }
}



export const loadTimeTable = (body) => (dispatch) => {
    dispatch(timeTableLoading());

    fetch(baseUrl + 'schedule/time-table/', {
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
            if (response.success) {
                dispatch(timeTableSuccess(response.timeTableData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(timeTableFailure(err.message));
        });
}


const wardTableLoading = () => {
    return {
        type: ActionTypes.WARD_TABLE_LOADING
    }
}

const wardTableSuccess = (wardTableData) => {
    return {
        type: ActionTypes.WARD_TABLE_SUCCESS,
        wardTableData: wardTableData
    }
}

const wardTableLoadWards = (wardCategory) => {
    return {
        type: ActionTypes.WARD_TABLE_LOAD_WARDS,
        wardCategory: wardCategory
    }
}

const wardTableFailure = (message) => {
    return {
        type: ActionTypes.WARD_TABLE_FAILURE,
        message: message
    }
}

export const loadWardCategory = (body) => (dispatch) => {
    dispatch(wardTableLoading());

    fetch(baseUrl + 'schedule/ward-category/', {
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
            if (response.success) {
                dispatch(wardTableLoadWards(response.wardCategory));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(wardTableFailure(err.message));
        });
}


export const loadWardTable = (body) => (dispatch) => {
    dispatch(wardTableLoading());

    fetch(baseUrl + 'schedule/ward-table/', {
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
            if (response.success) {
                dispatch(wardTableSuccess(response.blockList));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(wardTableFailure(err.message));
        });
}


const appointmentDataLoading = (userID) => {
    return {
        type: ActionTypes.SCH_SUR_TABLE_LOADING,
        userID: userID
    }
}

const appointmentDataSuccess = (appointmentData) => {
    console.log(appointmentData.app_sl_no)
    return {
        type: ActionTypes.LOAD_APPNT_DATA_SUCCESS,
        app_sl_no: appointmentData.app_sl_no,
        patientData: appointmentData.patientData,
        appntDocData: appointmentData.appntDocData,
    }
}

export const loadAppointmentData = (body) => (dispatch) => {
    dispatch(appointmentDataLoading(body.userID));

    fetch(baseUrl + 'schedule/appointment-data/', {
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
            if (response.success) {
                dispatch(appointmentDataSuccess(response.appointmentData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            //dispatch(scheduleFailure(err.message));
        });
}


const docDeptDataLoading = (userID) => {
    return {
        type: ActionTypes.SCH_SUR_TABLE_LOADING,
        userID: userID
    }
}


const docDeptDataSuccess = (docData) => {
    return {
        type: ActionTypes.LOAD_DOC_DATA_SUCCESS,
        docData: docData,
    }
}


export const loadDocDeptData = (body) => (dispatch) => {
    dispatch(docDeptDataLoading(body.userID));

    fetch(baseUrl + 'schedule/doc-dept-list/', {
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
            if (response.alertMessage === "Not Okay") {
                alert("No Doctor available on the selected Day");
            }
            else if (response.success) {
                console.log("dispatching");
                dispatch(docDeptDataSuccess(response.docData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            //dispatch(scheduleFailure(err.message));
        });
}


const roomDataSuccess = (roomData) => {
    return {
        type: ActionTypes.LOAD_ROOM_DATA_SUCCESS,
        roomData: roomData,
    }
}


export const loadRoomData = (body) => (dispatch) => {
    dispatch(docDeptDataLoading());

    fetch(baseUrl + 'schedule/surgery-room-list/', {
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
                alert(response.alertMessage);
            }
            else if (response.success) {
                dispatch(roomDataSuccess(response.roomData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(scheduleFailure(err.message));
        });
}


const admitRoomDataSuccess = (roomData) => {
    return {
        type: ActionTypes.LOAD_ADMIT_ROOM_DATA_SUCCESS,
        roomData: roomData,
    }
}

export const loadAdmitRoomData = (body) => (dispatch) => {
    fetch(baseUrl + 'schedule/admit-room-list/', {
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
                alert(response.alertMessage);
            }
            else if (response.success) {
                dispatch(admitRoomDataSuccess(response.roomData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            //dispatch(scheduleFailure(err.message));
        });
}


const fetchRoomTypesSuccess = (roomTypes) => {
    return {
        type: ActionTypes.LOAD_ROOM_TYPES_SUCCESS,
        roomTypes: roomTypes,
    }
}


export const loadRoomTypes = (body) => (dispatch) => {
    fetch(baseUrl + 'schedule/room-types-for-categories/', {
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
                alert(response.alertMessage);
            }
            else if (response.success) {
                dispatch(fetchRoomTypesSuccess(response.roomTypes));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            //dispatch(scheduleFailure(err.message));
        });
}



const patientDataLoading = (userID) => {
    return {
        type: ActionTypes.ADMIT_TABLE_LOADING,
        userID: userID
    }
}

const patientDataSuccess = (patientData) => {
    return {
        type: ActionTypes.LOAD_PATIENT_DATA_SUCCESS,
        patientData: patientData
    }
}

export const patientDetails = (body) => (dispatch) => {
    dispatch(patientDataLoading(body.userID));

    fetch(baseUrl + 'schedule/patient-details/', {
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
            if (response.success) {
                dispatch(patientDataSuccess(response.patientData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            //dispatch(scheduleFailure(err.message));
        });
}

export const addSurgerySchedule = (body) => (dispatch) => {
    dispatch(docDeptDataLoading());

    fetch(baseUrl + 'schedule/add-sur-schedule/', {
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
                alert(response.message);
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(scheduleFailure(err.message));
        });
}

export const addAdmitPatient = (body) => (dispatch) => {

    fetch(baseUrl + 'schedule/admit-patient/', {
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
                alert(response.alertMessage)
            }
            else if (response.success) {
                alert(response.alertMessage);
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            //dispatch(scheduleFailure(err.message));
        });
}

const freeTimeSURDataSuccess = (freeTimeData) => {
    return {
        type: ActionTypes.LOAD_FREE_TIME_DATA,
        freeTimeData: freeTimeData,
    }
}


export const loadFreeSURTimeData = (body) => (dispatch) => {
    dispatch(docDeptDataLoading());

    fetch(baseUrl + 'schedule/surgery-room-list/', {
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
            if (response.success) {
                dispatch(freeTimeSURDataSuccess(response.appointmentData));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(scheduleFailure(err.message));
        });
}


const receptionistAppointmentLoading = () => {
    return {
        type: ActionTypes.RECEPTIONIST_APPOINTMENT_LOADING
    };
}


const receptionistAppointmentSuccess = (appointments) => {
    return {
        type: ActionTypes.RECEPTIONIST_APPOINTMENT_SUCCESS,
        appointments: appointments
    }
}

const receptionistAppointmentFailure = (message) => {
    return {
        type: ActionTypes.RECEPTIONIST_APPOINTMENT_FAILURE,
        message: message
    };
}

export const getReceptionistAppointments = (body) => (dispatch) => {
    dispatch(receptionistAppointmentLoading());

    fetch(baseUrl + 'appointment/get-receptionist-appointments/', {
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
            if (response.success) {
                dispatch(receptionistAppointmentSuccess(response.appointments))
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(receptionistAppointmentFailure(err.message));
        });
}


const acceptReceptionistAppointmentLoading = () => {
    return {
        type: ActionTypes.ACCEPT_RECEPTIONIST_APPOINTMENT_LOADING
    }
}
const acceptReceptionistAppointmentSuccess = (appointments) => {
    return {
        type: ActionTypes.ACCEPT_RECEPTIONIST_APPOINTMENT_SUCCESS,
        appointments: appointments
    }
}

const acceptReceptionistAppointmentFailure = (message) => {
    return {
        type: ActionTypes.ACCEPT_RECEPTIONIST_APPOINTMENT_FAILURE,
        message: message
    }
}

export const acceptReceptionistAppointment = (body) => (dispatch) => {
    dispatch(acceptReceptionistAppointmentLoading());
    fetch(baseUrl + 'appointment/accept-receptionist-appointment/', {
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
            if (response.success) {
                dispatch(acceptReceptionistAppointmentSuccess(response.appointments));
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(acceptReceptionistAppointmentFailure(err.message));
        });
}

const doctorAppointmentLoading = () => {
    return {
        type: ActionTypes.DOCTORS_APPOINTMENT_LOADING
    }
}

const doctorAppointmentSuccess = (appointments) => {
    return {
        type: ActionTypes.DOCTORS_APPOINTMENT_SUCCESS,
        appointments: appointments
    }
}

const doctorsAppointmentFailure = (message) => {
    return {
        type: ActionTypes.DOCTORS_APPOINTMENT_FAILURE,
        message: message
    }
}

export const getDoctorsAppointment = (body) => (dispatch) => {
    dispatch(doctorAppointmentLoading());

    fetch(baseUrl + 'appointment/get-all-doc-appointment/', {
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
            if (response.success) {
                dispatch(doctorAppointmentSuccess(response.appointments))
            }
            else {
                let err = new Error(response.errorMessage);
                err.response = response;
                throw err;
            }
        })
        .catch((err) => {
            alert(err.message);
            dispatch(doctorsAppointmentFailure(err.message));
        });
}