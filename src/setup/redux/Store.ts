import {Action, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import {reduxBatch} from "@manaflair/redux-batch";
import {persistStore} from "redux-persist";
import {rootReducer, rootSaga} from "./RootReducer";
import { takeEvery, takeLatest } from "redux-saga/effects";


const sagaMiddleware = createSagaMiddleware();
const JWTMiddleware = createSagaMiddleware();
const middleware = [
  ...getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
    thunk: true
  }),
  sagaMiddleware
];
middleware.push(JWTMiddleware);

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
  enhancers: [reduxBatch]
});

export type AppDispatch = typeof store.dispatch

/**
 * @see https://github.com/rt2zz/redux-persist#persiststorestore-config-callback
 * @see https://github.com/rt2zz/redux-persist#persistor-object
 */
export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
JWTMiddleware.run(jwtSaga);

function* jwtSaga() {

  yield takeEvery("*", function* registerToken (action : Action<string>) {
    console.log("takeEvery",action) 
    

 });
  
};




export default store;
