import * as ActionTypes from '../ActionTypes';

export const ScheduleSurgeryTable = (state = {
    isLoading: false,
    errorMessage: null,
    userID: null,
    //patientID: null,
    patientData: null,
    appntDocData: null,
    docData: null,
    app_sl_no: null,
    //ref_appnt_sl_no: null,
    freeTimeData: null,
    roomData: null
}, action) => {
    switch (action.type) {
        case ActionTypes.SCH_SUR_TABLE_LOADING:
            return { ...state, isLoading: true, errorMessage: null, userID: action.userID };
        case ActionTypes.LOAD_APPNT_DATA_SUCCESS:
            return { ...state, isLoading: false, app_sl_no: action.app_sl_no, errorMessage: null, patientData: action.patientData, appntDocData: action.appntDocData };
        case ActionTypes.SCHEDULE_TABLE_FAILURE:
            return { ...state, isLoading: false, errorMessage: action.message, userID: null };
        case ActionTypes.LOAD_DOC_DATA_SUCCESS:
            return { ...state, isLoading: false, errorMessage: null, docData: action.docData };
        // case ActionTypes.LOAD_TIME_DATA_SUCCESS:
        //     return {...state, isLoading: false, errorMessage:null, timeData: action.timeData};
        case ActionTypes.LOAD_FREE_TIME_DATA:
            return { ...state, isLoading: false, errorMessage: null, freeTimeData: action.freeTimeData };
        case ActionTypes.LOAD_ROOM_DATA_SUCCESS:
            return { ...state, isLoading: false, errorMessage: null, roomData: action.roomData };

        // case ActionTypes.DELETE_SCHEDULE_LOADING:
        //     return { ...state, isLoading: true };
        // case ActionTypes.DELETE_SCHEDULE_SUCCESS:
        //     return { ...state, isLoading: false, schedule: action.scheduleData };
        // case ActionTypes.DELETE_SCHEDULE_FAILURE:
        //     return { ...state, isLoading: false, errorMessage: action.message };

        // case ActionTypes.ADD_SCHEDULE_LOADING:
        //     return { ...state, isLoading: true };
        // case ActionTypes.ADD_SCHEDULE_SUCCESS:
        //     return { ...state, isLoading: false, schedule: action.scheduleData };
        // case ActionTypes.ADD_SCHEDULE_FAILURE:
        //     return { ...state, isLoading: false, errorMessage: action.message };

        default:
            return state
    }
}