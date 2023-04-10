import { Post_getconsultadinamicasUser } from "../../../../_start/helpers/Axios/CoreService";
import { GetClientes, Post_GetConsultasDinamicasUserDWH } from "../../../../_start/helpers/Axios/DWHService";

export  function ObtenerListadoCLientes() {
    var params: { [id: string]: string | null; } = {};
    params['Estado'] = "1";
    return  GetClientes(params);
}

export function GetInformeTransmision (ClienteId:string,FechaActual:string ) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["clienteIdS"] = (Number.parseInt(ClienteId) == 0 ? null:ClienteId);
    params["FechaActual"] = FechaActual;
    return  Post_getconsultadinamicasUser({ Clase : "TXQueryHelper",  NombreConsulta: "GetReporteTransmision", Pagina :null, RecordsPorPagina :null}, params);
}
export function SetEstadoSyscaf (assetId:string,estadoSyscafIdS:string ) {
    var params: { [id: string]: string | null | boolean; } = {};
    params["assetId"] = assetId;
    params["estadoSyscafIdS"] = estadoSyscafIdS;
    return  Post_getconsultadinamicasUser({ Clase : "TXQueryHelper",  NombreConsulta: "CambiarEstadoSyscaf", Pagina :null, RecordsPorPagina :null}, params);
}