import { GetClientes, Post_SetGrupoSeguridad, Post_getGruposSeguridad, Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";


export function GetGruposSeguridad(clientesIdS: number | null){
    return Post_getGruposSeguridad(clientesIdS);
};

export function SetGruposSeguridad(nombre:string, descripcion:string, grupoSeguridadId:string, clave: string, esactivo: boolean) {
    let params : { [id: string]: string | null | boolean; } = {};
    params['Clave'] = clave;
    params['Nombre'] = nombre;
    params['Descripcion'] = descripcion;
    params['EsActivo'] = esactivo;
    params['GrupoSeguridadId'] = grupoSeguridadId;
    return Post_SetGrupoSeguridad(params);
}

export function getListadoClientes() {
    var params: { [id: string]: string | null; } = {};
  
    return GetClientes(params);
}

export function getListadoUsuarios() {
    var params: { [id: string]: string | null; } = {};
    params["OrganizacionId"] = '1';

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "AdmQueryHelper",
        NombreConsulta: "GetListadoUsuarioOrganizacion",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function getClientesGrupoDeSeguridad(grupoSeguridadId: string | null) {
    var params: { [id: string]: string | null; } = {};
    params["grupoSeguridadId"] = grupoSeguridadId ? grupoSeguridadId.toString() : null;

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "AdmQueryHelper",
        NombreConsulta: "getClientesGruposDeSeguridad",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function setClientesGrupoDeSeguridad(grupoSeguridadId: string, clienteIds: string) {
    var params: { [id: string]: string | null; } = {};
    params["grupoSeguridadId"] = grupoSeguridadId.toString();
    params["clienteIds"] = clienteIds;

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "AdmQueryHelper",
        NombreConsulta: "setClientesGrupoDeSeguridad",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function getUsuariosGrupoDeSeguridad(grupoSeguridadId: string | null) {
    var params: { [id: string]: string | null; } = {};
    params["grupoSeguridadId"] = grupoSeguridadId ? grupoSeguridadId.toString() : null;

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "AdmQueryHelper",
        NombreConsulta: "getUsuariosGruposDeSeguridad",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};

export function setUsuariosGrupoDeSeguridad(grupoSeguridadId: string, usuariosIds: string) {
    var params: { [id: string]: string | null; } = {};
    params["grupoSeguridadId"] = grupoSeguridadId.toString();
    params["usuariosIds"] = usuariosIds;

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "AdmQueryHelper",
        NombreConsulta: "setUsuariosGrupoDeSeguridad",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};