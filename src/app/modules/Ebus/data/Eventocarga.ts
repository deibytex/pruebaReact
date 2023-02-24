import { getClientesEBUS, Post_EBUS_getEventActiveRecargaByDayAndClient, Post_EventActiveViajesByDayAndClient } from "../../../../_start/helpers/Axios/DWHService";

export  function GetClientes() {
    return  getClientesEBUS();
}

export function PostEventActiveRecargaByDayAndClient(clientesIds:string, Periodo:string){
    var params: { [id: string]: string | null; } = {};
    params['clienteids'] = clientesIds;
    params['period'] = Periodo;
    params['command'] = 'recarga';
    return  Post_EBUS_getEventActiveRecargaByDayAndClient( params);
}
