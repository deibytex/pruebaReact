
export default function setupAxios(axios: any, store: any, token : string | null) {
  // cada vez que se hace una peticion se ejecuta este interceptor que verifica si se deba refrescar el token o que 
  // se le adicione el access token a todas las peticiones.

  axios.interceptors.request.use(
    (config: any) => {
      
      let accessToken = token ?? localStorage.getItem("token");
  
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (err: any) => Promise.reject(err)
  );

  axios.interceptors.response.use(
    
    function (response: any) {
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
  );

}

function isTokenExpiredError(errorResponse: any) {
  if (errorResponse.status === 401) {
    return true
  }
}


