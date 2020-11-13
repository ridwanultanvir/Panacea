import * as ActionTypes from '../ActionTypes';

export const ReceptionistsAppointments = (state = {
    isLoading: false,
    errorMessage: null,
    appointments: null
}, action) => {
    switch (action.type) {
        case ActionTypes.RECEPTIONIST_APPOINTMENT_LOADING:
            return {
                ...state, isLoading: true, errorMessage: null, appointments: null
            };
        case ActionTypes.RECEPTIONIST_APPOINTMENT_SUCCESS:
            return { ...state, isLoading: false, errorMessage: null, appointments: action.appointments };

        case ActionTypes.RECEPTIONIST_APPOINTMENT_FAILURE:
            return { ...state, isLoading: false, errorMessage: action.message, appointments: null };


        case ActionTypes.ACCEPT_RECEPTIONIST_APPOINTMENT_LOADING:
            return { ...state, isLoading: true, errorMessage: null };

        case ActionTypes.ACCEPT_RECEPTIONIST_APPOINTMENT_SUCCESS:
            return { ...state, isLoading: false, errorMessage: null, appointments: action.appointments };

        case ActionTypes.ACCEPT_RECEPTIONIST_APPOINTMENT_FAILURE:
            return { ...state, isLoading: false, errorMessage: action.message, appointments: action.appointments };

        default:
            return state
    }
}