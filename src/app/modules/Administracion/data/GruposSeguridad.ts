import { Post_SetGrupoSeguridad, Post_getGruposSeguridad } from "../../../../_start/helpers/Axios/CoreService";

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