import axios from "axios";
import { UserModel } from "../models/UserModel";
import { PaginacionDTO } from "../../../../_start/helpers/Models/PaginacionDTO"
import { Auth_GetMenuUsuario } from "../../../../apiurlstore";
import { Post_getconsultadinamicasUser } from "../../../../_start/helpers/Axios/CoreService";

const API_URL = process.env.REACT_APP_API_URL || "api";

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/account/get-user`;
export const LOGIN_URL = `${API_URL}/account/login`;
export const REGISTER_URL = `${API_URL}/account/Crear`;
export const REQUEST_PASSWORD_URL = `${API_URL}/account/SendTokenPassword`;
export const USERLIST_URL = `${API_URL}/account/listadoUsuarios`;
export const ResetPassWord = `${API_URL}/account/ResetPassWord`;
// Server should return AuthModel
export function login(username: string, password: string) {


  return axios({
    method: 'post',
    url: LOGIN_URL,
    data: { username, password },
    headers: { 'Content-Type': 'application/json' }

  });
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  PerfilId: Number
) {
  return axios.post(REGISTER_URL, {
    email,
    Nombres: `${firstname} ${lastname}`,
    Password: password,
    PerfilId
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {

  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      accept: 'text/plain',
    },
    url: REQUEST_PASSWORD_URL,
    data: email
  });
}

export function getUserByToken() {          
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return axios.get<any>(GET_USER_BY_ACCESSTOKEN_URL);
}

export function getMenuByUser() {
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  const formData = new FormData();
  return Post_getconsultadinamicasUser({
    Clase: "ADMQueryHelper", NombreConsulta: "GetMenuReact",
    Pagina: 0,
    RecordsPorPagina: 10
  }, formData);
}

// retorna el listado de usuarios que se mostrara en la aplicacion
export function getListUserByToken(PaginacionDTO: PaginacionDTO) {
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return axios({
    method: 'get',
    url: USERLIST_URL,
    params: PaginacionDTO
  });
}

export function CambiarPasword(token: string, NewPassword: string, UserName: string) {
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return axios({
    method: 'post',
    url: ResetPassWord,
    data: { token: atob(token), NewPassword, UserName }
  });
}
