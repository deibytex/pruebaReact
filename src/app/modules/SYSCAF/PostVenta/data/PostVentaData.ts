//GetInfoDashBoardAdmin

import { Post_GetConsultasDinamicasUser, Post_GetConsultasDinamicasUserDWH } from "../../../../../_start/helpers/Axios/DWHService";

export function GetInfoDashBoardAdmin(UsuarioId : string) { 
    var params: { [id: string]: string | null | undefined; } = {};
    return Post_GetConsultasDinamicasUser({
        NombreConsulta: "GetInfoDashBoardAdmin", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}