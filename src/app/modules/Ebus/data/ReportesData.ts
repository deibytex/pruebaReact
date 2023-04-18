import {  Post_getDynamicValueProcedureDWHTabla, Post_GetConsultasDinamicas } from "../../../../_start/helpers/Axios/DWHService";
import { FiltrosReportes } from "../models/eBus";

/**/
export  function GetReporteAlarmas(clientesIds:string,FechaInicio:string,FechaFinal:string) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['FechaInicio'] = FechaInicio;
    params['FechaFinal'] = FechaFinal;
    return  Post_getDynamicValueProcedureDWHTabla({
        NombreConsulta: "GetReporteAlarma", Clase: "EBUSQueryHelper",
        tabla: clientesIds
    }, params);
}

export  function GetReporteOdometro(FechaInicial:string, FechaFinal: string) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal;
   
    return  Post_GetConsultasDinamicas({
        NombreConsulta: "GetUltimoOdometro", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}

export  function GetReporteEficiencia(FechaInicial:string, FechaFinal: string, clientesIds :number, tipo : number) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['FechaInicio'] = FechaInicial;
    params['FechaFin'] = FechaFinal;
    params['tipo'] = `${tipo}`;
    params['ClienteIds'] = `${clientesIds}`;
   
    return  Post_GetConsultasDinamicas({
        NombreConsulta: "GetReporteEficienciaMesVehiculo", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
export function GetReporteOperadorMovil(FechaInicial:string, FechaFinal:string, tipo:string) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["FechaInicial"] = FechaInicial;
    params["FechaFinal"] = FechaFinal;
    const NombreConsulta = (tipo == "0" ? "GetReporteOperadorMovil": (tipo == "1" ? "GetReporteOperador" : "GetReporteOperadorZonas"))
    return  Post_GetConsultasDinamicas({ Clase : "EbusQueryHelper",  NombreConsulta: NombreConsulta, Pagina :null, RecordsPorPagina :null}, params);
}
