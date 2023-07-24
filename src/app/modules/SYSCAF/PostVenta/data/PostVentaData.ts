//GetInfoDashBoardAdmin

import { Post_GetConsultasDinamicasUser, Post_GetConsultasDinamicasUserDWH } from "../../../../../_start/helpers/Axios/DWHService";

export function GetInfoDashBoardAdmin() { 
    var params: { [id: string]: string | null | undefined; } = {};
    return Post_GetConsultasDinamicasUser({
        NombreConsulta: "GetInfoDashBoardAdmin", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
export function GetFallasSeniales(ClienteIds:any){
    var params: { [id: string]: string | null | undefined; } = {};
    params["ClienteIds"] = ClienteIds;
    return Post_GetConsultasDinamicasUserDWH({
        NombreConsulta: "TotalFallasPorRangoFechasIndicadores", Clase: "SIGQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}
//Guarda los requerimientos
export function SetRequerimiento(Datos:any){
    var params: { [id: string]: string | null | undefined; } = {};
    params["Tipo"] = Datos.Tipo;
    params["Cabecera"] = Datos.Cabecera;
    params["Observaciones"] = Datos.Observaciones;
    params["Estado"] = Datos.Estado;
    return Post_GetConsultasDinamicasUser({
        NombreConsulta: "CrearRequerimiento", Clase: "GOIQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}
//Se obtiene la parametrizacion por tipo
export function GetLista(){
    var params: { [id: string]: string | null | undefined; } = {};
    params["Sigla"] = "GOIREQ";
    return Post_GetConsultasDinamicasUser({
        NombreConsulta: "getListas", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}
//Todos los parametros para tipos dinamicamente.
export function GetDetalleLista(ListaId:any){
    var params: { [id: string]: string | null | undefined; } = {};
    params["ListaId"] = ListaId;
    return Post_GetConsultasDinamicasUser({
        NombreConsulta: "getDetalleListas", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}