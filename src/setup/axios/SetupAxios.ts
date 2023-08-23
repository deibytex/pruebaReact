
export default function setupAxios(axios: any, store: any, token : string | null) {
  // cada vez que se hace una peticion se ejecuta este interceptor que verifica si se deba refrescar el token o que 
  // se le adicione el access token a todas las peticiones.

  axios.interceptors.request.use(
    (config: any) => {
      
      let accessToken = token ?? localStorage.getItem("token");
     console.log(token,localStorage.getItem("token") )
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (err: any) => Promise.reject(err)
  );
}


