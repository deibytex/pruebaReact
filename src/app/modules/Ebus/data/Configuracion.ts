import { GetClientes } from "../../../../_start/helpers/Axios/CoreService";
import {  GetClientesActiveEvent, Post_GetClientesUsuarios, Post_GetConsultasDinamicasCore, Post_GetListadoClientesUsuario, Post_GetLocations, Post_GetTiempoActualizacion, setClientesActiveEvent } from "../../../../_start/helpers/Axios/DWHService";

export  function ObtenerListadoCLientes() {
    var params: { [id: string]: string | null; } = {};
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
    var params: { [id: string]: string | null | boolean; } = {};
    params["ClienteIds"] =ClienteId;
    return  Post_GetConsultasDinamicasCore({ Clase : "EbusQueryHelper",  NombreConsulta: "GetTiempoActualizacion", Pagina :null, RecordsPorPagina :null}, params);
}
export function GetVariables(ClienteId:string) {
    var params: { [id: string]: string | null; } = {};
    params["Clienteid"] =ClienteId;
    return  Post_GetConsultasDinamicasCore({    Clase : "EbusQueryHelper",  NombreConsulta: "GetParametrizacionVariablesEsomos", Pagina :null, RecordsPorPagina :null}, params);
}

export function SetLocations(ClienteId:string,IsParqueo :string, Locations:string) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["ClienteIds"] =ClienteId;
    params["IsParqueo"] =IsParqueo;
    params["Locations"] =Locations;
    return  Post_GetConsultasDinamicasCore({ Clase : "EbusQueryHelper",  NombreConsulta: "SetLocations", Pagina :null, RecordsPorPagina :null}, params);
}

export function SetUsuariosCliente(ClienteIds:string, Usuarios:string) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["ClienteIds"] =ClienteIds;
    params["Usuarios"] =Usuarios;
    return  Post_GetConsultasDinamicasCore({ Clase : "EbusQueryHelper",  NombreConsulta: "SetAsignarUsuarios", Pagina :null, RecordsPorPagina :null}, params);
}
export function SetVariablesCliente(ClienteIds:string,TipoParametroId:string|null, UsuarioId:string|null,valor:string,ParametrizacionId:string|null ) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["ClienteIds"] =ClienteIds;
    params["TipoParametroId"] =TipoParametroId;
    params["UsuarioIds"] =UsuarioId;
    params["Valor"] =valor;
    params["ParametrizacionId"] =ParametrizacionId;
    return  Post_GetConsultasDinamicasCore({ Clase : "EbusQueryHelper",  NombreConsulta: "SetVariablesCliente", Pagina :null, RecordsPorPagina :null}, params);
}

export function GetTiposParametros(Sigla:string ) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["Sigla"] =Sigla;
    return  Post_GetConsultasDinamicasCore({ Clase : "EbusQueryHelper",  NombreConsulta: "GetTiposParametros", Pagina :null, RecordsPorPagina :null}, params);
}
export function SetEstadoParametros(ParametrizacionId:string, TipoParametroId :string, EsActivo:string) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["ParametrizacionId"] =ParametrizacionId;
    params["TipoParametroId"] =TipoParametroId;
    params["EsActivo"] =EsActivo;
    return  Post_GetConsultasDinamicasCore({ Clase : "EbusQueryHelper",  NombreConsulta: "SetEstadoParametros", Pagina :null, RecordsPorPagina :null}, params);
}
