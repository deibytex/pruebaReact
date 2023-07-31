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
//Consulta la lista de los requerimientos
export function GettRequerimiento(FechaInicial:any|null, FechaFinal:any|null){
    var params: { [id: string]: string | null | undefined; } = {};
    params['FechaInicial'] = FechaInicial;
    params['FechaFinal'] = FechaFinal;
    return Post_GetConsultasDinamicasUser({
        NombreConsulta: "GetRequerimientos", Clase: "GOIQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}
//Para los filtros y tratados de datos
export const FiltroDashBoardData = {
    getSoloDatosNecesarios:(data:any[]) =>{
        return data.filter((item:any, index:any) =>{
            let estado = (item.estado == undefined ?  item.Estado: item.estado);
            if(estado == "Sin Respuesta del Cliente" || estado == "Operando Normalmente")
                return item;
        });
    },
    getOrdenados:(data:any[]) =>{
        return data.sort(function(a, b) {
            let bDias = (b.DiasSinTx == undefined ? b.diffAVL:b.DiasSinTx);
            let aDias = (a.DiasSinTx == undefined ? a.diffAVL: a.DiasSinTx)
            return  bDias - aDias;
        });
    },
 getVehiculosFallas:(data:any[], dt:any[]) =>{
    data.reduce((a: any, b: any) => {
        dt.map((val: any) => {
            if (b.AssetId == val.AssetId)
                b.TFallas = val.TFallas;
            return b;
        })
    }, [])
 }
 }