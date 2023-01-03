import { all, takeEvery } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "../../app/modules/auth";

export const rootReducer = combineReducers({
  auth: auth.reducer
});

export type RootState = ReturnType<typeof rootReducer>

export function* rootSaga() {
  yield all([auth.saga()]);
  yield watchAndLog
}

function* watchAndLog() {
  yield takeEvery('*', function* logger(action) {
    
    console.log('action', action)
 
  })
}

