import { GetClientes, Post_GetConsultasDinamicas } from "../../../../_start/helpers/Axios/DWHService";

export function GetListaClientes() {
    var params: { [id: string]: string | null | undefined;} = {};
    params['Estado'] = '1';
    return  GetClientes(params);
}
export function GetReporte(FechaInicial:string, FechaFinal:string, clientesIds :string) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal; 
    params['ClienteIds'] = clientesIds;
    return  Post_GetConsultasDinamicas({
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
    return  Post_GetConsultasDinamicas({
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
    
    return  Post_GetConsultasDinamicas({
        NombreConsulta: "ReporteFallasPorFechasCliente", Clase: "SIGQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}