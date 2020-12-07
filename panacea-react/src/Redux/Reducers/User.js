import * as ActionTypes from '../ActionTypes';

export const User = (
    state = {
        isLoading: false,
        isAuthenticated: sessionStorage.getItem('token') ? true : false,
        loginErrorMessage: null,
        token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : null,
        userData: sessionStorage.getItem('userData') ? sessionStorage.getItem('userData') : null,
        creds: sessionStorage.getItem('creds') ? sessionStorage.getItem('creds') : null,
        category: sessionStorage.getItem('userCategory') ? sessionStorage.getItem('userCategory') : null,

        updateErrorMessage: null,
        updateLoading: false
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.USER_LOGIN_REQUEST:
            return { ...state, isLoading: true, isAuthenticated: false, loginErrorMessage: null, token: null, userData: null, creds: null, category: null };
        case ActionTypes.USER_LOGIN_SUCCESS:
            return { ...state, isLoading: false, isAuthenticated: true, loginErrorMessage: null, token: action.token, userData: JSON.stringify(action.userData), category: action.category, creds: sessionStorage.getItem('creds') };
        case ActionTypes.USER_LOGIN_FAILURE:
            return { ...state, isLoading: false, isAuthenticated: false, loginErrorMessage: action.message, token: null, userData: null, creds: null, category: null };

        case ActionTypes.UPDATE_USER_LOADING:
            return { ...state, updateLoading: true, updateErrorMessage: null }
        case ActionTypes.UPDATE_USER_SUCCESS:
            return { ...state, updateErrorMessage: null, userData: JSON.stringify(action.userData), updateLoading: false };
        case ActionTypes.UPDATE_USER_FAILURE:
            return { ...state, updateErrorMessage: action.message, updateLoading: false };

        default:
            return state;
    }
}