import axios from "axios";
import moment from "moment";

import {  DWH_getconsultadinamicasprocedure, DWH_GetConsultasDinamicas } from "../../../../apiurlstore";
import { ParamsEndPointDynamic } from "../../../../_start/helpers/Models/paramsConsultasDinamicas";
import { Post_GetConsultasDinamicas, Post_getDynamicValueProcedureDWHTabla } from "../../../../_start/helpers/Axios/DWHService";



export  function getEventosActivosPorDia(props: ParamsEndPointDynamic , body: any) {
    return  axios({
      method: 'post',
      url: DWH_getconsultadinamicasprocedure,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }

  // obtine los vehiculos operando en el sistema
  //MOVQueryHelper
  //GetEventosSubtrips
  export  function getVehiculosOperando( ClienteIds: string, Fecha : Date) {

    var params: { [id: string]: string | null; } = {};
    params["ClienteIds"] =ClienteIds;
    params["Fecha"] = moment(Fecha).format("YYYYMMDD");
 
    return  axios({
      method: 'post',
      url: DWH_getconsultadinamicasprocedure,
      data: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
      params : { Clase: "FATGQueryHelper" , NombreConsulta : "GetVehiculosOperacion" }
    });
  }

  export  function GetClientesFatiga( ) {
    var params: { [id: string]: string | null; } = {};
    return  axios({
      method: 'post',
      url: DWH_getconsultadinamicasprocedure,   
      data: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
      params : { Clase: "FATGQueryHelper" , NombreConsulta : "GetClientesFatiga" }
    });
  }

  //GetClientesFatiga


  export  function getClienteFatiguePorUsuario( body: any) {
    return  axios({
      method: 'post',
      url: DWH_getconsultadinamicasprocedure,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params : { Clase: "FATGQueryHelper" , NombreConsulta : "GetClienteFatiguePorUsuario" }
    });
  }

  export  function getAlertas() {
    var params: { [id: string]: string | null; } = {};
    return  axios({
      method: 'post',
      url: DWH_getconsultadinamicasprocedure,
      data: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
      params : { Clase: "FATGQueryHelper" , NombreConsulta : "getAlertas" }
    });
  }

  export  function setGestor(UserId: string, Observaciones: string, EstadoGestion: boolean, alertaId: number, gestor: string){
    var params: { [id: string]: string | null; } = {};
    params["UserId"] = UserId;
    params["Observaciones"] = Observaciones;
    params["EsGestionado"] = EstadoGestion.toString();
    params["AlertaId"] = alertaId.toString();
    params["gestor"] = gestor;
    
    // hacemos la consulta 
  return  Post_GetConsultasDinamicas({    
    Clase : "FATGQueryHelper",  
    NombreConsulta: "setGestor", 
    Pagina :null, 
    RecordsPorPagina :null}, 
    params);
  };

  export  function setObservaciones(Observaciones: string){
    var params: { [id: string]: string | null; } = {};
    params["data"] = Observaciones;
    
    // hacemos la consulta 
    return  Post_GetConsultasDinamicas({    
      Clase : "FATGQueryHelper",  
      NombreConsulta: "setObervaciones", 
      Pagina :null, 
      RecordsPorPagina :null}, 
      params);
  };

  export function GetAlarmas(clientesIds: string, FechaInicio: Date, FechaFinal: Date) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicial'] = moment(FechaInicio).format("YYYY-MM-DD HH:mm");
    params['FechaFinal'] = moment(FechaFinal).format("YYYY-MM-DD HH:mm");
    return Post_getDynamicValueProcedureDWHTabla({
        NombreConsulta: "GetAlertasTimeLine", Clase: "FATGQueryHelper",
        tabla: clientesIds
    }, params);
  }
  
  export function GetDetalladoEventos(clientesIds: string, FechaInicio: Date) {
    var params: { [id: string]: string | null | undefined; } = {};
    params['Fecha'] = moment(FechaInicio).format("YYYYMMDD");
    return Post_getDynamicValueProcedureDWHTabla({
        NombreConsulta: "GetDetalladosAlertas", Clase: "FATGQueryHelper",
        tabla: clientesIds
    }, params);
  }