import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createForms } from 'react-redux-form';
import { InitialFeedback, InitialScheduleUserIDValue, AppointmentPageLogin } from './Reducers/forms';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger';
import { User } from './Reducers/User';
import { ScheduleTable } from './Reducers/ScheduleTable';
import { TimeTable } from './Reducers/TimeTable';
import { ReceptionistsAppointments } from './Reducers/ReceptionistsAppointment';
import { DoctorsAppointments } from './Reducers/DoctorsAppointments';
import { WardTable } from './Reducers/WardTable';
import { ScheduleSurgeryTable } from './Reducers/ScheduleSurgery';
import { AdmitPatientTable } from './Reducers/AdmitpatientTable';
import {ScheduleEmpTable} from './Reducers/ScheduleEmpTable';


export const configureStore = () => {
    const store = createStore(
        combineReducers({
            User: User,
            ScheduleTable: ScheduleTable,
            ScheduleEmpTable: ScheduleEmpTable,
            TimeTable: TimeTable,
            WardTable: WardTable,
            ScheduleSurgeryTable: ScheduleSurgeryTable,
            AdmitPatientTable: AdmitPatientTable,
            ReceptionistsAppointments: ReceptionistsAppointments,
            DoctorsAppointments: DoctorsAppointments,
            ...createForms({
                LoginForm: InitialFeedback,
                AdminScheduleUserID: InitialScheduleUserIDValue,
                AppointmentPageLogin: AppointmentPageLogin
            })
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}