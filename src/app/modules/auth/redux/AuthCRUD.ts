import axios from "axios";
import { AuthModel } from "../models/AuthModel";
import { UserModel } from "../models/UserModel";

const API_URL = process.env.REACT_APP_API_URL || "api";

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/account/get-user`;
export const LOGIN_URL = `${API_URL}/account/login`;
export const REGISTER_URL = `${API_URL}/account/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/account/forgot-password`;

// Server should return AuthModel
export function login(username: string, password: string) {
  
  
  return    axios({
    method: 'post',
    url: LOGIN_URL,
    data: { username, password },
    headers: { 'Content-Type': 'application/json' }

}) ;
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string
) {
  return axios.post<AuthModel>(REGISTER_URL, {
    email,
    firstname,
    lastname,
    password,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return axios.get<UserModel>(GET_USER_BY_ACCESSTOKEN_URL);
}
