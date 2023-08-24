import { GetClientes } from "../../../../_start/helpers/Axios/CoreService";
import {  Post_GetConsultasDinamicasCore, Post_getDynamicProcedureDWH } from "../../../../_start/helpers/Axios/DWHService";

export function GetListaClientes() {
    var params: { [id: string]: string | null | undefined;} = {};
 
    return  GetClientes(params);
}
export function GetReporte(FechaInicial:string, FechaFinal:string, clientesIds :string) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal; 
    params['ClienteIds'] = clientesIds;
    return  Post_getDynamicProcedureDWH({
        NombreConsulta: "TotalFallasPorRangoFechas", Clase: "SIGQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}

export function GetReporteDetallado(FechaInicial:string, FechaFinal:string, AssetId :string) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal; 
    params['AssetId'] = AssetId;
    return  Post_getDynamicProcedureDWH({
        NombreConsulta: "FallasPorVehiculo", Clase: "SIGQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}


export function GetReporteExportar(FechaInicial:string, FechaFinal:string, ParametroId :string, ClienteIds:string,AssetIds:string ) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal; 
    params['FallaId'] = ParametroId;
    params['ClienteIds'] = ClienteIds;
    params['AssetId'] = AssetIds;
    
    return  Post_getDynamicProcedureDWH({
        NombreConsulta: "ReporteFallasPorFechasCliente", Clase: "SIGQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
export function GetCondiciones(ClienteIds:string ) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['ClienteIds'] = ClienteIds;
    return  Post_getDynamicProcedureDWH({
        NombreConsulta: "GetSenialesCondiciones", Clase: "SIGQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
export function GuardarCondiciones(Parametro:any ) {
    var params: { [id: string]: string | number | null | undefined;} = {};
    switch(Parametro.Clave) {
        case '1':
        default:
            params['Clave'] = (Parametro.Clave == null || Parametro.Clave == undefined || Parametro.Clave == "" ? "1":Parametro.Clave);
            params['Valor'] = Parametro.Valor;
            params['Distancia'] = Parametro.Distancia;
            params['Ocurrencias'] = Parametro.Ocurrencias;
            params['Tiempo'] = Parametro.Tiempo;
            params['ClienteIds'] = Parametro.ClienteIds;
            params['EsActivo'] = String(Parametro.EsActivo);
        break;
        case '2':
            params['Clave'] = Parametro.Clave;
            params['CondicionId'] = Parametro.CondicionId;
            params['ClienteIds'] = Parametro.ClienteIds;
            params['Valor'] = Parametro.Valor;
            params['Distancia'] =Parametro.Distancia;
            params['Ocurrencias'] = Parametro.Ocurrencias;
            params['Tiempo'] = Parametro.Tiempo;
            params['EsActivo'] = String(Parametro.EsActivo);
        break;
        case '3':
            params['Clave'] = Parametro.Clave;
            params['CondicionId'] = Parametro.CondicionId;
            params['EsActivo'] = String(Parametro.EsActivo);
        break;
      }
    return  Post_getDynamicProcedureDWH({
        NombreConsulta: "GuardarEditarCondicion", Clase: "SIGQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
