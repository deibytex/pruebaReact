
import axios from "axios";
import { DWH_getconsultadinamicasprocedure } from "../../../../apiurlstore";
import { Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";
import { getConductoresClienteId, getVehiculosClienteId } from "../../../../_start/helpers/Axios/DWHService";

const ClienteId = "1546695255495533982";
const clienteIdS = "898";

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
  params["ClienteId"] = ClienteId;
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

export  function GetAssets() {
  return  getVehiculosClienteId(ClienteId, "Available");
}

export  function GetDrivers() {
  return  getConductoresClienteId(ClienteId);
}

export  function getReporteSotramacVH( FechaInicial : string, FechaFinal : string, assetsIds: string, assetTypeId: string) {

  var params: { [id: string]: string | null; } = {};
  params["FechaInicial"] = FechaInicial;
  params["FechaFinal"] = FechaFinal;
  params["clienteIdS"] = clienteIdS;
  params["Assetsids"] = assetsIds;
  params["AssetTypeId"] = assetTypeId;
  params["SiteId"] = null;

  return  axios({
    method: 'post',
    url: DWH_getconsultadinamicasprocedure,
    data: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
    params : { Clase: "SotramacQueryHelper" , NombreConsulta : "getReporteSotramacVH" }
  });
};

export  function getReporteSotramacCO( FechaInicial : string, FechaFinal : string, DriversIdS: string) {

  var params: { [id: string]: string | null; } = {};
  params["FechaInicial"] = FechaInicial;
  params["FechaFinal"] = FechaFinal;
  params["clienteIdS"] = clienteIdS;
  params["DriversIdS"] = DriversIdS;
  params["SiteId"] = null;

  return  axios({
    method: 'post',
    url: DWH_getconsultadinamicasprocedure,
    data: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
    params : { Clase: "SotramacQueryHelper" , NombreConsulta : "getReporteSotramacCO" }
  });
};

export  function getReporteSotramacVHxCO( FechaInicial : string, FechaFinal : string, DriversIdS: string, assetsIds: string, assetTypeId: string) {

  var params: { [id: string]: string | null; } = {};
  params["FechaInicial"] = FechaInicial;
  params["FechaFinal"] = FechaFinal;
  params["clienteIdS"] = clienteIdS;
  params["DriversIdS"] = DriversIdS;
  params["Assetsids"] = assetsIds;
  params["AssetTypeId"] = assetTypeId;
  params["SiteId"] = null;

  return  axios({
    method: 'post',
    url: DWH_getconsultadinamicasprocedure,
    data: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
    params : { Clase: "SotramacQueryHelper" , NombreConsulta : "getReporteSotramacVHxCO" }
  });
};