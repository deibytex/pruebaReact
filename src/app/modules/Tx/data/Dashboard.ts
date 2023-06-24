import { Post_getconsultadinamicas, Post_Getconsultadinamicas, Post_getconsultadinamicasUser } from "../../../../_start/helpers/Axios/CoreService";
import { Post_GetListaSemanas, Post_GetSnapShotTickets, Post_GetSnapShotTransmision, Post_UnidadesActivas } from "../../../../_start/helpers/Axios/DWHService";


export  function GetListadoSemanas(Anio:string) {
    var params: { [id: string]: string | null; } = {};
    params['Anio'] = Anio;
    return  Post_GetListaSemanas(params);
}

export  function GetUnidadesActivas(Fecha:string|null, ClienteId:string | null| undefined) {
    var params: { [id: string]: string | null| undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return  Post_getconsultadinamicasUser({ Clase : "TXQueryHelper",  NombreConsulta: "GetUnidadesActivas", Pagina :null, RecordsPorPagina :null}, params);
}

export  function  GetSnapShotTickets(Fecha:string|null, ClienteId:string | null| undefined) {
    var params: { [id: string]: string | null| undefined; } = {};
    params['Fecha'] = Fecha;
    return Post_Getconsultadinamicas({ Clase : "TXQueryHelper",  NombreConsulta: "GetTickets", Pagina :null, RecordsPorPagina :null}, params);
}
export  function GetSnapShotTransmision(Fecha:string|null, ClienteId:string | null| undefined) {
    var params: { [id: string]: string | null| undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return  Post_getconsultadinamicasUser({ Clase : "TXQueryHelper",  NombreConsulta: "GetTransmision", Pagina :null, RecordsPorPagina :null}, params);
}

export  function GetUnidadesActivas2(Fecha:string|null, ClienteId:string | null| undefined) {
    var params: { [id: string]: string | null| undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return  Post_UnidadesActivas(params);
}
export  function GetSnapShotTickets2(Fecha:string|null, ClienteId:string | null| undefined) {
    var params: { [id: string]: string | null| undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return  Post_GetSnapShotTickets(params);
}
export  function GetSnapShotTransmision2(Fecha:string|null, ClienteId:string | null| undefined) {
    var params: { [id: string]: string | null| undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return  Post_GetSnapShotTransmision(params);
}

export function SetActualizaUnidadesActivas(Fecha:string){
    var params: { [id: string]: string | null| undefined; } = {};
    params['Fecha'] = Fecha;
    return  Post_getconsultadinamicas({ Clase : "TXQueryHelper",  NombreConsulta: "SetSnapshotUnidadesActivasFecha", Pagina :null, RecordsPorPagina :null}, params);
}
export  function GetUnidadesActivasAcumulado(Fecha:string|null, ClienteId:string | null| undefined) {
    var params: { [id: string]: string | null| undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return  Post_getconsultadinamicasUser({ Clase : "TXQueryHelper",  NombreConsulta: "GetSnapshotUnidadesActivas3", Pagina :null, RecordsPorPagina :null}, params);
}
export  function GetSnapShotTransmisionAcumulado(Fecha:string|null, ClienteId:string | null| undefined) {
    var params: { [id: string]: string | null| undefined; } = {};
    params['Fecha'] = Fecha;
    params['ClienteId'] = (ClienteId == "0" ? null : ClienteId);
    return  Post_getconsultadinamicasUser({ Clase : "TXQueryHelper",  NombreConsulta: "GetTransmisionAcumulado4Semanas", Pagina :null, RecordsPorPagina :null}, params);
}

