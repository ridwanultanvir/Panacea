import * as ActionTypes from '../ActionTypes';

export const TimeTable = (state = {
    isLoading: false,
    errorMessage: null,
    timeTable: null
}, action) => {
    switch (action.type) {
        case ActionTypes.TIME_TABLE_LOADING:
            return { ...state, isLoading: true, errorMessage: null, timeTable: null };
        case ActionTypes.TIME_TABLE_SUCCESS:
            return { ...state, isLoading: false, errorMessage: null, timeTable: action.timeTableData };
        case ActionTypes.TIME_TABLE_FAILURE:
            return { ...state, isLoading: false, errorMessage: action.message, timeTable: null };
        default:
            return state
    }
}