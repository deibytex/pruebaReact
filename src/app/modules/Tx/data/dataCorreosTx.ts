import { GetClientes, Post_ExecProcedureByTipoConsulta, Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";


export function getListadoCLientes() {
    var params: { [id: string]: string | null; } = {};

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
    return  Post_getconsultadinamicas({
        Clase: "TxQueryHelper",
        NombreConsulta: "setSiteCorreosTx",
        Pagina: null,
        RecordsPorPagina: null
    }, 
        params);   
}

export function getCorreosTx(ListaClienteNotifacionId: number | null ) {
    var params: { [id: string]: number | null; } = {};
    params["ListaClienteNotifacionId"] = ListaClienteNotifacionId;

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "TxQueryHelper",
        NombreConsulta: "getCorreosTx",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function updateCorreosTx(correo: string, tipoCorreo: number, correoTxIdS: number) {
    var params: { [id: string]: string | null; } = {};
    params["correo"] = correo;
    params["tipoCorreo"] = tipoCorreo.toString();
    params["correoTxIdS"] = correoTxIdS.toString();

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "TxQueryHelper",
        NombreConsulta: "updateCorreoTx",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function setCorreoTx(correo: string, tipoCorreo: number, ListaClienteNotifacionId: number) {
    var params: { [id: string]: string | null; } = {};
    params["ListaClienteNotifacionId"] = ListaClienteNotifacionId.toString();
    params["correo"] = correo;
    params["tipoCorreo"] = tipoCorreo.toString();

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "TxQueryHelper",
        NombreConsulta: "insertCorreoTx",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function deleteCorreosTx(correoTxIdS: number) {
    var params: { [id: string]: string | null; } = {};
    params["correoTxIdS"] = correoTxIdS.toString();

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "TxQueryHelper",
        NombreConsulta: "deleteCorreoTx",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function insertListasCorreosTx(ClienteIds: number, NombreLista: string) {
    var params: { [id: string]: string | null; } = {};
    params["ClienteIds"] = ClienteIds.toString();
    params["NombreLista"] = NombreLista;

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "TxQueryHelper",
        NombreConsulta: "insertListasCorreosTx",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function updateListasCorreosTx(ListaNotifacionId: number, NombreLista: string, EsActivo: number) {
    var params: { [id: string]: string | null; } = {};
    params["ListaClienteNotifacionId"] = ListaNotifacionId.toString();
    params["NombreLista"] = NombreLista;
    params["EsActivo"] = EsActivo.toString();

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "TxQueryHelper",
        NombreConsulta: "updateListasCorreosTx",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};