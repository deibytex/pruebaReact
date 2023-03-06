import { GetClientes, GetClientesActiveEvent, Post_GetClientesUsuarios, Post_GetConsultasDinamicas, Post_GetListadoClientesUsuario, Post_GetLocations, Post_GetTiempoActualizacion, setClientesActiveEvent } from "../../../../_start/helpers/Axios/DWHService";

export  function ObtenerListadoCLientes() {
    var params: { [id: string]: string | null; } = {};
    params['Estado'] = "1";
    return  GetClientes(params);
}


export  function ObtenerClientesTabla() {
    var params: { [id: string]: string | null; } = {};
    params['ClienteId'] = null;
    return  GetClientesActiveEvent(params);
}


export function SetActiveEvent (ClienteId:string, ActiveEvent:string) {
    var params: { [id: string]: string | null | boolean; } = {};
    params['ClienteId'] = ClienteId;
    params['ActiveEvent'] = (ActiveEvent == "1" ? true:false);
    return  setClientesActiveEvent(params);
}

export function GetLocations (ClienteId:string, IsParqueo:boolean) {
    var params: { [id: string]: string | null | boolean; } = {};
    params['ClienteId'] = ClienteId;
    params['IsParqueo'] = IsParqueo;
    return  Post_GetLocations(params);
}

export function GetClientesUsuarios (UsuarioIdS:string|null, OrganzacionId:number|null ,ClienteId:string ) {
    var params: { [id: string]: string | null | number; } = {};
    params['UsuarioIdS'] = UsuarioIdS;
    params['OrganzacionId'] = OrganzacionId;
    params['ClienteId'] = ClienteId;
    return  Post_GetClientesUsuarios(params);
}

export function GetGetListadoClientesUsuario (Clientes:string ) {
    var params: { [id: string]: string | null | number; } = {};
    params['Clientes'] = Clientes;
    return  Post_GetListadoClientesUsuario(params);
}


export function GetTiempoActualizacion(ClienteId:string) {
    let params : { [id: string]: string | null; } = {};
    params['ClienteId'] = ClienteId;
    return Post_GetTiempoActualizacion(params);
}
export function GetVariables(ClienteId:string) {
    var params: { [id: string]: string | null; } = {};
    params["Clienteid"] =ClienteId;
    return  Post_GetConsultasDinamicas({    Clase : "EbusQueryHelper",  NombreConsulta: "GetParametrizacionVariablesEsomos", Pagina :null, RecordsPorPagina :null}, params);
}

export function SetLocations(ClienteId:string,IsParqueo :string, Locations:string) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["ClienteIds"] =ClienteId;
    params["IsParqueo"] =IsParqueo;
    params["Locations"] =Locations;
    return  Post_GetConsultasDinamicas({ Clase : "EbusQueryHelper",  NombreConsulta: "SetLocations", Pagina :null, RecordsPorPagina :null}, params);
}

export function SetUsuariosCliente(ClienteIds:string, Usuarios:string) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["ClienteIds"] =ClienteIds;
    params["Usuarios"] =Usuarios;
    return  Post_GetConsultasDinamicas({ Clase : "EbusQueryHelper",  NombreConsulta: "SetAsignarUsuarios", Pagina :null, RecordsPorPagina :null}, params);
}
export function SetVariablesCliente(ClienteIds:string,TipoParametroId:string, UsuarioId:string|null,valor:string,ParametrizacionId:string|null ) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["ClienteIds"] =ClienteIds;
    params["TipoParametroId"] =TipoParametroId;
    params["UsuarioId"] =UsuarioId;
    params["Valor"] =valor;
    params["ParametrizacionId"] =ParametrizacionId;
    return  Post_GetConsultasDinamicas({ Clase : "EbusQueryHelper",  NombreConsulta: "SetVariablesCliente", Pagina :null, RecordsPorPagina :null}, params);
}