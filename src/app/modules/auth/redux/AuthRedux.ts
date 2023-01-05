import { Action } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put,  takeEvery, takeLatest } from "redux-saga/effects";
import {  UserModelSyscaf } from "../models/UserModel";


export interface ActionWithPayload<T> extends Action {
  payload?: T;
}

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
  SetUser: "[Set User] Action",
  RefreshToken: "[RefreshToken] Action",
};

const initialAuthState: IAuthState = {
  user: undefined,
  accessToken: undefined,
  refreshToken: undefined
};

export interface IAuthState {
  user?: UserModelSyscaf; 
  accessToken?: string;
  refreshToken?: string;
}

export const reducer = persistReducer(
  { storage, key: "v100-demo1-usuario", whitelist: ["user", "accessToken", "refreshToken"] },
  (state: IAuthState = initialAuthState, action: ActionWithPayload<IAuthState>) => {

    switch (action.type) {
      
      case actionTypes.Login: {
        const accessToken = action.payload?.accessToken;
        const refreshToken = action.payload?.refreshToken;
        return { accessToken, user: undefined, refreshToken };
      }

      case actionTypes.RefreshToken: {
        const accessToken = action.payload?.accessToken;
        const refreshToken = action.payload?.refreshToken;
        const user = action.payload?.user;
        return { accessToken, user, refreshToken };
      }
      case actionTypes.Register: {
        const accessToken = action.payload?.accessToken;
        const refreshToken = action.payload?.refreshToken;
        return { accessToken, user: undefined , refreshToken};
      }

      case actionTypes.Logout: {
       
        return initialAuthState;
      }

      case actionTypes.UserRequested: {
        return { ...state, user: undefined };
      }

      case actionTypes.UserLoaded: {
        const user = action.payload?.user;
        return { ...state, user  };
      }

      case actionTypes.SetUser: {
        const user = action.payload?.user;
        return { ...state,  user};
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: (accessToken: string, refreshToken : string) => ({ type: actionTypes.Login, payload: { accessToken ,refreshToken} }),
  register: (accessToken: string, refreshToken : string) => ({
    type: actionTypes.Register,
    payload: { accessToken,refreshToken },
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: () => ({
    type: actionTypes.UserRequested
  }),
  fulfillUser: (user: UserModelSyscaf) => ({ type: actionTypes.UserLoaded, payload: { user } }),
  setUser: (user: UserModelSyscaf) => ({ type: actionTypes.SetUser, payload: { user } }),
  setRefreshToken: (user: UserModelSyscaf, accessToken: string, refreshToken : string) => ({ type: actionTypes.RefreshToken, payload: { user , accessToken, refreshToken} }),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
 
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());   
  });

 
/*yield takeLatest(actionTypes.UserRequested, function* userRequested() {
     
  });*/
}


