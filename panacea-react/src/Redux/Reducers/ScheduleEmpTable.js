import * as ActionTypes from '../ActionTypes';

export const ScheduleEmpTable = (state = {
    isLoading: false,
    errorMessage: null,
    userID: null,
    empData: null,
    schedule: null
}, action) => {
    switch (action.type) {
        case ActionTypes.SHCEDULE_TABLE_LOADING:
            return { ...state, isLoading: true, errorMessage: null, userID: action.userID, schedule: null, empData: null };
        case ActionTypes.SCHEDULE_TABLE_SUCCESS:
            return { ...state, isLoading: false, errorMessage: null, schedule: action.scheduleData, empData: action.empData };
        case ActionTypes.SCHEDULE_TABLE_FAILURE:
            return { ...state, isLoading: false, errorMessage: action.message, userID: null, schedule: null, empData: null };

        case ActionTypes.DELETE_SCHEDULE_LOADING:
            return { ...state, isLoading: true };
        case ActionTypes.DELETE_SCHEDULE_SUCCESS:
            return { ...state, isLoading: false, schedule: action.scheduleData };
        case ActionTypes.DELETE_SCHEDULE_FAILURE:
            return { ...state, isLoading: false, errorMessage: action.message };

        case ActionTypes.ADD_SCHEDULE_LOADING:
            return { ...state, isLoading: true };
        case ActionTypes.ADD_SCHEDULE_SUCCESS:
            return { ...state, isLoading: false, schedule: action.scheduleData };
        case ActionTypes.ADD_SCHEDULE_FAILURE:
            return { ...state, isLoading: false, errorMessage: action.message };

        default:
            return state
    }
}