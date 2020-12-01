import * as ActionTypes from '../ActionTypes';

export const AdmitPatientTable = (state = {
    isLoading: false,
    errorMessage: null,
    userID: null,
    patientData: null,
    roomData: null,
    roomTypes: null,
}, action) => {
    switch (action.type) {
        case ActionTypes.ADMIT_TABLE_LOADING:
            return { ...state, isLoading: true, errorMessage: null, userID: action.userID };
        case ActionTypes.ADMIT_TABLE_FAILURE:
            return { ...state, isLoading: false, errorMessage: action.message, userID: null};
        case ActionTypes.LOAD_ROOM_TYPES_SUCCESS:
            return {...state, roomTypes: action.roomTypes};
        case ActionTypes.LOAD_PATIENT_DATA_SUCCESS:
            return {...state, isLoading: false, errorMessage: null, patientData: action.patientData}
        case ActionTypes.LOAD_ADMIT_ROOM_DATA_SUCCESS:
            return {...state, isLoading: false, errorMessage:null, roomData: action.roomData};

        default:
            return state
    }
}