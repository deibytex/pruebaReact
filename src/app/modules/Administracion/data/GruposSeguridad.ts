import { Post_getGruposSeguridad } from "../../../../_start/helpers/Axios/CoreService";

export function GetGruposSeguridad(clientesIdS: number | null){
    return Post_getGruposSeguridad(clientesIdS);
};