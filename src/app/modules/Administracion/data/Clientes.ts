import { Post_getconsultadinamicas, Post_getconsultadinamicasUser } from "../../../../_start/helpers/Axios/CoreService";
import { GetVehiculos, Post_GetDetallesListas, Post_GetEstadosAssets, getVehiculosClienteId } from "../../../../_start/helpers/Axios/DWHService";

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
    return GetVehiculos(Clienteid);
};
export function GetAssetsEstados(Tipo: string){
    return Post_GetEstadosAssets(Tipo);
};
export function GetDetallesListas(Sigla: string){
    return Post_GetDetallesListas(Sigla);
};
export function GetConfiguracionAssets(Clienteid: string){
    var params: { [id: string]: string | null | undefined;} = {};
    params['Clienteid'] = Clienteid; 
       return Post_getconsultadinamicas({
        NombreConsulta: "getConfigurationAssets", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
       },params)
};
export function updateAssets(Clienteid: string, estadoClienteId:string,notificacion:string,GeneraIMG:string,Trips:string,Metrics:string, Event:string,Position:string,ActiveEvent:string){
    var params: { [id: string]: string | null | undefined;} = {};
        params['Clienteid'] = Clienteid; 
        params['estadoClienteId'] = estadoClienteId; 
        params['notificacion'] = notificacion; 
        params['GeneraIMG'] = GeneraIMG; 
        params['Trips'] = Trips; 
        params['Metrics'] = Metrics; 
        params['Event'] = Event; 
        params['Position'] = Position; 
        params['ActiveEvent'] = ActiveEvent; 
       return Post_getconsultadinamicas({
        NombreConsulta: "updateAssets", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
       },params)
};
