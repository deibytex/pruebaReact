import { Post_ExecProcedureByTipoConsulta, Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";
import { GetClientes } from "../../../../_start/helpers/Axios/DWHService";

export function getListadoCLientes() {
    var params: { [id: string]: string | null; } = {};
    params['Estado'] = "1";
    return GetClientes(params);
}

export function getListaClienteNotifacion() {
    var params: { [id: string]: string | null; } = {};
    params["EsActivo"] = "1";

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "PortalQueryHelper",
        NombreConsulta: "getListaClienteNotifacion",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function getSites(ClienteId: number | null) {
    var params: { [id: string]: number | null; } = {};
    params["ClienteId"] = ClienteId;

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "PortalQueryHelper",
        NombreConsulta: "GetListaSitesPorClienteAnidado",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function getSitesNotifacion(ListaClienteNotifacionId: number | null ) {
    var params: { [id: string]: number | null; } = {};
    params["ListaClienteNotifacionId"] = ListaClienteNotifacionId;

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "TxQueryHelper",
        NombreConsulta: "getClienteNotificacionSite",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function setSitesCorreosTx(ListaClienteNotifacionId: number, SitesIds: string) {
    var params: { [id: string]: string | null; } = {};
    params["ListaClienteNotifacionId"] = ListaClienteNotifacionId.toString();
    params["SitesIds"] = SitesIds == "" ? null : SitesIds;
    // hacemos la consulta 
    return  Post_ExecProcedureByTipoConsulta({    
        Clase : "TxQueryHelper",  
        NombreConsulta: "setSiteCorreosTx", 
        Pagina :null, 
        RecordsPorPagina :null}, 
        params);   
}