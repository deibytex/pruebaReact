import { GetClientes, GetClientesActiveEvent } from "../../../../_start/helpers/Axios/DWHService";

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


