
import axios from "axios";
import { DWH_getconsultadinamicasprocedure, PORTAL_getReporteSotramacMS, SOTRA_descargaReporte } from "../../../../../apiurlstore";
import { Post_getconsultadinamicas } from "../../../../../_start/helpers/Axios/CoreService";
import { getConductoresClienteId, getVehiculosClienteId } from "../../../../../_start/helpers/Axios/DWHService";
import { ParamsReporte } from "../models/dataModels";

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
  params["FechaFinal"] =  `${FechaFinal} 23:59:59`;
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

export  function getReporteSotramacCO( FechaInicial : string, FechaFinal : string, DriversIdS: string, AssetTypeId: string) {

  var params: { [id: string]: string | null; } = {};
  params["FechaInicial"] = FechaInicial;
  params["FechaFinal"] = `${FechaFinal} 23:59:59`;
  params["clienteIdS"] = clienteIdS;
  params["DriversIdS"] = DriversIdS;
  params["SiteId"] = null;
  params["AssetTypeId"] = AssetTypeId;

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
  params["FechaFinal"] =  `${FechaFinal} 23:59:59`;
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

export  function getReportesSotramacMS(reporte: string, FechaInicial : string, FechaFinal : string, DriversIdS: string, assetsIds: string, assetTypeId: string){

  var params: { [id: string]: string | null; } = {};
  params["TipoInforme"] = null;
  params["CategoriaInforme"] = reporte;
  params["Conductores"] = DriversIdS;
  params["Vehiculos"] = assetsIds;
  params["RangoFecha"] = `${FechaInicial}-${FechaFinal}`;  
  params["AssetTypeId"] = assetTypeId;
  params["SiteId"] = null;
  return  axios({
    method: 'post',
    url: PORTAL_getReporteSotramacMS,
    data: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
    responseType: 'blob',
    params: {}
  });
  
};

//ParamsReporte

export  function getReporteExcelSotramac( parametros : ParamsReporte, TipoReporte  : string) {

  var params: { [id: string]: string | null; } = {};
   let NombreConsulta : string = "";
   NombreConsulta = (TipoReporte === "EOAPC")? "getReporteSotramacCO" : ((TipoReporte === "EOAPV") ? "getReporteSotramacVH" : "getReporteSotramacVHxCO")
   let NombreReporte : string =(TipoReporte === "EOAPC")? "InformeConductor" : ((TipoReporte === "EOAPV") ? "InformeVehiculos" : "InformeConductorVehiculos");
// eliminamos las propiedades que no se necesiten por el tipo de reporte
// solo se pueden eliminar propiedades que esten marcadas como opcional.
if(TipoReporte === "EOAPC") 
 delete parametros.assetsIds;
 if(TipoReporte === "EOAPV") 
 delete parametros.DriversIdS;

  Object.entries(parametros).map(m => {

    
         params[m[0]] = m[1]?.toString()


  });
  params["clienteIdS"] = clienteIdS;
 
  return  axios({
    method: 'post',
    url: SOTRA_descargaReporte,
    data: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
   // headers : {'Content-Type': 'blob'},
   // responseType: 'arraybuffer',
    params : { Clase: "SotramacQueryHelper" , NombreConsulta : NombreConsulta , TipoReporte:NombreReporte }
  });
};
