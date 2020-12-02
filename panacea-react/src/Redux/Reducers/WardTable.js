import * as ActionTypes from '../ActionTypes';

export const WardTable = (state = {
    isLoading: false,
    errorMessage: null,
    wardCategory: null,
    selectedWard: null,
    wardTable: null,
}, action) => {
    switch (action.type) {
        case ActionTypes.WARD_TABLE_LOADING:
            return { ...state, isLoading: true, errorMessage: null, wardTable: null, selectedWard: null };
        case ActionTypes.WARD_TABLE_SUCCESS:
            return { ...state, isLoading: false, errorMessage: null, wardTable: action.wardTableData };
        case ActionTypes.WARD_TABLE_FAILURE:
            return { ...state, isLoading: false, errorMessage: action.message, wardTable: null };
        case ActionTypes.WARD_TABLE_LOAD_WARDS:
            return {...state, isLoading: false, errorMessage: null, wardTable: null, wardCategory: action.wardCategory, selectedWard: null};
        case ActionTypes.WARD_TABLE_SELECT_WARD:
            return {...state, isLoading: false, errorMessage: null, wardTable: null, selectedWard: action.selectedWard};
        default:
            return state
    }
}