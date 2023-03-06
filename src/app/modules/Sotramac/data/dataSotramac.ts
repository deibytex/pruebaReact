import axios from "axios";
import moment from "moment";
import { DWH_getconsultadinamicasprocedure, MOVIL_getReportesPorTipo } from "../../../../apiurlstore";

import { Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";
import { FechaServidor } from "../../../../_start/helpers/Helper";

export  function getListas(Sigla: string){
    var params: { [id: string]: string | null; } = {};
    params["Sigla"] = Sigla;
    
    // hacemos la consulta 
    return  Post_getconsultadinamicas({    
      Clase : "PortalQueryHelper",  
      NombreConsulta: "getListas", 
      Pagina :null, 
      RecordsPorPagina :null}, 
      params);
};

export  function getDetalleListas(ListaIds: string){
    var params: { [id: string]: string | null; } = {};
    params["ListaId"] = ListaIds;
    
    // hacemos la consulta 
    return  Post_getconsultadinamicas({    
      Clase : "PortalQueryHelper",  
      NombreConsulta: "getDetalleListas", 
      Pagina :null, 
      RecordsPorPagina :null}, 
      params);
};

export  function getSitesSotramac(){
  var params: { [id: string]: string | null; } = {};
  params["ClienteId"] = "1546695255495533982";
  params["SiteId"] = null;
  
  // hacemos la consulta 
  return  Post_getconsultadinamicas({    
    Clase : "PortalQueryHelper",  
    NombreConsulta: "GetListaSitesPorCliente_o_Siteid", 
    Pagina :null, 
    RecordsPorPagina :null}, 
    params);
};

export  function getAssetTypes(){
  var params: { [id: string]: string | null; } = {};
  
  // hacemos la consulta 
  return  Post_getconsultadinamicas({    
    Clase : "PortalQueryHelper",  
    NombreConsulta: "GetAssetType", 
    Pagina :null, 
    RecordsPorPagina :null}, 
    params);
};