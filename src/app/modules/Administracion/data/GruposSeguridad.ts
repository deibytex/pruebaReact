import { Post_SetGrupoSeguridad, Post_getGruposSeguridad, Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";
import { GetClientes } from "../../../../_start/helpers/Axios/DWHService";

export function GetGruposSeguridad(clientesIdS: number | null){
    return Post_getGruposSeguridad(clientesIdS);
};

export function SetGruposSeguridad(nombre:string, descripcion:string, grupoSeguridadId:string, clave: string, clienteids: string | null,
                                    esactivo: boolean, sitios: string | null) {
    let params : { [id: string]: string | null | boolean; } = {};
    params['Clave'] = clave;
    params['clienteIdS'] = clienteids;
    params['Nombre'] = nombre;
    params['Descripcion'] = descripcion;
    params['EsActivo'] = esactivo;
    params['GrupoSeguridadId'] = grupoSeguridadId;
    params['Sitios'] = sitios;
    return Post_SetGrupoSeguridad(params);
}

export function getListadoClientes() {
    var params: { [id: string]: string | null; } = {};
    params['Estado'] = "1";
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