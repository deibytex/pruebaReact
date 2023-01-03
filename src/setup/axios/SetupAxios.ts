import jwt_decode from "jwt-decode"





export default function setupAxios(axios: any, store: any) {
 
  const isRefresh = (accessToken : string) => {
    const decoded =  jwt_decode<any>(accessToken)    
    // verifica que el token no haya espirado, si falta unos minutos antes de 
    // expirar refresca el token para que continue navegando
    // el token se refresca cada 30 minutos esto con el fin de que se vuelva a loguer 
    // para poder volver a ver la informacion
     let diffTime = (Date.now() - (decoded.exp * 1000) ) / 60000; // determinamos los minutos que faltan para cumplirse el tiempo de expiracion
    return (diffTime >= 0 && diffTime <= 10) ;  // si esta dentro de los 10  minutos refrescamos el token de lo contrario se debera loguear nuevamente 
  }

  // cada vez que se hace una peticion se ejecuta este interceptor que verifica si se deba refrescar el token o que 
  // se le adicione el access token a todas las peticiones.
  axios.interceptors.request.use(
    (config: any) => {
      const {
        auth: { accessToken }
      } = store.getState();
      
      if (accessToken) {  
        // verifica si se tiene que volver a refrescar el token y se debe actualizar los datos en el store 
        // para que actualice informacion claims, menu y los datos que se trae
        if(isRefresh(accessToken)){
           return; // EN  IMPLEMENTACION
         }   
       
        config.headers.Authorization = `Bearer ${accessToken}`;      
      }

     
      return config;
    },
    (err: any) => Promise.reject(err)
  );

}


