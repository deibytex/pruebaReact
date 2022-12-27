import axios from "axios";
import moment from "moment";

import {  DWH_getconsultadinamicasprocedure, DWH_GetConsultasDinamicas } from "../../../../apiurlstore";
import { ParamsEndPointDynamic } from "../../../../_start/helpers/Models/paramsConsultasDinamicas";


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

  export  function GetClientesFatiga( ClienteIds: string, Fecha : Date) {

    var params: { [id: string]: string | null; } = {};
    params["ClienteIds"] =ClienteIds;
    params["Fecha"] = moment(Fecha).format("YYYYMMDD");
 
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