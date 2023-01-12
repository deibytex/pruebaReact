import { isExpire, isRefresh } from "../../_start/helpers/Axios/CoreService";
import * as auth from "../../app/modules/auth/redux/AuthRedux";
import { Auth_RefreshToken } from "../../apiurlstore";
import axios from "axios";
import jwt_decode from "jwt-decode"
import { UserModelSyscaf } from "../../app/modules/auth/models/UserModel";

// resetea el token 
async function resetTokenAndReattemptRequest(error: any, store: any) {
  const { dispatch } = store;
  const {
    auth: { accessToken, refreshToken }
  } = store.getState();
  try {

    const { response: errorResponse } = error;
    if (!refreshToken) {
      return Promise.reject("No existe resset token");
    }
 

    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;

  
        return await axios.post(Auth_RefreshToken, { AccessToken :accessToken, RefreshToken: refreshToken }).then(

        (data) => {
          console.log("data en refreshtoken", data)
          // adiciona una nuevas credenciales de refresco
          if (!data.data) {
            const newTokens = data.data;
            var decoded = jwt_decode<UserModelSyscaf>(newTokens.token);
            // fecha de expiracion  
            decoded.exp = newTokens.Expiracion;
            dispatch(auth.actions.setRefreshToken(decoded, newTokens.token, newTokens.refreshToken));


            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(newTokens);  

            document.location.reload();
            
          }         
        }
      ).catch( (error) => {
        // si hay algun error debe desloguearse y reiniciar la aplicacion
        console.log("refreshtiken", error)
        document.location.replace('/logout');
      })
      
      
    
    }
    
  } catch (err) {
    return Promise.reject(err);
  }
}
let isAlreadyFetchingAccessToken = false;
let subscribers: any[] = [];

function onAccessTokenFetched(tokens: any) {
  subscribers.forEach(callback => callback(tokens));
  subscribers = [];
}

function addSubscriber(callback: (tokens: any) => void) {
  subscribers.push(callback);
}
function isTokenExpiredError(errorResponse: any) {
  if (errorResponse.status === 401) {
    return true
  }
}

export default function setupAxios(axios: any, store: any) {

  // cada vez que se hace una peticion se ejecuta este interceptor que verifica si se deba refrescar el token o que 
  // se le adicione el access token a todas las peticiones.
  axios.interceptors.request.use(
    (config: any) => {
      const {
        auth: { accessToken }
      } = store.getState();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (err: any) => Promise.reject(err)
  );

  /*
  por algunar azon no funcionas
  axios.interceptors.response.use(
    
    unction (response: any) {
      return response
    },
    function (error: any) {
      const errorResponse = error.response;
      if (isTokenExpiredError(errorResponse)) {
        document.location.replace('/logout');
        //return resetTokenAndReattemptRequest(errorResponse, store);
      }
      return Promise.reject(error);
    }
  );*/ 

}


