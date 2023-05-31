import axios from "axios";
import { useSelector } from "react-redux";
import { CORE_ExecProcedureByTipoConsulta,  CORE_getconsultadinamicas, CORE_getconsultadinamicasUser, CORE_GetConsultasDinamicas, urlFatigueGetConfiguracionAlerta, urlFatigueSetConfiguracionAlerta } from "../../../apiurlstore";
import { RootState } from "../../../setup";
import { ParamsEndPointDynamic } from "../Models/paramsConsultasDinamicas";
import jwt_decode from "jwt-decode"

export function Post_getconsultadinamicas(props: ParamsEndPointDynamic, body: any) {
  return axios({
    method: 'post',
    url: CORE_getconsultadinamicas,
    data: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    params: props
  });
}

export function Post_Getconsultadinamicas(props: ParamsEndPointDynamic, body: any) {
  return axios({
    method: 'post',
    url: CORE_GetConsultasDinamicas,
    data: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    params: props
  });
}

export function Post_getconsultadinamicasUser(props: ParamsEndPointDynamic, body: any) {
  return axios({
    method: 'post',
    url: CORE_getconsultadinamicasUser,
    data: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    params: props
  });
}

export function Post_ExecProcedureByTipoConsulta(props: ParamsEndPointDynamic, body: any) {
  return axios({
    method: 'post',
    url: CORE_ExecProcedureByTipoConsulta,
    data: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    params: props
  });
}



export function EsAutorizadoIngresar(NombreOpcion: string) {

  const menuString = useSelector<RootState>(
    ({ auth }) => auth.menu
  );

  const menu = menuString as any[];
  
  let tienePermiso = false;

  menu.forEach((elemnt) => {

    const nombre: string = elemnt["nombreOpcion"];
    if (nombre.toLowerCase() === NombreOpcion.toLowerCase()) {

      let operaciones = elemnt["lstOperacion"] as any[];
      // permite consultar si tiene permiso para entrar  
      operaciones.forEach((operacion) => {
        if (operacion["Operacion"] === "ING")
          tienePermiso = true;
        return;
      });
    }
  })

  return tienePermiso;

}

export function PermisosOpcion(NombreOpcion: string) {

  // informacion del usuario almacenado en el sistema
  const menuString = useSelector<RootState>(
    ({ auth }) => auth.menu
  );
  const menu = menuString as any[];
  let operaciones : any[]= [];
  menu.forEach((elemnt) => {

    const nombre: string = elemnt["nombreOpcion"];
    if (nombre.toLowerCase() === NombreOpcion.toLowerCase()) {
       operaciones = elemnt["lstOperacion"] as any[];      
    }
  })
  return  operaciones;
  ;

}

// valida si una operacion esta contenida en un listado de opciones
export function EsPermitido(Operaciones : any[], operacion : string){

let espermitido = false;
Operaciones.forEach( (oper) => {

    if(oper["operacion"] === operacion)
    espermitido = true;
})

return espermitido;
}

export enum Operaciones { 
  Adicionar = "ADD", 
  Eliminar = "DEL", 
  Descargar = "DOWN", 
  Ingresar = "ING", 
  Consultar = "SEARCH", 
  Modificar = "UPD"
}


export const  isRefresh = (accessToken : string) => {
  const decoded =  jwt_decode<any>(accessToken)    
  // verifica que el token no haya espirado, si falta unos minutos antes de 
  // expirar refresca el token para que continue navegando
  // el token se refresca cada 30 minutos esto con el fin de que se vuelva a loguer 
  // para poder volver a ver la informacion
  let diffTime = ((decoded.exp * 1000)  -Date.now()  ) / 60000; // determinamos los minutos que faltan para cumplirse el tiempo de expiracion
 
  return (diffTime >= 0 && diffTime <= 10) ;  // si esta dentro de los 10  minutos refrescamos el token de lo contrario se debera loguear nuevamente 
}

export const  isExpire = (accessToken : string) => {
  const decoded =  jwt_decode<any>(accessToken)    
  // verifica que el token no haya espirado, si falta unos minutos antes de 
  // expirar refresca el token para que continue navegando
  // el token se refresca cada 30 minutos esto con el fin de que se vuelva a loguer 
  // para poder volver a ver la informacion
   let diffTime = ((decoded.exp * 1000)  -Date.now()  ) / 60000; // determinamos los minutos que faltan para cumplirse el tiempo de expiracion

  return (diffTime < 0) ;  // si esta dentro de los 10  minutos refrescamos el token de lo contrario se debera loguear nuevamente 
}

export function GetConfiguracionAlerta(data:any) {
  return axios(
      {
          method:'post',
          url:urlFatigueGetConfiguracionAlerta,
          data:JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
      }
  );
}
export function SetConfiguracionAlerta(data:any) {
  return axios(
      {
          method:'post',
          url:urlFatigueSetConfiguracionAlerta,
          data:JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
      }
  );
}