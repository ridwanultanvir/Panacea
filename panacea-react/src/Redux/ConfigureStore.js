import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createForms } from 'react-redux-form';
import { InitialFeedback, InitialScheduleUserIDValue } from './Reducers/forms';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger';
import { User } from './Reducers/User';
import { ScheduleTable } from './Reducers/ScheduleTable';
import { TimeTable } from './Reducers/TimeTable';


export const configureStore = () => {
    const store = createStore(
        combineReducers({
            User: User,
            ScheduleTable: ScheduleTable,
            TimeTable: TimeTable,
            ...createForms({
                LoginForm: InitialFeedback,
                AdminScheduleUserID: InitialScheduleUserIDValue,
            })
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}