//GetInfoDashBoardAdmin

import { Post_GetConsultasDinamicasUserCore, Post_GetConsultasDinamicasUserDWH } from "../../../../../_start/helpers/Axios/DWHService";

export function GetInfoDashBoardAdmin() { 
    var params: { [id: string]: string | null | undefined; } = {};
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "GetInfoDashBoardAdmin", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}

export function GetInfoDashBoardAdminClientes() { 
    var params: { [id: string]: string | null | undefined; } = {};
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "GetInfoDashBoardAdminClientes", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
export function GetInfoDashBoardAdminAsset() { 
    var params: { [id: string]: string | null | undefined; } = {};
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "GetInfoDashBoardAdminAsset", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
export function GetInfoDashBoardAdminConductores() { 
    var params: { [id: string]: string | null | undefined; } = {};
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "GetInfoDashBoardAdminConductores", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
export function GetInfoDashBoardAdminVehiculosSinTx() { 
    var params: { [id: string]: string | null | undefined; } = {};
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "GetInfoDashBoardAdminVehiculosSinTx", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
export function GetInfoDashBoardAdminTickets() { 
    var params: { [id: string]: string | null | undefined; } = {};
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "GetInfoDashBoardAdminTickets", Clase: "PortalQueryHelper",
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
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "CrearRequerimiento", Clase: "GOIQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}
//Se obtiene la parametrizacion por tipo
export function GetLista(){
    var params: { [id: string]: string | null | undefined; } = {};
    params["Sigla"] = "GOIREQ";
    return Post_GetConsultasDinamicasUserCore({
        NombreConsulta: "getListas", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params)
}
//Todos los parametros para tipos dinamicamente.
export function GetDetalleLista(ListaId:any){
    var params: { [id: string]: string | null | undefined; } = {};
    params["ListaId"] = ListaId;
    return Post_GetConsultasDinamicasUserCore({
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
    return Post_GetConsultasDinamicasUserCore({
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
                else
                    b.TFallas = 0;
                return b;
            })
        }, [])
    },
    getEmpresasAgrupadas:(data:any[]) =>{
        return data.reduce((p: any, c: any) => {
            let name = c.ClienteId;
            p[name] = p[name] ?? [];
            p[name].push(c);
            return p;
        }, {})
    },
    EsJson:(dato:any) =>{
        try {
            JSON.parse(dato);
        } catch (e) {
            return false;
        }
        return true;
    }
 }