import { getClientesEBUS, getVehiculosCliente, Post_EventActiveViajesByDayAndClient, Post_GetConsultasDinamicas, Post_GetConsultasDinamicasUser, Post_GetConsultasDinamicasUserDWH } from "../../../../_start/helpers/Axios/DWHService";

export  function GetClientes() {
    return  getClientesEBUS();
}
export  function GetVehiculos(ClienteIds: string|null) {
    var params: { [id: string]: string | null; } = {};
    params["usuarioids"] = ClienteIds;
    // hacemos la consulta 
    return  getVehiculosCliente(ClienteIds,"Available");
   
}

export function GetClientesEsomos(){
    var params: { [id: string]: string | null; } = {};
    return  Post_GetConsultasDinamicasUserDWH({    Clase : "EbusQueryHelper",  NombreConsulta: "getListClienteAsignados", Pagina :null, RecordsPorPagina :null}, params);
}

export function PostEventActiveViajesByDayAndClient(clientesIds:string, Periodo:string){
    var params: { [id: string]: string | null; } = {};
    params['clienteids'] = clientesIds;
    params['period'] = Periodo;
    params['command'] = 'Viaje';
    return  Post_EventActiveViajesByDayAndClient( params);
}