
// Validamos cada 30 segundos si la fecha de expiracion del token ha sucedio
// buscamos el que refresca el token

import { UserModelSyscaf } from "../../app/modules/auth/models/UserModel";
import jwt_decode from "jwt-decode"
import {  FechaServidor } from "../../_start/helpers/Helper";
import moment from "moment";
import { Dispatch } from "redux";
import { Auth_RefreshToken } from "../../apiurlstore";
import axios from "axios";
import * as auth from "../../app/modules/auth/redux/AuthRedux";
import * as _redux from "../../setup";
// export function ValidarSession(FechaExp: Date, refreshToken: string, dispatch: Dispatch<any>, accessToken: string) {

//     return setInterval(async () => {
//         const FechaActual = FechaServidor();
//         FechaExp = new Date(2023, 7, 18, 15, 0)       
//         console.log('model EXP', FechaExp, FechaActual)
//         if (moment(FechaActual) > moment(FechaExp)) {
//             console.log('Token Expirado', FechaExp, FechaActual, refreshToken)
//              axios.post(Auth_RefreshToken, { AccessToken: accessToken, RefreshToken: refreshToken }).then(

//                     (data) => {
//                        console.log('data', data)
//                         // adiciona una nuevas credenciales de refresco
                        
//                             const newTokens = data.data;
//                             var decoded = jwt_decode<UserModelSyscaf>(newTokens.token);
//                             // fecha de expiracion  
                         
//                             decoded.exp = newTokens.Expiracion;
//                             dispatch(auth.actions.setRefreshToken(decoded, newTokens.token, newTokens.refreshToken));
//                             console.log('Nuevo token',decoded )
                         
//                          //   _redux.setupAxios(axios, store);

                           
                        
//                     }
//                 ).catch((error) => {
//                     // si hay algun error debe desloguearse y reiniciar la aplicacion

//                   //  document.location.replace('/logout');
//                 })
            
//         }


//     }, 10000);


// }


