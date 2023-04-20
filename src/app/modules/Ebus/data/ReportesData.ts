import {  Post_getDynamicValueProcedureDWHTabla, Post_GetConsultasDinamicas } from "../../../../_start/helpers/Axios/DWHService";
import { TabProperty } from "../../../../_start/helpers/Models/Tabs";
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

const tab1 : TabProperty = {  icon: "/media/icons/duotone/files/Selected-file.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Móvil", subtitulo : ""}
const tab2 : TabProperty = {  icon: "/media/icons/duotone/files/Deleted-file.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Operador", subtitulo : ""}
const tab3 : TabProperty = {  icon: "/media/icons/duotone/files/DownloadedFile.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Operador", subtitulo : "Zona"}

export const listTabs : TabProperty[] = [tab1,tab2,tab3]

export function GetReporteNivelCarga(FechaInicial:string, FechaFinal:string, clientesIds :number) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal; 
    params['Movil'] = null;
   
    return  Post_GetConsultasDinamicas({
        NombreConsulta: "GetRecargasDetalladoPorFechasyVehiculo", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}

export function GetInformacionOdometro(FechaInicial:string, FechaFinal:string, clientesIds :number) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal; 
       
    return  Post_GetConsultasDinamicas({
        NombreConsulta: "GetReporteUltimoOdometro", Clase: "EBUSQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}

const tabEfi1 : TabProperty = {  icon: "/media/icons/duotone/files/Selected-file.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Móvil", subtitulo : "Mensual"}
const tabEfi2 : TabProperty = {  icon: "/media/icons/duotone/files/Deleted-file.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Móvil", subtitulo : "Diario"}
const tabEfi3 : TabProperty = {  icon: "/media/icons/duotone/files/DownloadedFile.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Operador", subtitulo : "Mensual"}
const tabEfi4 : TabProperty = {  icon: "/media/icons/duotone/files/DownloadedFile.svg", iconColored : "/media/svg/logo/colored/fox-hub-2.svg", titulo: "Operador", subtitulo : "Diario"}
export const listTabsEficiencia : TabProperty[] = [tabEfi1,tabEfi2,tabEfi3,tabEfi4]