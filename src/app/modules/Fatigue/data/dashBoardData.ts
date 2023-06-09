import axios from "axios";
import moment from "moment";

import {  DWH_getconsultadinamicasprocedure, DWH_GetConsultasDinamicas } from "../../../../apiurlstore";
import { ParamsEndPointDynamic } from "../../../../_start/helpers/Models/paramsConsultasDinamicas";
import { Post_GetConsultasDinamicas, Post_getDynamicValueProcedureDWHTabla } from "../../../../_start/helpers/Axios/DWHService";
import { formatViewHoraMinuto } from "../../../../_start/helpers/Helper";
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

  

export function GetAlarmas(clientesIds: string, FechaInicio: Date, FechaFinal: Date) {
  var params: { [id: string]: string | null | undefined; } = {};
  params['FechaInicial'] = moment(FechaInicio).format(formatViewHoraMinuto);
  params['FechaFinal'] = moment(FechaFinal).format(formatViewHoraMinuto);
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