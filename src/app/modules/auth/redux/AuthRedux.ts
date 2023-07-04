import { Action } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put,  takeEvery, takeLatest } from "redux-saga/effects";
import {  UserModelSyscaf } from "../models/UserModel";
import { getMenuByUser } from "./AuthCRUD";


export interface ActionWithPayload<T> extends Action {
  payload?: T;
}

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User Menu] Auth API",
  SetUser: "[Set User] Action",
  RefreshToken: "[RefreshToken] Action",
};

const initialAuthState: IAuthState = {
  user: undefined,
  accessToken: undefined,
  refreshToken: undefined,
  menu : undefined
};

export interface IAuthState {
  user?: UserModelSyscaf; 
  accessToken?: string;
  refreshToken?: string;
  menu? :any[]
}

export const reducer = persistReducer(
  { storage, key: "usuario-syscaf", whitelist: ["user", "accessToken", "refreshToken", "menu"] },
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
        return { ...state,accessToken, user, refreshToken };
      }
      case actionTypes.Register: {
        const accessToken = action.payload?.accessToken;
        const refreshToken = action.payload?.refreshToken;
        return { ...state,accessToken, user: undefined , refreshToken};
      }

      case actionTypes.Logout: {
       
        return initialAuthState;
      }

      case actionTypes.UserRequested: {
        return { ...state, user: undefined };
      }

      case actionTypes.UserLoaded: {
        const menu = action.payload?.menu;
       
        return { ...state, menu  };
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
  fulfillUser: (menu :any[]) => ({ type: actionTypes.UserLoaded, payload: { menu } }),
  setUser: (user: UserModelSyscaf) => ({ type: actionTypes.SetUser, payload: { user } }),
  setRefreshToken: (user: UserModelSyscaf, accessToken: string, refreshToken : string) => ({ type: actionTypes.RefreshToken, payload: { user , accessToken, refreshToken} }),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
 
  });
 
  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const { data: user } = yield getMenuByUser();
    console.log(JSON.parse(user[0].Menu));
    
    yield put(actions.fulfillUser(JSON.parse(user[0].Menu)));
  });

/*
yield takeLatest(actionTypes.UserRequested, function* userRequested() {
     
  });*/
}

// funcion que tranforma los datos y los convierte en datos que se pueden leer para el menu


