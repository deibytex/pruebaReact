import axios from "axios";
import { GetConfiguracionAlerta, Post_Getconsultadinamicas, SetConfiguracionAlerta } from "../../../../_start/helpers/Axios/CoreService";
import { Post_GetConsultasDinamicas } from "../../../../_start/helpers/Axios/DWHService";
import { DWH_getconsultadinamicasprocedure } from "../../../../apiurlstore";
export function  getConfiguraciones (data:any) {
    var params: { [id: string]: string | null; } = {};
    params['nombre'] = data.nombre;
    params['clienteId'] = data.clienteId;
    params['esActivo'] = data.esActivo;
    return  GetConfiguracionAlerta(params);
}
export function  setConfiguraciones (data:any) {
    var params: { [id: string]: string | null; } = {};
    params['clave'] = data.clave;
    params['nombre'] = data.nombre;
    params['tiempo'] = data.tiempo;
    params['condicion'] = data.condicion;
    params['columna'] = data.columna;
    params['clienteId'] = data.clienteId;
    params['esActivo'] = data.esActivo;
    params['configuracionAlertaId'] = data.configuracionAlertaId;
    return  SetConfiguracionAlerta(params);
}

export  function GetClientesFatiga() {
    var params: { [id: string]: string | null; } = {};
    return  axios({
        method: 'post',
        url: DWH_getconsultadinamicasprocedure,   
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
        params : { Clase: "FATGQueryHelper" , NombreConsulta : "GetClientesFatigaConfiguracion" }
      });
    // return Post_Getconsultadinamicas({
    //     NombreConsulta:  "GetClientesFatigaConfiguracion", Clase: "FATGQueryHelper",
    //     Pagina: null,
    //     RecordsPorPagina: null
    // },params);
  }

export function GetEventos(Clienteid: string){
    var params: { [id: string]: string | null | undefined;} = {};
        params['Clienteid'] = Clienteid; 
    return Post_GetConsultasDinamicas({
    NombreConsulta: "ObtenerEventosClienteFatiga", Clase: "FATGQueryHelper",
    Pagina: null,
    RecordsPorPagina: null
    },params)
};