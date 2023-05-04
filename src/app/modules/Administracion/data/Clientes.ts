import { Post_getconsultadinamicas, Post_getconsultadinamicasUser } from "../../../../_start/helpers/Axios/CoreService";
import { Post_GetDetallesListas, Post_GetEstadosAssets, getVehiculosClienteId } from "../../../../_start/helpers/Axios/DWHService";

export function GetClientesAdministradores(clientesIds :string|null) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['clienteIdS'] = clientesIds; 
       
    return  Post_getconsultadinamicasUser({
        NombreConsulta: "GetClientesAdministradores", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
};
export function GetSites(Clienteid: string){
    var params: { [id: string]: string | null | undefined;} = {};
    params['Clienteid'] = Clienteid; 
       return Post_getconsultadinamicas({
        NombreConsulta: "GetListaSitesPorCliente", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
       },params)
};
export function GetDrivers(Clienteid: string){
    var params: { [id: string]: string | null | undefined;} = {};
    params['Clienteid'] = Clienteid; 
       return Post_getconsultadinamicas({
        NombreConsulta: "GetDriversByClienteID", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
       },params)
};
export function GetAdministradores(Clienteid: string){
    var params: { [id: string]: string | null | undefined;} = {};
    params['Clienteid'] = Clienteid; 
       return Post_getconsultadinamicas({
        NombreConsulta: "GetAdministradoresByClienteID", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
       },params)
};
export function GetAssets(Clienteid: string){
    return getVehiculosClienteId(Clienteid, null);
};
export function GetAssetsEstados(Tipo: string){
    return Post_GetEstadosAssets(Tipo);
};
export function GetDetallesListas(Sigla: string){
    return Post_GetDetallesListas(Sigla);
};
