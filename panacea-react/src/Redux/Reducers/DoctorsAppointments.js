import * as ActionTypes from '../ActionTypes';

export const DoctorsAppointments = (state = {
    isLoading: false,
    errorMessage: null,
    appointments: null
}, action) => {
    switch (action.type) {
        case ActionTypes.DOCTORS_APPOINTMENT_LOADING:
            return { ...state, isLoading: true, errorMessage: null, appointments: null };
        case ActionTypes.DOCTORS_APPOINTMENT_SUCCESS:
            return { ...state, isLoading: false, errorMessage: null, appointments: action.appointments };
        case ActionTypes.DOCTORS_APPOINTMENT_FAILURE:
            return { ...state, isLoading: false, errorMessage: action.message, appointments: null };

        default:
            return state
    }
}