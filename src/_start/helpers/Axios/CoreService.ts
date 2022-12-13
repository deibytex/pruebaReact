import axios from "axios";
import { useSelector } from "react-redux";
import { CORE_ExecProcedureByTipoConsulta, CORE_getconsultadinamicas } from "../../../apiurlstore";
import { UserModelSyscaf } from "../../../app/modules/auth/models/UserModel";
import { RootState } from "../../../setup";
import { ParamsEndPointDynamic } from "../Models/paramsConsultasDinamicas";

export function Post_getconsultadinamicas(props: ParamsEndPointDynamic, body: any) {
  return axios({
    method: 'post',
    url: CORE_getconsultadinamicas,
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

  // informacion del usuario almacenado en el sistema
  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );

  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
  const model = (isAuthorized as UserModelSyscaf);
  //convertimos el objeto en un array de objeto desconocido para poder tratar los datos 
  const menu = JSON.parse(model.menu) as any[];
  let tienePermiso = false;
  menu.map((elemnt) => {

    const nombre: string = elemnt["NombreOpcion"];
    if (nombre.toLowerCase() === NombreOpcion.toLowerCase()) {

      let operaciones = elemnt["lstOperacion"] as any[];
      // permite consultar si tiene permiso para entrar  
      operaciones.map((operacion) => {
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
  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );

  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
  const model = (isAuthorized as UserModelSyscaf);
  //convertimos el objeto en un array de objeto desconocido para poder tratar los datos 
  const menu = JSON.parse(model.menu) as any[];
  let operaciones : any[]= [];
  menu.map((elemnt) => {

    const nombre: string = elemnt["NombreOpcion"];
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
Operaciones.map( (oper) => {

    if(oper["Operacion"] === operacion)
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

