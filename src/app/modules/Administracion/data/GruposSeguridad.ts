import { Post_SetGrupoSeguridad, Post_getGruposSeguridad } from "../../../../_start/helpers/Axios/CoreService";

export function GetGruposSeguridad(clientesIdS: number | null){
    return Post_getGruposSeguridad(clientesIdS);
};

export function SetGruposSeguridad(nombre:string, descripcion:string, grupoSeguridadId:string, clave: string) {
    let params : { [id: string]: string | null; } = {};
    params['Clave'] = clave;
    params['clienteIdS'] = null;
    params['Nombre'] = nombre;
    params['Descripcion'] = descripcion;
    params['TipoSeguridadId'] = null;
    params['EsActivo'] = '1';
    params['EsAdministrador'] = null;
    params['GrupoSeguridadId'] = grupoSeguridadId;
    params['Sitios'] = null;
    return Post_SetGrupoSeguridad(params);
}