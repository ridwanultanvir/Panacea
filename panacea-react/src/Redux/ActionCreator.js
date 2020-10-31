import * as ActionTypes from './ActionTypes';

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
                let err = new Error('Error ' + response.status + ': ' + response.statusText);
                err.response = response;
                throw err;
            }
        })
        .then((response) => response.json())
        .then((response) => {
            //alert(JSON.stringify(response));
            if (response.success) {
                sessionStorage.setItem('token', response.token);
                sessionStorage.setItem('userData', response.userData);
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
            alert(err.message);
            dispatch(userLoginFailure(err.message))
        });

    // alert(JSON.stringify(creds))
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

const docScheduleFailure = (message) => {
    return {
        type: ActionTypes.SCHEDULE_TABLE_FAILURE,
        message: message
    }
}


export const loadDocSchedule = (body) => (dispatch) => {
    console.log(body.docUserID);
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








