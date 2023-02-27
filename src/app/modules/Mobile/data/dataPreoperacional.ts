import axios from "axios";
import moment from "moment";
import { DWH_getconsultadinamicasprocedure } from "../../../../apiurlstore";

import { Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";
import { FechaServidor } from "../../../../_start/helpers/Helper";

export  function getVehiculosOperando( ClienteIds: string, Fecha : string) {

    var params: { [id: string]: string | null; } = {};
    params["ClienteIds"] = ClienteIds;
    params["Fecha"] = Fecha;
    return  axios({
      method: 'post',
      url: DWH_getconsultadinamicasprocedure,
      data: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
      params : { Clase: "FATGQueryHelper" , NombreConsulta : "GetVehiculosOperacion" }
    });
  };

  export  function getEncabezados(ClienteId: string, Fecha : string, UsuarioId: string){
    var params: { [id: string]: string | null; } = {};
    params["ClienteId"] =ClienteId;
    params["Fecha"] = Fecha;
    params["UsuarioId"] = null;
    
    // hacemos la consulta 
    return  Post_getconsultadinamicas({    
      Clase : "MOVQueryHelper",  
      NombreConsulta: "GetPreoperacionalByUsuario", 
      Pagina :null, 
      RecordsPorPagina :null}, 
      params);
};

export  function getVehiculosSinPreoperacional( ClienteIds: string, Fecha : string) {

  var params: { [id: string]: string | null; } = {};
  params["ClienteIds"] = ClienteIds;
  params["Fecha"] = Fecha;

  return  axios({
    method: 'post',
    url: DWH_getconsultadinamicasprocedure,
    data: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
    params : { Clase: "MOVQueryHelper" , NombreConsulta : "GetEventosSubtrips" }
  });
};

export  function getRespuestas(EncabezadoId: string | null){
  var params: { [id: string]: string | null; } = {};
  params["EncabezadoId"] = EncabezadoId;
  
  // hacemos la consulta 
  return  Post_getconsultadinamicas({    
    Clase : "MOVQueryHelper",  
    NombreConsulta: "GetRespuestasPreoperacional", 
    Pagina :null, 
    RecordsPorPagina :null}, 
    params);
};

export  function setGestor(UserId: string, Observaciones: string, EsGestionado: boolean, EncabezadoId: number){
  var params: { [id: string]: string | null; } = {};
  params["UserId"] = UserId;
  params["Observaciones"] = Observaciones;
  params["EsGestionado"] = EsGestionado.toString();
  params["EncabezadoId"] = EncabezadoId.toString();
  
  // hacemos la consulta 
  return  Post_getconsultadinamicas({    
    Clase : "MOVQueryHelper",  
    NombreConsulta: "SetGestor", 
    Pagina :null, 
    RecordsPorPagina :null}, 
    params);
};

export  function setObservaciones(Observaciones: string){
  var params: { [id: string]: string | null; } = {};
  params["data"] = Observaciones;
  
  // hacemos la consulta 
  return  Post_getconsultadinamicas({    
    Clase : "MOVQueryHelper",  
    NombreConsulta: "SetObservaciones", 
    Pagina :null, 
    RecordsPorPagina :null}, 
    params);
};